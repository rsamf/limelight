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

    this.UPDATE_PERIOD = 10 * 1000;

    this.state = {
      songs: new LocalSongs(this.props.children, this), // Do not set state on this
      loading: true,
      playlist: null
    };
  }

  componentWillReceiveProps(props) {
    let loading = props.songsLoading || props.playlistLoading;
    if(!loading && !props.error) {
      if(this.state.loading) {
        if(!props.songs || !props.playlist) {
          this.init(props);
        } else {
          this.get(props);
        }
      // this.interval = setInterval(()=>this.get(), this.UPDATE_PERIOD);
      // this.props.subscribeToSongChanges();
      } else {
        console.log("received props", props);
        this.state.songs.rebase(props.songs);
      }
    }
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  init(props){
    if(props.isOwned) {
      network.initialize(props.children, props.user, playlist => {
        this.state.songs.rebase(playlist.songs);
        this.setState({
          playlist,
          loading: false
        });
      });
    } else {
      props.navigation.navigate('BarList');
    }
  }

  get(props = this.props) {
    if(props.isOwned) {
      network.rebasePlaylistFromSpotify(props.children, props.songs, playlist => {
        // console.warn("playlist", playlist);
        // console.warn("songs", playlist.songs);
        this.setState({
          playlist,
          loading: false
        });
        this.state.songs.rebase(props.songs, playlist.songs);
      });
    } else {
      props.refetchSongs();
      props.refetchPlaylist();
    }
  }

  vote(index) {
    this.state.songs.vote(index, id => {
      this.props.voteSong(index, id);
    });
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
            <Songs
              {...this.props}
              owned={this.props.isOwned} 
              addSong={(song)=>this.props.addSong(song)}
              deleteSong={(songId)=>this.props.deleteSong(songId)}
              vote={(i)=>this.vote(i)}
            >
              {this.state.songs.queue}
            </Songs>
            <Spotlight 
              isOwned={this.props.isOwned} 
              next={()=>this.props.nextSong()}
            >
              {this.state.songs.spotlight}
            </Spotlight>
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
      isOwned: (this.props.screenProps.user && this.props.screenProps.user.id) === globals.getUserId(this.id)
    };
  }

  render(){
    return (
      <View style={globals.style.view}>
        {
          <Playlist 
            {...this.props.screenProps} 
            isOwned={this.state.isOwned}
            navigation={this.props.navigation} 
          >
            {this.id}
          </Playlist>
        }
      </View>
    );
  }
}