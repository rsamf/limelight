import globals from "../helpers";
import Spotify from 'rn-spotify-sdk';

const includesId = (array, element) => {
  for(let i = 0; i < array.length; i++) {
    if(element.id === array[i].id) {
      return true;
    }
  }
  return false;
};

const net = {
  initialize: globals.addPlaylistToAWS,
  getPlaylistFromSpotify: (id, callback) => {
    Spotify.sendRequest(`v1/playlists/${globals.getPlaylistId(id)}`, 'GET', {}, true)
    .then(callback)
    .catch();
  },
  rebaseSongsFromSpotify: (id, spotifySongs, awsSongs, callback) => {
    let doneFlag = 0;
    spotifySongs = spotifySongs.map(({track})=>globals.getSongData(track));
    const findNewSongs = () => {
      return spotifySongs.filter(s => !includesId(awsSongs, s));
    };
    const findOldSongs = () => {
      return awsSongs.filter(a => !includesId(spotifySongs, a));
    };
    const checkToCallback = () => {
      doneFlag++;
      if(doneFlag === 2) {
        callback(spotifySongs);
      }
    };
    const newSongsToAdd = findNewSongs();
    const oldSongsToDelete = findOldSongs();
    if(newSongsToAdd.length > 0) {
      globals.client.mutate({
        mutation: AddSongsMutation,
        variables: {
          id,
          songs: newSongsToAdd.map(s => parseSongToAWS(s))
        }
      }).then(checkToCallback);
    } else {
      checkToCallback();
    }
    if(oldSongsToDelete.length > 0) {
      globals.client.mutate({
        mutation: DeleteSongsMutation,
        variables: {
          id,
          songs: oldSongsToDelete.map(s => s.id)
        }
      }).then(checkToCallback);
    } else {
      checkToCallback();
    }
  }
};

export default net;