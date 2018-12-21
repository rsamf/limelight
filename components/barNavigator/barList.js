import React from 'react';
import { View, SectionList, StyleSheet, Text, Image, TouchableOpacity } from 'react-native';
import { Icon } from 'react-native-elements';
import globals from '../helpers';
import createPlaylists from '../../GQL/playlists';
import Header from './header';
import OwnedPlaylists from './ownedList';

const style = StyleSheet.create({
  noPlaylistsText: {
    ...globals.style.text,
    flex: 1, 
    alignItems: 'center', 
    justifyContent: 'center',
    margin: 50
  },
  playlists: {
    flex: 1
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
  },
  sectionHeader: {
    ...globals.style.smallText,
    color: globals.sSand,
    backgroundColor: globals.darkerGrey,
    padding: 5,
    shadowRadius: 5,
    shadowOffset: {
      height: 15
    },
    shadowOpacity: .9,
    shadowColor: globals.sBlack,
    zIndex: 5
  }
});

class PlaylistsComponent extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      nearby: []
    };
  }
  eachPlaylist(playlist) {
    if(playlist === "OWNED") return <OwnedPlaylists {...this.props.forOwned}/>;
    return (
      <TouchableOpacity style={style.playlist} onPress={()=>this.props.navigation.navigate('Bar', playlist)}>
        <View style={{flexDirection: 'row'}}>
          <Image style={style.playlistImage} source={{uri:playlist.image || playlist.images[0].url}}/>
          <View style={style.playlistDetails}>
            <Text ellipsizeMode={'tail'} numberOfLines={1} style={globals.style.text}>{playlist.playlistName || playlist.name}</Text>
            <Text ellipsizeMode={'tail'} numberOfLines={1} style={style.playlistOwner}>{playlist.ownerName || playlist.owner.display_name }</Text>
          </View>
        </View>
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
    if (this.props.loading) {
      return <globals.Loader/>;
    }
    if (this.props.error) {
      return (
        <View style={{...globals.style.view, ...globals.style.center}}>
          <Text style={globals.style.text}>
            There was a problem with loading your playlists. Check back in a little bit.
          </Text>
        </View>
      );
    }      
    let sections = [];
    if(this.props.user) {
      sections.push({title: 'Created by You', data: ["OWNED"]})
    }
    if(this.props.playlists.length > 0) {
      sections.push({title: 'Added by You', data: this.getSortedPlaylists(this.props.playlists)})
    }
    if(this.state.nearby.length > 0) {
      sections.push({title: 'Nearby', data: this.state.nearby});
    }
  //   <View style={style.noPlaylistsText}>
  //   <Text style={globals.style.text}>You have not joined any playlists...</Text>
  // </View>
    return (
      <View style={style.playlists}>
        <SectionList
          renderItem={({item, index, section})=>this.eachPlaylist(item)}
          renderSectionHeader={({section: {title}}) => (
            <Text style={style.sectionHeader}>{title}</Text>
          )}
          sections={sections}
          keyExtractor={(item, index)=>String(index)} 
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
      const forOwned = {
        ...this.props.screenProps,
        navigation: this.props.navigation,
      };
      return  (
        <Playlists 
          navigation={this.props.navigation} 
          user={this.props.screenProps.user} 
          localPlaylists={localPlaylists}
          forOwned={forOwned}
        >
          {ids}
        </Playlists>
      );
    }
    return <globals.Loader/>
  }
}