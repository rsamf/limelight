import globals from "../helpers";
import aws from '../../util/aws';
import Spotify from 'rn-spotify-sdk';

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
  rebasePlaylistFromSpotify: async (id, aws, addSongs, deleteSongs, update, callback) => {
    console.log("rebasePlaylistFromSpotify()");
    let spotifyPlaylist = await getPlaylistFromSpotify(id);
    let spotifySongs = globals.getSongsFromPlaylist(spotifyPlaylist);
    let diff = globals.diff(spotifySongs, aws.songs || []);
    if(diff.new.length > 0) {
      console.log("adding songs", diff.new);
      addSongs(diff.new);
    }
    if(diff.old.length > 0) {
      console.log("deleting songs", diff.old);
      deleteSongs(diff.old);
    }
    let toEdit = {};
    if(spotifyPlaylist.name !== aws.name) {
      console.log("NAMES NOT EQUAL", spotifyPlaylist.name, aws.name);
      toEdit.name = spotifyPlaylist.name;
    }
    let spotifyImage = getSpotifyImage(spotifyPlaylist);
    if(spotifyImage !== aws.image) {
      console.log("IMAGES NOT EQUAL", spotifyImage, aws.image);
      toEdit.image = spotifyImage;
    }
    if(toEdit.name || toEdit.image) {
      console.log("SENDING UPDATED", toEdit);
      console.log("rebase(): playlist", aws);
      update(toEdit);
    }
    callback(spotifyPlaylist);
  },
  deleteSongs: (id, ids) => {
    const tracks = ids.map(id => ({
      uri: `spotify:track:${id}`
    }));
    Spotify.sendRequest(`v1/playlists/${globals.getPlaylistId(id)}/tracks`, "DELETE", { tracks }, true).then(console.log);
  }
};

function getSpotifyImage(spotify) {
  return (
    (spotify.images && spotify.images[1] && spotify.images[1].url) || 
    (spotify.images && spotify.images[0] && spotify.images[0].url)
  );
}

export default net;