import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text, FlatList, Image } from 'react-native';
import globals from '../helpers';
import { ButtonGroup, Icon, Badge } from 'react-native-elements';
import QRCodeScanner from 'react-native-qrcode-scanner';
import GetPlaylistsByCode from '../../GQL/queries/GetPlaylistsByCode';
import Spotify from 'rn-spotify-sdk';

export default class AddPlaylistBlur extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      selectedButton: this.props.selected || 0,
      iDinput: "",
      nameInput: "",
      searchedPlaylists: [],
      searching: false,
      showNoneMessage: false
    };
  }
  
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
        <Text style={globals.style.smallText}>Create New</Text>
      </View>
    )
  }]

  setSelected(i) {
    const go = () => this.setState({selectedButton: i});
    if(i === 2) {
      globals.rsa(() => go());
    } else {
      go();
    }
  }

  joinPlaylist(playlist) {
    this.props.playlists.push(playlist.id, () => {
      this.props.close();
    });
  }

  searchPlaylists() {
    this.setState({
      loading: true
    });
    globals.client.query({
      query: GetPlaylistsByCode,
      variables: {
        shortCode: this.state.iDinput
      }
    }).then(({data: {getPlaylistsByCode:{playlists}}})=>{
      this.setState({
        searchedPlaylists: playlists,
        loading: false,
        showNoneMessage: playlists.length === 0
      });
    });
  }

  eachPlaylist(playlist, onPress) {
    let disabled = this.props.playlists.contains(playlist.id);
    return (
      <TouchableOpacity disabled={disabled} style={{...style.playlist, opacity: 1-disabled*.5}} onPress={()=>onPress(playlist)}>
        <Image style={style.playlistImage} source={{uri:playlist.image || playlist.images[0].url}}/>
        <View style={style.playlistContent}>
          <View style={style.playlistDetails}>
            <Text ellipsizeMode={'tail'} numberOfLines={1} style={globals.style.text}>{playlist.name}</Text>
            <Text ellipsizeMode={'tail'} numberOfLines={1} style={globals.style.smallText}>{playlist.ownerName}</Text>
          </View>
          {
            disabled &&
            <Badge value="Added" textStyle={{ color: globals.sWhite }}/>
          }
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

  SearchTextInput = globals.createSearchTextInput((iDinput) => {
    this.setState({iDinput});
  }, () => {
    this.searchPlaylists();
  });

  TextInput = globals.createTextInput((nameInput) => {
    this.setState({nameInput});
  }, () => {
    this.createAndGoToBar();
  });

  createAndGoToBar() {
    this.props.close();
    this.props.addToUserPlaylists("LOADING");
    const name = this.state.nameInput;
    globals.rsa(() => {
      Spotify.sendRequest(`v1/users/${this.props.user.id}/playlists`, 'POST', {name}, true)
      .then((data) => {
        console.warn("DATA", data);
        globals.addPlaylist({name, id: data.uri}, this.props.user, playlist => {
          if(playlist) {
            console.warn("playlist:", playlist);
            console.warn(data.owner.id);
            this.props.addToUserPlaylists({
              id: playlist.id,
              ownerId: data.owner.id,
              name: playlist.name
            });
          }
        });
      })
      .catch(error => {
        this.props.addToUserPlaylists("ERROR");
      });
    });
  }

  renderSelected() {
    if(this.state.selectedButton === 0) {
      let toRender;
      if(this.state.loading) {
        toRender = (
          <View style={style.message}>
            <globals.Loader/>
          </View>
        );
      } else if(this.state.showNoneMessage) {
        toRender = (
          <View style={style.message}>
            <Icon name="emoji-sad" type="entypo" color={globals.sGrey}/>
            <Text style={globals.style.errorText}>Sorry, I couldn't find a playlist that matched that code. Try again soon.</Text>
          </View>
        );
      } else {
        toRender = (
          <FlatList 
            data={this.state.searchedPlaylists} 
            keyExtractor={(item, index) => String(index)} 
            renderItem={({item}) => 
              this.eachPlaylist(item, (playlist)=>this.joinPlaylist(playlist))
            }
          />
        );
      }
      return (
        <View style={style.selectedRender}>
          <this.SearchTextInput/>
          <View style={style.playlists}>
            {toRender}
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
        <View style={{...style.selectedRender, justifyContent: 'center', marginLeft: 20, marginRight: 20}}>
          <View style={{flexDirection: 'row'}}>
            <View style={{flexDirection: 'column', flex: 1}}>
              <Text style={globals.style.text}>Playlist Name:</Text>
                <View style={{flexDirection: 'row'}}>
                  <View style={{flex: .8}}>
                    <this.TextInput/>
                  </View>
                  <View style={{flex: .2}}>
                    <TouchableOpacity onPress={()=>this.createAndGoToBar()}>
                      <Icon name="arrow-right" type="evilicon" size={55} color={globals.sWhite}/>
                    </TouchableOpacity>
                  </View>
                </View>
            </View>
          </View>
        </View>
      );
    }
  }

  renderQRScanner(){
    const success = ({data}) => {
      this.props.playlists.push(data, () => {
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
    backgroundColor: 'rgba(55,55,55,1)',
  },
  playlists: {
    flex: .8,
    marginLeft: 20,
    marginRight: 20
  },
  playlist: {
    marginTop: 10,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center'
  },
  playlistContent: {
    flexDirection:'row',
    flex: 1, 
    alignItems: 'center', 
    justifyContent: 'space-between'
  },
  playlistDetails: {
    marginLeft: 5,
    color: globals.style.darkGrey
  },
  playlistImage: {
    width: 40,
    height: 40
  },
  createLabel: {
    ...globals.style.text
  },
  message: {
    margin: 10,
    ...globals.style.center
  }
});