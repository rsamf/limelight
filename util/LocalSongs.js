import LocalObject from './LocalObject';

export default class LocalSongs extends LocalObject {
  constructor(playlistId, songs, component) {
    super("votes", votes => {
      component.setState({
        songs: votes
      });
    });
    prepare(playlistId, songs);
  }

  // removePlaylist(playlistId, callback) {
  //   this.getAll(playlists => {
  //     delete playlists[playlistId];
  //     this.setPlaylists(playlists).then(()=>{
  //       if(callback) callback(playlists);
  //     });
  //   });
  // }

  prepare(playlistId, songs) {
    this.rebase(playlistId, songs);
    this.merge(playlistId, songs);
  }

  merge(votes, songs){
    component.setState({
      songs: songs.map(s => {
        return {
          ...s,
          ...votes[s.id]
        };
      })
    });
  }

  rebase(key, value, callback) {
    this.getAll(playlists => {
      if(!playlists[key]) {
        this.set(key, value, callback);
      } else {
        let songs = Object.entries(value);
        songs.forEach(song => {
          let songId = song[0];
          let songState = song[1].state;
          let songVoted = false;
          if(!playlists[key][songId]) {
            playlists[key][songId] = {
              state: songState,
              voted: songVoted
            };
          }
        });
        this.set(key, playlists[key][songId], callback);
      }
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

  deleteSong(playlistId, songId, callback) {
    this.get(playlistId, playlist => {
      delete playlist[songId];
      this.set(playlistId, playlist[songId], callback);
    });
  }

  tryVote(playlistId, songId, state, callback) {
    this.getAll(playlists => {
      let song = playlists[playlistId][songId];
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
          if(callback) callback(playlists, true);
        });
      } else {
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
    this.getAll(playlists => {
      let playlist = playlists[playlistId] || {};
      songs.forEach(song => {
        let local = playlist[song.id];
        // If exists locally, get local state, else it is a new song, so it is not voted for and the state is from network
        if(local) {
          playlist[song.id] = {
            voted: (local.state === song.state) ? local.voted : false,
            state: local.state
          };
        } else {
          playlist[song.id] = {
            voted: false,
            state: song.state
          };
        }
      });
      playlists[playlistId] = playlist;
      this.setPlaylists(playlists);
      if(callback) callback(playlist);
    });
  }
  
  setPlaylists(playlists) {
    return AsyncStorage.setItem(this.item, JSON.stringify(playlists));
  }
}
