import React from 'react';
import { FlatList, View, TouchableOpacity, Image, Text } from 'react-native';

export default class NearbyPlaylists extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  eachPlaylist(playlist, i) {
    return (
      <TouchableOpacity style={style.playlist} onPress={()=>this.props.navigation.navigate('Bar', playlist.id)}>
        <View style={{flexDirection: 'row'}}>
          <Image style={style.playlistImage} source={{uri:playlist.image || playlist.images[0].url}}/>
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
      <FlatList data={this.props.nearby}/>
    );
  }
}