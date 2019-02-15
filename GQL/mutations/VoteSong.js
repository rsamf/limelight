import gql from 'graphql-tag';

export default gql`
mutation VoteSong($id: ID!, $songId: ID!) {
  voteSong(id: $id, songId: $songId) {
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