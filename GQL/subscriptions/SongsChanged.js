import gql from 'graphql-tag';

export default gql`
subscription SongsChanged{
  onSongsChanged {
    id
    name
    artist
    duration
    image
    votes
  }
}
`;