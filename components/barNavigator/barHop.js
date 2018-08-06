import React from 'react';
import { View, TextInput, StyleSheet, findNodeHandle } from 'react-native';
import globals from '../helpers';
import { Button, Icon } from 'react-native-elements';
import GetPlaylist from '../../GQL/queries/GetPlaylist';

const qrIcon={
  name: "qrcode",
  type: 'font-awesome'
};
const codeIcon = {
  name: "keyboard-o",
  type: "font-awesome"
};
const hostIcon = {
  name: "spotify",
  type: "font-awesome"
};

export default class BarHop extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      // QR INPUT STATE
      qrInputActive: false,
      // MANUAL INPUT STATE
      manualInputActive: false,
      input: "",
      failure: false,
    };
  }

  submitJoin() {
    globals.client.query({ 
      query: GetPlaylist,
      variables: {
        id: this.state.input
      }
    }).then(({data : {getPlaylist}}) => {
      console.warn(getPlaylist);
      if(getPlaylist) {
        this.setState({
          failure: false,
          manualInputActive: false
        });
        this.props.screenProps.localPlaylists.add(getPlaylist.id, () => {
          this.props.navigation.navigate('BarList');
        });
      } else {
        this.setState({
          failure: true
        });
      }
    }).catch(err => {
      this.setState({
        failure: true
      });
    });
  }

  setOverlay() {
    this.props.screenProps.setOpenedBlur(1, { 
      navigation: this.props.navigation
    });
  }

  render(){
    return (
      <View style={{flex: 1}}>
        <View style={{...globals.style.view, ...style.barHop,...globals.style.fullscreen}}>
          <Button style={globals.style.button} large raised backgroundColor={globals.sGrey} 
          title="Join with QR Code" rightIcon={qrIcon} textStyle={globals.style.text}/>
          {this.renderManualInput()}
          <Button style={globals.style.button} large raised backgroundColor={globals.sGreen} 
          title="Host Playlist" rightIcon={hostIcon} textStyle={globals.style.text}
          onPress={()=>this.setOverlay(true)}/>
        </View>
      </View>
    );
  }

  renderManualInput() {
    if(this.state.manualInputActive) {
      return (
        <View style={style.manualInput}>
          <TextInput style={this.state.failure ? globals.style.textInputFailed : globals.style.textInput} placeholder="Playlist Id" 
          onChangeText={(input) => this.setState({input})} onSubmitEditing={()=>this.submitJoin()}>
          </TextInput>
          <Icon raised backgroundColor={globals.sWhite} name="check" type="evilicons" onPress={()=>this.submitJoin()}/>
        </View>
      );
    }
    return (
      <Button style={globals.style.button} large raised backgroundColor={globals.sGrey} 
      title="Join with ID" rightIcon={codeIcon} textStyle={globals.style.text} onPress={()=>this.setState({manualInputActive:true})}>
      </Button>
    );
  }

  renderQR(){
    return <View/>
  }
}

const style = StyleSheet.create({
  manualInput: {
    flexDirection: 'row'
  },
  barHop: {
    justifyContent: 'center',
    alignItems: 'center',
  }
});