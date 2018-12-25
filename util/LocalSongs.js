import LocalObject from './LocalObject';
import globals from '../components/helpers';

export default class LocalSongs extends LocalObject {
  constructor(playlistId, songs, component, callback) {
    super("songs", () => {
      component.setState({
        songs: this
      });
    }, ()=>{
      this.playlistId = playlistId;
      this.rebase(songs, ()=>callback(this));
    });
  }

  get spotlight() {
    // console.error(this[this.playlistId]);
    return this[this.playlistId][0];
  }

  get queue() {
    return this[this.playlistId].slice(1);
  }

  canVote(state, index) {
    let localSong = this[this.playlistId][index];
    return state !== localSong.state || !localSong.voted;
  } 

  rebase(newSongs, callback) {
    if(this.contains(this.playlistId)) {
      const diff = globals.diff(newSongs, this[this.playlistId]);
      this.set(this.playlistId, [...this[this.playlistId], ...diff.new.map(song => ({
        ...song,
        voted: !this.canVote(song),
      }))], callback);
    } else {
      this.set(this.playlistId, newSongs.map(song => ({
        ...song,
        voted: false,
      })), callback);
    }

    // diff.old.forEach(old =>{

    // });
  }

  addSong(song) {
    this.set(this.playlistId, [...this[this.playlistId], {
      ...song,
      voted: !this.canVote(song),
    }]);
  }

  deleteSong(index) {
    let songs = this[this.playlistId];
    songs.splice(index, 1);
    this.set(this.playlistId, songs);
  }

  deleteSongById(id) {
    let songs = this[this.playlistId];
    const targetIndex = getSongIndexFromId(id);
    if(targetIndex === -1) return;

    songs.splice(targetIndex, 1);
    this.set(this.playlistId, songs);
  }

  vote(state, index) {
    if(this.canVote(state, index)) {
      let songs = this[this.playlistId];
      songs[index] = {
        ...songs[index],
        state: song.state,
        voted: true
      };
      this.set(this.playlistId, songs);
    }
  }

  getSongIndexFromId(songId) {
    let i = 0;
    while(i < this[this.playlistId].length) {
      if(this[this.playlistId][i].id === songId) {
        return i;
      }
    }
    return -1;
  }

  // get(playlistId, callback) {
  //   this.getAll(playlists => {
  //     if(callback) callback(playlists[playlistId]);
  //   });
  // }

  // getAll(callback) {
  //   AsyncStorage.getItem(this.item, (err, playlists) => {
  //     const parsedPlaylists = (!err && playlists) ? JSON.parse(playlists) : {};
  //     if(callback) callback(parsedPlaylists);
  //   });
  // }

  // setPlaylistToSongs(playlistId, songs, callback) {
  //   this.getAll(playlists => {
  //     let playlist = playlists[playlistId] || {};
  //     songs.forEach(song => {
  //       let local = playlist[song.id];
  //       // If exists locally, get local state, else it is a new song, so it is not voted for and the state is from network
  //       if(local) {
  //         playlist[song.id] = {
  //           voted: (local.state === song.state) ? local.voted : false,
  //           state: local.state
  //         };
  //       } else {
  //         playlist[song.id] = {
  //           voted: false,
  //           state: song.state
  //         };
  //       }
  //     });
  //     playlists[playlistId] = playlist;
  //     this.setPlaylists(playlists);
  //     if(callback) callback(playlist);
  //   });
  // }
  
  // setPlaylists(playlists) {
  //   return AsyncStorage.setItem(this.item, JSON.stringify(playlists));
  // }
}
