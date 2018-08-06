import React from 'react';
import { View, Text } from 'react-native';
import { Icon } from 'react-native-elements';
import globals from '../helpers';
import Header from './header';
import Spotlight from './spotlight';
import Songs from './songs';
import createPlaylist from '../../GQL/playlist';

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
        <View style={{flex:1}}>
          <Spotlight next={()=>this.props.nextSong()} owned={true}>
            {this.props.songs[0]}
          </Spotlight>
          <Songs addSong={(song)=>this.props.addSong(song)} vote={(song, i)=>this.props.voteSong(i)} {...this.props.screenProps}>
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
      <View style={globals.style.view}>
        <Header navigation={this.props.navigation} setOpenedBlur={(i, props)=>this.props.screenProps.setOpenedBlur(i,props)}>
          {playlist}
        </Header>
        <Playlist screenProps={this.props.screenProps}>
          {playlist.id}
        </Playlist>
      </View>
    );
  }
}