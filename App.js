import { createStackNavigator } from 'react-navigation';
import { AppRegistry, Alert, View, findNodeHandle, Text } from 'react-native';
import BarNavigator from './components/barNavigator';
import Bar from './components/bar';
import Spotify from 'rn-spotify-sdk';
import React from 'react';
import Signin from './components/helpers/signin';
import globals from './components/helpers';
import { BlurView } from 'react-native-blur';
import Profile from './components/helpers/profile';

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
      opened: false,
      isProfileIconVisible: true
    };
  }

  getUser(){
    Spotify.getMe().then(user => {
      console.warn(user);
      this.setState({
        user: user
      });
    });
  }

  componentDidMount(){
    Spotify.addListener("login", () => {
      console.warn("getting user");
      this.getUser();
    });
    Spotify.addListener("logout", () => {
      // Spotify.login();
      this.setState({
        user: null
      });
    });
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

  render(){
    let propsToPass = {
      user: this.state.user,
      setProfileIconVisibility: (val) => {
        this.setState({
          isProfileIconVisible: val
        });
      }
    };
    return (
      <ApolloProvider client={globals.client}>
        <Rehydrated>
          <View style={{flex:1}}>
            <View style={globals.style.fullscreen} ref="view" onLayout={()=>this.setState({ viewRef: findNodeHandle(this.refs.view) })}>
              <Root screenProps={propsToPass}/>
              {
                this.state.isProfileIconVisible &&
                <Signin open={()=>this.setState({ opened: true })} user={this.state.user}/>
              }
            </View>
            {
              this.state.opened &&
              <BlurView style={globals.style.fullscreen} viewRef={this.state.viewRef} blurType="dark" blurAmount={3}/>
            }
            {
              this.state.opened &&
              <Profile close={()=>this.setState({ opened: false })} user={this.state.user}/>
            }
          </View>
        </Rehydrated>
      </ApolloProvider>
    );
  }
}

AppRegistry.registerComponent('Spotlight', () => Root);