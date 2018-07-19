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

export default class extends React.Component {
  componentDidMount(){
    // initialize Spotify if it hasn't been initialized yet
		if(!Spotify.isInitialized())
		{
			// initialize spotify
			let spotifyOptions = {
			  clientID: "65a08501d9e64abfb003fb795ee1a540",
				sessionUserDefaultsKey: "SpotifySession",
				redirectURL: "spotlight://auth",
				scopes:["user-read-private", "playlist-read", "playlist-read-private", "streaming"],
			};
			Spotify.initialize(spotifyOptions).then((loggedIn) => {
				// update UI state
				this.setState({spotifyInitialized: true});
				// handle initialization
				if(loggedIn)
				{
					this.goToPlayer();
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