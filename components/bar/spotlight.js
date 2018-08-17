import React from 'react';
import { View, Text, StyleSheet, ProgressViewIOS, Image } from 'react-native';
import { Icon } from 'react-native-elements';
import Spotify from 'rn-spotify-sdk';
import globals from '../helpers';

export default class extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      track: {
        position: 0,
        playing: false,
        initialized: false
      },
      interval: null,
    };
  }
  
  componentDidMount(){
    const setPlaybackState = () => {
      Spotify.getPlaybackStateAsync().then(state => {
        if(!state) return;
        if(state.playing) {
          this.nexting = false;
          this.setState({
            track: {
              ...this.state.track,
              position: state.position/this.props.children.duration
            }
          });
        }
        else if (this.state.track.playing && !this.nexting) {
          this.next();
        }
      });
    }
    if(this.props.owned) {
      this.interval = setInterval(setPlaybackState, 1000)
    }
    if(this.props.children && this.props.owned) {
      this.play();
    }
  }

  next() {
    this.nexting = true;
    this.props.next();
  }

  componentWillReceiveProps(newProps) {
    let song = newProps.children;
    if(song && this.props.children && song.id != this.props.children.id) {
      Spotify.playURI(`spotify:track:${song.id}`, 0, 0);
      this.setState({
        track: {
          position: 0,
          playing: true,
          initialized: true
        }
      });
    }
  }

  pause() {
    Spotify.setPlaying(false);
    this.setState({
      track: {
        ...this.state.track,
        playing: false
      }
    });
  }

  play() {
    if(this.state.track.initialized) {
      // Play Already playing song
      Spotify.setPlaying(true);
    } else {
      // Play new song
      let song = this.props.children;
      if(!song) return;
      Spotify.playURI(`spotify:track:${song.id}`, 0, 0);
    }
    this.setState({
      track: {
        position: this.state.track.position,
        playing: true,
        initialized: true
      }
    });
  }

  seekStart(){
    Spotify.seek(0);
    this.setState({
      track: {
        ...this.state.track,
        position: 0
      }
    });
  }

  componentWillUnmount(){
    if(this.props.owned) {
      Spotify.setPlaying(false);
      clearInterval(this.interval);
    }
  }

  renderNotLive(){
    return (
      <View style={style.view}>
        <Text style={globals.style.smallText}>Add some songs!</Text>
      </View>
    );
  }

  renderForGuest(song){
    return (
      <View style={style.view}>
        <Text style={style.text}>Currently Playing:</Text>
        <View style={style.title}>
          <Image style={style.image} source={{uri:song.image}}/>
          <Text ellipsizeMode={'middle'} numberOfLines={1} style={style.text}>{song.artist} - {song.name}</Text>
        </View>
      </View>
    );
  }

  renderForHost(song){
    return (
      <View style={style.view}>
        <View style={style.title}>
          <Image style={style.image} source={{uri:song.image}}/>
          <Text ellipsizeMode={'middle'} numberOfLines={1} style={style.text}>{song.artist} - {song.name}</Text>
        </View>
        <View style={style.control}>
          <Icon onPress={()=>this.seekStart()} iconStyle={style.controlItem} underlayColor={globals.sBlack}
          color={globals.sWhite} name="step-backward" type="font-awesome"/>
          {
            this.state.track.playing
            ?
            <Icon onPress={()=>this.pause()} iconStyle={style.controlItem} 
            color={globals.sWhite} name="pause" type="font-awesome" underlayColor={globals.sBlack}/>
            :
            <Icon onPress={()=>this.play()} iconStyle={style.controlItem} 
            color={globals.sWhite} name="play" type="font-awesome" underlayColor={globals.sBlack}/>
          }
          <Icon onPress={()=>this.next()} iconStyle={style.controlItem} underlayColor={globals.sBlack}
          color={globals.sWhite} name="step-forward" type="font-awesome"/>
        </View>
        <ProgressViewIOS style={style.progress} trackTintColor={globals.sGrey} progressTintColor={globals.sSand} progress={this.state.track.position}/>
      </View>
    );
  }
  
  render(){
    const song = this.props.children;
    if(song) {
      if(this.props.owned) {
        return this.renderForHost(song);
      }
      return this.renderForGuest(song);
    }
    return this.renderNotLive();
  }
}

const style = StyleSheet.create({
  view: {
    padding: 20,
    backgroundColor: globals.sBlack,
    borderBottomWidth: 0.5,
    borderBottomColor: globals.sGrey
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
  },
  text: {
    ...globals.style.smallText,
    marginBottom: 10
  },
  image: {
    height: 30,
    width: 30,
    marginRight: 7
  },
  title: {
    flexDirection: 'row',
    alignItems: 'center'
  }
});