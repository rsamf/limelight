import GetPlaylist from './queries/GetPlaylist';
import GetSongs from './queries/GetSongs';
import GetSongRequests from './queries/GetSongRequests';
import UpdatePlaylistMutation from './mutations/UpdatePlaylist';
import DeletePlaylistMutation from './mutations/DeletePlaylist';
import DeleteSongListMutation from './mutations/DeleteSongList';
import VoteSongMutation from './mutations/VoteSong';
import NextSongMutation from './mutations/NextSong';
import AddSongsMutation from './mutations/AddSongs';
import DeleteSongsMutation from './mutations/DeleteSongs';
import RequestAddSongMutation from './mutations/RequestAddSong';
import RequestACKSongMutation from './mutations/RequestACKSong';
import OnSongsChangedSubscription from './subscriptions/SongsChanged';
import OnRequestsChangedSubscription from './subscriptions/RequestsChanged';
import { graphql, compose } from 'react-apollo';
import SongsManipulation from './songHandlers';

export default (Component) => compose(
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
        refetchSongs: props.data.refetch,
        error: props.data.error,
        songsLoading: props.data.loading,
        subscribeToSongChanges: () => {
          props.data.subscribeToMore({
            document: OnSongsChangedSubscription,
            variables: { id: props.ownProps.children },
            updateQuery: (prev, {subscriptionData:{data:{onSongsChanged:{songs}}}}) => {
              return {
                getSongs: {
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
  graphql(GetSongRequests, {
    options: props => {
      return {
        fetchPolicy: 'cache-and-network',
        variables: { id: "r-"+props.children }
      };
    },
    props: props => {
      return {
        requestsLoading: props.data.loading,
        error: props.data.error,
        requests: props.data.getSongs && props.data.getSongs.songs,
        refetchRequests: props.data.refetch,
        subscribeToRequests: () => {
          props.data.subscribeToMore({
            document: OnRequestsChangedSubscription,
            variables: { id: "r-"+props.ownProps.children },
            updateQuery: (prev, {subscriptionData:{data:{onRequestsChanged:{songs}}}}) => {
              return {
                getSongs: {
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
        playlistLoading: props.data.loading,
        refetchPlaylist: props.data.refetch,
        error: props.data.error  
      };
    }
  }),
  graphql(UpdatePlaylistMutation, {
    props: props => {
      return {
        updatePlaylist: (changed) => {
          props.mutate({
            variables: {
              id: props.ownProps.playlist.id,
              ...changed
            }
          });
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
  graphql(DeleteSongListMutation, {
    props: props => {
      return {
        deleteSongList: () => {
          props.mutate({
            variables: {
              id: props.ownProps.playlist.songs
            }
          });
        }
      }
    }
  }),
  graphql(VoteSongMutation, {
    props: props => {
      return {
        voteSong: (index, id) => {
          props.mutate({
            variables: { id: props.ownProps.children, songId: id },
            optimisticResponse: () => {
              let songs = SongsManipulation.vote(props.ownProps.songs, index);
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
  graphql(AddSongsMutation, {
    props: props => {
      return {
        addSongs: (songs) => {
          console.log("ADDDING songs", songs);
          props.mutate({
            variables: { id: props.ownProps.children, songs },
            optimisticResponse: () => {
              let updatedSongs = SongsManipulation.add(props.ownProps.songs, songs);
              return {
                addSongs: {
                  id: props.ownProps.children,
                  songs: updatedSongs,
                  __typename: 'SongList'
                }
              };
            },
            update: (proxy, { data: { addSongs } }) => {
              let data = proxy.readQuery({ 
                query: GetSongs, 
                variables: { id: props.ownProps.children }
              });
              data.getSongs.songs = addSongs.songs;
              proxy.writeQuery({ query: GetSongs, variables: { id: props.ownProps.children }, data });
            }
          });
        }
      };
    }
  }),
  graphql(DeleteSongsMutation, {
    props: props => {
      return {
        deleteSongs: (ids) => {
          props.mutate({
            variables: { id: props.ownProps.children, songs: ids },
            optimisticResponse: () => {
              let songs = SongsManipulation.deleteByIds(props.ownProps.songs, ids);
              return {
                deleteSongs: {
                  id: props.ownProps.children,
                  songs: songs,
                  __typename: 'SongList'
                }
              };
            },
            update: (proxy, { data: { deleteSongs } }) => {
              let data = proxy.readQuery({ 
                query: GetSongs, 
                variables: { id: props.ownProps.children, songs: ids }
              });
              data.getSongs.songs = deleteSongs.songs;
              proxy.writeQuery({ query: GetSongs, variables: { id: props.ownProps.children }, data });
            }
          });
        }
      };
    }
  }),
  graphql(RequestAddSongMutation, {
    props: props => {
      const id = props.ownProps.children;
      return {
        requestSong: (song) => {
          props.mutate({
            variables: { id, song },
            optimisticResponse: () => {
              let songs = SongsManipulation.request(props.ownProps.requests, song);
              return {
                requestAddSong: {
                  id,
                  songs,
                  __typename: 'SongList'
                }
              };
            },
            update: (proxy, { data: { requestAddSong }}) => {
              const rid = "r-"+id;
              let data = proxy.readQuery({ 
                query: GetSongRequests, 
                variables: { id: rid }
              });
              data.getSongs.songs = requestAddSong.songs;
              proxy.writeQuery({ query: GetSongRequests, variables: { id: rid }, data });
            }
          });
        }
      }
    }
  }),
  graphql(RequestACKSongMutation, {
    props: props => {
      const id = props.ownProps.children;
      return {
        requestACKSong: index => {
          props.mutate({
            variables: { id, index },
            optimisticResponse: () => {
              let songs = SongsManipulation.requestACK(props.ownProps.requests, index);
              return {
                requestACKSong: {
                  id,
                  songs,
                  __typename: 'SongList'
                }
              };
            },
            update: (proxy, { data: { requestACKSong }}) => {
              console.log("songs:", requestACKSong);
              const rid = "r-"+id;
              let data = proxy.readQuery({ 
                query: GetSongRequests, 
                variables: { id: rid }
              });
              data.getSongs.songs = requestACKSong.songs;
              console.log("DATA",data.getSongs);
              proxy.writeQuery({ query: GetSongRequests, variables: { id: rid }, data });
            }
          });
        }
      }
    }
  })
)(Component);