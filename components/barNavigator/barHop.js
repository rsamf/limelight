import React from 'react';
import { View, TextInput, StyleSheet, Text, FlatList, Modal, TouchableOpacity, findNodeHandle, Platform } from 'react-native';
import globals from '../helpers';
import { Button, Icon } from 'react-native-elements';
import AddPlaylist from '../../GQL/mutations/AddPlaylist';
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
      input: "",
      qrInputActive: false,
      manualInputActive: false,
      hostInputActive: false,
      selectedPlaylist: -1,
      loading: false,
      failure: false,
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
      this.setState({
        hostInputActive: true
      });
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

  render(){
    const renderHost = this.state.hostInputActive && this.props.screenProps.user && this.state.viewRef;
    return (
      <View style={{flex: 1}}>
        <View style={{...globals.style.view, ...style.barHop,...style.absolute}} ref="view"
        onLayout={()=>this.setState({ viewRef: findNodeHandle(this.refs.view) })}
        >
          <Button style={globals.style.button} large raised backgroundColor={globals.sGrey} 
          title="Scan QR Code" rightIcon={qrIcon} textStyle={globals.style.text}/>
          {this.renderManualInput()}
          <Button style={globals.style.button} large raised backgroundColor={globals.sGreen} 
          title="Host Playlist" rightIcon={hostIcon} textStyle={globals.style.text}
          onPress={()=>this.getPlaylists()}/>
        </View>
        { 
          renderHost && 
          <BlurView style={style.absolute} viewRef={this.state.viewRef} blurType="dark" blurAmount={3}/>
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
            <Button title="Cancel" onPress={()=>this.setState({hostInputActive:false})}/>
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
          <Icon raised backgroundColor={globals.sWhite} name="check" type="evilicons" onPress={()=>this.submitJoin()}>
          </Icon>
        </View>
      );
    }
    return (
      <Button style={globals.style.button} large raised backgroundColor={globals.sGrey} 
      title="Enter Code" rightIcon={codeIcon} textStyle={globals.style.text} onPress={()=>this.setState({manualInputActive:true})}>
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
      image: user.images[0].url
    };
    if(playlist) {
      globals.getSongsDataHTTP(user.id, playlist.id, songs => {
        Object.assign(variables, {
          playlistName: playlist.name,
          songs: songs,
          image: (playlist.images[0] && playlist.images[0].url) || variables.image
        });
        sendMutation(variables)
      });
    } else {
      Object.assign(variables, {
        playlistName: user.display_name,
        songs: [],
      });
      sendMutation(variables);
    }
    const sendMutation = (variables) => {
      globals.client.mutate({
        mutation: AddPlaylist,
        variables
      }).then(({data: {addPlaylist: {id}}})=>{
        console.warn(id);
        this.setState({
          hostInputActive: false
        });
        localPlaylists.push(id, ()=>{
          this.props.navigation.navigate('BarList');
        });
      });
    }
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
  },
  absolute: {
    position: "absolute",
    top: 0, left: 0, bottom: 0, right: 0,
  }
});