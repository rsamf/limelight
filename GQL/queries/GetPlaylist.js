import gql from 'graphql-tag';

export default gql`
query GetPlaylist($id: ID!) {
  getPlaylist(id: $id) {
    id
    owner
    item
    songs
    currentSong
  }
}`;