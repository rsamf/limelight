import gql from 'graphql-tag';

export default gql`
  query($id: ID!) {
    getSongs(id: $id) {
      songs {
        id
        name
        artist
        image
        duration
        votes
      }
    }
  }
`;