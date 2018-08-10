import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Icon } from 'react-native-elements';
import globals from '../helpers';

export default class extends React.Component {
  constructor(props){
    super(props);
  }

  showPlaylistOptions() {
    this.props.setOpenedBlur(3, {
      playlist: this.props.children,
      navigation: this.props.navigation,
      updatePlaylist: (p)=>this.props.updatePlaylist(p),
      deletePlaylist: ()=>this.props.deletePlaylist(),
      deleteSongs: ()=>this.props.deleteSongs()
    });
  }

  render(){
    return (
      <View style={style.view}>
        <Icon name="ios-arrow-back" type="ionicon" color={globals.sBlack} underlayColor={globals.sSand}
        onPress={()=>this.props.navigation.goBack()} iconStyle={style.icon}/>
        <View style={style.titleContainer}>
          <Text style={style.title}>{this.props.children.playlistName}</Text>
        </View>
        {
          this.props.owned &&
          <Icon name="md-more" type="ionicon" color={globals.sBlack} underlayColor={globals.sSand}
         onPress={()=>this.showPlaylistOptions()} iconStyle={style.icon}/>
        }
      </View>
    );
  }
}

const style = StyleSheet.create({
  view: {
    backgroundColor: globals.sSand,
    height: 80,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 20
  },
  icon: {
    marginLeft: 20,
    marginRight: 20
  },
  title: {
    color: globals.sBlack
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    flex: 1,
    marginRight: 29
  }
});