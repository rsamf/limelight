import React from 'react';
import { View, FlatList, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Button } from 'react-native-elements';
import { BlurView } from 'react-native-blur';
import Spotify from 'rn-spotify-sdk';
import globals from '../helpers';
import AddPlaylistMutation from '../../GQL/mutations/AddPlaylist';
import CreateSongsMutation from '../../GQL/mutations/CreateSongs';

export default class HostPlaylist extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      playlists: []
    };
  }

  componentDidMount() {
    console.warn("mounted");
    if(this.props.user) {
      Spotify.sendRequest("v1/me/playlists", "GET", {}, true).then(({items}) => {
        this.setState({
          playlists: items
        });
      });
    } else {
      Spotify.login();
      this.props.close();
    }
  }

  eachPlaylist(playlist, i) {
    return (
      <TouchableOpacity style={style.playlist} onPress={()=>{this.addPlaylist(playlist)}}>
        <Text style={style.playlistText}>{playlist.name}</Text>
      </TouchableOpacity>
    );
  }

  render() {
    return (
      <View style={globals.style.fullscreen}>
        <BlurView style={globals.style.fullscreen} viewRef={this.props.viewRef} blurType="dark" blurAmount={3}/>
        <View style={style.overlayView}>
          <View>
            <Text style={style.label}>Use songs from one of your playlists:</Text>
            <View style={style.playlists}>
              <FlatList data={this.state.playlists} keyExtractor={(item, index)=>String(index)} 
              renderItem={({item})=>this.eachPlaylist(item)}>
              </FlatList>
            </View>  
            <Text style={style.label}>Or create one from scratch:</Text>
            <Button style={globals.style.button} title="Create New" onPress={()=>this.addPlaylist()}/>
          </View>
        </View>
        <View style={style.cancelButton}>
          <Button title="Cancel" onPress={()=>this.props.close()}/>
        </View>
      </View>
    );
  }

  addPlaylist(playlist){
    const { user } = this.props;
    let variables = {
      ownerURI: user.id,
      ownerName: user.display_name,
      image: (playlist && playlist.images[0] && playlist.images[0].url) || (user.images[0] && user.images[0].url),
      playlistName: playlist ? playlist.name : user.display_name
    };
    const sendPlaylistMutation = (variables, callback) => {
      globals.client.mutate({
        mutation: AddPlaylistMutation,
        variables
      }).then(({data: {addPlaylist: {id}}})=>{
        this.props.localPlaylists.add(id, ()=>{
          this.props.close();
          this.props.navigation.navigate('BarList');
        });
        callback(id);
      });
    }
    const sendSongsMutation = (variables, callback) => {
      globals.client.mutate({
        mutation: CreateSongsMutation,
        variables
      }).then(({data: {createSongs: {id}}})=>{
        callback(id)
      });
    };
    sendPlaylistMutation(variables, (id) => {
      let songVariables = { id: id, songs: [] };
      console.warn(id);
      if(playlist) {
        globals.getSongsDataHTTP(user.id, playlist.id, songs => {
          songVariables.songs = songs;
          sendSongsMutation(songVariables, console.warn);
        });
      } else {
        sendSongsMutation(songVariables, console.warn);
      }
    });
  }
}

const style = StyleSheet.create({
  overlayView: {
    alignItems: 'center',
    flex: 1
  },
  cancelButton: {
    position: 'absolute',
    bottom: 20,
    left: 20
  },
  playlists: {
    flex: .8,
    borderTopWidth: 1,
    borderColor: globals.sGrey
  },
  playlist: {
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 20,
    borderColor: globals.sGrey,
    borderBottomWidth: 1
  },
  playlistText: {
    color: globals.sWhite,
    fontSize: 24,
    fontFamily: 'Futura',
  },
  label: {
    marginTop: 40,
    marginBottom: 20,
    fontFamily: 'Futura',
    color: globals.sWhite
  }
});