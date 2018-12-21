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
    const user = this.props.user;
    if(user) {
      const image = user.images[0];
      return (
        <View style={style.view}>
          <View style={style.item}>
            {
              image && image.url ?
              <Avatar 
                style={style.innerItem}
                large rounded
                source={{uri: image.url}}
              /> :
              <Icon size={50} type="feather" name="user" color={globals.sWhite} underlayColor={globals.sBlack}/>
            }
            <Text style={style.name}>{user.display_name}</Text>
          </View>
          <Button 
            style={style.item} 
            onPress={()=>{Spotify.logout();this.props.close();}}
            title="Logout"
            backgroundColor={globals.darkGrey}
            borderRadius={20}
          />
        </View>  
      );
    } else {
      return (
        <View style={style.view}>
          <Text>Not logged in</Text>
        </View>  
      );
    }
  }
}

const itemStyle = {
  margin: 20,
  flexDirection: 'row',
  alignItems: 'center'
};

const style = StyleSheet.create({
  view: {
    ...globals.style.center,
    flex: 1
  },
  item: itemStyle,
  innerItem: {
    margin: 10
  },
  name: {
    ...itemStyle,
    ...globals.style.text,
  }
});