import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Button, Avatar, Icon } from 'react-native-elements';
import Spotify from 'rn-spotify-sdk';
import globals from '.';

export default class extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    let user = this.props.user;
    return (
      <View style={style.view}>
        <View style={style.center}>
          <View style={style.item}>
            <Avatar style={style.innerItem}
              large rounded
              source={{uri: user.images[0].url}}
            />
            <Text style={{...globals.style.text, ...style.innerItem}}>{user.display_name}</Text>
          </View>
          <Button style={style.item} onPress={()=>{Spotify.logout();this.props.close();}} title="Logout"/>
        </View>
        <TouchableOpacity style={style.cancel} onPress={()=>this.props.close()}>
          <Icon size={30} color={globals.sWhite} name="x" type="feather"/>
        </TouchableOpacity>
      </View>
    );
  }
}

const style = StyleSheet.create({
  view: {
    flex: 1
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1
  },
  item: {
    margin: 20,
    flexDirection: 'row'
  },
  innerItem: {
    margin: 20
  },
  cancel: {
    position: 'absolute',
    top: 20,
    left: 20
  }
});