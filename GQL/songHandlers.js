export default {
  vote: (songs, index) => {
    let songsCopy = [...songs];
    let songsToVoteFrom = songsCopy.slice(1);
    console.log(songsToVoteFrom[index]);
    songsToVoteFrom[index].votes++;
    return [songsCopy[0], ...shift(songsToVoteFrom, index)];
  },
  add: (songs, song) => {
    let songsCopy = songs.map(s => ({...s}));
    songsCopy.push({
      ...song,
      votes: 0,
      state: 0
    });
    return songsCopy;
  },
  delete: (songs, id) => {
    let songsCopy = songs.map(s => ({...s}));
    let index = getIndexFromId(songsCopy, id);
    songsCopy.splice(index, 1);
    return songsCopy;
  },
  next: (songs) => {
    let songsCopy = songs.map(s => ({...s}));
    songsCopy[0].votes = 0;
    songsCopy[0].state++;
    return [...songsCopy.slice(1), songsCopy[0]];
  }
};

function getIndexFromId(songs, id) {
  let i = 0;
  while(i < songs.length && songs[i].id !== id) {
    i++;
  }
  return i;
}

function shift(songs, index) {
  const shiftingSong = songs[index];
  let i = index;
  while(i > 0 && shiftingSong.votes > songs[i - 1].votes) {
    songs[i] = songs[i-1];
    i--;
  }
  songs[i] = shiftingSong;
  return songs;
}