import LocalObject from './LocalObject';
import globals from '../components/helpers';

export default class LocalSongs extends LocalObject {
  constructor(playlistId, component) {
    super("songs", () => {
      component.setState({
        songs: this
      });
    }, ()=>{
      this.playlistId = playlistId;
    });
  }

  get array() {
    return this[this.playlistId] || [];
  }

  get length() {
    return this.array.length;
  }

  get spotlight() {
    return this.array[0];
  }

  get queue() {
    return this.array.slice(1);
  }

  canVote(index) {
    let song = this.queue[index];
    return song && (song.localState !== song.networkState || !song.voted);
  }

  getMerged(songs, onlyInclude) {
    let toReturn = [];
    let oldSongs = this.array;
    const contains = songId => {
      for(let i = 0; i < onlyInclude.length; i++) {
        if(onlyInclude[i].id === songId) {
          return true;
        }
      }
      return false;
    };
    const findOldSongWithMatchingId = songIndex => {
      const id = songs[songIndex].id;
      for(let i = 0; i < oldSongs.length; i++) {
        if(oldSongs[i].id === id) {
          delete songs[songIndex];
          return oldSongs[i];
        }
      }
      return null;
    };
    songs.forEach((s,i) => {
      let oldSong = findOldSongWithMatchingId(i);
      if(oldSong) {
        toReturn.push({
          ...s,
          localState: oldSong.localState,
          voted: oldSong.voted,
          networkState: s.state,
        });
      }
    });
    toReturn = [...toReturn, ...songs.filter(s => s).map(s => ({
      ...s,
      localState: s.state,
      networkState: s.state,
      voted: false
    }))];
    if(onlyInclude) {
      toReturn = toReturn.filter(s => contains(s.id));
    }
    return toReturn;
  }

  rebase(newSongs, onlyInclude, callback) {
    if(!newSongs) return;
    if(this.contains(this.playlistId)) {
      const merged = this.getMerged([...newSongs], onlyInclude);
      this.set(this.playlistId, merged, () => {
        if(callback) callback();
      });
    } else {
      let localSongs = newSongs.map(song => ({
        ...song,
        voted: false,
        networkState: song.state,
        localState: song.state
      }));
      this.set(this.playlistId, localSongs, () => {
        if(callback) callback();
      });
    }
  }

  addSong(song) {
    this.set(this.playlistId, [...this[this.playlistId], {
      ...song,
      localState: song.state,
      networkState: song.state,
      voted: false,
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

  vote(index, callback) {
    if(this.canVote(index)) {
      let newQ = [...this.queue];
      let song = newQ[index];
      newQ[index] = {
        ...song,
        localState: song.networkState,
        voted: true
      };
      this.set(this.playlistId, [this.spotlight, ...newQ], ()=>callback(song.id));
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
}
