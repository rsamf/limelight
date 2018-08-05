import React from 'react';
import { View, FlatList, StyleSheet, Text, Image, TouchableOpacity } from 'react-native';
import { Icon } from 'react-native-elements';
import globals from '../helpers';
import { graphql, compose } from 'react-apollo';
import GetPlaylistsById from '../../GQL/queries/GetPlaylistsById';
import { NavigationEvents } from 'react-navigation';
const { localPlaylists } = globals;

class BarList extends React.Component {
  constructor(props){
    super(props);

    this.state = {
      barIds: null
    };
  }

  getLocalPlaylists(){
    localPlaylists.getAll(ids => {
      // console.warn("returned list", ids);
      this.setState({
        barIds: ids
      });
      if(ids.length === 0) {
        this.props.navigation.navigate('BarHop');
      }
    });
  }

  render(){
    return (
      <View style={globals.style.view}>
        <NavigationEvents onWillFocus={()=>this.getLocalPlaylists()}/>
        {this.renderList()}    
      </View>
    );
  }

  getPlaylists = () => compose(
    graphql(GetPlaylistsById, {
      options: {
          fetchPolicy: 'cache-and-network',
          variables: {
            ids: this.state.barIds
          }
      },
      props: ({data}) => ({
        navigation: this.props.navigation,
        playlists: data.getPlaylistsOf,
        loading: data.loading,
        error: data.error
      })
  }))(Playlists)

  renderList(){
    if(this.state.barIds){
      if(this.state.barIds.length > 0) {
        const Playlists = this.getPlaylists();
        return <Playlists/>;
      }
      return (
        <View style={style.noPlaylistsText}>
          <Text style={globals.style.text}>You have not joined any playlists...</Text>
        </View>
      );
    }
    return <globals.Loader/>;
  }
}

class Playlists extends React.Component {
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
    if (this.props.error) return <Text style={globals.style.text}>'Error'</Text>;
    return (
      <FlatList data={this.props.playlists} keyExtractor={(item, index)=>String(index)} 
      renderItem={({item})=>this.eachBar(item)}/>
    );
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

export default BarList;