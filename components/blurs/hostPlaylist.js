import React from 'react';
import { View, FlatList, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Button } from 'react-native-elements';
import { BlurView } from 'react-native-blur';
import Spotify from 'rn-spotify-sdk';
import globals from '../helpers';
import AddPlaylistMutation from '../../GQL/mutations/AddPlaylist';
import CreateSongsMutation from '../../GQL/mutations/CreateSongs';

export default class HostPlaylist extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      playlists: []
    };
  }

  componentDidMount() {

  }



  render() {
    return (
      <View style={globals.style.fullscreen}>
        <BlurView style={globals.style.fullscreen} viewRef={this.props.viewRef} blurType="dark" blurAmount={3}/>
        <View style={style.overlayView}>
          <View>
            
          </View>
        </View>
        <View style={style.cancelButton}>
          <Button title="Cancel" onPress={()=>this.props.close()}/>
        </View>
      </View>
    );
  }

  
}

const style = StyleSheet.create({
  overlayView: {
    alignItems: 'center',
    flex: 1
  },
  cancelButton: {
    position: 'absolute',
    bottom: 20,
    left: 20
  },

  playlist: {
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 20,
    borderColor: globals.sGrey,
    borderBottomWidth: 1
  },
  playlistText: {
    color: globals.sWhite,
    fontSize: 24,
    fontFamily: 'Futura',
  },
  label: {
    marginTop: 40,
    marginBottom: 20,
    fontFamily: 'Futura',
    color: globals.sWhite
  }
});