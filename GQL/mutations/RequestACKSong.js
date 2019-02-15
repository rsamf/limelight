import gql from 'graphql-tag';

export default gql`
mutation RequestACKSong($id: ID!, $index: Int!, $accepted: Boolean){
  requestACKSong(id: $id, index: $index, accepted: $accepted) {
    id
    songs {
      id
      name
      image
      artist
      artists
      duration
    }
  }
}`;