import React from 'react';
import { View, ScrollView, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import Modal from 'react-native-modal';
import { Icon } from 'react-native-elements';
import globals from '../../util'
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

    this.state = {
      activePlaylistModal: null
    };
  }

  goToBar(id) {
    this.setState({ activePlaylistModal: null });
    this.props.navigation.navigate('Bar', id);
  }

  componentDidMount() {
    user.setOwnedPlaylistsScrollView(this.refs.scroll);
  }

  showPlaylistModal(val = null) {
    this.setState({ activePlaylistModal: val });
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
      <TouchableOpacity onPress={()=>this.goToBar(playlist.id)} onLongPress={()=>this.showPlaylistModal(playlist)} key={i} style={style.playlist}>
        {
          playlist.image ?
          <Image style={style.playlistImage} source={{uri: playlist.image}}/> :
          <Icon containerStyle={style.playlistImage} size={80} color={globals.sWhite} name="music" type="feather"/>
        }
        <Text ellipsizeMode="tail" numberOfLines={1} style={style.playlistText}>{playlist.name}</Text>
      </TouchableOpacity>
    );
  }

  renderModal() {
    const playlist = this.state.activePlaylistModal;
    return (
      <Modal isVisible={!!this.state.activePlaylistModal} onBackdropPress={()=>this.showPlaylistModal()}>
        {globals.getPlaylistModal(playlist, ()=>this.goToBar(playlist.id), true)}
      </Modal>
    );
  }

  render() {
    return (
      <View style={style.view}>
        {this.renderModal()}
        <Side value="left"/>
        <ScrollView ref="scroll" horizontal={true} style={style.scroll}>
          {
            this.props.user.playlists.map((p, i)=>this.eachPlaylist(p, i))
          }
          <TouchableOpacity onPress={()=>this.props.addPlaylist(2)} style={{...style.playlist, ...style.createButton}}>
            <Icon type="feather" name="plus" color={globals.sBlack} containerStyle={style.createIcon}/>
            <Text ellipsizeMode="tail" numberOfLines={1} style={globals.style.smallText}> </Text>
          </TouchableOpacity>
        </ScrollView>
        <Side value="right"/>
      </View>      
    );
  }
}

const style = StyleSheet.create({
  createButton: {
    marginRight: 80
  },
  playlist: {
    width: 165,
    height: 165,
    alignItems: 'center',
    justifyContent: 'center'
  },
  playlistImage: {
    width: 145,
    height: 145,
    borderWidth: 0.5,
    borderColor: globals.sGrey
  },
  createIcon: {
    width: 145,
    height: 145,
    borderWidth: .5,
    borderRadius: 5,
    borderColor: globals.sWhite,
    backgroundColor: globals.sWhite
  },
  playlistText: {
    marginTop: 2,
    ...globals.style.smallText
  },
  view: {
    flexDirection: 'row',
    marginTop: 18,
    marginBottom: 15
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
});
