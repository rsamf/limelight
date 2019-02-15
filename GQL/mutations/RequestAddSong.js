import gql from 'graphql-tag';

export default gql`
mutation RequestAddSong($id: ID!, $song: SongInput!){
  requestAddSong(id: $id, song: $song) {
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