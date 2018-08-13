import gql from 'graphql-tag';

export default gql`
subscription($id: ID!){
  onSongsChanged(id: $id) {
    songs {
      id
      name
      votes
      image
      duration
      artist
      state
    }
  }
}
`;