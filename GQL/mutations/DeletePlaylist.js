import gql from 'graphql-tag';

export default gql`
mutation DeletePlaylist($id: ID!) {
  deletePlaylist(id: $id) {
      id
      item
      owner
      songs
  }
}`;