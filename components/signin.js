import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import Shade from './shade';
import globals from '.';

export default class extends React.Component {

  constructor(props){
    super(props);

    this.state = {

    };
  }
  render(){
    return(
      <Shade>
        <View style={style.view}>
          <Text style={globals.style.text}>Hello</Text>
          <Text style={globals.style.text}>Hello</Text>
          <Text style={globals.style.text}>World</Text>
          <Text style={globals.style.text}>World</Text>
        </View>
      </Shade>
    );
  }
}

const style = StyleSheet.create({
  view: {
    justifyContent: 'center',
    alignItems: 'center'
  }
});