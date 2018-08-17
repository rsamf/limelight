import React from 'react';
import { FlatList, Text, StyleSheet, View, Image, TouchableOpacity } from 'react-native';
import Modal from "react-native-modal";
import { Icon, Button } from 'react-native-elements';
import globals from '../helpers';
import Spotify from 'rn-spotify-sdk';

export default class extends React.Component {
  constructor(props){
    super(props);

    this.state = {
      addingSong: false,
      deletingSong: null
    };
  }

  eachSong(song, i) {
    const renderSong = () => {
      return (
        <View style={style.song}>
          <Icon iconStyle={style.voteIcon} type="entypo" name="chevron-with-circle-up" color={song.voted ? globals.sGreen : globals.sGrey} underlayColor={globals.sBlack} onPress={()=>this.props.vote(song, i)}/>
          <Text style={{...style.voteText, ...globals.style.smallText, color: song.voted ? globals.sGreen : globals.sGrey}}>{song.votes}</Text>
          <Image style={style.image} source={{uri:song.image}}/>
          <Text style={{...style.songDescription, ...globals.style.smallText}}>{song.artist} - {song.name}</Text>
        </View>
      );
    }
    return (
      this.props.owned ?
      <TouchableOpacity onLongPress={()=>this.setState({deletingSong:song})}>
        {renderSong()}
      </TouchableOpacity> :
      renderSong()
    );
  }

  setOverlay() {
    if(Spotify.isLoggedIn()) {
      this.props.setOpenedBlur(2, { 
        addSong: (song) => this.props.addSong(song)
      });
    } else {
      Spotify.login();
    }
  }

  deleteSong() {
    this.props.deleteSong(this.state.deletingSong.id);
    this.setState({
      deletingSong: null
    });
  }

  render() {
    const songs = this.props.children;
    return (
      <View style={style.view}>
        <Modal isVisible={this.state.deletingSong !== null}>
          <View style={style.deleteView}>
            <Text style={style.deleteConfirmation}>Delete "{this.state.deletingSong && this.state.deletingSong.name}" from your playlist?</Text>
            <View style={style.deleteOptions}>
              <Button onPress={()=>this.deleteSong()} title="Delete" backgroundColor={'red'}/>
              <Button onPress={()=>this.setState({deletingSong:null})} title="Cancel"/>
            </View>
          </View>
        </Modal>
        <View style={style.view}>
          <FlatList data={songs} keyExtractor={(item, index)=>String(index)} renderItem={({item, index})=>this.eachSong(item, index)}>
          </FlatList>
          <View style={style.addIcon}>
            <Icon color={globals.sBlack} size={30} name="ios-add" type="ionicon" raised onPress={()=>this.setOverlay()}/>
          </View>
        </View>
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
    paddingBottom: 12,
    paddingTop: 12,
    paddingLeft: 10,
    marginLeft: 5,
    marginRight: 5,
    alignItems: 'center'
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
  image: {
    height: 30,
    width: 30,
    marginRight: 7
  },
  deleteOptions: {
    marginTop: 20,
    flexDirection: 'row'
  },
  deleteView: {
    flex: 1, 
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    backgroundColor: globals.sWhite
  },
  deleteConfirmation: {
    ...globals.style.text,
    color: globals.sBlack
  }
});