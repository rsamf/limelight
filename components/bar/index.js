import React from 'react';
import { View, Text } from 'react-native';
import globals from '../helpers';
import Header from '../helpers/header';
import Spotlight from './spotlight';
import Songs from './songs';
import createPlaylist from '../../GQL/playlist';

const style = globals.style;

class PlaylistComponent extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      subscribed: false
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

  render() {
    if(!this.props.loading && this.props.playlist && this.props.songs) {
      return (
        <View>
          <Spotlight next={()=>this.props.nextSong()} owned={true}>
            {this.props.songs[0]}
          </Spotlight>
          <Songs vote={(song, i)=>this.props.voteSong(i)}>
            {this.props.songs.slice(1)}
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
  }

  render(){
    const playlist = this.props.navigation.state.params;
    return (
      <View style={style.view}>
        <Header type="back" navigation={this.props.navigation}>
          {playlist.playlistName}
        </Header>
        <Playlist>
          {playlist.id}
        </Playlist>
      </View>
    );
  }
}
