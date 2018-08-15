import React from 'react';
import { View, StyleSheet, FlatList, Text, TextInput, TouchableOpacity, Image } from 'react-native';
import { Icon, Button } from 'react-native-elements';
import { BlurView } from 'react-native-blur';
import GetPlaylistsByCode from '../../GQL/queries/GetPlaylistsByCode';
import globals from '../helpers';

export default class Profile extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      input: "",
      searchedPlaylists: []
    };
  }

  addPlaylist(id) {
    this.props.localPlaylists.add(id, () => {
      this.props.close();
      this.props.navigation.navigate('BarList');
    });
  }

  searchPlaylists() {
    globals.client.query({
      query: GetPlaylistsByCode,
      variables: {
        shortCode: this.state.input
      }
    }).then(({data: {getPlaylistsByCode:{playlists}}})=>{
      this.setState({
        searchedPlaylists: playlists
      });
    });
  }

  eachPlaylist(playlist, i) {
    console.warn(playlist);
    return (
      <TouchableOpacity style={style.playlist} onPress={()=>this.addPlaylist(playlist.id)}>
        <Image style={style.playlistImage} source={{uri:playlist.image}}/>
        <Text style={globals.style.smallText}> {playlist.playlistName}</Text>
        <Text style={globals.style.smallText}> {playlist.ownerName}</Text>
      </TouchableOpacity>
    );
  }

  render(){
    return (
      <View style={globals.style.fullscreen}>
        <BlurView style={globals.style.fullscreen} viewRef={this.props.viewRef} blurType="dark" blurAmount={3}/>
        <View style={style.view}>
          <View style={style.inputContainer}>
            <TextInput style={globals.style.textInput} placeholder="Code" onChangeText={(input) => this.setState({input})}
            blurOnSubmit={true} enablesReturnKeyAutomatically={true} onSubmitEditing={()=>this.searchPlaylists()}
            autoCapitalize="none" spellCheck={false}>
            </TextInput>
          </View>
          <FlatList data={this.state.searchedPlaylists} keyExtractor={(item, index)=>String(index)} renderItem={({item, index})=>this.eachPlaylist(item, index)}>
          </FlatList>
          <View style={style.cancel}>
            <Button title="Cancel" onPress={()=>this.props.close()}></Button>
          </View>
        </View>
      </View>
    );
  }
}

const style = StyleSheet.create({
  cancel: {
    position: 'absolute',
    bottom: 20,
    left: 20
  },
  view: {
    ...globals.style.fullscreen,
    paddingTop: 50
  },
  playlist: {
    paddingTop: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: globals.sGrey,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginLeft: 20,
    marginRight: 20
  },
  playlistImage: {
    width: 50,
    height: 50
  },
  inputContainer: {
    flexDirection: 'row',
    justifyContent: 'center'
  }
});