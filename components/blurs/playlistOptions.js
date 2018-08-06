import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Icon, Button } from 'react-native-elements';
import { BlurView } from 'react-native-blur';
import QRCode from 'react-native-qrcode';
import globals from '../helpers';
const trashIcon = {
  name: 'delete',
  size: 15,
  color: 'white'
};

export default class PlaylistOptions extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      editingTitle: null
    };
  }

  submitEditingTitle() {
    console.warn("submitting", this.state.editingTitle);
  }

  deletePlaylist() {
    console.warn("deleting playist");
  }

  render() {
    return (
      <View style={globals.style.fullscreen}>
        <BlurView style={globals.style.fullscreen} viewRef={this.props.viewRef} blurType="light" blurAmount={10}/>
        <View style={style.view}>
          <View style={style.title}>
            {
              this.state.editingTitle !== null ?
              <TextInput onChangeText={(input)=>this.setState({editingTitle:input})} defaultValue={this.props.playlist.playlistName}
              blurOnSubmit={true} enablesReturnKeyAutomatically={true} onSubmitEditing={()=>this.submitEditingTitle()}
              style={globals.style.textInput} onBlur={()=>this.setState({editingTitle:null})}/> :
              <TouchableOpacity onPress={()=>this.setState({editingTitle:this.props.playlist.playlistName})}>
                <Text style={globals.style.text}>{this.props.playlist.playlistName}</Text>
              </TouchableOpacity>
            }
          </View>
          <QRCode value={this.props.playlist.id} size={256}/>
          <Button buttonStyle={style.delete} icon={trashIcon} title='Delete' onPress={()=>this.deletePlaylist()}/>
          <TouchableOpacity style={style.cancel} onPress={()=>this.props.close()}>
            <Icon size={30} color={globals.sBlack} name="x" type="feather"/>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const style = StyleSheet.create({
  cancel: {
    position: 'absolute',
    top: 20,
    left: 20
  },
  view: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1
  },
  title: {
    marginBottom: 40
  },
  delete: {
    marginTop: 40
  }
});