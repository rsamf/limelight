import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import globals from '../helpers';
import { Button } from 'react-native-elements';
import QRCodeScanner from 'react-native-qrcode-scanner';

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

  openQRScanner(){
    this.setState({
      qrInputActive: true
    });
  }

  render(){
    return (
      <View style={{flex: 1}}>
        <View style={{...globals.style.view, ...style.barHop,...globals.style.fullscreen}}>
          {
            this.state.qrInputActive ?
            this.renderQRScanner() :
            <Button style={globals.style.button} large raised backgroundColor={globals.sGrey} 
            title="Join with QR Code" rightIcon={qrIcon} textStyle={globals.style.text} onPress={()=>this.openQRScanner()}/>
          }
        
          <Button style={globals.style.button} large raised backgroundColor={globals.sGrey} 
          title="Join with ID" rightIcon={codeIcon} textStyle={globals.style.text} onPress={()=>this.openJoinBlur()}/>

          <Button style={globals.style.button} large raised backgroundColor={globals.sGreen} 
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
      console.warn(data);
      this.props.screenProps.localPlaylists.add(data, (list) => {
        this.props.navigation.navigate('BarList');
        console.warn(list);
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
  barHop: {
    justifyContent: 'center',
    alignItems: 'center',
  }
});