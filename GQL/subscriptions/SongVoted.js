import gql from 'graphql-tag';

export default gql`
subscription SongVoted($id: ID!) {
  songVoted(id: $id) {
    songs
  }
}
`;