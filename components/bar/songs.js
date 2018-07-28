import React from 'react';
import { FlatList, Text, StyleSheet, View } from 'react-native';
import { Icon } from 'react-native-elements';
import globals from '../helpers';

export default class extends React.Component {
  constructor(props){
    super(props);

  }
  eachSong(song){
    return (
      <View style={style.song}>
        <Icon iconStyle={style.voteIcon} type="entypo" name="chevron-with-circle-up" color={song.voted ? globals.sGreen : globals.sGrey} underLayColor={globals.sBlack} onPress={()=>this.vote(song)}></Icon>
        <Text style={{...style.voteText, ...globals.style.smallText, color: song.voted ? globals.sGreen : globals.sSand}}>{song.votes}</Text>
        <Text style={{...style.songDescription, ...globals.style.smallText}}>{song.artist} - {song.name}</Text>
      </View>
    );
  }
  vote(song){
    this.props.vote(song);
  }
  render(){
    const songs = this.props.children;
    return (
      <FlatList data={songs} keyExtractor={(item, index)=>String(index)} renderItem={({item})=>this.eachSong(item)}>
      </FlatList>
    );
  }
}

const style = StyleSheet.create({
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
  }
});