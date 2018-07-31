import gql from 'graphql-tag';

export default gql`
mutation AddPlaylist($ownerURI: String!, $ownerName: String!, $playlistName: String!, $songs: [SongInput], $image: String) {
  addPlaylist(ownerURI: $ownerURI, ownerName: $ownerName, playlistName: $playlistName, songs: $songs, image: $image) {
    id
  }
}`;