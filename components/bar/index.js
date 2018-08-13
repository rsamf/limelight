import React from 'react';
import { View, Text } from 'react-native';
import globals from '../helpers';
import Header from './header';
import Spotlight from './spotlight';
import Songs from './songs';
import createPlaylist from '../../GQL/playlist';
import StoredVotes from '../helpers/StoredVotes';
const localVotes = new StoredVotes();

class PlaylistComponent extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      subscribed: false,
      mergedVotes: false,
      songs: []
    };
  }

  componentDidUpdate() {
    if(this.props.subscribeToSongChanges && !this.state.subscribed) {
      console.warn("Subscribing");
      this.props.subscribeToSongChanges();
      this.setState({
        subscribed: true
      });
    }
  }

  componentWillReceiveProps(newProps) {
    if(newProps.songs) {
      this.mergeSongsWithVotes(newProps.songs);
    }
  }

  async mergeSongsWithVotes (songs) {
    let votedSongs = await this.props.localVotes.get();
    if(!votedSongs) {
      votedSongs = await this.props.localVotes.set(songs);
    }
    this.setState({
      mergedVotes: true,
      songs: songs.map(s => {
        let currentVotedState = votedSongs[s.id];
        return {
          ...s,
          voted: currentVotedState ? currentVotedState.voted : false
        };
      })
    });
  }

  voteSong(i) {
    this.props.localVotes.vote(this.state.songs[i].id, this.state.songs[i].state, (songs, notAlreadyVoted) => {
      if(notAlreadyVoted) {
        this.props.voteSong(i);
      }
    });
  }

  render() {
    if(!this.props.loading && this.props.playlist && this.props.songs && this.state.mergedVotes) {
      let user = this.props.screenProps.user;
      let owned = user && user.id === this.props.playlist.ownerURI;
      return (
        <View style={{flex:1}}>
          <Header
          owned={owned}
          navigation={this.props.navigation}
          updatePlaylist={(p)=>this.props.updatePlaylist(p)}
          deletePlaylist={()=>this.props.deletePlaylist()}
          deleteSongs={()=>this.props.deleteSongs()}
          setOpenedBlur={(i, props)=>this.props.screenProps.setOpenedBlur(i,props)}
          >
            {this.props.playlist}
          </Header>
          <Spotlight next={()=>this.props.nextSong()} owned={owned}>
            {this.state.songs[0]}
          </Spotlight>
          <Songs addSong={(song)=>this.props.addSong(song)} vote={(song, i)=>this.voteSong(i)} {...this.props.screenProps}>
            {this.state.songs.slice(1)}
          </Songs>
        </View>
      );
    }
    if(this.props.error) {
      return (
        <View>
          <Text style={globals.style.text}>{JSON.stringify(this.props.error)}</Text>
        </View>
      );
    }
    return <globals.Loader/>;
  }
}

const Playlist = createPlaylist(PlaylistComponent);

export default class Bar extends React.Component {
  constructor(props){
    super(props);

    this.state = {
      localVotes: null
    };
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


  componentWillMount() {
    this.playlistId = this.props.navigation.state.params.id;
    this.getLocalVotesInterface();
  }

  render(){
    return (
      <View style={globals.style.view}>
        <Playlist screenProps={this.props.screenProps} navigation={this.props.navigation} localVotes={this.state.localVotes}>
          {this.playlistId}
        </Playlist>
      </View>
    );
  }
}