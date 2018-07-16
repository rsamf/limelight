import React from 'react';
import { View, Text } from 'react-native';
import globals from './index';
const style = globals.style;

export default class Home extends React.Component {
  constructor(){
    super();
  }

  render(){
    return (
      <View style={style.view}>
        <Text style={style.text}>You are at Home</Text>
      </View>
    );
  }
}