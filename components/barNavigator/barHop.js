import React from 'react';
import { View, StyleSheet } from 'react-native';
import globals from '../helpers';
import { Button } from 'react-native-elements';

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
      qrInputActive: false,
    };
  }

  openHostBlur() {
    this.props.screenProps.setOpenedBlur(1, { 
      navigation: this.props.navigation
    });
  }

  openJoinBlur(){
    this.props.screenProps.setOpenedBlur(4, { 
      navigation: this.props.navigation
    });
  }

  render(){
    return (
      <View style={{flex: 1}}>
        <View style={{...globals.style.view, ...style.barHop,...globals.style.fullscreen}}>
          <Button style={globals.style.button} large raised backgroundColor={globals.sGrey} 
          title="Join with QR Code" rightIcon={qrIcon} textStyle={globals.style.text}/>

          <Button style={globals.style.button} large raised backgroundColor={globals.sGrey} 
          title="Join with ID" rightIcon={codeIcon} textStyle={globals.style.text} onPress={()=>this.openJoinBlur()}>
          </Button>

          <Button style={globals.style.button} large raised backgroundColor={globals.sGreen} 
          title="Host Playlist" rightIcon={hostIcon} textStyle={globals.style.text}
          onPress={()=>this.openHostBlur()}/>
        </View>
      </View>
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