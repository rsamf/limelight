import React from 'react';
import { View, Text, StyleSheet, ProgressViewIOS, Image, TouchableOpacity, Linking, Alert } from 'react-native';
import { Icon } from 'react-native-elements';
import Modal from "react-native-modal";
import Spotify from 'rn-spotify-sdk';
import globals from '../../util';
import MusicControl from './ios-music-control';

export default class extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      modalActive: false,
      track: {
        position: 0,
        positionSec: 0,
        playing: false,
        initialized: false
      },
      interval: null,
    };
  }

  musicControlFunctions = [
    ()=>this.play(), ()=>this.pause(), ()=>this.next()
  ]

  updateTrack(state) {
    this.setState({
      track: { ...this.state.track, ...state }
    });
  }

  setPlaybackState() {
    Spotify.getPlaybackStateAsync().then(state => {
      if(!state) return;
      console.log(this.state.track, state);
      this.updateTrack({
        position: state.position/this.props.children.duration,
        positionSec: Math.floor(state.position),
        playing: state.playing || this.optimisticallyPlaying,
        initialized: state.position > 0
      });
    }).catch(() => {
      this.updateTrack({ playing: false });
    });
  }

  componentDidMount() {
    if(this.props.isOwned) {
      MusicControl.init(...this.musicControlFunctions);
      this.optimisticallyPlaying = false;
      if(!this.interval) {
        this.interval = setInterval(()=>this.setPlaybackState(), 1000);
      }
      this.setNewSong();
      Spotify.addListener("audioDeliveryDone", ()=>{
        console.log("audiodelivery done");
        this.next();
      });
      Spotify.addListener("play", () => {
        MusicControl.updateSong(true, this.state.track.positionSec);
      });
      Spotify.addListener("pause", () => {
        MusicControl.updateSong(false, this.state.track.positionSec);
      });
    }
  }

  componentWillReceiveProps(newProps) {
    if(newProps.isOwned) {
      if(newProps.children && this.props.children && (newProps.children.id !== this.props.children.id)) {
        this.setNewSong(newProps.children, true);
      }
    }
  }

  setNewSong(song = this.props.children, play=false) {
    if(!song) return;
    Spotify.playURI(`spotify:track:${song.id}`, 0, 0);
    MusicControl.setSong(song, this.props.name);
    if(!play) Spotify.setPlaying(false);
    this.updateTrack({ initialized: true });
  }

  pause() {
    Spotify.setPlaying(false);
    MusicControl.updateSong(false, this.state.track.positionSec);
    this.optimisticallyPlaying = false;
    this.updateTrack({ playing: false });
  }

  play() {
    if(this.state.track.initialized) {
      Spotify.setPlaying(true);
      MusicControl.updateSong(true, this.state.track.positionSec);
    } else {
      this.setNewSong(this.props.children, true);
    }
    this.optimisticallyPlaying = true;
    this.updateTrack({ playing: true });
    setTimeout(() => {
      this.optimisticallyPlaying = false;
    }, 3000);
  }

  next() {
    this.props.next();
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
                  {globals.getScrollableText(song.name)}
                  {globals.getScrollableText(globals.getArtistsText(song), style.songArtist)}
                </View>
              </View>
              <TouchableOpacity style={style.modalItem} onPress={()=>globals.visitSong(song.id)}>
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
            <View style={{...style.song, flex: this.props.isOwned ? .7 : .95}}>
              <TouchableOpacity onPress={()=>this.setState({modalActive:true})}>
                <Image style={style.songImage} source={{ uri: song.image }}/>
              </TouchableOpacity>
              <View style={style.songInfo}>
                {globals.getScrollableText(song.name)}
                {globals.getScrollableText(globals.getArtistsText(song), style.songArtist)}
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
    return <View/>;
  }
}

const style = StyleSheet.create({
  spotifyIcon: {
    position: 'absolute',
    right: 2,
    top: 2
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
    ...globals.style.shadow,
    shadowOffset: {
      height: -12
    }
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