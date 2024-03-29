import React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { Icon } from 'react-native-elements';
import Modal from 'react-native-modal';
import globals from '../../util';
import createPlaylists from '../../GQL/playlists';

const style = StyleSheet.create({
  noPlaylistsText: {
    ...globals.style.text,
    flex: 1, 
    alignItems: 'center', 
    justifyContent: 'center',
    margin: 50
  },
  playlist: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    margin: 15,
    marginTop: 0
  },
  removeButton: {
    backgroundColor: globals.sBlack, 
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  message: {
    margin: 30,
    ...globals.style.center
  }
});

class AddedPlaylistsComponent extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      activePlaylistModal: null
    };
  }

  removePlaylist(playlist) {
    this.setState({ activePlaylistModal: null });
    this.props.playlists.remove(playlist.id);
  }
  
  eachPlaylist(playlist, i) {
    const isOwned = (playlist && this.props.user) && (playlist.ownerId === this.props.user.id);
    return (
      <TouchableOpacity 
        style={style.playlist} 
        onPress={()=>this.props.navigation.navigate('Bar', playlist.id)} 
        onLongPress={()=>this.showPlaylistModal(playlist)}
      >
        {globals.getPlaylistView(playlist, ()=>this.goToBar(playlist.id), isOwned)}
      </TouchableOpacity>
    );
  }

  showPlaylistModal(val = null) {
    this.setState({ activePlaylistModal: val });
  }

  goToBar(id) {
    this.setState({ activePlaylistModal: null });
    this.props.navigation.navigate('Bar', id);
  }
  
  renderModal() {
    const playlist = this.state.activePlaylistModal;
    const isOwned = (playlist && this.props.user) && (playlist.ownerId === this.props.user.id);
    const removeFunc = () => this.removePlaylist(this.state.activePlaylistModal);
    return (
      <Modal isVisible={!!this.state.activePlaylistModal} onBackdropPress={()=>this.showPlaylistModal()}>
        {globals.getPlaylistModal(playlist, ()=>this.goToBar(playlist.id), isOwned, null, null, removeFunc)}
      </Modal>
    );
  }

  render(){
    if (this.props.loading) {
      return (
        <View style={style.message}>
          <globals.Loader/>
        </View>
      );
    }
    if (this.props.error) {
      return (
        <View style={style.message}>
          <Text style={globals.style.text}>
            There was a problem with loading your playlists. Check back in a little while.
          </Text>
        </View>
      );
    }
    
    return (
      <View>
        {this.renderModal()}
        <FlatList 
          data={this.props.data}
          renderItem={({item, index})=>this.eachPlaylist(item, index)}
          keyExtractor={(item, index)=>String(index)} 
        />
      </View>
    );
  }
}

export default class AddedPlaylists extends React.Component {
  constructor(props){
    super(props);

    this.playlistsLength = this.props.playlists.length;
  }

  shouldComponentUpdate(newProps) {
    if(newProps.playlists.length !== this.playlistsLength) {
      this.playlistsLength = newProps.playlists.length;
      return true;
    }
    return false;
  }

  render() {
    if(this.props.playlists.length > 0) {
      const AddedPlaylistsElement = createPlaylists(AddedPlaylistsComponent);
      return (
        <AddedPlaylistsElement
          navigation={this.props.navigation} 
          user={this.props.user} 
          playlists={this.props.playlists}
        />
      );
    }
    return (
      <View style={style.message}>
        <Text style={globals.style.text}>No playlists...</Text>
        <View style={{flexDirection: 'row'}}>
          <Text style={globals.style.text}>Tap </Text>
          <Icon
            underlayColor={globals.sBlack}
            onPress={()=>this.props.addPlaylist(0)}
            color={globals.sWhite} 
            type="entypo" 
            name="plus"
          />
          <Text style={globals.style.text}> to add some.</Text>
        </View>
      </View>
    );
  }
}