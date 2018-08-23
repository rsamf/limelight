import React from 'react';
import { View, Alert } from 'react-native';
import { Icon, Avatar } from 'react-native-elements';
import Spotify from 'rn-spotify-sdk';
import globals from '../helpers';
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

  renderNotLoggedIn(){
    return(
      <Icon size={40} type="font-awesome" name="user" 
      color={globals.sWhite} underlayColor={globals.sBlack} onPress={()=>this.login()}/>
    );
  }

  renderLoggedIn(){
    let images = this.props.user.images;
    if(images[0] && images[0].url) {
      return(
        <Avatar
          medium rounded
          source={{uri: images[0] && images[0].url}}
          onPress={() => this.props.open()}
          activeOpacity={0.7}
        />
      );
    } else {
      return(
        <Icon size={40} type="font-awesome" name="user-circle" 
        color={globals.sWhite} underlayColor={globals.sBlack} onPress={()=>this.login()}/>
      );
    }
  }
  render(){
    return (
      <View style={{position: 'absolute', bottom: 15, left: 15}}>
        {
          this.props.user ?
          this.renderLoggedIn() :
          this.renderNotLoggedIn()
        }
      </View>
    );
  }
}