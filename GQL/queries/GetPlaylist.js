import gql from 'graphql-tag';

export default gql`
query GetPlaylist($id: ID!) {
  getPlaylist(id: $id) {
    id
    ownerName
    ownerId
    name
    songs
    image
    code
  }
}`;