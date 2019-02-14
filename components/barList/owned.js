import React from 'react';
import { View, ScrollView, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import Modal from 'react-native-modal';
import { Icon, Badge } from 'react-native-elements';
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
      <View key={i} style={style.playlist}>
        <View>
          <TouchableOpacity onPress={()=>this.goToBar(playlist.id)} onLongPress={()=>this.showPlaylistModal(playlist)}>
            {
              playlist.image ?
              <Image style={style.playlistImage} source={{uri: playlist.image}}/> :
              <Icon containerStyle={style.playlistImage} size={80} color={globals.sWhite} name="music" type="feather"/>
            }
          </TouchableOpacity>
          <Text ellipsizeMode="tail" numberOfLines={1} style={style.playlistText}>{playlist.name}</Text>
        </View>
        <View style={{alignItems: 'center', width: 50}}>
          <View style={style.playlistIcon}>
            <Icon underlayColor={globals.sBlack} onPress={()=>globals.visitPlaylist(this.props.user.id, globals.getPlaylistId(playlist.id))} name="spotify" color={globals.sWhite} type="font-awesome"/>
          </View>
        </View>
      </View>
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
          <TouchableOpacity onPress={()=>this.props.addPlaylist(2)} style={style.createButton}>
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
    marginLeft: 20,
    marginRight: 80,
    alignItems: 'center',
    justifyContent: 'center'
  },
  playlist: {
    marginLeft: 10,
    marginRight: 10,
    width: 245,
    borderWidth: .5,
    borderRadius: 20,
    borderColor: globals.sWhite,
    padding: 15,
    paddingRight: 50,
    flexDirection: 'row'
  },
  playlistImage: {
    width: 180,
    height: 180,
    borderWidth: .5,
    borderColor: globals.darkGrey
  },
  playlistIcon: {
    marginBottom: 20
  },
  createIcon: {
    width: 180,
    height: 180,
    borderRadius: 5,
    backgroundColor: globals.sWhite
  },
  playlistText: {
    marginTop: 2,
    textAlign: 'center',
    ...globals.style.smallText
  },
  view: {
    flexDirection: 'row',
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
