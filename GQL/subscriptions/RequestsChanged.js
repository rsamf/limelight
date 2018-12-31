import gql from 'graphql-tag';

export default gql`
subscription($id: ID!){
  onRequestsChanged(id: $id) {
    songs {
      id
      name
      image
      artist
    }
  }
}
`;