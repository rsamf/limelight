import { StyleSheet, View, Image, Text, TouchableOpacity, TextInput, ActivityIndicator, Dimensions, Platform, Linking, Alert } from 'react-native';
import { Icon } from 'react-native-elements';
import React from 'react';
import * as AWS from 'aws-sdk';
import { AUTH_TYPE } from "aws-appsync/lib/link/auth-link";
import AWSAppSyncClient from "aws-appsync/lib";
import Spotify from 'rn-spotify-sdk';

const sBlue = '#43e5f8',//'#23a5c8',//'#84bd00'
      sMiddle = '#20f3cb',
      sGreen = '#04fea6'
      sBlack = '#000000',
      sGrey = '#929292',
      darkGrey = '#333333',
      darkerGrey = '#282828',
      sSand = '#ecebe8',
      sWhite = '#ffffff',
      spotifyGreen = "#1DB954",
      darkRed = '#992311';

const style = StyleSheet.create({
  view: {
    backgroundColor: sBlack,
    flex: 1,
    justifyContent: 'flex-start'
  },
  text: {
    color: sWhite,
    fontFamily: 'Futura',
    fontSize: 18
  },
  biggerText: {
    color: sWhite,
    fontFamily: 'Futura',
    fontSize: 20
  },
  errorText: {
    color: sGrey,
    fontFamily: 'Futura',
    fontSize: 18
  },
  smallText:{
    color: sSand,
    fontFamily: 'Futura',
    fontSize: 12
  },
  textInputFailed: {
  },
  button: {
    margin: 10
  },
  fullscreen: {
    position: "absolute",
    flex: 1,
    top: 0, left: 0, bottom: 0, right: 0,
  },
  absolute: {
    position: 'absolute'
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  centerColumn: {
    justifyContent: 'center'
  },
  centerRow: {
    alignItems: 'center'
  },
  textInputContainer: {
    flexDirection: 'row',
    justifyContent: 'center'
  },
  textInput: {
    fontFamily: 'Futura',
    fontSize: 18,
    padding: 10,
    color: sWhite,
    borderBottomColor: sWhite,
    borderBottomWidth: 2,
    flex: .75
  },
  textInputAlt: {
    fontFamily: 'Futura',
    fontSize: 18,
    padding: 10,
    color: sWhite,
    borderBottomColor: sWhite,
    borderBottomWidth: 2,
    flex: 1
  },
  modalText: {
    color: sBlack,
    fontFamily: 'Futura',
    fontSize: 18
  },
  modalOptions: {
    marginTop: 20,
    flexDirection: 'row'
  },
  modalView: {
    backgroundColor: 'rgba(0,0,0,.6)',
    borderWidth: 1,
    borderRadius: 20,
    borderColor: sWhite
  },
  modalBorder: {
    borderBottomWidth: 1,
    borderBottomColor: sGrey
  },
  modalItem: {
    flexDirection: 'row',
    padding: 15
  },
  modalIcon: {
    marginRight: 10
  },
  modalImage: {
    width: 50,
    height: 50,
    borderWidth: 0.5,
    borderColor: sGrey
  },
  modalDetails: {
    marginLeft: 10,
    flex: 1
  },
  playlist: {
    marginLeft: 15,
    marginRight: 15,
    marginTop: 15,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  playlistWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flex: 1
  },
  playlistData: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1
  },
  playlistDetails: {
    marginLeft: 10,
    flex: 1
  },
  playlistImage: {
    width: 50,
    height: 50,
    borderWidth: 0.5,
    borderColor: sGrey
  },
  playlistOwner: {
    color: sSand,
    fontFamily: 'Futura',
    fontSize: 12,
    color: sGrey
  },
  playlistIcons: {
    width: 25,
    alignItems: 'center'
  },
  playlistIcon: {
    marginBottom: 3,
  }
});

