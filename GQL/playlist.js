import GetPlaylist from './queries/GetPlaylist';
import GetSongs from './queries/GetSongs';
import VoteSongMutation from './mutations/VoteSong';
import NextSongMutation from './mutations/NextSong';
import AddSongMutation from './mutations/AddSong';
import OnSongsChangedSubscription from './subscriptions/SongsChanged';
import { graphql, compose } from 'react-apollo';

export default (Component) => compose(
  graphql(GetPlaylist, {
    options: props => {
      return {
        fetchPolicy: 'network-only',
        variables: { id: props.children }
      };
    },
    props: (props) => {
      return {
        playlist: props.data.getPlaylist,
        loading: props.data.loading,
        error: props.data.error  
      };
    }
  }),
  graphql(GetSongs, {
    options: props => {
      return {
        fetchPolicy: 'network-only',
        variables: { id: props.children }
      };
    },
    props: props => {
      return {
        songs: props.data.getSongs && props.data.getSongs.songs,
        subscribeToSongChanges: () => {
          props.data.subscribeToMore({
            document: OnSongsChangedSubscription,
            variables: { id: props.ownProps.children },
            updateQuery: (prev, {subscriptionData:{data:{onSongsChanged:{id, songs}}}}) => {
              return {
                getSongs: {
                  id,
                  songs,
                  __typename: 'SongList'
                }
              };
            }
          });
        }
      }
    }
  }),
  graphql(VoteSongMutation, {
    props: props => {
      return {
        voteSong: (i) => {
          props.mutate({
            variables: { id: props.ownProps.children, index: i }
          });
        }
      };
    }
  }),
  graphql(NextSongMutation, {
    props: props => {
      return {
        nextSong: () => {
          props.mutate({
            variables: { id: props.ownProps.children }
          });
        }
      };
    }
  }),
  graphql(AddSongMutation, {
    props: props => {
      return {
        addSong: (song) => {
          props.mutate({
            variables: { id: props.ownProps.children, song }
          });
        }
      };
    }
  })
)(Component);