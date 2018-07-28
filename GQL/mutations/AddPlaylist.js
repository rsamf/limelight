import gql from 'graphql-tag';

export default gql`
mutation AddPlaylist($ownerURI: String!, $playlistURI: String!, $ownerName: String!, $playlistName: String!, $songs: [String]!, $image: String) {
  addPlaylist(ownerURI: $ownerURI, playlistURI: $playlistURI, ownerName: $ownerName, playlistName: $playlistName, songs: $songs, image: $image) {
    id
  }
}`;