import React from 'react';
import { FlatList, View, TouchableOpacity, StyleSheet } from 'react-native';
import Modal from 'react-native-modal';
import globals from '../../util';

export default class NearbyPlaylists extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activePlaylistModal: null
    };
  }

  eachPlaylist(playlist) {
    const isOwned = (playlist && this.props.user) && (playlist.ownerId === this.props.user.id);
    return (
      <TouchableOpacity 
        style={style.playlist} 
        onPress={()=>this.props.navigation.navigate('Bar', playlist.id)}
        onLongPress={()=>this.showPlaylistModal(playlist)}
      >
        {
          globals.getPlaylistView(playlist, ()=>this.goToBar(playlist.id), isOwned, "map-pin")
        }
      </TouchableOpacity>
    );
  }

  goToBar(id) {
    this.setState({ activePlaylistModal: null });
    this.props.navigation.navigate('Bar', id);
  }

  showPlaylistModal(val = null) {
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
    margin: 15,
    marginTop: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  }
});