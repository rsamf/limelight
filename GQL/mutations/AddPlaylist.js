import gql from 'graphql-tag';

export default gql`
mutation AddPlaylist($id: ID!, $ownerId: String!, $ownerName: String!, $name: String!, $image: String) {
  addPlaylist(id: $id, ownerId: $ownerId, ownerName: $ownerName, name: $name, image: $image) {
    id
    name
  }
}`;