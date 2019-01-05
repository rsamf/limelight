import gql from 'graphql-tag';

export default gql`
mutation AddPlaylist($playlist: PlaylistInput!){
  addPlaylist(playlist: $playlist) {
    id
    name
    ownerId
    ownerName
    code
    image
  }
}`;