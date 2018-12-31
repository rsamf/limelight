import gql from 'graphql-tag';

export default gql`
mutation updatePlaylist($id: ID!, $playlist: PlaylistInput!) {
  updatePlaylist(id: $id, playlist: $playlist) {
    id
    name
    code
    image
  }
}`;