import gql from 'graphql-tag';

export default gql`
mutation AddPlaylist($ownerURI: String!, $ownerName: String!, $playlistName: String!, $image: String) {
  addPlaylist(ownerURI: $ownerURI, ownerName: $ownerName, playlistName: $playlistName, image: $image) {
    id
  }
}`;