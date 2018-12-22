import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Icon, Avatar } from 'react-native-elements';
import ProfileBlur from '../blurs/profile';
import AddPlaylistBlur from '../blurs/addPlaylist';
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
    const signinSize = 25;
    if(this.props.user) {
      const image = this.props.user.images[0];
      return (
        <TouchableOpacity onPress={()=>this.props.openBlur(ProfileBlur)}>
        {
          image && image.url ?
          <Avatar
            rounded
            source={{uri:image.url}}
            height={signinSize}
          /> :
          <Icon size={signinSize} type="feather" name="user" color={globals.sWhite} underlayColor={globals.sBlack}/>
        }
        </TouchableOpacity>
      );
    } else {
      return (
        <TouchableOpacity onPress={()=>Spotify.login()}>
          <Icon size={signinSize} type="font-awesome" name="user-circle" color={globals.sWhite} underlayColor={globals.sBlack}/>
        </TouchableOpacity>
      )
    }
  }

  renderAdd() {
    return (
      <TouchableOpacity onPress={()=>this.props.openBlur(AddPlaylistBlur, {selected: 0})}>
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
    paddingBottom: 10,
    // shadowRadius: 5,
    // shadowOffset: {
    //   height: 15
    // },
    // shadowOpacity: .9,
    // shadowColor: globals.sBlack,
    // zIndex: 5
  },
  item: {
    marginRight: 20
  },
  textItem: {
    ...globals.style.text,
    fontSize: 14
  }
});