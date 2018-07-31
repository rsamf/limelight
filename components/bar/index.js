import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import globals from '../helpers';
import Header from '../helpers/header';
import Spotlight from './spotlight';
import Spotify from 'rn-spotify-sdk';
import { graphql, compose } from 'react-apollo';
import Songs from './songs';
import GetPlaylist from '../../GQL/queries/GetPlaylist';
import OnSongsChangedSubscription from '../../GQL/subscriptions/SongAdded';
import VoteSongMutation from '../../GQL/mutations/VoteSong';
import NextSongMutation from '../../GQL/mutations/NextSong';
const style = globals.style;

export default class Bar extends React.Component {
  constructor(props){
    super(props);

    this.playlist = this.props.navigation.state.params;
    this.state = {
      songs: []
    };
  }

  componentDidMount(){
    // this.setSongs();
  }

  setSongs(){
    // Spotify.sendRequest(`v1/users/${this.playlist.ownerURI}/playlists/${this.playlist.id}/tracks`, "GET", {}, false).then(({items}) => {
    //   this.setState({
    //     songs: this.sortSongs(items.map(({track}) => ({
    //       artist: track.artists[0].name,
    //       id: track.id,
    //       image: track.images && track.images[0],
    //       name: track.name,
    //       duration: track.duration_ms/1000,
    //       votes: Math.round(Math.random()*10),
    //       voted: false
    //     })))
    //   });
    // });
  }

  render(){
    const spotlight = this.state.songs[0];
    const songs = this.state.songs.slice(1);
    const Playlist = this.getPlaylist();
    return (
      <View style={style.view}>
        <Header type="back" navigation={this.props.navigation}>
          {this.playlist.playlistName + " by " + this.playlist.ownerName}
        </Header>
        <Playlist/>
      </View>
    );
  }

  getPlaylist = () => compose(
    graphql(GetPlaylist, {
      options: {
          fetchPolicy: 'cache-and-network',
          variables: {
            id: this.playlist.id
          }
      },
      props: ({data}) => ({
        playlist: {
          ...data.getPlaylist,
          songs: data.getPlaylist && globals.getSongsAsObjects(data.getPlaylist.songs)
        },
        loading: data.loading,
        error: data.error,
        subscribeToVotes: () => {
          data.subscribeToMore({
            document: OnSongsChangedSubscription,
            variables: { id: this.playlist.id },
            updateQuery: (prev, { subscriptionData: { data: { songAdded }}}) => ({
              ...prev,
              getPlaylist: {
                playlist: {
                  ...prev.getPlaylist.playlist,
                  songs: songAdded
                }
              }
            })
          });
        }
      })
  }))(Playlist);
}

class Playlist extends React.Component {
    
  componentDidMount() {
    this.props.subscribeToVotes();
  }

  next(){
    this.setState({
      songs: [...this.state.songs.slice(1), {
        ...this.state.songs[0],
        votes: 0,
        voted: false
      }]
    });
    return (this.state.songs[1] || this.state.songs[0]);
  }

  vote(song, i){
    // let index = -1;
    // this.state.songs.forEach((s, i) => {
    //   if(s.id === song.id) index = i;
    // });
    // let songs = this.state.songs;
    // if(!songs[index].voted && index > -1) {
    //   songs[index].votes++;
    //   songs[index].voted = true;
    //   this.setState({
    //     songs: this.sortSongs(songs)
    //   });
    // }
    globals.client.mutate({
      mutation: VoteSongMutation,
      variables: {
        id: this.props.playlist.id,
        index: i
      }
    }).then(({loading, data: {voteSong: { playlist }}})=>{
      console.warn(playlist);
    });
  }

  render() {
    if(!this.props.loading) {
      let songs = this.props.playlist.songs.slice(1);
      return (
        <View>
          <Spotlight next={()=>this.next()} owned={true}>
            {this.props.playlist.songs[0]}
          </Spotlight>
          <Songs vote={(song)=>this.vote(song)}>
            {songs}
          </Songs>
        </View>
      );
    }
    return <globals.Loader/>;
  }
}