const diff = (truth, previous) => {
  let toReturn = {
    old: [], // old ids
    new: [], // new objs
    ordered: [] // defining objs
  };
  const findTruthWithId = (id) => {
    for(let i = 0; i < truth.length; i++) {
      if(truth[i]) {
        if(truth[i].id === id) {
          return i;
        }
      }
    }
    return -1;
  };
  for(let i = 0; i < previous.length; i++) {
    const truthIndex = findTruthWithId(previous[i].id);
    if(truthIndex === -1) {
      toReturn.old.push(previous[i].id);
    } else {
      toReturn.ordered.push(previous[i]);
      delete truth[truthIndex];
    }
  }
  toReturn.new = truth.filter(t => t).map(s => ({...s, votes: 0, state: 0}));
  toReturn.ordered = [...toReturn.ordered, ...toReturn.new];
  return toReturn;
};

const createSearchTextInput = (placeholder, onChangeText, onSubmitEditing, additionalProps) => {
  return (
    <View style={style.textInputContainer}>
      <Icon name="search" color={sWhite}/>
      <TextInput
        placeholder={placeholder}
        placeholderTextColor={sWhite}
        style={style.textInput} 
        blurOnSubmit={true} 
        enablesReturnKeyAutomatically={true} 
        autoCapitalize="none" 
        spellCheck={false}
        onChangeText={(text)=>onChangeText(text)}
        onSubmitEditing={onSubmitEditing}
        returnKeyType="search"
        autoFocus={true}
        {...additionalProps}
      />
    </View>
  );
};
const createTextInput = (onChangeText, onSubmitEditing, onBlur) => {
  return () => (
    <View style={style.textInputContainer}>
      <TextInput 
        style={style.textInputAlt} 
        blurOnSubmit={true} 
        enablesReturnKeyAutomatically={true} 
        autoCapitalize="words" 
        spellCheck={false}
        onChangeText={(text)=>onChangeText(text)}
        onSubmitEditing={onSubmitEditing}
        onBlur={onBlur}
        returnKeyType="done"
        autoFocus={true}
      />
    </View>
  )
};
const Loader = () => {
  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <ActivityIndicator size="large" color={sGrey}/>
    </View>
  );
};

const getSongData = (track, smallerImage) => {
  return {
    id: track.id,
    name: track.name,
    artist: track.artists[0].name,
    duration: track.duration_ms/1000,
    image: (
      smallerImage ? 
      track.album.images[1] && track.album.images[1].url :
      track.album.images[0] && track.album.images[0].url
    ),
    state: 0,
    votes: 0
  };
};

const getSongsFromPlaylist = playlist => {
  if(playlist.tracks && playlist.tracks.items) {
    return playlist.tracks.items.map(({track})=>getSongData(track));
  }
  return [];
};

const getPlaylistId = uri => uri.substring(uri.search(/playlist:/g) + 9);
const getUserId = uri => uri.substring(uri.search(/user:/g) + 5, uri.search(/:playlist/g));
const getMyPlaylists = (user, func) => {
  Spotify.sendRequest('v1/me/playlists?limit=50&offset=0', "GET", null, false).then(data => {
    let items = data.items;
    let filtered = items.filter(playlist => playlist.owner.id === user.id);
    let mapped = filtered.map(playlist => ({
      id: playlist.uri,
      ownerId: playlist.owner.id,
      image: playlist.images && playlist.images[0] && playlist.images[0].url,
      name: playlist.name
    }));
    func(mapped);
  });
};

export const isX = () => {
  const { height, width } = Dimensions.get('window');
  return (
    Platform.OS === 'ios' && (height === 812 || height === 896 || width === 812 || width === 896)
  );
}

const client = new AWSAppSyncClient({
  url: "https://oiywd3csqfenhjw7d6p3k6qepe.appsync-api.us-west-2.amazonaws.com/graphql",
  region: "us-west-2",
  auth: {
      type: AUTH_TYPE.AWS_IAM,
      credentials: new AWS.Credentials({
        accessKeyId: "AKIAJVF5BO4TV7IJIRYA",
        secretAccessKey: "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"
      })
  },
  disableOffline: true
});

