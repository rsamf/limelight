import GetPlaylist from './queries/GetPlaylist';
import GetSongs from './queries/GetSongs';
import UpdatePlaylistMutation from './mutations/UpdatePlaylist';
import DeletePlaylistMutation from './mutations/DeletePlaylist';
import DeleteSongsMutation from './mutations/DeleteSongs';
import VoteSongMutation from './mutations/VoteSong';
import NextSongMutation from './mutations/NextSong';
import AddSongMutation from './mutations/AddSong';
import DeleteSongMutation from './mutations/DeleteSong';
import OnSongsChangedSubscription from './subscriptions/SongsChanged';
import { graphql, compose } from 'react-apollo';
import SongsManipulation from './songHandlers';

export default (Component) => compose(
  graphql(GetPlaylist, {
    options: props => {
      return {
        fetchPolicy: 'cache-and-network',
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
        fetchPolicy: 'cache-and-network',
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
            variables: { id: props.ownProps.children, songId: id },
            optimisticResponse: () => {
              let songs = SongsManipulation.vote(props.ownProps.songs, id);
              return {
                voteSong: {
                  id: props.ownProps.children,
                  songs: songs,
                  __typename: 'SongList'
                }
              };
            },
            update: (proxy, { data: { voteSong } }) => {
              let data = proxy.readQuery({ 
                query: GetSongs, 
                variables: { id: props.ownProps.children, songId: id }
              });
              data.getSongs.songs = voteSong.songs;
              proxy.writeQuery({ query: GetSongs, variables: { id: props.ownProps.children, songId: id }, data });
            }
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
            variables: { id: props.ownProps.children },
            optimisticResponse: () => {
              let songs = SongsManipulation.next(props.ownProps.songs);
              return {
                nextSong: {
                  id: props.ownProps.children,
                  songs: songs,
                  __typename: 'SongList'
                }
              };
            },
            update: (proxy, { data: { nextSong } }) => {
              let data = proxy.readQuery({ 
                query: GetSongs, 
                variables: { id: props.ownProps.children }
              });
              data.getSongs.songs = nextSong.songs;
              proxy.writeQuery({ query: GetSongs, variables: { id: props.ownProps.children }, data });
            }
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
            variables: { id: props.ownProps.children, song },
            optimisticResponse: () => {
              let newSong = {...song, __typename: 'Song'};
              let songs = SongsManipulation.add(props.ownProps.songs, newSong);
              return {
                addSong: {
                  id: props.ownProps.children,
                  songs: songs,
                  __typename: 'SongList'
                }
              };
            },
            update: (proxy, { data: { addSong } }) => {
              let newSong = {...song, __typename: 'Song'};
              let data = proxy.readQuery({ 
                query: GetSongs, 
                variables: { id: props.ownProps.children, song: newSong }
              });
              data.getSongs.songs = addSong.songs;
              proxy.writeQuery({ query: GetSongs, variables: { id: props.ownProps.children, song: newSong }, data });
            }
          });
        }
      };
    }
  }),
  graphql(DeleteSongMutation, {
    props: props => {
      return {
        deleteSong: (id) => {
          props.mutate({
            variables: { id: props.ownProps.children, songId: id },
            optimisticResponse: () => {
              let songs = SongsManipulation.delete(props.ownProps.songs, id);
              return {
                deleteSong: {
                  id: props.ownProps.children,
                  songs: songs,
                  __typename: 'SongList'
                }
              };
            },
            update: (proxy, { data: { deleteSong } }) => {
              let data = proxy.readQuery({ 
                query: GetSongs, 
                variables: { id: props.ownProps.children, songId: id }
              });
              data.getSongs.songs = deleteSong.songs;
              proxy.writeQuery({ query: GetSongs, variables: { id: props.ownProps.children, songId: id }, data });
            }
          });
        }
      };
    }
  })
)(Component);