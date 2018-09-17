import React from 'react';
import { Alert, TouchableOpacity } from 'react-native';
import { Icon, Avatar } from 'react-native-elements';
import Spotify from 'rn-spotify-sdk';
import globals from '../helpers';
import ProfileBlur from '../blurs/profile';
const noPremiumMessage = "Make sure this is a Spotify Premium account. Hosting a playlist through Spotlight requires a Spotify Premium account";

export default class extends React.Component {
  constructor(props){
    super(props);

    this.state = {
      opened: false,
      loggingIn: false
    };
  }

  componentWillReceiveProps() {
    if(this.state.loggingIn) {
      Spotify.getMe().catch(() => {
        Alert.alert("Login Error", noPremiumMessage, [{
          text: 'Ok'
        }]);
      });
      this.setState({
        loggingIn: false
      });
    }
  }

  login() {
    this.setState({
      loggingIn: true
    });
    Spotify.login();
  }

  render(){
    return (
      <TouchableOpacity onPress={()=>this.openBlur()}>
        {
          this.props.user ?
          this.renderLoggedIn() :
          this.renderNotLoggedIn()
        }
      </TouchableOpacity>
    );
  }
}