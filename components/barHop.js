import React from 'react';
import { View, Text } from 'react-native';
import globals from './index';
import { Button } from 'react-native-elements';
const style = globals.style;
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
  constructor(){
    super();
  }

  render(){
    return (
      <View style={{...style.view, ...style.barHop}}>
        <Button style={style.button} large raised backgroundColor={globals.sGrey} 
        title="Scan QR Code" rightIcon={qrIcon} textStyle={style.text}>
        </Button>
        <Button style={style.button} large raised backgroundColor={globals.sGrey} 
        title="Enter Code" rightIcon={codeIcon} textStyle={style.text}>
        </Button>
        <Button style={style.button} large raised backgroundColor={globals.sGreen} 
        title="Host Playlist" rightIcon={hostIcon} textStyle={style.text}>
        </Button>
      </View>
    );
  }
}