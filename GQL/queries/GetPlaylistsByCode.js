import gql from 'graphql-tag';

export default gql`
query GetPlaylistsByCode($code: ID!) {
  getPlaylistsByCode(code: $code) {
    playlists {
      id
      name
      ownerName
      image
    }
  }
}`;