import React from 'react';
import { View } from 'react-native';
import globals from '../helpers';
import Header from '../header';
import Spotlight from './spotlight';
import Songs from './songs';
import createPlaylist from '../../GQL/playlist';
import LocalSongs from '../../util/LocalSongs';
import AddSongBlur from '../blurs/addSong';
import network from './network';
import user from '../../util/user';

class PlaylistComponent extends React.Component {
  constructor(props) {
    super(props);

    this.UPDATE_PERIOD = 10 * 1000;

    this.state = {
      songs: new LocalSongs(this.props.children, this), // Do not set state on this
      loading: true,
      playlist: null,
      refreshing: false
    };
  }

  initializing = true

  componentWillReceiveProps(props) {
    let loading = props.songsLoading || props.playlistLoading || props.requestsLoading;
    if(loading) return;
    if(props.error) props.navigation.navigate('BarList');
    if(this.initializing) {
      this.initializing = false;
      if(!props.songs || !props.playlist) {
        this.init(props);
      } else {
        this.get(props);
      }
      // this.interval = setInterval(()=>this.get(), this.UPDATE_PERIOD);
      this.props.subscribeToSongChanges();
      this.props.subscribeToRequests();
    } else {
      this.state.songs.rebase(props.songs);
      this.setState({ refreshing: false });
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
      const callback = (playlist, songs) => {
        this.setState({
          playlist,
          loading: false,
          refreshing: false
        });
        if(songs)
          this.state.songs.rebase(songs);
      };
      const awsPlaylist = {
        ...props.playlist,
        songs: props.songs
      };
      network.rebasePlaylistFromSpotify(
        props.children, 
        awsPlaylist, 
        this.props.addSongs,
        this.props.deleteSongs, 
        this.props.updatePlaylist,
        this.props.updateSongProps,
        callback
      );
    } else {
      this.setState({
        loading: false,
        refreshing: false
      });
    }
  }

  refresh() {
    this.setState({refreshing: true});
    if(this.props.isOwned) {
      this.get();
    } else {
      this.props.refetchSongs();
      this.props.refetchPlaylist();
      this.props.refetchRequests();
    }
  }

  vote(index) {
    this.state.songs.vote(index, id => {
      this.props.voteSong(index, id);
    });
  }

  addSong(song, uri, requestIndex) {
    if(this.props.isOwned) {
      network.addSongToSpotify(this.state.playlist.id, uri, playlist => {
        if(playlist) {
          this.props.addSongs([awsSong(song)]);
        }
      });
      if(requestIndex != -1) {
        this.props.requestACKSong(requestIndex);
      }
    } else {
      this.props.requestSong(song);
    }
  }

  requestACKSong(index) {
    this.props.requestACKSong(index);
  }

  deleteSong(id) {
    network.deleteSongs(this.props.playlist.id, [id]);
    this.props.deleteSongs([id]);
  }

  searchSong(){
    user.rsa(()=>{
      this.props.openBlur(AddSongBlur, {
        isOwned: this.props.isOwned,
        addSong: (song, uri) => this.addSong(song, uri, -1)
      });
    });
  }

  render() {
    return (
      <View style={globals.style.view}>
        {
          !this.state.loading ? (
          <View style={globals.style.view}>
            <Header
              user={this.props.user}
              openBlur={(blur, props)=>this.props.openBlur(blur,props)}
              navigation={this.props.navigation}
              playlist={this.props.playlist}
              updatePlaylist={(p)=>this.props.updatePlaylist(p)}
            />
            <Songs
              {...this.props}
              isOwned={this.props.isOwned}
              voted={(i)=>!this.state.songs.canVote(i)}
              search={()=>this.searchSong()}
              addSong={(song, uri, i)=>this.addSong(song, uri, i)}
              ackSong={(i)=>this.props.requestACKSong(i)}
              deleteSong={(id, isRequest)=>this.deleteSong(id, isRequest)}
              vote={(i)=>this.vote(i)}
              requests={this.props.requests}
              refreshing={this.state.refreshing}
              refresh={()=>this.refresh()}
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

function awsSong(song) {
  return { 
    id: song.id,
    name: song.name,
    artist: song.artist,
    image: song.image,
    duration: song.duration
  };
}