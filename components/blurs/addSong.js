import React from 'react';
import { View, TouchableOpacity, Text, Image, StyleSheet, ScrollView } from 'react-native';
import { Icon } from 'react-native-elements';
import Modal from "react-native-modal";
import Spotify from 'rn-spotify-sdk';
import globals from '../../util';

export default class AddSong extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      searchedSongs: [],
      songToSearch: "",
      loading: false,
      viewingSong: null
    };
  }

  addSong(song, uri) {
    this.props.addSong(song, uri);
    this.props.close();
  }

  eachAddSong(song, index) {
    let uri = song.uri;
    song = globals.getSongData(song, true);
    return (
      <View style={style.song} key={index}>
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <TouchableOpacity onPress={()=>this.setState({viewingSong:song})}>
            <Image style={style.songImage} source={{uri: song.image}}/>
          </TouchableOpacity>
          <View style={style.songInfo}>
            <Text ellipsizeMode='tail' numberOfLines={1} style={style.songName}>{song.name}</Text>
            <Text ellipsizeMode='tail' numberOfLines={1} style={style.songArtist}>{globals.getArtistsText(song)}</Text>
          </View>
          <TouchableOpacity onPress={()=>this.addSong(song, uri)} style={style.addButton}>
            <Icon name="plus" type="feather" color={globals.sWhite}/>
            <Text style={{...globals.style.smallText, marginLeft: 5}}>Add</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={style.spotifyButton} onPress={()=>this.setState({viewingSong:song})}>
          <Text style={{...globals.style.smallText, marginRight: 5}}>Visit in Spotify</Text>
          <Icon 
            name="spotify" 
            type="entypo"
            color={globals.sWhite}
            size={18}
          />
        </TouchableOpacity>
      </View>
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
      <View style={{flex: 1}}>
        {
          this.state.viewingSong &&
          <Modal isVisible={!!this.state.viewingSong} onBackdropPress={()=>this.setState({ viewingSong: null })}>
            <View style={globals.style.modalView}>
              <View style={{...globals.style.modalBorder, ...globals.style.modalItem}}>
                <Image style={globals.style.modalImage} source={{uri: this.state.viewingSong.image}}/>
                <View style={globals.style.modalDetails}>
                  {globals.getScrollableText(this.state.viewingSong.name)}
                  {globals.getScrollableText(globals.getArtistsText(this.state.viewingSong), style.songArtist)}
                </View>
              </View>
              <TouchableOpacity style={{...globals.style.modalItem}} onPress={()=>globals.visitSong(this.state.viewingSong.id)}>
                <Icon containerStyle={globals.style.modalIcon} color={globals.sWhite} name="spotify" type="font-awesome"/>
                <Text style={globals.style.text}>View in Spotify</Text>
              </TouchableOpacity>
            </View>
          </Modal>
        }
        <this.SearchTextInput/>
        {
          this.state.loading ?
          <globals.Loader/> :
          <ScrollView
            style={style.songs}
            indicatorStyle="white"
          >
            {this.state.searchedSongs.map((item, index)=>this.eachAddSong(item, index))}
          </ScrollView>
        }
      </View>
    );
  }
}

const style = StyleSheet.create({
  spotifyButton: {
    marginTop: 10,
    borderWidth: 1,
    borderColor: globals.sWhite,
    flexDirection: 'row',
    padding: 3,
    paddingLeft: 10,
    paddingRight: 10,
    borderRadius: 40,
    alignSelf: 'flex-start',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 5
  },
  song: {
    marginTop: 10,
    marginBottom: 10,
  },
  songInfo: {
    flex: 1
  },
  songs: {
    marginLeft: 25,
    marginRight: 25,
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