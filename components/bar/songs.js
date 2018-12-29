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
          <Icon
            containerStyle={style.voteIcon} 
            size={35}
            type="entypo" 
            name="chevron-with-circle-up" 
            color={song.voted ? globals.sGreen : globals.sGrey} 
            underlayColor={globals.sBlack} 
            onPress={()=>this.props.vote(i)}
          />
          <Text style={{...style.voteNumber, color: song.voted ? globals.sGreen : globals.sGrey}}>
            {song.votes}
          </Text>
          <Image style={style.songImage} source={{uri: song.image}}/>
          <View style={style.songInfo}>
            <Text ellipsizeMode={"tail"} numberOfLines={1} style={style.songName}>{song.name}</Text>
            <Text ellipsizeMode="tail" numberOfLines={1} style={style.songArtist}>{song.artist}</Text>
          </View>
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
  view: {
    flex: 1,
    marginBottom: 80
  },
  song: {
    flexDirection: 'row',
    flex: 1,
    paddingBottom: 10,
    paddingTop: 10,
    marginLeft: 10,
    marginRight: 10,
    alignItems: 'center'
  },
  voteIcon: {
    width: 35,
    height: 35,
    marginRight: 10
  },
  voteNumber: {
    marginRight: 10,
    color: globals.sGrey,
    ...globals.style.text,
  },
  songImage: {
    height: 30,
    width: 30,
    marginRight: 10
  },
  songInfo: {
    flexDirection: 'column',
    flex: 1
  },
  songName: {
    ...globals.style.text
  },
  songArtist: {
    ...globals.style.smallText,
    color: globals.sGrey
  },
  addButtonContainer: {
    flex: 1,
    alignItems: 'center'
  },
  addButton: {
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 30,
    paddingRight: 30,
    marginTop: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: globals.sWhite,
    backgroundColor: globals.sBlue,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
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