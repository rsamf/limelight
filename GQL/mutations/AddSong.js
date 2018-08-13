import gql from 'graphql-tag';

export default gql`
mutation AddSong($id: ID!, $song: SongInput!) {
  addSong(id: $id, song: $song) {
    id
    songs {
      id
      image
      name
      artist
      votes
      duration
      state
    }
  }
}`;