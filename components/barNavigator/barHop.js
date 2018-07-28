import React from 'react';
import { View, TextInput, StyleSheet, Text, FlatList, Modal, TouchableOpacity } from 'react-native';
import globals from '../helpers';
import { Button, Icon } from 'react-native-elements';
import AddPlaylist from '../../GQL/mutations/AddPlaylist';
import GetPlaylist from '../../GQL/queries/GetPlaylist';
import Spotify from 'rn-spotify-sdk';
const _ = globals.requireSpotifyAuthorizationAndInjectUserDetails;
const { localPlaylists } = globals;

const qrIcon={
  name: "qrcode",
  type: 'font-awesome'
};
const codeIcon = {
  name: "keyboard-o",
  type: "font-awesome"
};
const hostIcon = {
  name: "spotify",
  type: "font-awesome"
};

export default class BarHop extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      input: "",
      qrInputActive: false,
      manualInputActive: false,
      hostInputActive: false,
      selectedPlaylist: -1,
      loading: false,
      failure: false,
      myPlaylists: []
    };
  }

  submitJoin() {
    globals.client.query({ 
      query: GetPlaylist,
      variables: {
        id: this.state.input
      }
    }).then(({data : {getPlaylist}}) => {
      console.warn(getPlaylist);
      if(getPlaylist) {
        this.setState({
          failure: false,
          manualInputActive: false
        });
        localPlaylists.push(getPlaylist.id, () => {
          this.props.navigation.navigate('BarList');
        });
      } else {
        this.setState({
          failure: true
        });
      }
    }).catch(err => {
      this.setState({
        failure: true
      });
    });
  }

  getPlaylists(){
    if(this.props.screenProps.user) {
      this.setState({
        hostInputActive: true
      });
      Spotify.sendRequest("v1/me/playlists", "GET", {}, true).then(({items}) => {
        this.setState({
          myPlaylists: items.filter(i => i.public)
        });
      });
    } else {
      Spotify.login();
    }
  }

  render(){
    return (
      <View style={{...globals.style.view, ...style.barHop}}>
        {this.renderHostOverlay()}
        <Button style={globals.style.button} large raised backgroundColor={globals.sGrey} 
        title="Scan QR Code" rightIcon={qrIcon} textStyle={globals.style.text}>
        </Button>
        {this.renderManualInput()}
        <Button style={globals.style.button} large raised backgroundColor={globals.sGreen} 
        title="Host Playlist" rightIcon={hostIcon} textStyle={globals.style.text}
        onPress={()=>this.getPlaylists()}>
        </Button>
      </View>
    );
  }

  renderManualInput() {
    if(this.state.manualInputActive) {
      return (
        <View style={style.manualInput}>
          <TextInput style={this.state.failure ? globals.style.textInputFailed : globals.style.textInput} placeholder="Playlist Id" 
          onChangeText={(input) => this.setState({input})} onSubmitEditing={()=>this.submitJoin()}>
          </TextInput>
          <Icon raised backgroundColor={globals.sWhite} name="check" type="evilicons" onPress={()=>this.submitJoin()}>
          </Icon>
        </View>
      );
    }
    return (
      <Button style={globals.style.button} large raised backgroundColor={globals.sGrey} 
      title="Enter Code" rightIcon={codeIcon} textStyle={globals.style.text} onPress={()=>this.setState({manualInputActive:true})}>
      </Button>
    );
  }

  eachPlaylist(playlist) {
    return (
      <TouchableOpacity style={style.playlist} onPress={()=>{this.addPlaylist(playlist)}}>
        <Text style={style.playlistText}>{playlist.name}</Text>
      </TouchableOpacity>
    );
  }

  addPlaylist(playlist){
    let { user } = this.props.screenProps;
    let playlistImage = playlist.images[0];
    let userImage = user.images[0];
    let image = (playlistImage && playlistImage.url) || (userImage && userImage.url);
    globals.getSongsDataHTTP(user.id, playlist.id, songs => {
      globals.client.mutate({
        mutation: AddPlaylist,
        variables: {
          ownerURI: user.id,
          playlistURI: playlist.id,
          ownerName: user.display_name,
          playlistName: playlist.name,
          songs,
          image
        }
      }).then(({loading, data: {addPlaylist: {id}}})=>{
        console.warn(loading);
        this.setState({
          hostInputActive: false
        });
        localPlaylists.push(id, ()=>{
          this.props.navigation.navigate('BarList');
        });
      });
    });
  }

  renderHostOverlay(){
    if(this.state.hostInputActive) {
      if(this.props.screenProps.user) {
        return (
          <Modal animationType="slide" transparent={false} visible={true}>
            <View style={style.overlayView}>
              <FlatList data={this.state.myPlaylists} keyExtractor={(item, index)=>String(index)} 
              renderItem={({item})=>this.eachPlaylist(item)} style={{marginBottom:20}}>
              </FlatList>
              <View style={style.overlayButtons}>
                {/* <Button disabled={this.state.selectedPlaylist === -1} title="Add" onPress={()=>addPlaylist(getPlaylist())}></Button> */}
                <Button style={{marginLeft: 20}} title="Cancel" onPress={()=>this.setState({hostInputActive:false})}></Button>
              </View>
            </View>
          </Modal>
        );
      } else {
        Spotify.login();
        return <View/>;
      }
    }
    return <View/>;
  }

  renderQR(){
    return <View/>
  }
}

const style = StyleSheet.create({
  manualInput: {
    flexDirection: 'row'
  },
  barHop: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  overlayView: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    marginTop: 50
  },
  overlayButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  playlist: {
    paddingLeft: 100,
    paddingRight: 100,
    padding: 15,
    borderColor: globals.sBlack,
    borderWidth: 1
  },
  playlistText: {
    color: globals.sBlack,
    fontSize: 24,
    fontFamily: 'Futura',
  }
});


// const AddPlaylistElement = graphql(AddPlaylistMutation, {
//   props: (props) => ({
//       onAdd: post => props.mutate({
//           variables: post,
//           optimisticResponse: () => ({ addPost: { ...post, __typename: 'Post', version: 1 } }),
//       })
//   }),
//   options: {
//       refetchQueries: [{ query: GetPlaylistsQuery }],
//       update: (dataProxy, { data: { addPlaylist } }) => {
//         const query = GetPlaylistsQuery;
//         const data = dataProxy.readQuery({ query });

//         data.allPlaylist.posts.push(addPlaylist);

//         dataProxy.writeQuery({ query, data });
//       }
//   }
// })(AddPlaylistComponent);