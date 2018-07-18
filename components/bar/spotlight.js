import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Icon } from 'react-native-elements';
import globals from '..';

export default class extends React.Component {
  constructor(props){
    super(props);

  }
  render(){
    const song = this.props.children;
    return (
      <View style={style.view}>
        <Text style={style.song}>{song.artist} - {song.name}</Text>
        <View style={style.control}>
          <Icon iconStyle={style.controlItem} color={globals.sWhite} name="step-backward" type="font-awesome"></Icon>
          <Icon iconStyle={style.controlItem} color={globals.sWhite} name="play" type="font-awesome"></Icon>
          <Icon iconStyle={style.controlItem} color={globals.sWhite} name="step-forward" type="font-awesome"></Icon>
        </View>
      </View>
    );
  }
}

const style = StyleSheet.create({
  view: {
    padding: 20,
    backgroundColor: globals.sBlack,
    borderBottomWidth: 0.5,
    borderBottomColor: globals.sGrey
  },
  song: {
    fontSize: 16,
    color: globals.sWhite
  },
  control: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10
  },
  controlItem: {
    marginRight: 20,
    marginLeft: 20
  }
});