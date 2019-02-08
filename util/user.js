import Spotify from 'rn-spotify-sdk';
import LocalObject from './LocalObject';

const getPlaylists = (user, func) => {
  console.warn("Sending Request");
  Spotify.sendRequest('v1/me/playlists', "GET", {}, false).then(({items}) => {
    if(items) {
      let filtered = items.filter(playlist => playlist.owner.id === user.id);
      let mapped = filtered.map(playlist => ({
        id: playlist.uri,
        ownerId: playlist.owner.id,
        ownerName: playlist.owner.display_name,
        image: playlist.images && playlist.images[0] && playlist.images[0].url,
        name: playlist.name,
        length: playlist.tracks.total
      }));
      func(mapped);
    } else {
      func([]);
    }
  });
};

let ownedPlaylistsScrollView, userComponent;
export default {
  setOwnedPlaylistsScrollView: val => {
    ownedPlaylistsScrollView = val;
  },
  get: (component) => {
    userComponent = component;
    const setUser = user => {
      component.setState({
        user,
        blurProps: {
          ...component.state.blurProps,
          user
        },
        header: {
          ...component.state.header,
          user
        }
      });
    };
    Spotify.addListener("login", () => {
      Spotify.getMe().then(user => {
        setUser({...user, playlists: ["LOADING"]});
        getPlaylists(user, playlists => setUser({...user, playlists}));
      });
    });
    Spotify.addListener("logout", () => {
      setUser(null);
    });
    promptLogin();
  },
  getPlaylists,
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
  refreshPlaylists: (callback) => {
    getPlaylists(userComponent.state.user, playlists => {
      userComponent.setState({
        user: {
          ...userComponent.state.user,
          playlists
        }
      });
      callback(playlists);
    });
  },
  rsa: func => {
    Spotify.isLoggedInAsync().then((loggedIn)=> {
      if(loggedIn) {
        func();
      } else {
        Spotify.login();
      }
    });
  },
  rsa_ud: func => {
    Spotify.isLoggedInAsync().then((loggedIn)=> {
      if(loggedIn) {
        Spotify.getMe().then(func);
      } else {
        Spotify.login();
      }
    });
  }
};
    

function promptLogin() {
  let app = new LocalObject("app", ()=>{}, () => {
    if(!app.notFirstTimeOpen) {
      app.set("notFirstTimeOpen", true);
      Spotify.login();
    }
  });
}