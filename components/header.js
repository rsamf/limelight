import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Icon, Avatar } from 'react-native-elements';
import ProfileBlur from './blurs/profile';
import AddPlaylistBlur from './blurs/addPlaylist';
import PlaylistOptionsBlur from './blurs/playlistOptions';
import globals from './helpers';
import Spotify from 'rn-spotify-sdk';

export default class Header extends React.Component {  

  constructor(props) {
    super(props);
  }

  render(){
    return (
      <View style={style.view}>
        {this.renderLeft()}
        {this.renderMiddle()}
        {this.renderRight()}
      </View>
    );
  }

  renderLeft() {
    const avatar = () => {
      const signinSize = 25;
      if(this.props.user) {
        const image = this.props.user.images[0];
        return (
          <TouchableOpacity style={style.widerClick} onPress={()=>this.props.openBlur(ProfileBlur)}>
          {
            image && image.url ?
            <Avatar
              rounded
              source={{uri:image.url}}
              height={signinSize}
            /> :
            <Icon
              size={signinSize}
              type="feather" 
              name="user" 
              color={globals.sWhite} 
              underlayColor={globals.sBlack}
            />
          }
          </TouchableOpacity>
        );
      } else {
        return (
          <TouchableOpacity onPress={()=>Spotify.login()}>
            <Icon 
              containerStyle={style.widerClick} 
              size={signinSize} 
              type="font-awesome" 
              name="user-circle" 
              color={globals.sWhite} 
              underlayColor={globals.sBlack}
            />
          </TouchableOpacity>
        );
      }
    };
    return (
      <View style={style.clickable}>
        {
          this.props.playlist ?
          <Icon 
            name="ios-arrow-back" 
            type="ionicon" 
            color={globals.sWhite} 
            underlayColor={globals.darkGrey}
            containerStyle={style.widerClick}
            onPress={()=>this.props.navigation.goBack()}
          /> :
          avatar()
        }
      </View>
    );
  }

  renderMiddle() {
    const title = (this.props.playlist && this.props.playlist.name) || "Your Playlists";
    return (
      <View style={style.titleContainer}>
        <Text style={style.textItem}>{title}</Text>
      </View>
    );
  }

  renderRight() {
    if(this.props.playlist) {
      if(this.props.user && this.props.user.id === this.props.playlist.ownerId) {
        return (
          <TouchableOpacity onPress={()=>this.showPlaylistOptions()}>
            <Icon 
              containerStyle={style.widerClick} 
              name="md-more" 
              type="ionicon" 
              color={globals.sWhite} 
              underlayColor={globals.sSand}
            />
          </TouchableOpacity>
        );
      }
      return <View></View>;
    }
    return (
      <TouchableOpacity onPress={()=>this.props.openBlur(AddPlaylistBlur, {selected: 0})}>
        <Icon containerStyle={style.widerClick} color={globals.sWhite} type="entypo" name="plus"/>
      </TouchableOpacity>    
    );
  }

  showPlaylistOptions() {
    this.props.openBlur(PlaylistOptionsBlur, {
      playlist: this.props.playlist,
      updatePlaylist: (p)=>this.props.updatePlaylist(p)
    });
  }
}

const style = StyleSheet.create({
  view: {
    backgroundColor: globals.darkGrey,
    height: 70 + (globals.isX() ? 15 : 0),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 30 + (globals.isX() ? 15 : 0),
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 10,
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    marginTop: 20 + (globals.isX() ? 15 : 0),
    left: 0,
    right: 0,
    top: 0,
    bottom: 0
  },
  textItem: {
    ...globals.style.text,
    fontSize: 14
  },
  clickable: {
    zIndex: 5
  },
  widerClick: {
    paddingLeft: 15,
    paddingRight: 15
  }
});