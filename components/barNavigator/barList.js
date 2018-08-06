import React from 'react';
import { View, FlatList, StyleSheet, Text, Image, TouchableOpacity } from 'react-native';
import { Icon } from 'react-native-elements';
import globals from '../helpers';
import createPlaylists from '../../GQL/playlists';

class PlaylistsComponent extends React.Component {
  eachBar(bar){
    return (
      <TouchableOpacity style={style.bar} onPress={()=>this.props.navigation.navigate('Bar', bar)}>
        {
          bar.image ?
          <Image style={style.barImage} source={{uri:bar.image}}/> :
          <Icon size={50} type="feather" name="music" color={globals.sWhite}/>
        }
        <Text style={{...style.barText, color: bar.live ? globals.sSand : globals.sGrey}}>
          {bar.playlistName}
        </Text>
        {
          bar.live ?
          <View style={style.barIconsRight}>
            <Icon size={14} color={globals.sGreen} name="sound" type="entypo"/>
            <Icon size={14} color={globals.sGreen} name="chevron-thin-right" type="entypo"/>
          </View> :
          <View>
            <Icon size={14} color={globals.sGrey} name="sound-mute" type="entypo"/>
          </View>
        }   
      </TouchableOpacity>
    );
  }

  render(){
    if (this.props.loading) return <globals.Loader/>;
    if (this.props.error) {console.warn(this.props.error);return <Text style={globals.style.text}>'Error'</Text>;}
    return (
      <FlatList data={this.props.playlists} keyExtractor={(item, index)=>String(index)} 
      renderItem={({item})=>this.eachBar(item)}/>
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
          <Playlists navigation={this.props.navigation}>
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
    fontSize: 18
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
  }
});