import React from 'react';
import { View, Text } from 'react-native';
import { List, ListItem, Icon } from 'react-native-elements';
import globals from './index';
const style = globals.style;


export default class Home extends React.Component {
  bars = [{
    name: "Sammy",
    live: false,
    img: "https://s3.amazonaws.com/uifaces/faces/twitter/ladylexy/128.jpg"
  }, {
    name: "Amanda",
    live: true,
    img: "https://s3.amazonaws.com/uifaces/faces/twitter/ladylexy/128.jpg"
  }, {
    name: "Alex",
    live: false,
    img: "https://s3.amazonaws.com/uifaces/faces/twitter/ladylexy/128.jpg"
  }];

  constructor(props){
    super(props);

    this.state = {
      bars: this.bars.sort((a, b) => a.live < b.live)
    };
  }

  render(){
    return (
      <View style={style.view}>
        <List>
        {
          this.state.bars.map((l, i) => (
            <ListItem style={{backgroundColor: globals.sGrey}} roundAvatar key={i} 
            title={l.name} avatar={{uri:l.img}} subtitle={
              <View>
                <Icon raised size={14} color={l.live ? globals.sGreen : globals.sGrey} name={l.live ? "sound" : "sound-mute"} type="entypo"></Icon>
              </View>
            }/>
          ))
        }
        </List>
      </View>
    );
  }
}