import AddPlaylistMutation from '../GQL/mutations/AddPlaylist';
import DeletePlaylistMutation from '../GQL/mutations/DeletePlaylist';
import globals from '.';

export default {
  addPlaylist: (playlist, user, callback) => {
    if(user.id === playlist.owner.id) {
      const songs = globals.getSongsFromPlaylist(playlist);
      globals.client.mutate({
        mutation: AddPlaylistMutation,
        variables: {
          playlist: {
            id: playlist.uri,
            name: playlist.name,
            ownerId: user.id,
            ownerName: user.display_name,
            image: playlist.images && playlist.images[0] && playlist.images[0].url,
            songs
          }
        }
      }).then(({data:{addPlaylist}}) => {
        callback({...addPlaylist, songs});
      });
    } else {
      callback();
    }
  },
  deletePlaylist: (id, callback) => {
    globals.client.mutate({
      mutation: DeletePlaylistMutation,
      variables: {
        id
      }
    }).then(callback);
  }
};