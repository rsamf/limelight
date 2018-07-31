import gql from 'graphql-tag';

export default gql`
subscription SongAdded($id: ID!) {
  songAdded(id: $id) {
    songs
  }
}
`;