import gql from 'graphql-tag';

export default gql`
mutation DeleteSong($id: ID!, $songId: ID!) {
  deleteSong(id: $id, songId: $songId) {
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