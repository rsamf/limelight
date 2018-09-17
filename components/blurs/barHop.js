import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text, FlatList, Image } from 'react-native';
import globals from '../helpers';
import { Button, ButtonGroup, Icon  } from 'react-native-elements';
import QRCodeScanner from 'react-native-qrcode-scanner';
import GetPlaylistsByCode from '../../GQL/queries/GetPlaylistsByCode';
import Spotify from 'rn-spotify-sdk';

export default class BarHop extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      selectedButton: 0,
      input: "",
      searchedPlaylists: [],
      playlists: []
    };
  }

  setSelected(i) {
    if(i !== 2) return this.setState({selectedButton: i});

    const getMyPlaylists = () => {
      this.setState({selectedButton: 2});
      Spotify.sendRequest("v1/me/playlists", "GET", {}, true).then(({items}) => {
        this.setState({
          playlists: items
        });
      });
    };

    if(this.props.user) {
      getMyPlaylists();
    } else {
      Spotify.login().then(isLoggedIn => {
        if(isLoggedIn) {
          getMyPlaylists();
        }
      });
    }
  }
  
  TextInput = globals.createSearchTextInput((input)=>this.setState({input}), ()=>this.searchPlaylists());

  buttons = [{
    element: () => (
      <View>
        <Icon color={globals.sWhite} type="font-awesome" name="keyboard-o"/>
        <Text style={globals.style.smallText}>Join by ID</Text>
      </View>
    )
  }, {
    element: ()=> (
      <View>
        <Icon color={globals.sWhite} type="font-awesome" name="qrcode"/>
        <Text style={globals.style.smallText}>Join by QR</Text>
      </View>
    )
  }, {
    element: () => (
      <View>
        <Icon color={globals.sWhite} type="entypo" name="spotify"/>
        <Text style={globals.style.smallText}>Host</Text>
      </View>
    )
  }]

  joinPlaylist(id) {
    this.props.localPlaylists.add(id, () => {
      this.props.close();
    });
  }

  addPlaylist(playlist){
    const { user } = this.props;
    const variables = {
      ownerURI: user.id,
      ownerName: user.display_name,
      image: (playlist && playlist.images[0] && playlist.images[0].url) || (user.images[0] && user.images[0].url),
      playlistName: playlist ? playlist.name : user.display_name
    };
    const sendPlaylistMutation = (variables, callback) => {
      globals.client.mutate({
        mutation: AddPlaylistMutation,
        variables
      }).then(({data})=>{callback(data)});
    }
    const sendSongsMutation = (variables, callback) => {
      globals.client.mutate({
        mutation: CreateSongsMutation,
        variables
      }).then(({data})=>{callback(data)});
    };
    const switchView = (id) => {
      this.props.localPlaylists.add(id, ()=>{
        this.props.close();
        this.props.navigation.navigate('BarList');
      });
    };
    sendPlaylistMutation(variables, data => {
      const id = data.addPlaylist.id;
      let songVariables = { id: id, songs: [] };
      if(playlist) {
        globals.getSongsDataHTTP(user.id, playlist.id, songs => {
          songVariables.songs = songs;
          sendSongsMutation(songVariables, ({createSongs: {id}})=>switchView(id));
        });
      } else {
        sendSongsMutation(songVariables, ({createSongs: {id}})=>switchView(id));
      }
    });
  }

  searchPlaylists() {
    globals.client.query({
      query: GetPlaylistsByCode,
      variables: {
        shortCode: this.state.input
      }
    }).then(({data: {getPlaylistsByCode:{playlists}}})=>{
      this.setState({
        searchedPlaylists: playlists
      });
    });
  }

  eachPlaylist(playlist, onPress) {
    return (
      <TouchableOpacity style={style.playlist} onPress={()=>onPress(playlist)}>
        <Image style={style.playlistImage} source={{uri:playlist.image || playlist.images[0].url}}/>
        <View style={style.playlistDetails}>
          <Text style={globals.style.text}>{playlist.playlistName || playlist.name}</Text>
          <Text style={globals.style.smallText}>{playlist.ownerName || playlist.owner.display_name }</Text>
        </View>
      </TouchableOpacity>
    );
  }

  render(){
    return (
      <View style={style.view}>
        {this.renderSelected()}
        <View style={style.buttonGroupContainer}>
          <ButtonGroup
            onPress={(i)=>this.setSelected(i)}
            selectedIndex={this.state.selectedButton}
            buttons={this.buttons}
            containerStyle={style.buttonContainer}
            selectedButtonStyle={style.selectedButton}
            selectedTextStyle={style.selectedText}
            underlayColor={'rgba(33,33,33,.3)'}
          />
        </View>
      </View>
    );
  }

  renderSelected() {
    if(this.state.selectedButton === 0) {
      return (
        <View style={style.selectedRender}>
          <this.TextInput/>
          <View style={style.playlists}>
            <FlatList 
              data={this.state.searchedPlaylists} 
              keyExtractor={(item, index) => String(index)} 
              renderItem={({item}) => 
                this.eachPlaylist(item, (playlist)=>this.joinPlaylist(playlist))
              }
            />
          </View>
        </View>
      );
    } else if(this.state.selectedButton === 1) {
      return (
        <View style={style.selectedRender}>
          {this.renderQRScanner()}
        </View>
      );
    } else {
      return (
        <View style={style.selectedRender}>
          <View style={globals.style.centerRow}>
            <Text style={globals.style.text}>Use songs from one of your playlists:</Text>
          </View>
          <View style={style.playlists}>
            <FlatList
              data={this.state.playlists} 
              keyExtractor={(item, index) => String(index)} 
              renderItem={({item}) =>
                this.eachPlaylist(item, (playlist) => this.addPlaylist(playlist))
              }
            />
          </View>
          <View style={globals.style.centerRow}>
            <Text style={globals.style.text}>Or create one from scratch:</Text>
            <Button style={globals.style.button} title="Create New" onPress={()=>this.addPlaylist()}/>
          </View>
        </View>
      );
    }
  }

  renderQRScanner(){
    const success = ({data}) => {
      this.props.screenProps.localPlaylists.add(data, () => {
        this.props.close();
      });
    };

    return (
      <QRCodeScanner onRead={(data)=>success(data)}/>
    );
  }
}

const style = StyleSheet.create({
  view: {
    flex: 1
  },
  selectedRender: {
    flex: .8
  },
  buttonGroupContainer: {
    alignItems: 'center',
    flex: .2
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
  button: {
    padding: 10
  },
  selectedText: {
    color: globals.sBlack
  },
  selectedButton: {
    backgroundColor: 'rgba(33,33,33,1)',
  },
  playlists: {
    flex: .8,
    marginLeft: 20
  },
  playlist: {
    marginTop: 10,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center'
  },
  playlistDetails: {
    marginLeft: 5
  },
  playlistImage: {
    width: 40,
    height: 40
  }
});