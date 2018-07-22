import { createStackNavigator } from 'react-navigation';
import { AppRegistry, Alert } from 'react-native';
import BarNavigator from './components/barNavigator';
import Bar from './components/bar';
import Spotify from 'rn-spotify-sdk';
import React from 'react';
import globals from './components';

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
      userLoggedIn: null
    };
  }

  getUser(callback){
    Spotify.getMe().then(user => {
      globals.user = user;
      callback();
    });
  }

  count = 0;
  componentDidMount(){
    
    let self = this;
    setInterval(()=>{
      self.setState({
        user: {
          name: "hi" + this.count++,
        }
      });
    }, 1000);
    Spotify.addListener("login", details => {
      this.getUser(()=>{
        self.setState({
          userLoggedIn: true
        });
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
				Alert.alert("Error", error.message);
			});
		}
  }
  
  render(){
    return <Root screenProps={{user: this.state.user}}/>;
  }
}

AppRegistry.registerComponent('Spotlight', () => Root);