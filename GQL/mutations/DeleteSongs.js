import gql from 'graphql-tag';

export default gql`
mutation DeleteSongs($id: ID!, $songs: [ID]!) {
  deleteSongs(id: $id, songId: $songs) {
    id
  }
}`;