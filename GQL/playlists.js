import { graphql, compose } from 'react-apollo';
import GetPlaylistsById from './queries/GetPlaylistsById';

export default (Component) => compose(
  graphql(GetPlaylistsById, {
    options: props => {
      return {
        fetchPolicy: 'cache-and-network',
        variables: {
          ids: props.children
        }
      };
    },
    props: props => ({
      navigation: props.ownProps.navigation,
      playlists: props.data.getPlaylistsOf,
      loading: props.data.loading,
      error: props.data.error
    })
}))(Component);