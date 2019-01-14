import React from 'react';
import { View, FlatList, TouchableOpacity, Text, Image, StyleSheet } from 'react-native';
import { Icon } from 'react-native-elements';
import Spotify from 'rn-spotify-sdk';
import globals from '../../util';

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
      <TouchableOpacity style={style.song} onPress={()=>this.addSong(song, uri)} onLongPress={()=>globals.visitSong(song.id)}>
        <Image style={style.songImage} source={{uri: song.image}}/>
        <View style={style.songInfo}>
          <Text ellipsizeMode='tail' numberOfLines={1} style={style.songName}>{song.name}</Text>
          <Text ellipsizeMode='tail' numberOfLines={1} style={style.songArtist}>{song.artist}</Text>
        </View>
        <Icon name="spotify" type="font-awesome" color={globals.sWhite} size={21}/>
      </TouchableOpacity>
    );
  }

  searchSongs() {
    this.setState({loading: true});
    Spotify.search(this.state.songToSearch.replace(/ /g, '+'), ['track','artist'], {}).then(({tracks: {items}}) => {
      this.setState({
        searchedSongs: items,
        loading: false
      });
    });
  }

  SearchTextInput = globals.createSearchTextInput(
  "Search by song or artist",
  (songToSearch) => {
    this.setState({songToSearch});
  }, () => {
    this.searchSongs();
  }, {autoFocus: true});

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
            indicatorStyle="white"
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
    justifyContent: 'space-between',
    marginTop: 10,
    marginBottom: 10,
    marginRight: 10
  },
  songInfo: {
    flex: 1
  },
  songs: {
    marginLeft: 25,
    marginRight: 15,
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