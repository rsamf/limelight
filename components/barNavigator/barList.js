import React from 'react';
import { View, FlatList, StyleSheet, Text, Image, TouchableOpacity } from 'react-native';
import { Icon } from 'react-native-elements';
import globals from '../helpers';
import createPlaylists from '../../GQL/playlists';
import Header from './header';

const style = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 0.5,
    borderBottomColor: globals.sGrey,
    height: 100,
    marginLeft: 40,
    marginRight: 40,
    paddingLeft: 20,
    paddingRight: 20
  },
  barText: {
    ...globals.style.smallText,
    width: 200,
    marginLeft: 10,
    marginRight: 10
  },
  barImage: {
    width: 50,
    height: 50
  },
  barIconsRight: {
    flexDirection: 'row'
  },
  noPlaylistsText: {
    ...globals.style.text,
    flex: 1, 
    alignItems: 'center', 
    justifyContent: 'center',
    margin: 50
  },
  playlists: {
    marginLeft: 20,
    marginRight: 20
  },
  playlist: {
    marginTop: 13,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  playlistDetails: {
    marginLeft: 5
  },
  playlistImage: {
    width: 40,
    height: 40
  },
  playlistOwner: {
    ...globals.style.smallText,
    color: globals.sGrey
  }
});

class PlaylistsComponent extends React.Component {
  eachPlaylist(playlist) {
    return (
      <TouchableOpacity style={style.playlist} onPress={()=>this.props.navigation.navigate('Bar', playlist)}>
        <View style={{flexDirection: 'row'}}>
          <Image style={style.playlistImage} source={{uri:playlist.image || playlist.images[0].url}}/>
          <View style={style.playlistDetails}>
            <Text ellipsizeMode={'tail'} style={globals.style.text}>{playlist.playlistName || playlist.name}</Text>
            <Text ellipsizeMode={'tail'} style={style.playlistOwner}>{playlist.ownerName || playlist.owner.display_name }</Text>
          </View>
        </View>
        <Icon size={14} color={globals.sBlue} name="chevron-thin-right" type="entypo"/>
      </TouchableOpacity>      
    );
  }

  getSortedPlaylists(playlists) {
    let user = this.props.user;
    if(!user) return playlists;
    let playlistsCopy = playlists.slice(0);
    return playlistsCopy.sort((a, b) => {
      let ownedA = user.id === a.ownerURI;
      let ownedB = user.id === b.ownerURI;
      return (ownedA === ownedB) ? (a.playlistName > b.playlistName) : (ownedA < ownedB);
    });
  }

  render(){
    if (this.props.loading) return <globals.Loader/>;
    if (this.props.error) {
      return <Text style={globals.style.text}>'Error'</Text>;
    }
    return (
      <View style={style.playlists}>
        <FlatList 
          data={this.getSortedPlaylists(this.props.playlists)} 
          keyExtractor={(item, index)=>String(index)} 
          renderItem={({item})=>this.eachPlaylist(item)}
        />
      </View>
    );
  }
}

const Playlists = createPlaylists(PlaylistsComponent);

export default class BarList extends React.Component {
  constructor(props){
    super(props);

    this.state = {};
  }

  render(){
    return (
      <View style={globals.style.view}>
        <Header {...this.props.screenProps}/>
        {this.renderList()}    
      </View>
    );
  }

  renderList(){
    const localPlaylists = this.props.screenProps.localPlaylists;
    if(localPlaylists && localPlaylists.stored) {
      const ids = localPlaylists.stored;
      if(ids.length > 0) {
        return  (
          <Playlists navigation={this.props.navigation} user={this.props.screenProps.user}
          localPlaylists={localPlaylists}>
            {ids}
          </Playlists>
        );
      }
      return (
        <View style={style.noPlaylistsText}>
          <Text style={globals.style.text}>You have not joined any playlists...</Text>
        </View>
      );
    }
    return <globals.Loader/>
  }
}