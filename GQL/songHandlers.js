export default {
  // Songs
  vote: (songs, index) => {
    return [songs[0], ...voted(songs.slice(1), index)];
  },
  next: (songs) => {
    let songsCopy = [...songs];
    songsCopy[0].votes = 0;
    songsCopy[0].state++;
    return [...songsCopy.slice(1), songsCopy[0]];
  },
  add: (songs, newSongs) => {
    return [...songs, ...newSongs.map(song => ({
      ...song,
      __typename: "Song",
      votes: 0,
      state: 0
    }))];
  },
  delete: (songs, id) => {
    let songsCopy = [...songs];
    let index = getIndexFromId(songsCopy, id);
    songsCopy.splice(index, 1);
    return songsCopy;
  },
  // Requests
  request: (songs, song) => {
    return [...songs, {
      ...song,
      __typename: "Song"
    }];
  },
  requestACK: (songs, index) => {
    return songs.filter((_, i) => i !== index).map(song => ({
      ...song,
      __typename: "Song"
    }));
  }
};

function getIndexFromId(songs, id) {
  let i = 0;
  while(i < songs.length && songs[i].id !== id) {
    i++;
  }
  return i;
}

function shifted(songs, i) {
  const song = songs[i];
  let songsCopy = [...songs];
  while(i > 0 && song.votes > songsCopy[i - 1].votes) {
    songsCopy[i] = songsCopy[i-1];
    i--;
  }
  songsCopy[i] = song;
  return songsCopy;
}

function voted(songs, index) {
  let song = songs[index];
  songs[index] = {
    ...song,
    votes: song.votes + 1,
    __typename: "Song" 
  };
  return shifted(songs, index);
}