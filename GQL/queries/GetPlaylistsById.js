import gql from 'graphql-tag';

export default gql`
query GetSomePlaylists($ids: [ID]!) {
  getPlaylistsOf(ids: $ids) {
    id
    ownerName
    playlistName
    live
    image
  }
}`;