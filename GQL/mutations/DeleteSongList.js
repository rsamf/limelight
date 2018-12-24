import gql from 'graphql-tag';

export default gql`
mutation DeleteSongList($id: ID!) {
  deleteSongList(id: $id) {
    id
  }
}`;