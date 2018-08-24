import React from 'react';
import { View, Text, StyleSheet, ProgressViewIOS, Image, TouchableOpacity, Linking, Alert } from 'react-native';
import { Icon, Button } from 'react-native-elements';
import Modal from "react-native-modal";
import Spotify from 'rn-spotify-sdk';
import globals from '../helpers';
import MusicControl from './ios-music-control';

export default class extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      modalActive: false,
      track: {
        position: 0,
        playing: false,
        initialized: false
      },
      interval: null,
    };
  }

  musicControlFunctions = [
    ()=>this.play(), ()=>this.pause(), ()=>this.next(), ()=>this.seekStart()
  ]

  stop(){
    Spotify.setPlaying(false);
    Spotify.seek(0);
  }

  setPlaybackState() {
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
      else {
        if (this.state.track.playing && !this.nexting) {
          this.next();
        }
      }
    }).catch(() => {
      this.setState({
        track: {
          ...this.state.track,
          playing: false
        }
      });
    });
  }

  componentWillReceiveProps(newProps) {
    if(newProps.owned) {
      MusicControl.init(...this.musicControlFunctions);
      if(!this.interval) {
        this.interval = setInterval(()=>this.setPlaybackState(), 1000)
      }
      let song = newProps.children;
      if(song && this.props.children && song.id !== this.props.children.id) {
        this.stop();
        MusicControl.setSong(newProps.children);
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
  }

  next() {
    this.nexting = true;
    this.props.next();
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

  play(fromBackground) {
    if(this.state.track.initialized) {
      // Play Already playing song
      Spotify.setPlaying(true);
    } else {
      // Play new song
      let song = this.props.children;
      if(!song) return;
      if(!fromBackground) {
        this.stop();
        MusicControl.setSong(song);
      }
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
      MusicControl.turnOff();
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
        <TouchableOpacity style={style.spotifyIcon} onPress={()=>this.setState({modalActive:true})}>
          <Icon color={globals.sWhite} name="spotify" type="font-awesome"/>
        </TouchableOpacity>
        <Text style={style.text}>Currently Playing:</Text>
        <View style={style.title}>
          <Image style={style.image} source={{uri:song.image}}/>
          <Text ellipsizeMode="middle" numberOfLines={1} style={style.text}>{song.artist} - {song.name}</Text>
        </View>
      </View>
    );
  }

  renderForHost(song){
    return (
      <View style={style.view}>
        <TouchableOpacity style={style.spotifyIcon} onPress={()=>this.setState({modalActive:true})}>
          <Icon color={globals.sWhite} name="spotify" type="font-awesome"/>
        </TouchableOpacity>
        <View style={style.title}>
          <Image style={style.image} source={{uri:song.image}}/>
          <Text ellipsizeMode="middle" numberOfLines={1} style={style.text}>{song.artist} - {song.name}</Text>
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
      return (
        <View>
          <Modal isVisible={this.state.modalActive}>
            <View style={style.modalView}>
              <Text style={style.modalText}>See this song in Spotify?</Text>
              <View style={style.control}>
                <Button onPress={()=>this.visitSong()} title="Yes" backgroundColor={globals.spotifyGreen}
                icon={{name:"spotify", type:"font-awesome"}}/>
                <Button onPress={()=>this.setState({modalActive:false})} title="Cancel"/>
              </View>
            </View>
          </Modal>
          {
            this.props.owned ?
            this.renderForHost(song) :
            this.renderForGuest(song)
          }
        </View>
      );
    }
    return this.renderNotLive();
  }

  visitSong() {
    let url = "https://open.spotify.com/track/"+this.props.children.id;
    Linking.canOpenURL(url).then(supported => {
      if (!supported) {
        Alert.alert("Could not open the link to the song!");
      } else {
        Linking.openURL(url);
      }
    });
  }
}

const style = StyleSheet.create({
  spotifyIcon: {
    padding: 15,
    position: "absolute",
    right: 0,
    top: 0
  },
  modalView: {
    flex: 1, 
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    backgroundColor: globals.sWhite
  },
  modalText: {
    ...globals.style.text,
    color: globals.sBlack
  },
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