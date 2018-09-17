import React from 'react';
import { View, StyleSheet, FlatList, Text, TextInput, TouchableOpacity, Image } from 'react-native';
import { Button } from 'react-native-elements';
import { BlurView } from 'react-native-blur';
import GetPlaylistsByCode from '../../GQL/queries/GetPlaylistsByCode';
import globals from '../helpers';

export default class Profile extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      input: "",
      searchedPlaylists: []
    };
  }



  render(){
    return (
      <View style={globals.style.fullscreen}>
        <BlurView style={globals.style.fullscreen} viewRef={this.props.viewRef} blurType="dark" blurAmount={3}/>
        <View style={style.view}>

          <View style={style.cancel}>
            <Button title="Cancel" onPress={()=>this.props.close()}></Button>
          </View>
        </View>
      </View>
    );
  }
}

const style = StyleSheet.create({
  cancel: {
    position: 'absolute',
    bottom: 20,
    left: 20
  },
  view: {
    ...globals.style.fullscreen,
    paddingTop: 50
  },

  inputContainer: {
    flexDirection: 'row',
    justifyContent: 'center'
  }
});