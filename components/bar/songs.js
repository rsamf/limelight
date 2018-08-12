import React from 'react';
import { FlatList, Text, StyleSheet, View, Image } from 'react-native';
import { Icon } from 'react-native-elements';
import globals from '../helpers';
import Spotify from 'rn-spotify-sdk';

export default class extends React.Component {
  constructor(props){
    super(props);

    this.state = {
      addingSong: false,
      voted: []
    };
  }

  vote(song, i) {
    if(this.state.voted.includes(song.id)) return;
    this.setState({
      voted: [...this.state.voted, song.id]
    });
    this.props.vote(song, i);
  }

  componentWillReceiveProps(newProps) {
    let songs = newProps.children;
    let toBeRemoved = songs[songs.length - 1];
    if(toBeRemoved) {
      this.setState({
        voted: this.state.voted.filter(v => v !== toBeRemoved.id)
      });
    }
    
  }

  eachSong(song, i) {
    let voted = this.state.voted.includes(song.id);
    return (
      <View style={style.song}>
        <Icon iconStyle={style.voteIcon} type="entypo" name="chevron-with-circle-up" color={voted ? globals.sGreen : globals.sGrey} underlayColor={globals.sBlack} onPress={()=>this.vote(song, i)}/>
        <Text style={{...style.voteText, ...globals.style.smallText, color: voted ? globals.sGreen : globals.sGrey}}>{song.votes}</Text>
        <Image style={style.image} source={{uri:song.image}}/>
        <Text style={{...style.songDescription, ...globals.style.smallText}}>{song.artist} - {song.name}</Text>
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

  render() {
    const songs = this.props.children;
    return (
      <View style={style.view}>
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
  }
});