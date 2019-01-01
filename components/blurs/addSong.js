import React from 'react';
import { View, FlatList, TouchableOpacity, Text, Image, StyleSheet } from 'react-native';
import Spotify from 'rn-spotify-sdk';
import globals from '../helpers';

export default class AddSong extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      searchedSongs: [],
      songToSearch: "",
      loading: false
    };
  }

  addSong(song, uri) {
    this.props.addSong(song, uri);
    this.props.close();
  }

  eachAddSong(song) {
    let uri = song.uri;
    song = globals.getSongData(song, true);
    return (
      <TouchableOpacity style={style.song} onPress={()=>this.addSong(song, uri)}>
        <Image style={style.songImage} source={{uri: song.image}}/>
        <View style={style.songInfo}>
          <Text ellipsizeMode='tail' numberOfLines={1} style={style.songName}>{song.name}</Text>
          <Text ellipsizeMode='tail' numberOfLines={1} style={style.songArtist}>{song.artist}</Text>
        </View>
      </TouchableOpacity>
    );
  }

  searchSongs() {
    this.setState({loading: true});
    Spotify.search(this.state.songToSearch.replace(/ /g, '+'), ['track'], {}).then(({tracks: {items}}) => {
      this.setState({
        searchedSongs: items,
        loading: false
      });
    });
  }

  SearchTextInput = globals.createSearchTextInput((songToSearch) => {
    this.setState({songToSearch});
  }, () => {
    this.searchSongs();
  });

  render() {
    return (
      <View style={style.view}>
        <this.SearchTextInput/>
        {
          this.state.loading ?
          <globals.Loader/> :
          <FlatList
            style={style.songs}
            data={this.state.searchedSongs} 
            keyExtractor={(_, index)=>String(index)} 
            renderItem={({item})=>this.eachAddSong(item)}
          />
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
    marginTop: 10,
    marginBottom: 10
  },
  songInfo: {
    flex: 1
  },
  songs: {
    marginLeft: 40,
    marginTop: 20
  },
  songImage: {
    width: 50,
    height: 50,
    marginRight: 10
  },
  songName: {
    ...globals.style.text,
  },
  songArtist: {
    ...globals.style.smallText,
    color: globals.sGrey
  },
  addSongInput: {
    borderBottomWidth: 1
  }
});