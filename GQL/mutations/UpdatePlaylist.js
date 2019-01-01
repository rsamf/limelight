import gql from 'graphql-tag';

export default gql`
mutation updatePlaylist($id: ID!, $name: String, $code: String, $image: String) {
  updatePlaylist(id: $id, name: $name, code: $code, image: $image) {
    id
    name
    code
    image
  }
}`;