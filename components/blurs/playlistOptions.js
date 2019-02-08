import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Icon } from 'react-native-elements';
import QRCode from 'react-native-qrcode';
import globals from '../../util';

export default class PlaylistOptions extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      editingCode: null
    };
  }

  submitEditingCode() {
    if(!this.props.isOnline || !this.props.isOwned) return;
    this.props.updatePlaylist({ code: this.state.editingCode });
    this.props.close();
  }

  TextInput = globals.createTextInput(
    (editingCode)=>this.setState({ editingCode }), 
    ()=>this.submitEditingCode(),
    ()=>this.setState({editingCode: null })
  )

  renderCode() {
    if(this.props.isOwned) {
      if(this.state.editingCode !== null) {
        return <this.TextInput/>;
      }
      return (
        <TouchableOpacity style={style.code} onPress={()=>this.setState({editingCode:this.props.playlist.name})}>
          <Text ellipsizeMode="tail" numberOfLines={1}  style={style.codeText}>{this.props.playlist.code || "Insert Invitational Code"}</Text>
          <Icon
            iconStyle={style.codeIcon}
            type="entypo"
            name="edit"
            color={globals.sWhite}
            size={18}
          />
        </TouchableOpacity>
      );
    }
    return <Text ellipsizeMode="tail" numberOfLines={1} style={style.codeText}>{this.props.playlist.code || "Insert Invitational Code"}</Text>;
  }

  render() {
    return (
      <View style={style.view}>
        <Text style={globals.style.text}>{this.props.playlist.name}</Text>
        {this.renderCode()}
        <View style={style.qr}>
          <QRCode value={this.props.playlist.id} size={256}/>
        </View>
        <TouchableOpacity style={style.goToSpotify} onPress={()=>globals.visitPlaylist(this.props.playlist.ownerId, globals.getPlaylistId(this.props.playlist.id))}>
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
    backgroundColor: globals.sWhite,
    padding: 1,
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