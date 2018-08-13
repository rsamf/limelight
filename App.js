import { createStackNavigator } from 'react-navigation';
import { AppRegistry, Alert, View, findNodeHandle, Text } from 'react-native';
import BarNavigator from './components/barNavigator';
import Bar from './components/bar';
import Spotify from 'rn-spotify-sdk';
import React from 'react';
import Signin from './components/helpers/signin';
import globals from './components/helpers';
import Profile from './components/blurs/profile';
import HostPlaylist from './components/blurs/hostPlaylist';
import JoinPlaylist from './components/blurs/joinPlaylist';
import AddSong from './components/blurs/addSong';
import PlaylistOptions from './components/blurs/playlistOptions';
import StoredPlaylist from './components/helpers/StoredPlaylist';
const localPlaylists = new StoredPlaylist();


// AppSync
import { Rehydrated } from 'aws-appsync-react';
import { ApolloProvider } from 'react-apollo';


const Root = createStackNavigator({
  BarNavigator: {
    screen: BarNavigator
  },
  Bar: {
    screen: Bar
  }
}, {
  initialRouteName: 'BarNavigator',
  headerMode: 'none',
  gesturesEnabled: false
});

export default class App extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      user: null,
      playlists: null,
      opened: [false, false, false, false, false],
      props: {}
    };
  }

  getUser(){
    Spotify.addListener("login", () => {
      Spotify.getMe().then(user => {
        console.warn(user);
        this.setState({
          user: user
        });
      });
    });
    Spotify.addListener("logout", () => {
      // Spotify.login();
      this.setState({
        user: null
      });
    });
  }

  getLocalPlaylistsInterface() {
    localPlaylists.getAll(list => {
      this.setState({
        playlists: {
          stored: list,
          add: (id, callback) => {
            localPlaylists.push(id, ids => {
              this.setState({
                playlists: {
                  ...this.state.playlists,
                  stored: ids
                }
              });
              if(callback) callback(ids);
            });
          },
          remove: (id, callback) => {
            localPlaylists.remove(id, ids => {
              this.setState({
                playlists: {
                  ...this.state.playlists,
                  stored: ids
                }
              });
              if(callback) callback(ids);
            });
          }
        }
      })
    });
  }

  componentDidMount(){
    this.getLocalPlaylistsInterface();
    this.getUser();
		if(!Spotify.isInitialized())
		{
			let spotifyOptions = {
			  clientID: "65a08501d9e64abfb003fb795ee1a540",
				sessionUserDefaultsKey: "SpotifySession",
				redirectURL: "spotlight://auth",
				scopes: ["user-read-private", "playlist-read", "playlist-read-private", "streaming"],
			};
			Spotify.initialize(spotifyOptions).catch((error) => {
				Alert.alert("Error in initializing Spotify");
			});
		}
  }

  setOpened(which, props) {
    let opened = this.state.opened;
    opened[which] = !opened[which];
    this.setState({ 
      opened,
      props
    });
  }

  render(){
    let propsToPass = {
      user: this.state.user,
      localPlaylists: this.state.playlists,
      setOpenedBlur: (i, props) => this.setOpened(i, props),
    };
    return (
      <ApolloProvider client={globals.client}>
        <Rehydrated>
          <View style={{flex:1}}>
            <View style={globals.style.fullscreen} ref="view" onLayout={()=>this.setState({ viewRef: findNodeHandle(this.refs.view) })}>
              <Root screenProps={propsToPass}/>
              <Signin open={()=>this.setOpened(0)} user={this.state.user}/>
            </View>
            {this.renderBlurs()}
          </View>
        </Rehydrated>
      </ApolloProvider>
    );
  }
  renderBlurs() {
    const which = this.state.opened.indexOf(true);
    const props = {
      ...this.state.props,
      viewRef: this.state.viewRef,
      user: this.state.user,
      close: ()=>this.setOpened(which),
      localPlaylists: this.state.playlists
    };
    switch(which) {
      case 0:
        return (
          <Profile {...props}/>
        );
      case 1: 
        return (
          <HostPlaylist {...props}/>
        );
      case 2:
        return (
          <AddSong {...props}/>
        );
      case 3:
        return (
          <PlaylistOptions {...props}/>
        );
      case 4:
        return (
          <JoinPlaylist {...props}/>
        );
    }
  }
}

AppRegistry.registerComponent('Spotlight', () => Root);