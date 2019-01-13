import React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { Icon } from 'react-native-elements';
import Modal from 'react-native-modal';
import globals from '../../util';
import Swipeout from 'react-native-swipeout';
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
    justifyContent: 'space-between'
  },
  removeButton: {
    backgroundColor: globals.sBlack, 
    borderBottomColor: globals.darkRed, 
    borderBottomWidth: 2, 
    flex: 1, 
    justifyContent: 'center'
  },
  message: {
    margin: 30,
    ...globals.style.center
  },
  swipeout: {
    marginTop: 15,
    marginLeft: 15,
    marginRight: 15,
    marginBottom: 10,
    backgroundColor: globals.sBlack
  }
});

class AddedPlaylistsComponent extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      activePlaylistModal: null
    };
  }

  eachPlaylist(playlist, i) {
    const isLastPlaylist = i === this.props.data.length - 1;
    const swipeoutBtns = [{
      component: (
        <View style={style.removeButton}>
          <Icon name='close' color={globals.darkRed}/>
        </View>
      ),
      onPress: ()=>this.props.playlists.remove(playlist.id)
    }];
    return (
      <Swipeout right={swipeoutBtns} style={{...style.swipeout, marginBottom : isLastPlaylist ? 15 : 0}}>
        <TouchableOpacity 
          style={style.playlist} 
          onPress={()=>this.props.navigation.navigate('Bar', playlist.id)} 
          onLongPress={()=>this.showPlaylistModal(playlist)}
        >
          {globals.getPlaylistView(playlist)}
        </TouchableOpacity>
      </Swipeout>
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
    return (
      <Modal isVisible={!!this.state.activePlaylistModal} onBackdropPress={()=>this.showPlaylistModal()}>
        {globals.getPlaylistModal(playlist, ()=>this.goToBar(playlist.id), isOwned)}
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