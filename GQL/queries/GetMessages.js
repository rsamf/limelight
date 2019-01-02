import gql from 'graphql-tag';

export default gql`
query GetMessages {
  getMessages {
    id
    type
    title
    subtitle
    content
    subcontent
    date
    image
  }
}`;