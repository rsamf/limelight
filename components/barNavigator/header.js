import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Icon } from 'react-native-elements';
import ProfileBlur from '../blurs/profile';
import BarhopBlur from '../blurs/barHop';
import globals from '../helpers';
import Spotify from 'rn-spotify-sdk';

export default class Header extends React.Component {  
  render(){
    return (
      <View style={style.view}>
        {this.renderSignin()}
        <Text style={style.textItem}>Your Playlists</Text>
        {this.renderAdd()}
      </View>
    );
  }

  renderSignin() {
    if(this.props.user) {
      let images = this.props.user.images;
      return (
        <TouchableOpacity onPress={()=>this.props.openBlur(ProfileBlur)}>
        {
           images[0] && images[0].url ?
           <Avatar
             medium rounded
             source={images[0].url}
             activeOpacity={0.7}
           /> :
           <Icon size={20} type="feather" name="user" color={globals.sWhite} underlayColor={globals.sBlack}/>
        }
        </TouchableOpacity>
      );
    } else {
      return (
        <TouchableOpacity onPress={()=>Spotify.login()}>
          <Icon size={20} type="font-awesome" name="user-circle" color={globals.sWhite} underlayColor={globals.sBlack}/>
        </TouchableOpacity>
      )
    }
  }

  renderAdd() {
    return (
      <TouchableOpacity onPress={()=>this.props.openBlur(BarhopBlur)}>
        <Icon color={globals.sWhite} type="entypo" name="plus"/>
      </TouchableOpacity>
    );
  }
}

const style = StyleSheet.create({
  view: {
    backgroundColor: globals.darkGrey,
    height: 70,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 30,
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 10
  },
  item: {
    marginRight: 20
  },
  textItem: {
    ...globals.style.text,
    fontSize: 14
  }
});