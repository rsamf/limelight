import GetPlaylist from './queries/GetPlaylist';
import GetSongs from './queries/GetSongs';
import UpdatePlaylistMutation from './mutations/UpdatePlaylist';
import DeletePlaylistMutation from './mutations/DeletePlaylist';
import DeleteSongsMutation from './mutations/DeleteSongs';
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
  graphql(UpdatePlaylistMutation, {
    props: props => {
      return {
        updatePlaylist: (playlist) => {
          props.mutate({
            variables: {
              id: props.ownProps.playlist.id,
              playlist
            }
          }).then(console.warn);
        }
      }
    }
  }),
  graphql(DeletePlaylistMutation, {
    props: props => {
      return {
        deletePlaylist: () => {
          props.mutate({
            variables: {
              id: props.ownProps.playlist.id
            }
          });
        }
      }
    }
  }),
  graphql(DeleteSongsMutation, {
    props: props => {
      return {
        deleteSongs: () => {
          props.mutate({
            variables: {
              id: props.ownProps.playlist.songs
            }
          });
        }
      }
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
        voteSong: (id) => {
          props.mutate({
            variables: { id: props.ownProps.children, songId: id }
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