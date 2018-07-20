import React from 'react';
import { View, Text, StyleSheet, ProgressViewIOS } from 'react-native';
import { Icon } from 'react-native-elements';
import Spotify from 'rn-spotify-sdk';
import globals from '..';

export default class extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      playing: false,
      trackInitialized: false,
      trackIndex: 0,
      trackPosition: 0
    };
  }
  componentDidMount(){
    let self = this;
    Spotify.addListener("play", (anything) => {
      self.setState({
        track: anything.metadata.currentTrack
      });
    });
  }
  pause() {
    Spotify.setPlaying(false);
    clearInterval(this.state.interval);
    this.setState({
      playing: false
    });
  }
  play() {
    if(this.state.trackInitialized) {
      Spotify.setPlaying(true);
    } else {
      Spotify.playURI("spotify:track:7kQiiHm3jvdz2npYMW7wcE", 0, 0);
    }
    let self = this;
    let interval = setInterval(()=>{
      Spotify.getPlaybackStateAsync().then(state => {
        self.setState({
          trackPosition: state.position
        });
      });
    }, 1000);
    this.setState({
      playing: true,
      trackInitialized: true,
      interval: interval
    });


  }
  componentWillUnmount(){
    Spotify.setPlaying(false);
    clearInterval(this.state.interval);
  }
  render(){
    const song = this.props.children;
    const track = this.state.track;
    const trackPosition = this.state.trackPosition;
    const position = track && trackPosition ? trackPosition / track.duration : 0;
    console.warn(position);
    return (
      <View style={style.view}>
        <Text style={style.song}>{song.artist} - {song.name}</Text>
        <View style={style.control}>
          <Icon iconStyle={style.controlItem} color={globals.sWhite} name="step-backward" type="font-awesome"></Icon>
          {
            this.state.playing
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
        <ProgressViewIOS style={style.progress} trackTintColor={globals.sGrey} progressTintColor={globals.sSand} progress={position}></ProgressViewIOS>
      </View>
    );
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