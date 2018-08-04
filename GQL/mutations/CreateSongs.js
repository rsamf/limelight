import gql from 'graphql-tag';

export default gql`
  mutation($id: ID!, $songs: [SongInput]!) {
    createSongs(id: $id, songs: $songs) {
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
  }
`;