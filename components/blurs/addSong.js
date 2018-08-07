import React from 'react';
import { View, FlatList, TouchableOpacity, Text, TextInput, StyleSheet } from 'react-native';
import { Button } from 'react-native-elements';
import { BlurView } from 'react-native-blur';
import Spotify from 'rn-spotify-sdk';
import globals from '../helpers';

export default class AddSong extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      searchedSongs: [],
      songToSearch: ""
    };
  }

  addSong(song) {
    this.props.addSong(globals.getSongData(song));
    this.props.close();
  }

  eachAddSong(song, i) {
    return (
      <TouchableOpacity style={style.addSong} onPress={()=>this.addSong(song)}>
        <Text style={globals.style.text}>{song.name} - {song.artists[0].name}</Text>
      </TouchableOpacity>
    );
  }

  changeQuery(toQuery) {
    this.setState({
      songToSearch: toQuery
    });
  }

  searchSongs() {
    Spotify.search(this.state.songToSearch.replace(/ /g, '+'), ['track'], {}).then(({tracks: {items}}) => {
      console.warn(items);
      this.setState({
        searchedSongs: items
      });
    });
  }

  render() {
    return (
      <View style={globals.style.fullscreen}>
        <BlurView style={globals.style.fullscreen} viewRef={this.props.viewRef} blurType="light" blurAmount={10}/>
        <View style={style.addSongView}>
          <TextInput placeholder="Song Name" style={globals.style.textInput} onChangeText={(text)=>this.changeQuery(text)}
          blurOnSubmit={true} enablesReturnKeyAutomatically={true} onSubmitEditing={()=>this.searchSongs()}
          ></TextInput>
          <FlatList data={this.state.searchedSongs} keyExtractor={(item, index)=>String(index)} renderItem={({item, index})=>this.eachAddSong(item, index)}>
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
  addSongView: {
    ...globals.style.fullscreen,
    paddingTop: 30,
    alignItems: 'center'
  },
  addSongInput: {
    borderBottomWidth: 1
  },
  addSong: {
    padding: 20,
    borderBottomWidth: 1,
    borderColor: globals.sGrey
  },
  cancel: {
    position: 'absolute',
    left: 15,
    bottom: 15
  }
});