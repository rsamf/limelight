import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { Icon, Button, Avatar } from 'react-native-elements';
import Spotify from 'rn-spotify-sdk';
import Shade from '../helpers/shade';
import globals from '../helpers';
import BlurView from 'react-native-blur';

export default class extends React.Component {

  constructor(props){
    super(props);

    this.state = {
      opened: false
    };
  }

  renderNotLoggedIn(){
    return(
      <Icon size={40} type="font-awesome" name="user" 
      color={globals.sWhite} underlayColor={globals.sBlack} onPress={()=>Spotify.login()}/>
    );
  }

  renderLoggedIn(){
    let user = this.props.user;
    return(
      <Avatar
        medium rounded
        source={{uri: user.images[0].url}}
        onPress={() => this.props.open()}
        activeOpacity={0.7}
      />
    );
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

const style = StyleSheet.create({
  view: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    padding: 40
  },
  icon: {
    backgroundColor: globals.sBlack
  }
});