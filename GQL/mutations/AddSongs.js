import gql from 'graphql-tag';

export default gql`
mutation AddSongs($id: ID!, $songs: [SongInput]!) {
  addSongs(id: $id, songs: $songs) {
    id
    songs {
      id
      image
      name
      artist
      artists
      votes
      duration
      state
    }
  }
}`;