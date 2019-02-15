import gql from 'graphql-tag';

export default gql`
mutation DeleteSongs($id: ID!, $songs: [ID]!) {
  deleteSongs(id: $id, songs: $songs) {
    id
    songs {
      id
      name
      artist
      artists
      image
      duration
      votes
      state
    }
  }
}`;