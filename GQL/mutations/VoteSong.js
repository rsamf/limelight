import gql from 'graphql-tag';

export default gql`
mutation VoteSong($id: ID!, $index: Int!) {
  voteSong(id: $id, index: $index) {
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