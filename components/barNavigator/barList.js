import React from 'react';
import { View } from 'react-native';
import { List, ListItem, Icon } from 'react-native-elements';
import globals from '..';

const style = globals.style;


class BarList extends React.Component {
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

  render(){
    return (
      <View style={style.view}>
        <List>
        {
          this.state.bars.map((l, i) => (
            <ListItem style={{backgroundColor: globals.sGrey}} roundAvatar key={i} 
            title={l.name} avatar={{uri:l.img}} onPress={()=>this.props.navigation.navigate('Bar')} subtitle={
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


export default BarList;