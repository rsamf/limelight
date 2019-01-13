import React from 'react';
import { View, SectionList, StyleSheet, Text, RefreshControl } from 'react-native';
import { Icon } from 'react-native-elements';
import globals from '../helpers';
import OwnedPlaylists from './owned';
import AddedPlaylists from './added';
import NearbyPlaylists from './nearby';
import AddPlaylistBlur from '../blurs/addPlaylist';
import user from '../../util/user';

const style = StyleSheet.create({
  sectionHeader: {
    backgroundColor: globals.darkerGrey,
    flexDirection: 'row',
    justifyContent: 'space-between',
    shadowRadius: 5,
    shadowOffset: {
      height: 15
    },
    shadowOpacity: .9,
    shadowColor: globals.sBlack,
    zIndex: 5
  },
  sectionHeaderText: {
    ...globals.style.smallText,
    fontSize: 12,
    color: globals.sSand,
    margin: 5
  },
  playlists: {
    flex: 1
  },
  spotifyIcon: {
    marginRight: 5
  },
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
      console.warn("FOCUSED");
      this.props.screenProps.setHeader({
        name: "Playlists",
        playlist: null,
        navigation: this.props.navigation
      });
    });
    this.getNearby();
  }

  getNearby(callback) {
    if(navigator) {
      try {
        navigator.geolocation.getCurrentPosition((pos) => {
          const lng = pos.coords.longitude;
          const lat = pos.coords.latitude;
          fetch(`https://limelight-server.herokuapp.com/nearby?lng=${lng}&lat=${lat}`)
            .then(res => res.json())
            .then(data => {
              this.setState({ nearby: data });
              if(callback) callback();
            });
        });
      } catch(e) {
        if(callback) callback();
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
    let count = 2;
    const checkToCallback = () => {
      if(--count === 0) {
        this.setState({ refreshing: false });
      }
    };
    this.getNearby(checkToCallback);
    if(this.props.screenProps.user){
      user.refreshPlaylists(checkToCallback);
    } else {
      checkToCallback();
    }
  }

  render(){
    let sections = [];
    if(this.props.screenProps.user) {
      sections.push({title: 'From Spotify', data: ["OWNED"]})
    }
    sections.push({title: 'Added', data: ["ADDED"]})
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
              <View style={style.sectionHeader}>
                <Text style={style.sectionHeaderText}>{title}</Text>
                {
                  title === "From Spotify" &&
                  <Icon 
                    containerStyle={style.spotifyIcon}
                    color={globals.sWhite}
                    size={21}
                    name="spotify"
                    type="font-awesome"
                  />
                }
              </View>
            )}
            sections={sections}
            keyExtractor={(_, i)=>String(i)} 
          />
        </View>
      </View>
    );
  }
}