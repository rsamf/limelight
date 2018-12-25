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

    this.state = {
      subscribed: false,
      loading: true,
      songs: null,
      playlist: null
    };
  }

  componentWillReceiveProps(props) {
    let loading = props.songsLoading || props.playlistLoading;
    if(this.state.loading && props.isOwned && !loading && !props.error) {
      if(!props.songs || !props.playlist) {
        console.warn("Couldn't find songs or playlist, initialzing...");
        this.init(props);
      } else {
        this.get(props);
      }
    }
  }

  init(props) {
    network.initialize(props.spotify, props.user, (songs, playlist) => {
      console.warn("init: from initialize (aws songs length):", songs.length);
      this.setReady(props.children, songs, playlist);
    });
  }

  get(props) {
    // console.warn("Spotify", props.spotify.tracks.items);
    // console.warn("Songs", props.songs);
    network.rebaseSongsFromSpotify(props.children, props.spotify.tracks.items, props.songs, (songs) => {
      console.warn("get: from initialize (aws songs length):", songs.length);
      this.setReady(props.children, songs, props.playlist);
    });
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

  // componentDidUpdate() {
  //   if(this.props.subscribeToSongChanges && !this.state.subscribed) {
  //     this.props.subscribeToSongChanges();
  //     this.setState({
  //       subscribed: true
  //     });
  //   }
  // }

  voteSong(index) {
    // this.props.localVotes.vote(song.id, song.state, (songs, notAlreadyVoted) => {
    //   if(notAlreadyVoted) {
    //     this.props.voteSong(song.id);
    //   }
    // });
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

  // getLocalVotesInterface() {
  //   this.setState({
  //     localVotes: {
  //       vote: (songId, state, callback)=>{
  //         localVotes.tryVote(this.playlistId, songId, state, callback);
  //       },
  //       get: () => {
  //         return new Promise(resolve => {
  //           localVotes.get(this.playlistId, playlist => {
  //             resolve(playlist);
  //           });
  //         });
  //       },
  //       set: (songs) => {
  //         return new Promise(resolve => {
  //           localVotes.setPlaylistToSongs(this.playlistId, songs, playlist => {
  //             resolve(playlist);
  //           });
  //         });
  //       }
  //     }  
  //   });
  // }

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