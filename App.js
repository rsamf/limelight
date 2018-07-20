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
  componentDidMount(){
    Spotify.addListener("login", details => {
      console.warn(details);
    });
		if(!Spotify.isInitialized())
		{
			let spotifyOptions = {
			  clientID: "65a08501d9e64abfb003fb795ee1a540",
				sessionUserDefaultsKey: "SpotifySession",
				redirectURL: "spotlight://auth",
				scopes: ["user-read-private", "playlist-read", "playlist-read-private", "streaming"],
			};
			Spotify.initialize(spotifyOptions).then((loggedIn) => {
        console.warn("Spotify is initializzed");
        console.warn("Login status", loggedIn);
        if(!loggedIn){
          Spotify.login();
        }
			}).catch((error) => {
				Alert.alert("Error", error.message);
			});
		}
	}
  render(){
    return <Root/>;
  }
}

AppRegistry.registerComponent('Spotlight', () => Root);