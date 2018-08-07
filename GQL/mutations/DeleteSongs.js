import gql from 'graphql-tag';

export default gql`
mutation DeleteSongs($id: ID!) {
  deleteSongs(id: $id) {
    id
  }
}`;