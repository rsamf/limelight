import { createStackNavigator } from 'react-navigation';
import { AppRegistry, Alert, View, StatusBar, StatusBarStyle, findNodeHandle } from 'react-native';
import BarList from './components/barList';
import Bar from './components/bar';
import Spotify from 'rn-spotify-sdk';
import React from 'react';
import globals from './components/helpers';
import Header from './components/header';
import Blur from './components/blurs';
import ProfileBlur from './components/blurs/profile';
import LocalPlaylists from './util/LocalPlaylists';
// AppSync
import { Rehydrated } from 'aws-appsync-react';
import { ApolloProvider } from 'react-apollo';
import user from './util/user';

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
    StatusBar.setBarStyle('light-content', true);
    const playlists = new LocalPlaylists(this);
    this.state = {
      user: null,
      playlists,
      blur: null,
      blurProps: {
        close: () => this.setOpenedBlur(null),
        goToProfile: () => this.setOpenedBlur(ProfileBlur),
        addToUserPlaylists: playlist => user.addPlaylist(this, playlist),
        playlists
      }
    };
  }

  componentDidMount(){
    console.warn("loggedin?", Spotify.isLoggedIn());
    user.get(this);
		if(!Spotify.isInitialized())
		{
			let spotifyOptions = {
        tokenSwapURL: "https://limelight-server.herokuapp.com/auth/swap",
        tokenRefreshURL: "https://limelight-server.herokuapp.com/auth/refresh",
			  clientID: "65a08501d9e64abfb003fb795ee1a540",
				sessionUserDefaultsKey: "SpotifySession",
				redirectURL: "limelight://auth",
				scopes: ["user-read-private", "playlist-read", "playlist-modify-public", "streaming"],
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
        ...this.state.blurProps,
        ...props,
      }
    });
  }

  componentDidUpdate() {
    console.warn('children', this.props.children);
    console.warn('node', findNodeHandle(this.refs.scroll));
    console.warn('user', user.ownedPlaylistsScrollView);
  }

  render(){
    let propsToPass = {
      user: this.state.user,
      playlists: this.state.playlists,
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
        >
          <InnerContent {...this.state.blurProps}/>
        </Blur>
      );
    }
  }
}

AppRegistry.registerComponent('Spotlight', () => Root);