import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import globals from '../helpers';
import Header from '../helpers/header';
import Spotlight from './spotlight';
import Spotify from 'rn-spotify-sdk';
import Songs from './songs';
const style = globals.style;

export default class Bar extends React.Component {
  constructor(props){
    super(props);

    this.state = {
      songs: [],
      playlistId: "0MvwPHEYqwU5xHu5H0geaM"
    };
  }

  componentDidMount(){
    this.setSongs();
  }

  setSongs(){
    Spotify.sendRequest(`v1/users/${this.props.screenProps.user.id}/playlists/${this.state.playlistId}/tracks`, "GET", {}, false).then(({items}) => {
      this.setState({
        songs: this.sortSongs(items.map(({track}) => ({
          artist: track.artists[0].name,
          id: track.id,
          image: track.images && track.images[0],
          name: track.name,
          duration: track.duration_ms/1000,
          votes: Math.round(Math.random()*10),
          voted: false
        })))
      });
    });
  }

  next(){
    this.setState({
      songs: [...this.state.songs.slice(1), {
        ...this.state.songs[0],
        votes: 0,
        voted: false
      }]
    });
    return (this.state.songs[1] || this.state.songs[0]);
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
      this.setState({
        songs: this.sortSongs(songs)
      });
    }
  }

  sortSongs(songs){
    return songs.sort((a, b) => a.votes < b.votes);
  }

  render(){
    const spotlight = this.state.songs[0];
    const songs = this.state.songs.slice(1);
    return (
      <View style={style.view}>
        <Header type="back" navigation={this.props.navigation}>
          Amanda's Playlist
        </Header>
        {this.getSpotlight(spotlight)}
        <Songs vote={(song)=>this.vote(song)}>
          {songs}
        </Songs>
      </View>
    );
  }

  getSpotlight(spotlight){
    if(spotlight) {
      return (
        <Spotlight next={()=>this.next()} owned={true}>
          {spotlight}
        </Spotlight>
      );
    } else {
      return (
        <View style={{height: 100, justifyContent: 'center', alignItems: 'center'}}>
          <ActivityIndicator size="large" color={globals.sGreen}/>
        </View>
      );
    }
  }
}