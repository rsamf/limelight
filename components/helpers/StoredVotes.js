import { AsyncStorage } from 'react-native';

export default class StoredVotes {
  constructor() {
    this.item = this.stg`votes`;
  }

  stg = item => `spotlight:${item}`;

  removePlaylist(playlistId, callback) {
    this.getAll(playlists => {
      delete playlists[playlistId];
      this.setPlaylists(playlists).then(()=>{
        if(callback) callback(playlists);
      });
    });
  }

  addSong(playlistId, songId, state, callback) {
    this.getAll(playlists => {
      playlists[playlistId][songId] = {
        state,
        voted: false
      };
      this.setPlaylists(playlists).then(()=>{
        if(callback) callback(playlists);
      });
    });
  }

  addPlaylist(playlistId, songs, callback) {
    this.getAll(playlists => {
      songs.forEach(song => {
        playlists[playlistId][songId] = {
          state: song.state,
          voted: false
        };
      });
      this.setPlaylists(playlists).then(()=>{
        if(callback) callback(playlists);
      });
    });
  }

  tryVote(playlistId, songId, state, callback) {
    this.getAll(playlists => {
      let song = playlists[playlistId][songId];
      console.warn(state, song.state, song.voted);
      if(state !== song.state || !song.voted) {
        this.setPlaylists({
          ...playlists,
          [playlistId]: {
            ...playlists[playlistId],
            [songId]: {
              state,
              voted: true
            }
          }
        }).then(()=>{
          console.warn("succeeding to vote");
          if(callback) callback(playlists, true);
        });
      } else {
        console.warn("failing to vote");
        if(callback) callback(playlists, false);
      }
    });
  }

  get(playlistId, callback) {
    this.getAll(playlists => {
      if(callback) callback(playlists[playlistId]);
    });
  }

  getAll(callback) {
    AsyncStorage.getItem(this.item, (err, playlists) => {
      const parsedPlaylists = (!err && playlists) ? JSON.parse(playlists) : {};
      if(callback) callback(parsedPlaylists);
    });
  }

  wipe(callback) {
    this.setVotes({}).then(()=>{
      if(callback) callback({});
    });
  }

  setPlaylistToSongs(playlistId, songs, callback) {
    let playlist = {};
    songs.forEach(song => {
      playlist[song.id] = {
        voted: false,
        state: song.state
      };
    });
    this.getAll(playlists => {
      playlists[playlistId] = playlist;
      this.setPlaylists(playlists);
      if(callback) callback(playlist);
    });
  }
  
  setPlaylists(playlists) {
    return AsyncStorage.setItem(this.item, JSON.stringify(playlists));
  }
}
