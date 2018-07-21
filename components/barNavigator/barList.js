import React from 'react';
import { View, FlatList, StyleSheet, Text, Image, TouchableOpacity } from 'react-native';
import { Icon } from 'react-native-elements';
import globals from '..';
import Signin from '../signin';

class BarList extends React.Component {
  bars = [{
    name: "Amanda",
    live: true,
    img: "https://s3.amazonaws.com/uifaces/faces/twitter/ladylexy/128.jpg"
  }, {
    name: "Sammy",
    live: false,
    img: "https://s3.amazonaws.com/uifaces/faces/twitter/ladylexy/128.jpg"
  }, {
    name: "Alex",
    live: false,
    img: "https://s3.amazonaws.com/uifaces/faces/twitter/ladylexy/128.jpg"
  }, {
    name: "John",
    live: false,
    img: "https://s3.amazonaws.com/uifaces/faces/twitter/ladylexy/128.jpg"
  }, {
    name: "El",
    live: false,
    img: "https://s3.amazonaws.com/uifaces/faces/twitter/ladylexy/128.jpg"
  }, {
    name: "Thomas",
    live: false,
    img: "https://s3.amazonaws.com/uifaces/faces/twitter/ladylexy/128.jpg"
  }, {
    name: "Susan",
    live: false,
    img: "https://s3.amazonaws.com/uifaces/faces/twitter/ladylexy/128.jpg"
  }, {
    name: "Michael",
    live: false,
    img: "https://s3.amazonaws.com/uifaces/faces/twitter/ladylexy/128.jpg"
  }, {
    name: "Paul",
    live: false,
    img: "https://s3.amazonaws.com/uifaces/faces/twitter/ladylexy/128.jpg"
  }, {
    name: "Enza",
    live: false,
    img: "https://s3.amazonaws.com/uifaces/faces/twitter/ladylexy/128.jpg"
  }, {
    name: "Moe",
    live: false,
    img: "https://s3.amazonaws.com/uifaces/faces/twitter/ladylexy/128.jpg"
  }, {
    name: "Sally",
    live: false,
    img: "https://s3.amazonaws.com/uifaces/faces/twitter/ladylexy/128.jpg"
  }];

  constructor(props){
    super(props);

    this.state = {
      bars: this.bars.sort((a, b) => a.live < b.live)
    };
  }
  navigateTo = (bar) => {
    this.props.navigation.navigate('Bar');
  }
  eachBar(bar){
    return (
      <TouchableOpacity style={style.bar} onPress={()=>this.navigateTo(bar)}>
        <Image style={style.barImage} source={{uri:bar.img}}></Image>
        <Text style={{...style.barText, color: bar.live ? globals.sSand : globals.sGrey}}>{bar.name}</Text>
        {
          bar.live ?
          <View style={{flexDirection: 'row'}}>
            <Icon size={14} color={globals.sGreen} name="sound" type="entypo"></Icon>
            <Icon size={14} color={globals.sGreen} name="chevron-thin-right" type="entypo"></Icon>
          </View> :
          <View>
            <Icon size={14} color={globals.sGrey} name="sound-mute" type="entypo"></Icon>
          </View>
        }   
      </TouchableOpacity>
    );
  }
  render(){
    return (
      <View style={globals.style.view}>
        <Signin></Signin>
        <FlatList style={{marginTop: 14}} data={this.state.bars} keyExtractor={(item, index)=>String(index)} renderItem={({item})=>this.eachBar(item)}>
        </FlatList>
      </View>
    );
  }
}

const style = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 0.5,
    borderBottomColor: globals.sGrey,
    height: 100,
    marginLeft: 40,
    marginRight: 40,
    paddingLeft: 20,
    paddingRight: 20
  },
  barText: {
    fontSize: 18
  },
  barImage: {
    width: 50,
    height: 50
  }
});

export default BarList;