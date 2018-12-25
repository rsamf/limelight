import globals from "../helpers";
import Spotify from 'rn-spotify-sdk';

const net = {
  initialize: globals.addPlaylistToAWS,
  getPlaylistFromSpotify: (id, callback) => {
    Spotify.sendRequest(`v1/playlists/${globals.getPlaylistId(id)}`, 'GET', {}, true)
    .then(callback)
    .catch();
  },
  rebaseSongsFromSpotify: (id, spotifySongs, awsSongs, callback) => {
    let doneFlag = 0;
    const diff = globals.diff(spotifySongs, awsSongs);
    const checkToCallback = () => {
      doneFlag++;
      if(doneFlag === 2) {
        callback(diff.ordered);
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
    if(diff.old.length > 0) {
      globals.client.mutate({
        mutation: DeleteSongsMutation,
        variables: {
          id,
          songs: diff.old
        }
      }).then(checkToCallback);
    } else {
      checkToCallback();
    }
  }
};

export default net;