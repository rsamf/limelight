import React from 'react';
import { View, Text, StyleSheet, ProgressViewIOS } from 'react-native';
import { Icon } from 'react-native-elements';
import Spotify from 'rn-spotify-sdk';
import globals from '..';

export default class extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      track: null
    };
  }

  componentDidMount(){
    if(!this.props.children || !this.props.owned) return;
    let self = this;
    Spotify.addListener("play", (song) => {
      self.setTrack({
        name: song.metadata.currentTrack.name,
        artistName: song.metadata.currentTrack.artistName,
        playing: true,
        interval: setInterval(()=>{
          Spotify.getPlaybackStateAsync().then(state => {
            self.setTrack({
              position: state.position
            });
          });
        }, 1000)
      });
    });
    this.play();
  }

  pause() {
    Spotify.setPlaying(false);
    clearInterval(this.state.interval);
    this.setTrack({
      playing: false
    });
  }

  play() {
    if(this.state.track) {
      Spotify.setPlaying(true);
    } else {
      Spotify.playURI(`spotify:track:${this.props.children}`, 0, 0);
    }
  }

  seekStart(){
    Spotify.seek(0);
  }

  skip(){
    this.props.next();
  }

  componentWillUnmount(){
    Spotify.setPlaying(false);
    clearInterval(this.state.interval);
  }

  setTrack(assignment){
    this.setState({
      track: {
        ...this.state.track,
        ...assignment
      }
    });
  }

  renderForGuest(){
    const track = this.state.track;
    return (
      <View style={style.view}>
        {track ? <Text style={style.song}>{track.artistName} - {track.name}</Text> : <Text style={style.song}> </Text>}
      </View>
    );
  }

  renderForHost(){
    const track = this.state.track;
    return (
      <View style={style.view}>
        {track ? <Text style={style.song}>{track.artistName} - {track.name}</Text> : <Text style={style.song}> </Text>}
        <View style={style.control}>
          <Icon iconStyle={style.controlItem} color={globals.sWhite} name="step-backward" type="font-awesome"></Icon>
          {
            track && track.playing
            ?
            <Icon onPress={()=>this.pause()} iconStyle={style.controlItem} 
            color={globals.sWhite} name="pause" type="font-awesome" underlayColor={globals.sBlack}>
            </Icon>
            :
            <Icon onPress={()=>this.play()} iconStyle={style.controlItem} 
            color={globals.sWhite} name="play" type="font-awesome" underlayColor={globals.sBlack}>
            </Icon>
          }
          <Icon iconStyle={style.controlItem} color={globals.sWhite} name="step-forward" type="font-awesome"></Icon>
        </View>
        <ProgressViewIOS style={style.progress} trackTintColor={globals.sGrey} progressTintColor={globals.sSand} progress={track ? track.position : 0}></ProgressViewIOS>
      </View>
    );
  }
  
  render(){
    return this.props.owned ? this.renderForHost() : this.renderForGuest();
  }
}

const style = StyleSheet.create({
  view: {
    padding: 20,
    backgroundColor: globals.sBlack,
    borderBottomWidth: 0.5,
    borderBottomColor: globals.sGrey
  },
  song: {
    fontSize: 16,
    color: globals.sWhite
  },
  control: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10
  },
  controlItem: {
    marginRight: 20,
    marginLeft: 20
  },
  progress: {
    marginTop: 20
  }
});