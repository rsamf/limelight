import React from 'react';
import { View, Text } from 'react-native';
import globals from '../helpers';
import Header from '../header';
import Spotlight from './spotlight';
import Songs from './songs';
import createPlaylist from '../../GQL/playlist';
import LocalSongs from '../../util/LocalSongs';
import network from './network';

class PlaylistComponent extends React.Component {
  constructor(props) {
    super(props);

    this.UPDATE_PERIOD = 60 * 1000;

    this.state = {
      loading: true,
      songs: null,
      playlist: null
    };
  }

  componentWillReceiveProps(props) {
    let loading = props.songsLoading || props.playlistLoading;
    if(this.state.loading && !loading && !props.error) {
      this.init(props, !props.songs || !props.playlist, props.isOwned);
    }
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  init(props, isEmpty, isOwned) {
    if(isEmpty) {
      if(isOwned) {
        network.initialize(props.spotify, props.user, (songs, playlist) => {
          console.warn("init: from initialize (aws songs length):", songs.length);
          this.setReady(props.children, songs, playlist);
        });
      } else {
        props.navigation.navigate('BarList');
      }
    } else {
      if(isOwned) {
        this.get(props);
      }
    }
    this.interval = setInterval(this.get, this.UPDATE_PERIOD);
    this.props.subscribeToSongChanges();
  }

  get(props = this.props) {
    // console.warn("Spotify", props.spotify.tracks.items);
    // console.warn("Songs", props.songs);
    if(props.isOwned) {
      network.rebaseSongsFromSpotify(props.children, props.spotify.tracks.items, props.songs, (songs) => {
        console.warn("get: from initialize (aws songs length):", songs.length);
        this.setReady(props.children, songs, props.playlist);
      });
    } else {
      network.refetch(props.refetchSongs, props.refetchPlaylist, (data)=>{
        console.log("REFTECHED:", data);
      });
    }
  }

  setReady(id, songs, playlist) {
    let localSongs = new LocalSongs(id, songs, this, () => {
      this.setState({
        loading: false
      });
    });
    this.setState({
      songs: localSongs,
      playlist: playlist
    });
  }

  voteSong(index) {
    this.state.songs.vote(index);
  }

  render() {
    return (
      <View style={globals.style.view}>
        <Header
          {...this.props}
          navigation={this.props.navigation}
          playlist={this.state.playlist}
          updatePlaylist={(p)=>this.props.updatePlaylist(p)}
          deletePlaylist={()=>this.props.deletePlaylist()}
          deleteSongs={()=>this.props.deleteSongs()}
        />
        {
          !this.state.loading ? (
          <View style={globals.style.view}>
            <Spotlight 
              owned={this.props.isOwned} 
              next={()=>this.props.nextSong()}
            >
              {this.state.songs.spotlight}
            </Spotlight>

            <Songs
              {...this.props}
              owned={this.props.isOwned} 
              addSong={(song)=>this.props.addSong(song)}
              deleteSong={(songId)=>this.props.deleteSong(songId)}
              vote={(song)=>this.voteSong(song)}
            >
              {this.state.songs.queue}
            </Songs>
          </View>
          ) :
          <globals.Loader/>
        }
      </View>
    );
  }
}

const Playlist = createPlaylist(PlaylistComponent);

export default class Bar extends React.Component {
  constructor(props){
    super(props);

    this.id = this.props.navigation.state.params;
    this.state = {
      spotify: null,
      loading: true,
      isOwned: (this.props.screenProps.user && this.props.screenProps.user.id) === globals.getUserId(this.id)
    };
  }

  componentDidMount() {
    this.getPlaylistFromSpotify();
  }

  getPlaylistFromSpotify() {
    if(this.state.isOwned) {
      network.getPlaylistFromSpotify(this.id, playlist => {
        console.warn(playlist);
        this.setState({
          spotify: playlist,
          loading: false
        });
      });
    } else {
      this.setState({
        loaded: false
      });
    }
  }

  render(){
    return (
      <View style={globals.style.view}>
        {
          !this.state.loading ?
          <Playlist 
            {...this.props.screenProps} 
            isOwned={this.state.isOwned}
            spotify={this.state.spotify}
            navigation={this.props.navigation} 
          >
            {this.id}
          </Playlist>
          :
          <globals.Loader/>
        }
      </View>
    );
  }
}