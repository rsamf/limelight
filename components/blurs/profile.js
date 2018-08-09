import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity} from 'react-native';
import { Icon, Avatar, Button } from 'react-native-elements';
import { BlurView } from 'react-native-blur';
import Spotify from 'rn-spotify-sdk';
import globals from '../helpers';

export default class Profile extends React.Component {
  constructor(props) {
    super(props);
  }

  render(){
    let user = this.props.user;
    return (
      <View style={globals.style.fullscreen}>
        <BlurView style={globals.style.fullscreen} viewRef={this.props.viewRef} blurType="dark" blurAmount={3}/>
        <View style={style.view}>
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
  cancel: {
    position: 'absolute',
    top: 20,
    left: 20
  },
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
  title: {
    marginBottom: 40
  },
  delete: {
    marginTop: 40
  }
});