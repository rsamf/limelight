import React from 'react';
import { View, TextInput, StyleSheet, Text, FlatList, TouchableOpacity, findNodeHandle } from 'react-native';
import globals from '../helpers';
import { Button, Icon } from 'react-native-elements';
import AddPlaylist from '../../GQL/mutations/AddPlaylist';
import CreateSongs from '../../GQL/mutations/CreateSongs';
import GetPlaylist from '../../GQL/queries/GetPlaylist';
import Spotify from 'rn-spotify-sdk';
import { BlurView } from 'react-native-blur';
const _ = globals.requireSpotifyAuthorizationAndInjectUserDetails;
const { localPlaylists } = globals;

const qrIcon={
  name: "qrcode",
  type: 'font-awesome'
};
const codeIcon = {
  name: "keyboard-o",
  type: "font-awesome"
};
const hostIcon = {
  name: "spotify",
  type: "font-awesome"
};

export default class BarHop extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      // QR INPUT STATE
      qrInputActive: false,
      // MANUAL INPUT STATE
      manualInputActive: false,
      input: "",
      failure: false,
      // HOST INPUT STATE
      hostInputActive: false,
      myPlaylists: []
    };
  }

  submitJoin() {
    globals.client.query({ 
      query: GetPlaylist,
      variables: {
        id: this.state.input
      }
    }).then(({data : {getPlaylist}}) => {
      console.warn(getPlaylist);
      if(getPlaylist) {
        this.setState({
          failure: false,
          manualInputActive: false
        });
        localPlaylists.push(getPlaylist.id, () => {
          this.props.navigation.navigate('BarList');
        });
      } else {
        this.setState({
          failure: true
        });
      }
    }).catch(err => {
      this.setState({
        failure: true
      });
    });
  }

  getPlaylists(){
    if(this.props.screenProps.user) {
      this.setOverlay(true);
      Spotify.sendRequest("v1/me/playlists", "GET", {}, true).then(({items}) => {
        localPlaylists.getAll(list => {
          this.setState({
            myPlaylists: items.filter(i => i.public && !list.includes(i.id))
          });
        });
      });
    } else {
      Spotify.login();
    }
  }

  setOverlay(active) {
    this.setState({ hostInputActive: active });
    this.props.screenProps.setProfileIconVisibility(!active);
  }

  render(){
    const renderHost = this.state.hostInputActive && this.props.screenProps.user && this.state.viewRef;
    return (
      <View style={{flex: 1}}>
        <View style={{...globals.style.view, ...style.barHop,...globals.style.fullscreen}} ref="view"
        onLayout={()=>this.setState({ viewRef: findNodeHandle(this.refs.view) })}
        >
          <Button style={globals.style.button} large raised backgroundColor={globals.sGrey} 
          title="Join with QR Code" rightIcon={qrIcon} textStyle={globals.style.text}/>
          {this.renderManualInput()}
          <Button style={globals.style.button} large raised backgroundColor={globals.sGreen} 
          title="Host Playlist" rightIcon={hostIcon} textStyle={globals.style.text}
          onPress={()=>this.getPlaylists()}/>
        </View>
        { 
          renderHost && 
          <BlurView style={globals.style.fullscreen} viewRef={this.props.screenProps.viewRef} blurType="dark" blurAmount={3}/>
        }
        { 
          renderHost && 
          <View style={style.overlayView}>
            <View>
              <Text style={style.label}>Use songs from one of your playlists:</Text>
              <View style={style.playlists}>
                <FlatList data={this.state.myPlaylists} keyExtractor={(item, index)=>String(index)} 
                renderItem={({item})=>this.eachPlaylist(item)}>
                </FlatList>
              </View>  
              <Text style={style.label}>Or create one from scratch:</Text>
              <Button style={globals.style.button} title="Create New" onPress={()=>this.addPlaylist()}/>
            </View>
          </View>
        }
        {
          renderHost &&
          <View style={style.cancelButton}>
            <Button title="Cancel" onPress={()=>this.setOverlay(false)}/>
          </View>
        }
      </View>
    );
  }

  renderManualInput() {
    if(this.state.manualInputActive) {
      return (
        <View style={style.manualInput}>
          <TextInput style={this.state.failure ? globals.style.textInputFailed : globals.style.textInput} placeholder="Playlist Id" 
          onChangeText={(input) => this.setState({input})} onSubmitEditing={()=>this.submitJoin()}>
          </TextInput>
          <Icon raised backgroundColor={globals.sWhite} name="check" type="evilicons" onPress={()=>this.submitJoin()}/>
        </View>
      );
    }
    return (
      <Button style={globals.style.button} large raised backgroundColor={globals.sGrey} 
      title="Join with ID" rightIcon={codeIcon} textStyle={globals.style.text} onPress={()=>this.setState({manualInputActive:true})}>
      </Button>
    );
  }

  eachPlaylist(playlist, i) {
    return (
      <TouchableOpacity style={style.playlist} onPress={()=>{this.addPlaylist(playlist)}}>
        <Text style={style.playlistText}>{playlist.name}</Text>
      </TouchableOpacity>
    );
  }

  addPlaylist(playlist){
    const { user } = this.props.screenProps;
    let variables = {
      ownerURI: user.id,
      ownerName: user.display_name,
      image: (playlist.images[0] && playlist.images[0].url) || (user.images[0] && user.images[0].url),
      playlistName: playlist ? playlist.name : user.display_name
    };
    const sendPlaylistMutation = (variables, callback) => {
      globals.client.mutate({
        mutation: AddPlaylist,
        variables
      }).then(({data: {addPlaylist: {id}}})=>{
        this.setOverlay(false)
        localPlaylists.push(id, ()=>{
          this.props.navigation.navigate('BarList');
        });
        callback(id);
      });
    }
    const sendSongsMutation = (variables, callback) => {
      globals.client.mutate({
        mutation: CreateSongs,
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

  renderQR(){
    return <View/>
  }
}

const style = StyleSheet.create({
  label: {
    marginTop: 40,
    marginBottom: 20,
    fontFamily: 'Futura',
    color: globals.sWhite
  },
  manualInput: {
    flexDirection: 'row'
  },
  barHop: {
    justifyContent: 'center',
    alignItems: 'center',
  },
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
    flex: .7,
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
  }
});