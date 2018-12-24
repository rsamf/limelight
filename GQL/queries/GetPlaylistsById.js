import gql from 'graphql-tag';

export default gql`
query GetSomePlaylists($ids: [ID]!) {
  getPlaylistsOf(ids: $ids) {
    id
    ownerName
    ownerId
    name
    image
    __typename
  }
}`;