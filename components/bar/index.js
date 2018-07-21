import React from 'react';
import { View, Text } from 'react-native';
import globals from '..';
import Header from '../header';
import SpotLight from './spotlight';
import Songs from './songs';
const style = globals.style;

export default class Bar extends React.Component {
  constructor(props){
    super(props);

    this.state = {
      songs: [{
        name: "Single Ladies",
        votes: 6,
        artist: "Beyonce",
        id: 0,
        voted: false,
        uri: "5R9a4t5t5O0IsznsrKPVro"
      }, {
        name: "Hello",
        votes: 5,
        artist: "Adele",
        id: 1,
        voted: false,
        uri: "4sPmO7WMQUAf45kwMOtONw"
      }, {
        name: "Heartless",
        votes: 2,
        artist: "Kanye West",
        id: 2,
        voted: false,
        uri: "4EWCNWgDS8707fNSZ1oaA5"
      }, {
        name: "It Was a Good Day",
        votes: 1,
        artist: "Ice Cube",
        id: 3,
        voted: false,
        uri: "2qOm7ukLyHUXWyR4ZWLwxA"
      }]
    };
  }

  next(){
    let songs = this.state.songs;
    songs[0].votes = 0;
    this.sortSongs(songs);
    this.setState({songs});
  }

  vote(song){
    let index = -1;
    this.state.songs.forEach((s, i) => {
      if(s.id === song.id) index = i;
    });
    let songs = this.state.songs;
    if(!songs[index].voted && index > -1) {
      songs[index].votes++;
      songs[index].voted = true;
      this.sortSongs(songs);
      this.setState({songs});
    }
  }

  sortSongs(songs){
    songs = songs.sort((a, b) => a.votes < b.votes);
  }

  render(){
    const spotlight = this.state.songs[0];
    const songs = this.state.songs.slice(1);
    return (
      <View style={style.view}>
        <Header type="back" navigation={this.props.navigation}>
          Amanda's Playlist
        </Header>
        <SpotLight owned={true}>
          {spotlight && spotlight.uri}
        </SpotLight>
        <Songs vote={(song)=>this.vote(song)}>
          {songs}
        </Songs>
      </View>
    );
  }
}