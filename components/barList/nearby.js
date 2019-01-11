import React from 'react';
import { FlatList, View, TouchableOpacity, StyleSheet } from 'react-native';
import Modal from 'react-native-modal';
import globals from '../helpers';

export default class NearbyPlaylists extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activePlaylistModal: null
    };
  }

  eachPlaylist(playlist, i) {
    return (
      <TouchableOpacity 
        style={style.playlist} 
        onPress={()=>this.props.navigation.navigate('Bar', playlist.id)}
        onLongPress={()=>this.showPlaylistModal(playlist)}
      >
        {
          globals.getPlaylistView(playlist, "map-pin")
        }
      </TouchableOpacity>
    );
  }

  showPlaylistModal(val = null) {
    console.log("showing ", val);
    this.setState({ activePlaylistModal: val });
  }

  renderModal() {
    const playlist = this.state.activePlaylistModal;
    const isOwned = (playlist && this.props.user) && (playlist.ownerId === this.props.user.id);
    return (
      <Modal isVisible={!!this.state.activePlaylistModal} onBackdropPress={()=>this.showPlaylistModal()}>
        {globals.getPlaylistModal(playlist, ()=>this.goToBar(playlist.id), isOwned)}
      </Modal>
    );
  }
  
  render() {
    return (
      <View>
        {this.renderModal()}
        <FlatList 
          keyExtractor={(_, index)=>String(index)} 
          data={this.props.nearby}
          renderItem={({item}) => this.eachPlaylist(item)}
        />
      </View>
    );
  }
}

const style = StyleSheet.create({
  playlist: {
    marginLeft: 15,
    marginRight: 15,
    marginTop: 15,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  }
});