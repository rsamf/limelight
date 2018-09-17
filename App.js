import { createStackNavigator } from 'react-navigation';
import { AppRegistry, Alert, View, findNodeHandle } from 'react-native';
import BarList from './components/barNavigator/barList';
import Bar from './components/bar';
import Spotify from 'rn-spotify-sdk';
import React from 'react';
import globals from './components/helpers';
import StoredPlaylist from './components/helpers/StoredPlaylist';
import Blur from './components/blurs/blur';
import ProfileBlur from './components/blurs/profile';
const localPlaylists = new StoredPlaylist();

// AppSync
import { Rehydrated } from 'aws-appsync-react';
import { ApolloProvider } from 'react-apollo';

const Root = createStackNavigator({
  BarList: {
    screen: BarList
  },
  Bar: {
    screen: Bar
  }
}, {
  initialRouteName: 'BarList',
  headerMode: 'none',
  gesturesEnabled: false
});

export default class App extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      user: null,
      playlists: null,
      blur: null,
      blurProps: {
        close: ()=>this.setOpenedBlur(null)
      }
    };
  }


  getUser(){
    const setUser = (user) => {
      this.setState({
        user,
        blurProps: {
          ...this.state.blurProps,
          user
        }
      });
    }
    Spotify.addListener("login", () => {
      Spotify.getMe().then(user => {
        setUser(user);
      });
    });
    Spotify.addListener("logout", () => {
      setUser(null);
    });
  }

  getLocalPlaylistsInterface() {
    localPlaylists.getAll(list => {
      this.setState({
        playlists: {
          stored: list,
          add: (id, callback) => {
            localPlaylists.push(id, ids => {
              setPlaylists(ids);
              if(callback) callback(ids);
            });
          },
          remove: (id, callback) => {
            localPlaylists.remove(id, ids => {
              setPlaylists(ids);
              if(callback) callback(ids);
            });
          }
        }
      })
    });
    const setPlaylists = (ids) => {
      const playlists = {
        ...this.state.playlists,
        stored: ids
      };
      this.setState({
        playlists,
        blurProps: {
          ...this.state.blurProps,
          localPlaylists: playlists
        }
      });
    }
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

  setOpenedBlur(blur, props) {
    this.setState({ 
      blur,
      blurProps: {
        ...props,
        ...this.state.blurProps
      }
    });
  }

  render(){
    let propsToPass = {
      user: this.state.user,
      localPlaylists: this.state.playlists,
      openBlur: (blur, props) => this.setOpenedBlur(blur, props),
      goToLogin: () => this.setOpenedBlur(ProfileBlur)
    };
    return (
      <ApolloProvider client={globals.client}>
        <Rehydrated>
          <View style={globals.style.view}>
            <View style={globals.style.fullscreen} ref="view" onLayout={()=>this.setState({ viewRef: findNodeHandle(this.refs.view) })}>
              <Root screenProps={propsToPass}/>
            </View>
            {this.renderBlurs()}
          </View>
        </Rehydrated>
      </ApolloProvider>
    );
  }
  
  renderBlurs() {
    const InnerContent = this.state.blur;
    if(InnerContent) {
      return (
        <Blur 
          viewRef={this.state.viewRef}
          close={()=>this.setOpenedBlur(null)}
          goToProfile={()=>this.setOpenedBlur(ProfileBlur)}
        >
          <InnerContent {...this.state.blurProps}/>
        </Blur>
      );
    }
  }
}

AppRegistry.registerComponent('Spotlight', () => Root);