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
      } else {
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
    if(newProps.isOwned) {
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
    if(this.props.isOwned) {
      Spotify.setPlaying(false);
      clearInterval(this.interval);
      MusicControl.turnOff();
    }
  }

  render(){
    const song = this.props.children;
    if(song) {
      return (
        <View>
          <Modal isVisible={this.state.modalActive} onBackdropPress={()=>this.setState({ modalActive: false })}>
            <View style={style.modalView}>
              <View style={{...style.modalBorder, ...style.modalItem}}>
                <Image style={style.modalImage} source={{uri: song.image}}/>
                <View style={style.modalDetails}>
                  <Text ellipsizeMode="tail" numberOfLines={1} style={style.songName}>{song.name}</Text>
                  <Text ellipsizeMode="tail" numberOfLines={1} style={style.songArtist}>{song.artist}</Text>
                </View>
              </View>
              <TouchableOpacity style={{...style.modalBorder, ...style.modalItem}} onPress={()=>this.visitSong()}>
                <Icon containerStyle={style.modalIcon} color={globals.sWhite} name="spotify" type="font-awesome"/>
                <Text style={globals.style.text}>View in Spotify</Text>
              </TouchableOpacity>
            </View>
          </Modal>
          {
            this.props.isOwned &&
            <ProgressViewIOS style={style.progress} trackTintColor={globals.sGrey} progressTintColor={globals.sGreen} progress={this.state.track.position}/>
          }
          <View style={style.view}>
            <View style={{...style.song, flex: this.props.isOwned ? .7 : 1}}>
              <Image style={style.songImage} source={{ uri: song.image }}/>
              <View style={style.songInfo}>
                <Text ellipsizeMode="tail" numberOfLines={1} style={style.songName}>{song.name}</Text>
                <Text ellipsizeMode="tail" numberOfLines={1} style={style.songArtist}>{song.artist}</Text>
              </View>
            </View>
            {
              this.props.isOwned &&
              (
                <View style={style.songControls}>
                  {
                    this.state.track.playing
                    ?
                    <Icon onPress={()=>this.pause()} containerStyle={style.controlItem} 
                    color={globals.sWhite} name="pause" type="font-awesome" underlayColor={globals.darkerGrey}/>
                    :
                    <Icon onPress={()=>this.play()} containerStyle={style.controlItem} 
                    color={globals.sWhite} name="play" type="font-awesome" underlayColor={globals.darkerGrey}/>
                  }
                  <Icon onPress={()=>this.next()} containerStyle={style.controlItem} 
                  color={globals.sWhite} name="step-forward" type="font-awesome" underlayColor={globals.darkerGrey}/>  
                </View>
              )
            }
            <TouchableOpacity style={style.spotifyIcon} onPress={()=>this.setState({modalActive:true})}>
              <Icon color={globals.sWhite} name="spotify" type="font-awesome"/>
            </TouchableOpacity>
          </View>
        </View>
      );
    }
    return <View></View>;
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
    position: 'absolute',
    right: 2,
    top: 2,
    opacity: .66
  },
  progress: {
    flex: 1,
    position: 'absolute',
    bottom: 80 + (globals.isX() ? 15 : 0),
    left: 0,
    right: 0,
    zIndex: 10
  },
  view: {
    flex: 1,
    padding: 10,
    paddingLeft: 10 + (globals.isX() ? 10 : 0),
    paddingBottom: 10 + (globals.isX() ? 10 : 0),
    backgroundColor: globals.darkerGrey,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 80 + (globals.isX() ? 15 : 0),
    flexDirection: 'row',
    justifyContent: 'space-between',
    shadowRadius: 5,
    shadowOffset: {
      height: -15
    },
    shadowOpacity: .9,
    shadowColor: globals.sBlack,
    zIndex: 5
  },
  song: {
    flexDirection: 'row'
  },
  songImage: {
    height: 60,
    width: 60,
    marginRight: 5
  },
  songInfo: {
    flexDirection: 'column',
    flex: 1
  },
  songName: {
    ...globals.style.text
  },
  songArtist: {
    ...globals.style.smallText,
    color: globals.sGrey
  },
  songControls: {
    flexDirection: 'row',
    marginLeft: 20,
    flex: .3
  },
  controlItem: {
    marginRight: 30
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
  modalOptions: {
    marginTop: 20,
    flexDirection: 'row'
  },
  modalView: {
    backgroundColor: 'rgba(0,0,0,.6)',
    borderWidth: 1,
    borderRadius: 20,
    borderColor: globals.sWhite
  },
  modalBorder: {
    borderBottomWidth: 1,
    borderBottomColor: globals.sGrey
  },
  modalItem: {
    flexDirection: 'row',
    padding: 15
  },
  modalIcon: {
    marginRight: 10
  },
  modalImage: {
    height: 50,
    width: 50
  },
  modalDetails: {
    marginLeft: 10,
    flex: 1
  }
});