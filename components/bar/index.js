import React from 'react';
import { View, Text } from 'react-native';
import globals from '../helpers';
import Header from '../header';
import Spotlight from './spotlight';
import Songs from './songs';
import createPlaylist from '../../GQL/playlist';
import LocalSongs from '../../util/LocalSongs';
import network from './network';
import { getOperationAST } from 'graphql';

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
    if(this.state.loading && !loading && !props.error) {
      this.init(props, !props.songs || !props.playlist);
    }
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }


  init(props, isEmpty) {
    if(isEmpty) {
      this.initEmpty(props);
    } else {
      this.get(props);
    }
    // this.interval = setInterval(()=>this.get(), this.UPDATE_PERIOD);
    // this.props.subscribeToSongChanges();
  }

  initEmpty(props){
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
        console.warn("playlist", playlist);
        console.warn("songs", playlist.songs);
        this.setState({
          playlist,
          loading: false
        });
        this.state.songs.rebase(playlist.songs);
      });
    } else {
      props.refetchSongs();
      props.refetchPlaylist();
    }
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