import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Avatar, Button } from 'react-native-elements';
import Spotify from 'rn-spotify-sdk';
import globals from '../helpers';

export default class Profile extends React.Component {
  constructor(props) {
    super(props);
  }


  render(){
    return (
      <View style={style.view}>

      </View>
    );
  }

  renderSelected() {
    const user = this.props.user;
    return (
      user ?
      <View>
        <View style={style.item}>
          <Avatar style={style.innerItem}
            large rounded
            source={{uri: user.images[0].url}}
          />
          <Text style={{...globals.style.text, ...style.innerItem}}>{user.display_name}</Text>
        </View>
        <Button style={style.item} onPress={()=>{Spotify.logout();this.close();}} title="Logout"/>
      </View>  
      :
      <View>
        <Text>Not logged in</Text>
      </View>    
    );
  }
}

const style = StyleSheet.create({
  view: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1
  },
  item: {
    margin: 20,
    flexDirection: 'row',
    alignItems: 'center'
  },
  innerItem: {
    margin: 10
  },
  buttonContainer: {
    backgroundColor: 'rgba(33,33,33,.3)',
    height: 50
  },
  text: {
    color: globals.sWhite,
  },
  button: {
    padding: 10
  }
});