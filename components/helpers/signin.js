import React from 'react';
import { View, StyleSheet} from 'react-native';
import { Icon, Avatar } from 'react-native-elements';
import Spotify from 'rn-spotify-sdk';
import globals from '../helpers';

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
        color={globals.sWhite} underlayColor={globals.sBlack} onPress={()=>Spotify.login()}/>
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