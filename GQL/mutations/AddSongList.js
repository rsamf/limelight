import gql from 'graphql-tag';

export default gql`
  mutation($id: ID!, $songs: [SongInput]!) {
    addSongList(id: $id, songs: $songs) {
      songs {
        id
        name
        artist
        duration
        image
      }
    }
  }
`;