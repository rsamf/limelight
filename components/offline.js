import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native'
import { Icon } from 'react-native-elements';
import globals from '../util';

export default class Offline extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style={globals.style.center}>
        <Icon name="alert-circle" type="feather" color={globals.sWhite} containerStyle={style.alertIcon}/>
        <Text style={style.text}>Limelight requires Internet connectivity.</Text>
        <Text style={style.text}>Check your connection and try again.</Text>
        <TouchableOpacity style={style.retryButton} onPress={()=>this.props.retry()}>
          <Text style={style.retryText}>Tap to Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const style = StyleSheet.create({
  alertIcon: {
    marginBottom: 10
  },
  retryButton: {
    backgroundColor: globals.sWhite,
    padding: 10,
    paddingTop: 5,
    paddingBottom: 5,
    marginTop: 25
  },
  retryText: {
    ...globals.style.text,
    color: globals.sBlack
  },
  text: {
    ...globals.style.text,
    marginTop: 5,
    marginLeft: 20,
    marginRight: 20,
    textAlign: "center"
  }
});