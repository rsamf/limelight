import GetPlaylist from './queries/GetPlaylist';
import GetSongs from './queries/GetSongs';
import UpdatePlaylistMutation from './mutations/UpdatePlaylist';
import DeletePlaylistMutation from './mutations/DeletePlaylist';
import DeleteSongListMutation from './mutations/DeleteSongList';
import VoteSongMutation from './mutations/VoteSong';
import NextSongMutation from './mutations/NextSong';
import AddSongsMutation from './mutations/AddSongs';
import DeleteSongsMutation from './mutations/DeleteSongs';
import OnSongsChangedSubscription from './subscriptions/SongsChanged';
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
  graphql(AddSongsMutation, {
    props: props => {
      return {
        addSong: (song) => {
          props.mutate({
            variables: { id: props.ownProps.children, song },
            optimisticResponse: () => {
              let newSong = {...song, __typename: 'Song'};
              let songs = SongsManipulation.add(props.ownProps.songs, newSong);
              return {
                addSongs: {
                  id: props.ownProps.children,
                  songs: songs,
                  __typename: 'SongList'
                }
              };
            },
            update: (proxy, { data: { addSongs } }) => {
              let newSong = {...song, __typename: 'Song'};
              let data = proxy.readQuery({ 
                query: GetSongs, 
                variables: { id: props.ownProps.children, song: newSong }
              });
              data.getSongs.songs = addSongs.songs;
              proxy.writeQuery({ query: GetSongs, variables: { id: props.ownProps.children, song: newSong }, data });
            }
          });
        }
      };
    }
  }),
  graphql(DeleteSongsMutation, {
    props: props => {
      return {
        deleteSongs: (id) => {
          props.mutate({
            variables: { id: props.ownProps.children, songId: id },
            optimisticResponse: () => {
              let songs = SongsManipulation.delete(props.ownProps.songs, id);
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
                variables: { id: props.ownProps.children, songId: id }
              });
              data.getSongs.songs = deleteSongs.songs;
              proxy.writeQuery({ query: GetSongs, variables: { id: props.ownProps.children, songId: id }, data });
            }
          });
        }
      };
    }
  })
)(Component);