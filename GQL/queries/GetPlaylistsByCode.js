import gql from 'graphql-tag';

export default gql`
query GetPlaylistsByCode($shortCode: ID!) {
  getPlaylistsByCode(shortCode: $shortCode) {
    playlists {
      id
      name
      ownerName
      image
    }
  }
}`;