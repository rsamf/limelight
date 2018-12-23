import React from 'react';
import { FlatList, Text, StyleSheet, View, Image, TouchableOpacity, Linking, Alert } from 'react-native';
import Modal from "react-native-modal";
import { Icon, Button } from 'react-native-elements';
import globals from '../helpers';
import Spotify from 'rn-spotify-sdk';

export default class extends React.Component {
  constructor(props){
    super(props);

    this.state = {
      addingSong: false,
      viewingSong: null
    };
  }

  eachSong(song, i) {
    return (
      <TouchableOpacity onLongPress={()=>this.setState({viewingSong:song})}>
        <View style={style.song}>
          <Icon iconStyle={style.voteIcon} type="entypo" name="chevron-with-circle-up" color={song.voted ? globals.sGreen : globals.sGrey} underlayColor={globals.sBlack} onPress={()=>this.props.vote(song, i)}/>
          <Text style={{...style.voteText, ...globals.style.smallText, color: song.voted ? globals.sGreen : globals.sGrey}}>{song.votes}</Text>
          <Image style={style.image} source={{uri:song.image}}/>
          <Text style={{...style.songDescription, ...globals.style.smallText}}>{song.artist} - {song.name}</Text>
        </View>
      </TouchableOpacity>
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
    this.props.deleteSong(this.state.viewingSong.id);
    this.setState({
      viewingSong: null
    });
  }

  visitSong() {
    let url = "https://open.spotify.com/track/"+this.state.viewingSong.id;
    Linking.canOpenURL(url).then(supported => {
      if (!supported) {
        Alert.alert("Could not open the link to the song!");
      } else {
        Linking.openURL(url);
      }
      this.setState({
        viewingSong: null
      });
    });
  }

  render() {
    const songs = this.props.children;
    return (
      <View style={style.view}>
        {
          this.state.viewingSong &&
          <Modal isVisible={true}>
            <View style={style.modalView}>
              <Text style={style.modalText}>{this.state.viewingSong.name} - {this.state.viewingSong.artist}</Text>
              <View style={style.modalOptions}>
                {
                  this.props.owned &&
                  <Button onPress={()=>this.deleteSong()} title="Delete" backgroundColor="red"/>
                }
                <Button onPress={()=>this.visitSong(this.state.viewingSong.id)} title="Spotify" backgroundColor={globals.spotifyGreen}
                 icon={{name:"spotify", type:"font-awesome"}}/>
                <Button onPress={()=>this.setState({viewingSong:null})} title="Cancel"/>
              </View>
            </View>
          </Modal>
        }
        <View style={globals.style.view}>
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
    flex: .65
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
  modalOptions: {
    marginTop: 20,
    flexDirection: 'row'
  },
  modalView: {
    flex: 1, 
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    backgroundColor: globals.sWhite
  },
  modalText: {
    ...globals.style.smallText,
    color: globals.sBlack
  }
});