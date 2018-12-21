import gql from 'graphql-tag';

export default gql`
query GetSomePlaylists($ids: [ID]!) {
  getPlaylistsOf(ids: $ids) {
    id
    ownerName
    ownerURI
    playlistName
    image
  }
}`;