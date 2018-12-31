import React from 'react';
import { View, ScrollView, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Icon } from 'react-native-elements';
import globals from '../helpers'
import user from '../../util/user';

class Side extends React.Component {
  constructor(props) {
    super(props);
    this.leftOpacities = [...Array(20)].map((_, i) => 1 - this.sigmoid(i));
    this.rightOpacities = [...Array(20)].map((_, i) => this.sigmoid(i));
  }

  sigmoid = x => 1 / (1 + Math.E**-((x-10)/4))

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
  }

  goToBar(id) {
    this.props.navigation.navigate('Bar', id);
  }

  componentDidMount() {
    user.setOwnedPlaylistsScrollView(this.refs.scroll);
  }

  eachPlaylist(playlist, i) {
    if(playlist === "LOADING") {
      return (
        <View key={i} style={style.playlist}>
          <globals.Loader/>
        </View>
      );
    }
    return (
      <TouchableOpacity onPress={()=>this.goToBar(playlist.id)} key={i} style={style.playlist}>
        {/* <Image source={{uri:playlist.image}} defaultSource={{uri:require('../../images/notes.png')}} style={style.playlistImage}/> */}
        <Image source={{uri:playlist.image}} style={style.playlistImage}/>
        <Text ellipsizeMode="tail" numberOfLines={1} style={globals.style.smallText}>{playlist.name}</Text>
      </TouchableOpacity>
    );
  }

  render() {
    return (
      <View style={style.view}>
        <Side value="left"/>
        <ScrollView ref="scroll" horizontal={true} style={style.scroll}>
          {
            this.props.user.playlists.map((p, i)=>this.eachPlaylist(p, i))
          }
          <TouchableOpacity onPress={()=>this.props.addPlaylist(2)} style={style.createButton}>
            <Icon raised name='add' color={globals.sBlack} containerStyle={style.createIcon}/>
            <Text ellipsizeMode="tail" numberOfLines={1} style={globals.style.smallText}>Create New</Text>
          </TouchableOpacity>
        </ScrollView>
        <Side value="right"/>
      </View>      
    );
  }
}

const style = StyleSheet.create({
  createButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: 10,
    marginLeft: 10,
    marginRight: 80,
    borderLeftWidth: .5,
    borderLeftColor: globals.sGrey
  },
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
    width: 1,
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
