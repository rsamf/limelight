import gql from 'graphql-tag';

export default gql`
query AllPlaylists {
  getPlaylists {
    playlists {
      id
      owner
      image
      playlistName
    }
  }
}
`;