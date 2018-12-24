import React from 'react';
import { FlatList, Text, StyleSheet, View, Image, TouchableOpacity, Linking, Alert, ScrollView } from 'react-native';
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
      <TouchableOpacity key={i} onLongPress={()=>this.setState({viewingSong:song})}>
        <View style={style.song}>
          <Icon iconStyle={style.voteIcon} type="entypo" name="chevron-with-circle-up" color={song.voted ? globals.sGreen : globals.sGrey} underlayColor={globals.sBlack} onPress={()=>this.props.vote(song, i)}/>
          <Text style={{...style.voteText, ...globals.style.smallText, color: song.voted ? globals.sGreen : globals.sGrey}}>{song.votes}</Text>
          <Image style={style.image} source={{uri:song.image}}/>
          <Text style={{...style.songDescription, ...globals.style.smallText}}>{song.artist} - {song.name}</Text>
        </View>
      </TouchableOpacity>
    );
  }

  renderAddButton() {
    return (
      <View style={style.song}>
        <View style={style.addButtonContainer}>
          <TouchableOpacity onPress={()=>this.setOverlay()} style={style.addButton}>
            <Icon name='add' color={globals.sWhite}/>
            <Text style={globals.style.text}>Add Song</Text>
          </TouchableOpacity>
        </View>
      </View>
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
      <View style={globals.style.view}>
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
          <ScrollView>
            {songs.map((s, i) => this.eachSong(s, i))}
            {this.renderAddButton()}
          </ScrollView>
        </View>
      </View>
    );
  }
}

const style = StyleSheet.create({
  song: {
    flexDirection: 'row',
    flex: 1,
    paddingBottom: 12,
    paddingTop: 12,
    paddingLeft: 10,
    marginLeft: 5,
    marginRight: 5,
    alignItems: 'center'
  },
  addButtonContainer: {
    flex: 1,
    alignItems: 'center'
  },
  addButton: {
    padding: 12,
    marginTop: 10,
    marginBottom: 50,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: globals.sWhite,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  voteIcon: {
    marginRight: 5
  },
  voteText: {
    marginRight: 15
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