import React from 'react';
import { View, Text } from 'react-native';
import globals from '../helpers';
import Header from '../header';
import Spotlight from './spotlight';
import Songs from './songs';
import createPlaylist from '../../GQL/playlist';
import StoredVotes from '../helpers/StoredVotes';
import network from './network';
const localVotes = new StoredVotes();

class PlaylistComponent extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      subscribed: false,
      mergedVotes: false,
      loading: true,
      songs: []
    };
  }

  componentWillReceiveProps(props) {
    let loading = props.songsLoading || props.playlistLoading;
    if(this.state.loading && props.isOwned && !loading && !props.error) {
      if(!props.songs) {
        console.warn("Couldn't find songs, initialzing...");
        network.initialize(props.spotify, props.user, (data) => {
          this.setState({
            loading: false,
            songs: data
          });
        });
      } else {
        this.get(props);
      }
    }
  }

  get(props) {
    console.warn("Spotify", props.spotify.tracks.items);
    console.warn("Songs", props.songs);
    network.rebaseSongsFromSpotify(props.playlist.id, props.spotify.tracks.items, props.songs, (data) => {
      this.setState({
        loading: false,
        songs: data
      });
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

  // componentWillReceiveProps(newProps) {
  //   if(newProps.songs) {
  //     this.mergeSongsWithVotes(newProps.songs);
  //   }
  // }

  // async mergeSongsWithVotes (songs) {
  //   let votedSongs = await this.props.localVotes.set(songs);
  //   let newSongs = songs.map(s => {
  //     let currentVotedState = votedSongs[s.id];
  //     return {
  //       ...s,
  //       voted: (currentVotedState !== undefined) ? currentVotedState.voted : false
  //     };
  //   });
  //   this.setState({
  //     mergedVotes: true,
  //     songs: newSongs
  //   });
  // }

  // voteSong(song) {
  //   this.props.localVotes.vote(song.id, song.state, (songs, notAlreadyVoted) => {
  //     if(notAlreadyVoted) {
  //       this.props.voteSong(song.id);
  //     }
  //   });
  // }

  render() {
    return (
      <View style={globals.style.view}>
        <Header
          {...this.props}
          navigation={this.props.navigation}
          playlist={this.props.playlist}
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
              {this.state.songs[0]}
            </Spotlight>

            <Songs
              {...this.props}
              owned={this.props.isOwned} 
              addSong={(song)=>this.props.addSong(song)}
              deleteSong={(songId)=>this.props.deleteSong(songId)}
              vote={(song)=>this.voteSong(song)}
            >
              {this.state.songs.slice(1)}
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
      localVotes: null,
      spotify: null,
      loading: true,
      isOwned: (this.props.screenProps.user && this.props.screenProps.user.id) === globals.getUserId(this.id)
    };
  }

  componentDidMount() {
    this.getLocalVotesInterface();
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

  getLocalVotesInterface() {
    this.setState({
      localVotes: {
        vote: (songId, state, callback)=>{
          localVotes.tryVote(this.playlistId, songId, state, callback);
        },
        get: () => {
          return new Promise(resolve => {
            localVotes.get(this.playlistId, playlist => {
              resolve(playlist);
            });
          });
        },
        set: (songs) => {
          return new Promise(resolve => {
            localVotes.setPlaylistToSongs(this.playlistId, songs, playlist => {
              resolve(playlist);
            });
          });
        }
      }  
    });
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
            localVotes={this.state.localVotes}
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