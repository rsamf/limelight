import React from 'react';
import { View, ScrollView, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Icon } from 'react-native-elements';
import globals from '../helpers'
import Spotify from 'rn-spotify-sdk';
import AddPlaylistBlur from '../blurs/addPlaylist';

class Side extends React.Component {
  constructor(props) {
    super(props);
    this.leftOpacities = [...Array(10)].fill(1,0,10).map((el, i)=>(10-i)*.1);
    this.rightOpacities = [...Array(10)].fill(1,0,10).map((el, i)=>(i+1)*.1);
  }

  render() {
    if(this.props.value === "left") {
      return (
        <View style={style.shadowLeft}>
          {
            this.leftOpacities.map((el, i) => (
              <View key={i} style={{...style.shade, opacity: el}}></View>
            ))
          }
        </View>
      );
    } else {
      return (
        <View style={style.shadowRight}>
          {
            this.rightOpacities.map((el, i) => (
              <View key={i} style={{...style.shade, opacity: el}}></View>
            ))
          }
        </View>
      );    
    }
  }
}

export default class OwnedList extends React.Component {
  constructor(props){
    super(props);

    this.state = {
      playlists: []
    };
    this.getPlaylists();
  }

  getPlaylists() {
    Spotify.sendRequest('v1/me/playlists', "GET", {}, true).then(({items}) => {
      let filtered = items.filter((playlist)=>playlist.owner.id===this.props.user.id);
      let mapped = filtered.map(playlist => ({
        image: playlist.images[0] && playlist.images[0].url,
        name: playlist.name
      }));
      this.setState({
        playlists: mapped
      });
    });
  }

  eachPlaylist(playlist, i) {
    return (
      <TouchableOpacity onPress={()=>this.props.navigation.navigate('Bar', playlist)} key={i} style={style.playlist}>
        {/* <Image source={{uri:playlist.image}} defaultSource={{uri:require('../../images/notes.png')}} style={style.playlistImage}/> */}
        <Image source={{uri:playlist.image}} style={style.playlistImage}/>
        <Text ellipsizeMode={'tail'} numberOfLines={1} style={globals.style.smallText}>{playlist.name}</Text>
      </TouchableOpacity>
    )
  }

  render() {
    return (
      <View style={style.view}>
        <Side value={"left"}/>
        <ScrollView horizontal={true} style={style.scroll}>
          {
            this.state.playlists.map((p, i)=>this.eachPlaylist(p, i))
          }
          <TouchableOpacity onPress={()=>this.props.openBlur(AddPlaylistBlur, {selected: 2})} style={{...style.playlist, marginLeft: 20}}>
            <Icon raised name='add' color={globals.sBlack} containerStyle={style.createIcon}/>
            <Text style={globals.style.smallText}>Create New</Text>
          </TouchableOpacity>
        </ScrollView>
        <Side value={"right"}/>
      </View>      
    );
  }
}

const style = StyleSheet.create({
  createIcon: {
    opacity: .6, 
    width: 50,
    height: 50,
    margin: 0,
    padding: 0
  },
  playlist: {
    width: 70,
    height: 70,
    alignItems: 'center'
  },
  playlistImage: {
    width: 50,
    height: 50
  },
  view: {
    flexDirection: 'row',
    marginTop: 13,
    marginBottom: 10
  },
  scroll: {
    paddingLeft: 10
  },
  shade: {
    width: 2,
    backgroundColor: globals.sBlack,
  },
  shadowLeft: {
    flexDirection: 'row',
    width: 20,
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    zIndex: 5
  },
  shadowRight: {
    flexDirection: 'row',
    width: 20,
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    zIndex: 5
  }
})
