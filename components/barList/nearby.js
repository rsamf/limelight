import React from 'react';
import { FlatList, View, TouchableOpacity, Image, Text, StyleSheet } from 'react-native';
import globals from '../helpers';

export default class NearbyPlaylists extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  eachPlaylist(playlist, i) {
    return (
      <TouchableOpacity style={style.playlist} onPress={()=>this.props.navigation.navigate('Bar', playlist.id)}>
        <View style={{flexDirection: 'row'}}>
          <Image style={style.playlistImage} source={{uri:playlist.image}}/>
          <View style={style.playlistDetails}>
            <Text ellipsizeMode='tail' numberOfLines={1} style={globals.style.text}>{playlist.name}</Text>
            <Text ellipsizeMode='tail' numberOfLines={1} style={style.playlistOwner}>{playlist.ownerName}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }
  
  render() {
    return (
      <FlatList 
        keyExtractor={(_, index)=>String(index)} 
        data={this.props.nearby}
        renderItem={({item}) => this.eachPlaylist(item)}
      />
    );
  }
}

const style = StyleSheet.create({
  playlist: {
    marginLeft: 20,
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
  }
});