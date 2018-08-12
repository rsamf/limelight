import { graphql, compose } from 'react-apollo';
import GetPlaylistsById from './queries/GetPlaylistsById';
import playlist from './playlist';

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
    props: props => {
      let playlists = props.data.getPlaylistsOf; 
      if(!props.data.loading) {
        // remove null or undefined playlists
        playlists = playlists.filter(p => p);
        // also removed them from local storage
        let playlistsIds = playlists.map(p => p.id);
        let localPlaylists = props.ownProps.localPlaylists;
        localPlaylists.stored.forEach(p => {
          if(!playlistsIds.includes(p)) {
            localPlaylists.remove(p);
          }
        });
      }
      return {
        navigation: props.ownProps.navigation,
        playlists: playlists,
        loading: props.data.loading,
        error: props.data.error
      };
    }
}))(Component);