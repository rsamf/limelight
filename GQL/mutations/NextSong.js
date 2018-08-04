import gql from 'graphql-tag';

export default gql`
mutation NextSong($id: ID!) {
  nextSong(id: $id) {
    id
    songs {
      id
      image
      name
      artist
      votes
      duration
    }
  }
}`;