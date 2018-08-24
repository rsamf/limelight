import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import globals from '../helpers';
import { Button } from 'react-native-elements';
import QRCodeScanner from 'react-native-qrcode-scanner';
import Spotify from 'rn-spotify-sdk';

const qrIcon={
  name: "qrcode",
  type: 'font-awesome'
};
const codeIcon = {
  name: "keyboard-o",
  type: "font-awesome"
};
const hostIcon = {
  name: "music",
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

  openQRScanner(){
    this.setState({
      qrInputActive: true
    });
  }

  render(){
    return (
      <View style={globals.style.view}>
        <View style={style.barHopView}>
          {
            this.state.qrInputActive ?
            this.renderQRScanner() :
            <Button buttonStyle={style.button} backgroundColor={globals.sBlue} 
            title="Join with QR Code" rightIcon={qrIcon} textStyle={globals.style.text} onPress={()=>this.openQRScanner()}/>
          }
        
          <Button buttonStyle={style.button} backgroundColor={globals.sBlue} 
          title="Join with ID" rightIcon={codeIcon} textStyle={globals.style.text} onPress={()=>this.openJoinBlur()}/>

          <Button buttonStyle={style.button} backgroundColor={Spotify.isLoggedIn() ? globals.sGreen : globals.sGrey} 
          title="Host Playlist" rightIcon={hostIcon} textStyle={globals.style.text}
          onPress={()=>this.openHostBlur()}/>
        </View>
      </View>
    );
  }

  renderQRScanner(){
    const cancel = () => {
      this.setState({
        qrInputActive: false
      });
    }

    const success = ({data}) => {
      cancel();
      this.props.screenProps.localPlaylists.add(data, () => {
        this.props.navigation.navigate('BarList');
      });
    }

    return (
      <QRCodeScanner onRead={(data)=>success(data)}
      topContent={
        <TouchableOpacity onPress={()=>cancel()}>
          <Text style={globals.style.smallText}>Cancel</Text>
        </TouchableOpacity>
      }
      />
    );
  }
}

const style = StyleSheet.create({
  barHopView: {
    ...globals.style.view,
    ...globals.style.fullscreen,
    ...globals.style.center
  },
  button: {
    borderRadius: 5,
    borderWidth: 0,
    marginTop: 20
  }
});