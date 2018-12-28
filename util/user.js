import Spotify from 'rn-spotify-sdk';
import globals from '../components/helpers';

let ownedPlaylistsScrollView;
export default {
  setOwnedPlaylistsScrollView: val => {
    ownedPlaylistsScrollView = val;
  },
  get: (component) => {
    const setUser = user => {
      component.setState({
        user,
        blurProps: {
          ...component.state.blurProps,
          user
        }
      });
    };
    Spotify.addListener("login", () => {
      Spotify.getMe().then(user => {
        setUser({...user, playlists: []});
        globals.getMyPlaylists(user, playlists => setUser({...user, playlists}));
      });
    });
    Spotify.addListener("logout", () => {
      setUser(null);
    });
  },
  addPlaylist(component, playlist) {
    let playlists = component.state.user.playlists;
    if(playlist === "LOADING") {
      if(ownedPlaylistsScrollView) {
        ownedPlaylistsScrollView.scrollTo({x: 0, y: 0, animated: true});
      }
      playlists = ["LOADING", ...playlists];
    } else {
      playlists = playlists.slice(1);
      if(playlist !== "ERROR") {
        playlists = [playlist, ...playlists];
      }
    }
    component.setState({
      user: {
        ...component.state.user,
        playlists
      }
    });
  },
  rsa: func => {
    if(!Spotify.isLoggedIn()){
      Spotify.login();
    } else {
      func();
    }
  },
  rsa_ud: func => {
    if(!Spotify.isLoggedIn()){
      Spotify.login();
    } else {
      Spotify.getMe().then(func);
    }
  }
};
    