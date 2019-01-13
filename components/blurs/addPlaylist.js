import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text, FlatList, Image, TextInput } from 'react-native';
import { ButtonGroup, Icon } from 'react-native-elements';
import Modal from 'react-native-modal';
import QRCodeScanner from 'react-native-qrcode-scanner';
import GetPlaylistsByCode from '../../GQL/queries/GetPlaylistsByCode';
import globals from '../helpers';
import Spotify from 'rn-spotify-sdk';
import aws from '../../util/aws';
import user from '../../util/user';

export default class AddPlaylistBlur extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      selectedButton: this.props.selected || 0,
      iDinput: "",
      nameInput: "",
      searchedPlaylists: [],
      searching: false,
      showNoneMessage: false,
      activePlaylistModal: null
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

  showPlaylistModal(val = null) {
    this.setState({ activePlaylistModal: val });
  }

  setSelected(i) {
    const go = () => this.setState({selectedButton: i});
    if(i === 2) {
      user.rsa(go);
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
    if(!this.props.isOnline) return;
    this.setState({
      loading: true
    });
    globals.client.query({
      query: GetPlaylistsByCode,
      variables: {
        code: this.state.iDinput
      }
    }).then(({data: {getPlaylistsByCode: {playlists}}})=>{
      this.setState({
        searchedPlaylists: playlists.map(p => ({...p, ownerId: globals.getUserId(p.id)})),
        loading: false,
        showNoneMessage: playlists.length === 0
      });
    });
  }

  eachPlaylist(playlist) {
    return (
      <TouchableOpacity 
        onPress={()=>this.joinPlaylist(playlist)}
        onLongPress={()=>this.showPlaylistModal(playlist)}
      >
        {globals.getPlaylistView(playlist)}
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

  TextInput = globals.createTextInput((nameInput) => {
    this.setState({nameInput});
  }, () => {
    this.createAndGoToBar();
  });

  createAndGoToBar() {
    this.props.close();
    this.props.addToUserPlaylists("LOADING");
    const name = this.state.nameInput;
    const url = `v1/users/${this.props.user.id}/playlists`;
    user.rsa(() => {
      Spotify.sendRequest(url, 'POST', {name}, true).then(data => {
        const toAdd = {
          name, 
          uri: data.uri, 
          owner: {
            id: this.props.user.id
          }
        };
        aws.addPlaylist(toAdd, this.props.user, playlist => {
          if(playlist) {
            this.props.addToUserPlaylists({
              id: playlist.id,
              ownerId: data.owner.id,
              name: playlist.name
            });
          }
        });
      })
      .catch(() => {
        this.props.addToUserPlaylists("ERROR");
      });
    });
  }

  goToBar(id) {
    this.setState({ activePlaylistModal: null });
    this.props.navigation.navigate('Bar', id);
    this.props.close();
  }

  renderModal() {
    const playlist = this.state.activePlaylistModal;
    console.log(playlist);
    const isOwned = (playlist && this.props.user) && (playlist.ownerId === this.props.user.id);
    const isAdded = playlist && this.props.playlists.contains(playlist.id);
    return (
      <Modal isVisible={!!this.state.activePlaylistModal} onBackdropPress={()=>this.showPlaylistModal()}>
        {globals.getPlaylistModal(playlist, ()=>this.goToBar(playlist.id), isOwned, ()=>this.joinPlaylist(playlist), isAdded)}
      </Modal>
    );
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
      } else if(!this.props.isOnline) {
        toRender = (
          <View style={style.message}>
            <Icon name="emoji-sad" type="entypo" color={globals.sGrey}/>
            <Text style={globals.style.errorText}>Sorry, check your connection.</Text>
          </View>
        );
      } else {
        toRender = (
          <FlatList 
            data={this.state.searchedPlaylists} 
            keyExtractor={(item, index) => String(index)} 
            renderItem={({item}) => this.eachPlaylist(item)}
          />
        );
      }
      return (
        <View style={style.selectedRender}>
          {this.renderModal()}
          <SearchTextInput 
            onSubmit={()=>this.searchPlaylists()} 
            onChange={(iDinput)=>this.setState({iDinput})}
            isOnline={this.props.isOnline}
          />
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

class SearchTextInput extends React.Component {
  constructor(props) {
    super(props);
  }

  render () {
    return (
      <View style={globals.style.textInputContainer}>
        <Icon name="search" color={sWhite}/>
        <TextInput
          placeholder="Type in your Invitational Code"
          placeholderTextColor={globals.sWhite}
          style={globals.style.textInput} 
          blurOnSubmit={true} 
          enablesReturnKeyAutomatically={true} 
          autoCapitalize="none" 
          spellCheck={false}
          onChangeText={this.props.onChange}
          onSubmitEditing={this.props.onSubmit}
          returnKeyType="search"
          autoFocus={true}
          disabled={!this.props.isOnline}
        />
      </View>
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
    marginTop: 20,
    marginLeft: 30,
    marginRight: 30
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