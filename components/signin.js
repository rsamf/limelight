import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Icon, Button, Avatar } from 'react-native-elements';
import Spotify from 'rn-spotify-sdk';
import Shade from './shade';
import globals from '.';

export default class extends React.Component {

  constructor(props){
    super(props);

    this.state = {

    };
  }

  login(){
    Spotify.login();
  }

  renderNotLoggedIn(){
    return(
      <Shade>
        <View style={style.view}>
          <Icon type="font-awesome" name="user-o" color={globals.sWhite}></Icon>
          <Button large raised backgroundColor={globals.sGreen} 
          rightIcon={{color: globals.sWhite, name: 'spotify', type: 'entypo'}} title='Login' 
          onPress={()=>this.login()}/>
        </View>
      </Shade>
    );
  }

  renderLoggedIn(){
    let user = this.props.user;
    return(
      <Shade>
        <View style={style.view}>
          <Avatar
            medium rounded
            source={{uri: user.images[0].url}}
            onPress={() => console.log("Works!")}
            activeOpacity={0.7}
          />
          <Text style={globals.style.text}>{user.display_name}</Text>
        </View>
      </Shade>
    );
  }
  render(){
    if(this.props.user) {
      return this.renderLoggedIn();
    } else {
      return this.renderNotLoggedIn();
    }
  }
}

const style = StyleSheet.create({
  view: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    padding: 40
  }
});