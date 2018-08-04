import React from 'react';
import { View, Text, StyleSheet, ProgressViewIOS } from 'react-native';
import { Icon } from 'react-native-elements';
import Spotify from 'rn-spotify-sdk';
import globals from '../helpers';

export default class extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      track: this.props.children,
      trackState: {
        position: 0,
        playing: false,
        initialized: false
      },
      interval: null,
    };
  }
  
  componentDidMount(){
    Spotify.addListener("play", () => {
      this.setState({
        interval: setInterval(()=>{
          Spotify.getPlaybackStateAsync().then(state => {
            if(!state.playing && this.state.trackState.playing) {
              this.next();
            } else {
              this.setState({
                trackState: {
                  ...this.state.trackState,
                  position: state.position/this.state.track.duration
                }
              });
            }
          });
        }, 1000)
      });
    });
    if(this.props.children && this.props.owned) {
      // this.play();
    }
  }

  pause() {
    Spotify.setPlaying(false);
    this.setState({
      trackState: {
        ...this.state.trackState,
        playing: false
      }
    });
  }

  play(song) {
    if(!song && this.state.trackState.initialized && this.state.track) {
      // Play Already playing song
      Spotify.setPlaying(true);
    } else {
      // Play new song
      Spotify.playURI(`spotify:track:${song ? song.id : this.state.track.id}`, 0, 0);
      this.setState({
        trackState: {
          position: 0
        }
      });
    }
    this.setState({
      trackState: {
        ...this.state.trackState,
        playing: true,
        initialized: true
      }
    });
  }

  seekStart(){
    Spotify.seek(0);
    if(!this.state.trackState.playing) {
      clearInterval(this.state.interval);
    }
    this.setState({
      trackState: {
        ...this.state.trackState,
        position: 0
      }
    });
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      track: nextProps.children
    });
  }

  componentWillUnmount(){
    Spotify.setPlaying(false);
    clearInterval(this.state.interval);
  }

  renderForGuest(){
    const track = {...this.state.track, ...this.state.trackState};
    return (
      <View style={style.view}>
        {track ? <Text style={style.song}>{track.artist} - {track.name}</Text> : <Text style={style.song}> </Text>}
      </View>
    );
  }

  renderForHost(){
    const track = {...this.state.track, ...this.state.trackState};
    return (
      <View style={style.view}>
        {track ? <Text style={style.song}>{track.artist} - {track.name}</Text> : <Text style={style.song}> </Text>}
        <View style={style.control}>
          <Icon onPress={()=>this.seekStart()} iconStyle={style.controlItem} underlayColor={globals.sBlack}
          color={globals.sWhite} name="step-backward" type="font-awesome">
          </Icon>
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
          <Icon onPress={()=>this.props.next()} iconStyle={style.controlItem} underlayColor={globals.sBlack}
          color={globals.sWhite} name="step-forward" type="font-awesome">
          </Icon>
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