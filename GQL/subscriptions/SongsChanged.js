import gql from 'graphql-tag';

export default gql`
subscription SongAdded($id: ID!) {
  onSongsChanged(id: $id) {
    songs
  }
}
`;