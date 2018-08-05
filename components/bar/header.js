import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Icon } from 'react-native-elements';
import globals from '../helpers';

export default class extends React.Component {
  constructor(props){
    super(props);
  }

  render(){
    return (
      <View style={style.view}>
        <Icon name="ios-arrow-back" type="ionicon" color={globals.sBlack} underlayColor={globals.sSand}
        onPress={()=>this.props.navigation.goBack()} iconStyle={style.icon}/>
        <View style={style.titleContainer}>
          <Text style={style.title}>{this.props.children}</Text>
        </View>
        {/* <Icon name="md-more" type="iconicons" color={globals.sBlack} underlayColor={globals.sSand}
        onPress={()=>}/> */}
      </View>
    );
  }
}

const style = StyleSheet.create({
  view: {
    backgroundColor: globals.sSand,
    height: 80,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 20
  },
  icon: {
    marginLeft: 20
  },
  title: {
    color: globals.sBlack
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    flex: 1,
    marginRight: 29
  }
});