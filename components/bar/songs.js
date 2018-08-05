import React from 'react';
import { FlatList, Text, TextInput, StyleSheet, View, TouchableOpacity, findNodeHandle } from 'react-native';
import { Button, Icon } from 'react-native-elements';
import { BlurView } from 'react-native-blur';
import Spotify from 'rn-spotify-sdk';
import globals from '../helpers';

export default class extends React.Component {
  constructor(props){
    super(props);

    this.state = {
      addingSong: false,
      searchedSongs: [],
      songToSearch: ""
    };
  }

  addSong(song) {
    this.props.addSong(globals.getSongData(song));
    this.setOverlay(false);
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

  eachSong(song, i) {
    return (
      <View style={style.song}>
        <Icon iconStyle={style.voteIcon} type="entypo" name="chevron-with-circle-up" color={song.voted ? globals.sGreen : globals.sGrey} underlayColor={globals.sBlack} onPress={()=>this.props.vote(song, i)}/>
        <Text style={{...style.voteText, ...globals.style.smallText, color: song.voted ? globals.sGreen : globals.sGrey}}>{song.votes}</Text>
        <Text style={{...style.songDescription, ...globals.style.smallText}}>{song.artist} - {song.name}</Text>
      </View>
    );
  }

  setOverlay(active) {
    this.setState({addingSong: active});
    this.props.setProfileIconVisibility(!active);
  }

  render() {
    const songs = this.props.children;
    return (
      <View style={style.view}>
        <View style={style.view} ref="view" onLayout={()=>this.setState({ viewRef: findNodeHandle(this.refs.view) })}>
          <FlatList data={songs} keyExtractor={(item, index)=>String(index)} renderItem={({item, index})=>this.eachSong(item, index)}>
          </FlatList>
          <View style={style.addIcon}>
            <Icon color={globals.sBlack} size={30} name="ios-add" type="ionicon" raised
            onPress={()=>this.setOverlay(true)}
            />
          </View>
        </View>
        {
          this.state.addingSong &&
          <BlurView style={globals.style.fullscreen} viewRef={this.state.viewRef} blurType="light" blurAmount={10}/>
        }
        {
          this.state.addingSong &&
          <View style={style.addSongView}>
            <TextInput placeholder="Song Name" style={globals.style.textInput} onChangeText={(text)=>this.changeQuery(text)}
            blurOnSubmit={true} enablesReturnKeyAutomatically={true} onSubmitEditing={()=>this.searchSongs()}
            ></TextInput>
            <FlatList data={this.state.searchedSongs} keyExtractor={(item, index)=>String(index)} renderItem={({item, index})=>this.eachAddSong(item, index)}>
            </FlatList>
            <View style={style.cancel}>
              <Button title="Cancel" onPress={()=>this.setOverlay(false)}></Button>
            </View>
          </View>
        }
      </View>
    );
  }
}

const style = StyleSheet.create({
  view: {
    flex: 1
  },
  song: {
    flexDirection: 'row',
    borderBottomWidth: 0.5,
    borderBottomColor: globals.sGrey,
    paddingBottom: 15,
    paddingTop: 15,
    paddingLeft: 10,
    marginLeft: 5,
    marginRight: 5
  },
  songDescription: {
  },
  voteIcon: {
    marginRight: 5
  },
  voteText: {
    marginRight: 15
  },
  addIcon: {
    position: 'absolute', 
    bottom: 20, 
    right: 20
  },
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