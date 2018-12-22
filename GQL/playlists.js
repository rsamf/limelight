import { graphql, compose } from 'react-apollo';
import GetPlaylistsById from './queries/GetPlaylistsById';

export default (Component) => compose(
  graphql(GetPlaylistsById, {
    options: props => {
      return {
        fetchPolicy: 'cache-and-network',
        variables: {
          ids: props.playlists.toArray()
        }
      };
    },
    props: props => {
      let playlists = props.data.getPlaylistsOf;
      if(!props.data.loading && !props.data.error && playlists) {
        // remove null or undefined playlists
        let networkPlaylists = playlists.filter(p=>p).map(p => p.id);
        let localPlaylists = props.ownProps.playlists;
        if(networkPlaylists.length !== localPlaylists.length) {
          let toRemove = [];
          localPlaylists.forEach(p => {
            if(!networkPlaylists.includes(p)) {
              toRemove.push(p);
            }
          });
          localPlaylists.removeAll(toRemove);
        }
      }
      return {
        navigation: props.ownProps.navigation,
        playlists: props.ownProps.playlists,
        data: playlists,
        loading: props.data.loading,
        error: props.data.error
      };
    }
}))(Component);