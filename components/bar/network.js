import globals from "../helpers";
import aws from '../../util/aws';
import Spotify from 'rn-spotify-sdk';
import AddSongsMutation from '../../GQL/mutations/AddSongs';
import DeleteSongsMutation from '../../GQL/mutations/DeleteSongs';

const getPlaylistFromSpotify = (uri) => new Promise((resolve, reject) => {
  Spotify.sendRequest(`v1/playlists/${globals.getPlaylistId(uri)}`, 'GET', {}, true)
  .then(resolve)
  .catch(reject);
});

const net = {
  initialize: async (id, user, callback) => {
    let spotify = await getPlaylistFromSpotify(id);
    aws.addPlaylist(spotify, user, callback);
  },
  addSongToSpotify: (id, song, callback) => {
    const body = { uris: [song] };
    Spotify.sendRequest(`v1/playlists/${id}/tracks`, "POST", body, true)
      .then(playlist => {
        callback(playlist);
      })
      .catch(err => {
      });
  },
  rebasePlaylistFromSpotify: async (id, awsSongs=[], callback) => {
    console.log("rebasePlaylistFromSpotify()");
    let spotifyPlaylist = await getPlaylistFromSpotify(id);
    let spotifySongs = globals.getSongsFromPlaylist(spotifyPlaylist);
    let diff = globals.diff(spotifySongs, awsSongs);
    let doneFlag = 0;
    const checkToCallback = () => {
      if(++doneFlag === 2) {
        callback({
          ...spotifyPlaylist,
          songs: diff.ordered
        });
      }
    };
    if(diff.new.length > 0) {
      globals.client.mutate({
        mutation: AddSongsMutation,
        variables: {
          id,
          songs: diff.new
        }
      }).then(checkToCallback);
    } else {
      checkToCallback();
    }
    checkToCallback();
    // if(diff.old.length > 0) {
    //   globals.client.mutate({
    //     mutation: DeleteSongsMutation,
    //     variables: {
    //       id,
    //       songs: diff.old
    //     }
    //   }).then(checkToCallback);
    // } else {
    //   checkToCallback();
    // }
  }
};

export default net;