import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, Linking } from 'react-native';
import { Icon } from 'react-native-elements';
import QRCode from 'react-native-qrcode';
import globals from '../helpers';

export default class PlaylistOptions extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      editingTitle: null,
      editingCode: null
    };
  }

  submitEditingTitle() {
    this.props.updatePlaylist({ name: this.state.editingTitle });
    this.props.close();
  }

  submitEditingCode() {
    this.props.updatePlaylist({ code: this.state.editingCode });
    this.props.close();
  }

  TextInput = globals.createTextInput(
    (editingCode)=>this.setState({ editingCode }), 
    ()=>this.submitEditingCode(),
    ()=>this.setState({editingCode: null })
  )

  goToPlaylist() {
    const url = `https://open.spotify.com/user/${this.props.playlist.ownerId}/playlist/${globals.getPlaylistId(this.props.playlist.id)}`;
    Linking.canOpenURL(url).then(supported => {
      if (!supported) {
        Alert.alert("Could not open the link to the playlist!");
      } else {
        Linking.openURL(url);
      }
    });
  }

  render() {
    return (
      <View style={style.view}>
        <Text style={style.name}>{this.props.playlist.name}</Text>
        {
          this.state.editingCode !== null ?
          <this.TextInput/> :
          <TouchableOpacity style={style.code} onPress={()=>this.setState({editingCode:this.props.playlist.name})}>
            <Text style={style.codeText}>{this.props.playlist.code || "Create a Code for People to Join"}</Text>
            <Icon
              iconStyle={style.codeIcon}
              type="entypo"
              name="edit"
              color={globals.sWhite}
              size={18}
            />
          </TouchableOpacity>
        }
        <View style={style.qr}>
          <QRCode value={this.props.playlist.id} size={256}/>
        </View>
        <TouchableOpacity style={style.goToSpotify} onPress={()=>this.goToPlaylist()}>
          <Text style={globals.style.text}>Visit in Spotify</Text>
          <Icon 
            name="spotify" 
            type="entypo" 
            color={globals.sWhite}
            size={18}
            containerStyle={style.spotifyIcon}
          />
        </TouchableOpacity>
      </View>
    );
  }
}

const style = StyleSheet.create({
  view: {
    flex: 1,
    marginLeft: 40,
    marginRight: 40,
    alignItems: 'center',
    justifyContent: 'center'
  },
  playlistInfo: {
    marginBottom: 20
  },
  name: {
    ...globals.style.text
  },
  code: {
    marginTop: 13,
    flexDirection: 'row'
  },
  codeEdit: {
    flexDirection: 'row'
  },
  codeIcon: {
    marginLeft: 40
  },
  codeText: {
    ...globals.style.text,
  },
  qr: {
    marginTop: 30
  },
  goToSpotify: {
    marginTop: 20,
    borderWidth: 1,
    borderColor: globals.sWhite,
    flexDirection: 'row',
    padding: 10,
    paddingLeft: 30,
    paddingRight: 30,
    borderRadius: 40
  },
  spotifyIcon: {
    marginLeft: 10
  }
});