import gql from 'graphql-tag';

export default gql`
query GetPlaylist($id: ID!) {
  getPlaylist(id: $id) {
    id
    ownerName
    ownerURI
    playlistName
    playlistURI
    songs
    currentSong
    image
  }
}`;