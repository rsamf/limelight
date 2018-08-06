import React from 'react';
import { FlatList, Text, StyleSheet, View } from 'react-native';
import { Icon } from 'react-native-elements';
import globals from '../helpers';

export default class extends React.Component {
  constructor(props){
    super(props);

    this.state = {
      addingSong: false
    };
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

  setOverlay() {
    this.props.setOpenedBlur(2, { 
      addSong: (song) => this.props.addSong(song)
    });
  }

  render() {
    const songs = this.props.children;
    return (
      <View style={style.view}>
        <View style={style.view}>
          <FlatList data={songs} keyExtractor={(item, index)=>String(index)} renderItem={({item, index})=>this.eachSong(item, index)}>
          </FlatList>
          <View style={style.addIcon}>
            <Icon color={globals.sBlack} size={30} name="ios-add" type="ionicon" raised
            onPress={()=>this.setOverlay()}
            />
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
  }
});