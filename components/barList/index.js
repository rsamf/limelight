import React from 'react';
import { View, SectionList, StyleSheet, Text, RefreshControl } from 'react-native';
import globals from '../helpers';
import Header from '../header';
import OwnedPlaylists from './owned';
import AddedPlaylists from './added';
import NearbyPlaylists from './nearby';
import AddPlaylistBlur from '../blurs/addPlaylist';
import user from '../../util/user';

const style = StyleSheet.create({
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
  },
  playlists: {
    flex: 1
  }
});

export default class BarList extends React.Component {
  constructor(props){
    super(props);

    this.state = {
      nearby: []
    };
  }

  componentDidMount() {
    this.props.navigation.addListener('willFocus', () => {
      this.props.screenProps.setHeader({
        name: "Your Playlists",
        playlist: null
      });
    });
    if(navigator) {
      try {
        navigator.geolocation.getCurrentPosition((pos) => {
          const lng = pos.coords.longitude;
          const lat = pos.coords.latitude;
          fetch(`https://limelight-server.herokuapp.com/nearby?lng=${lng}&lat=${lat}`)
          .then(res => res.json())
          .then(data => {
            this.setState({
              nearby: data
            });
          });
        });
      } catch(e) {
        return;
      }
    }
  }

  propsForPlaylists = () => ({
    user: this.props.screenProps.user,
    playlists: this.props.screenProps.playlists,
    nearby: this.state.nearby,
    navigation: this.props.navigation,
    addPlaylist: (op) => this.props.screenProps.openBlur(AddPlaylistBlur, {selected: op})
  });

  eachPlaylist(item) {
    if(item === "OWNED") {
      return <OwnedPlaylists {...this.propsForPlaylists()}/>;
    }
    if(item === "ADDED") {
      return <AddedPlaylists {...this.propsForPlaylists()}/>;
    }
    if(item === "NEARBY") {
      return <NearbyPlaylists {...this.propsForPlaylists()}/>;
    }
  }

  onRefresh() {
    user.refreshPlaylists((playlists)=>{
      this.setState({
        refreshing: false
      });
    });
  }

  render(){
    let sections = [];
    if(this.props.screenProps.user) {
      sections.push({title: 'Created by You', data: ["OWNED"]})
    }
    sections.push({title: 'Added by You', data: ["ADDED"]})
    if(this.state.nearby.length > 0) {
      sections.push({title: 'Nearby', data: ["NEARBY"]});
    }
    return (
      <View style={globals.style.view}>
        <View style={style.playlists}>
          <SectionList
            refreshControl={
              <RefreshControl refreshing={this.state.refreshing} onRefresh={()=>this.onRefresh()}/>
            }
            renderItem={({item})=>this.eachPlaylist(item)}
            renderSectionHeader={({section: {title}}) => (
              <Text style={style.sectionHeader}>{title}</Text>
            )}
            sections={sections}
            keyExtractor={(_, i)=>String(i)} 
          />
        </View>
      </View>
    );
  }
}