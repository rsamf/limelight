import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Icon } from 'react-native-elements';
import globals from '.';

export default class extends React.Component {
  constructor(props){
    super(props);
  }
  getHeaderContent(){
    if(this.props.type === "back") {
      return (
        <Icon name="ios-arrow-back" type="ionicon" color={globals.sBlack} 
        onPress={()=>this.props.navigation.goBack()} iconStyle={style.icon}>
        </Icon>
      );
    } else {
      return this.props.children;
    }
  }
  render(){
    return (
      <View style={style.view}>
        {this.getHeaderContent()}
        <View style={style.titleContainer}>
          <Text style={style.title}>{this.props.children}</Text>
        </View>
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