const visitSong = id => {
  let url = "https://open.spotify.com/track/"+this.props.children.id;
  Linking.canOpenURL(url).then(supported => {
    if (!supported) {
      Alert.alert("Could not open the link to the song!");
    } else {
      Linking.openURL(url);
    }
  });
};

const visitPlaylist = (ownerId, playlistId) => {
  const url = `https://open.spotify.com/user/${ownerId}/playlist/${playlistId}`;
  Linking.canOpenURL(url).then(supported => {
    if (!supported) {
      Alert.alert("Could not open the link to the playlist!");
    } else {
      Linking.openURL(url);
    }
  });
};

const getPlaylistView = (playlist, ...extraIcons) => (
  <View style={style.playlistWrapper}>
    <View style={style.playlistData}>
      {
        playlist.image ?
        <Image style={style.playlistImage} source={{uri: playlist.image}}/> :
        <Icon containerStyle={style.playlistImage} color={sWhite} name="music" type="feather"/>
      }
      <View style={style.playlistDetails}>
        <Text ellipsizeMode='tail' numberOfLines={1} style={style.text}>{playlist.name}</Text>
        <Text ellipsizeMode='tail' numberOfLines={1} style={style.playlistOwner}>{playlist.ownerName}</Text>
      </View>
    </View>
    <View style={style.playlistIcons}>
      <Icon containerStyle={style.playlistIcon} size={21} color={sWhite} name="spotify" type="font-awesome"/>
      {extraIcons.map((iconName, i) => (
        <Icon containerStyle={style.playlistIcon} size={21} color={sWhite} name={iconName} type="font-awesome" key={i}/>
      ))}
    </View>
  </View>
);

const getPlaylistModal = (playlist, play, isOwned) => (
  playlist ?
  <View style={style.modalView}>
    <View style={{...style.modalBorder, ...style.modalItem}}>
      {
        playlist.image ?
        <Image style={style.modalImage} source={{uri: playlist.image}}/> :
        <Icon containerStyle={style.modalImage} color={sWhite} name="music" type="feather"/>
      }
      <View style={style.modalDetails}>
        <Text ellipsizeMode="tail" numberOfLines={1} style={style.text}>{playlist.name}</Text>
        <Text ellipsizeMode="tail" numberOfLines={1} style={style.playlistOwner}>{playlist.ownerName}</Text>
      </View>
    </View>
    <TouchableOpacity style={{...style.modalBorder, ...style.modalItem}} onPress={()=>play()}>
      <Icon containerStyle={style.modalIcon} color={sWhite} name={isOwned ? "play" : "door-open"} type="material-community"/>
      <Text style={style.text}>{isOwned ? "Play Music" : "Connect to DJ"}</Text>
    </TouchableOpacity>
    <TouchableOpacity style={{...style.modalBorder, ...style.modalItem}} onPress={()=>visitPlaylist(playlist.ownerId, getPlaylistId(playlist.id))}>
      <Icon containerStyle={style.modalIcon} color={sWhite} name="spotify" type="font-awesome"/>
      <Text style={style.text}>View in Spotify</Text>
    </TouchableOpacity>
  </View> :
  <View/>
);

const globals = {
  style,
  sBlue,
  sMiddle,
  sGreen,
  sBlack,
  sGrey,
  darkGrey,
  darkerGrey,
  sSand,
  sWhite,
  darkRed,
  spotifyGreen,
  Loader,
  createSearchTextInput,
  createTextInput,
  diff,
  getPlaylistId,
  getUserId,
  getMyPlaylists,
  getSongData,
  getSongsFromPlaylist,
  isX,
  client,
  visitSong,
  visitPlaylist,
  getPlaylistView,
  getPlaylistModal
};


export default globals;
