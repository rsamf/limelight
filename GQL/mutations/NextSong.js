import gql from 'graphql-tag';

export default gql`
mutation NextSong($id: ID!) {
  nextSong(id: $id) {
    songs
  }
}`;