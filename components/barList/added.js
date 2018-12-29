import React from 'react';
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Icon } from 'react-native-elements';
import globals from '../helpers';
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
    marginTop: 13,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  playlistDetails: {
    marginLeft: 5
  },
  playlistImage: {
    width: 40,
    height: 40
  },
  playlistOwner: {
    ...globals.style.smallText,
    color: globals.sGrey
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
    backgroundColor: globals.sBlack
  }
});

class AddedPlaylistsComponent extends React.Component {
  constructor(props){
    super(props);
    this.state = {};
  }

  eachPlaylist(playlist) {
    const swipeoutBtns = [{
      component: (
        <View style={style.removeButton}>
          <Icon name='close' color={globals.darkRed}/>
        </View>
      ),
      onPress: ()=>this.props.playlists.remove(playlist.id)
    }];
    return (
      <Swipeout right={swipeoutBtns} style={style.swipeout}>
        <TouchableOpacity style={style.playlist} onPress={()=>this.props.navigation.navigate('Bar', playlist.id)}>
          <View style={{flexDirection: 'row'}}>
            <Image style={style.playlistImage} source={{uri:playlist.image || playlist.images[0].url}}/>
            <View style={style.playlistDetails}>
              <Text ellipsizeMode='tail' numberOfLines={1} style={globals.style.text}>{playlist.name}</Text>
              <Text ellipsizeMode='tail' numberOfLines={1} style={style.playlistOwner}>{playlist.ownerName}</Text>
            </View>
          </View>
        </TouchableOpacity>
      </Swipeout>
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
      <FlatList 
        data={this.props.data}
        renderItem={({item})=>this.eachPlaylist(item)}
        keyExtractor={(item, index)=>String(index)} 
      />
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