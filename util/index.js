import { StyleSheet, View, Image, Text, TouchableOpacity, TextInput, ActivityIndicator, Dimensions, Platform, Linking, Alert } from 'react-native';
import { Icon, Badge } from 'react-native-elements';
import MarqueeText from 'react-native-marquee';
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
      evenDarkerGrey = '#1e1e1e',
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
    fontSize: 21
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
  shadow: {
    shadowRadius: 5,
    shadowOffset: {
      height: 12
    },
    shadowOpacity: 1,
    shadowColor: sBlack,
    zIndex: 5,
  },
  textInputContainer: {
    flexDirection: 'row',
    justifyContent: 'center'
  },
  textInput: {
    fontFamily: 'Futura',
    fontSize: 16,
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
    height: 50
  },
  modalDetails: {
    marginLeft: 10,
    flex: 1
  },
  // playlist: {
  //   marginLeft: 15,
  //   marginRight: 15,
  //   marginTop: 15,
  //   marginBottom: 10,
  //   flexDirection: 'row',
  //   alignItems: 'center',
  //   justifyContent: 'space-between',
  //   flex: 1
  // },
  playlistWrapper: {
    flex: 1,
    backgroundColor: evenDarkerGrey,
    padding: 10
  },
  playlist: {
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
  playlistButtons: {
    flexDirection: 'row',
    flex: 1
  },
  playlistImage: {
    width: 50,
    height: 50,
    borderWidth: 0.5,
    borderColor: sGrey
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
  return () => (
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
    artists: track.artists.map(({name})=>name),
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
  url: "<REDACTED>",
  region: "us-west-2",
  auth: {
      type: AUTH_TYPE.AWS_IAM,
      credentials: new AWS.Credentials({
        accessKeyId: "<REDACTED>",
        secretAccessKey: "<REDACTED>"
      })
  },
  disableOffline: true
});

const visitSong = id => {
  let url = "https://open.spotify.com/track/"+id;
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

const getPlaylistView = (playlist, play, isOwned, ...extraIcons) => {
  return (
    <View style={style.playlistWrapper}>
      <View style={style.playlist}>
        <View style={style.playlistData}>
          {
            playlist.image ?
            <Image style={style.playlistImage} source={{uri: playlist.image}}/> :
            <Icon containerStyle={style.playlistImage} color={sWhite} name="music" type="feather"/>
          }
          <View style={style.playlistDetails}>
            <Text ellipsizeMode='tail' numberOfLines={1} style={style.text}>{playlist.name}</Text>
            <Text ellipsizeMode='tail' numberOfLines={1} style={{...style.smallText, color: sGrey}}>{playlist.ownerName}</Text>
          </View>
        </View>
        <View style={style.playlistIcons}>
          {extraIcons.map((icon, i) => (
            <Icon containerStyle={style.playlistIcon} size={21} color={sWhite} name={icon} type="font-awesome" key={i}/>
          ))}
        </View>
      </View>
      <View style={{flexDirection: 'row', marginTop: 10}}>
        <TouchableOpacity onPress={()=>visitPlaylist(playlist.ownerId, getPlaylistId(playlist.id))} style={{padding: 10, paddingTop: 2, paddingBottom: 2, borderRadius: 20, borderWidth: 1, borderColor: sWhite, flexDirection: 'row', marginRight: 10, alignItems: 'center'}}>
          <Icon containerStyle={{marginRight: 5}} size={21} color={sWhite} name="spotify" type="font-awesome"/>
          <Text style={style.smallText}>Visit in Spotify</Text>
        </TouchableOpacity>
        {
          isOwned ?
          <TouchableOpacity onPress={()=>play()} style={{padding: 10, paddingTop: 2, paddingBottom: 2, borderRadius: 20, borderWidth: 1, borderColor: sWhite, flexDirection: 'row', alignItems: 'center'}}>
            <Icon containerStyle={{marginRight: 5}} size={21} color={sWhite} name="play" type="material-community"/>
            <Text style={style.smallText}>Play Music</Text>
          </TouchableOpacity> :
          <TouchableOpacity onPress={()=>play()} style={{padding: 10, paddingTop: 2, paddingBottom: 2, borderRadius: 20, borderWidth: 1, borderColor: sWhite, flexDirection: 'row', alignItems: 'center'}}>
            <Icon containerStyle={{marginRight: 5}} size={21} color={sWhite} name="door-open" type="material-community"/>
            <Text style={style.smallText}>Connect to DJ</Text>
          </TouchableOpacity>
        }
      </View>
    </View>
  );
};

const getPlaylistModal = (playlist, play, isOwned, addFunc, isAdded, removeFunc) => (
  playlist ?
  <View style={style.modalView}>
    <View style={{...style.modalBorder, ...style.modalItem}}>
      {
        playlist.image ?
        <Image style={style.modalImage} source={{uri: playlist.image}}/> :
        <Icon containerStyle={style.modalImage} color={sWhite} name="music" type="feather"/>
      }
      <View style={style.modalDetails}>
        {globals.getScrollableText(playlist.name)}
        {globals.getScrollableText(playlist.ownerName, {...style.smallText, color: sGrey})}
      </View>
    </View>
    {
      addFunc &&
      <TouchableOpacity disabled={isAdded} style={{...style.modalBorder, ...style.modalItem, opacity: 1-isAdded*.5, justifyContent: 'space-between'}} onPress={addFunc}>
        <View style={{flexDirection:'row'}}>
          <Icon containerStyle={style.modalIcon} color={sWhite} name="plus" type="material-community"/>
          <Text style={style.text}>Add as Favorite</Text>
        </View>
        {
          isAdded &&
          <Badge value="Added" textStyle={{ color: sWhite }}/>
        }
      </TouchableOpacity>
    }
    <TouchableOpacity style={{...style.modalBorder, ...style.modalItem}} onPress={()=>play()}>
      <Icon containerStyle={style.modalIcon} color={sWhite} name={isOwned ? "play" : "door-open"} type="material-community"/>
      <Text style={style.text}>{isOwned ? "Play Music" : "Connect to DJ"}</Text>
    </TouchableOpacity>
    {
      removeFunc &&
      <TouchableOpacity style={{...style.modalBorder, ...style.modalItem}} onPress={()=>removeFunc()}>
        <Icon containerStyle={style.modalIcon} color={sWhite} name="x" type="feather"/>
        <Text style={style.text}>Remove</Text>
      </TouchableOpacity>
    }
    <TouchableOpacity style={style.modalItem} onPress={()=>visitPlaylist(playlist.ownerId, getPlaylistId(playlist.id))}>
      <Icon containerStyle={style.modalIcon} color={sWhite} name="spotify" type="font-awesome"/>
      <Text style={style.text}>View in Spotify</Text>
    </TouchableOpacity>
  </View> :
  <View/>
);

const getScrollableText = (text, optionalStyle) => {
  return (
    <MarqueeText
      duration={text.length * 100} 
      marqueeOnStart 
      loop 
      numberOfLines={1} 
      style={optionalStyle || style.text}
    >
      {text}
    </MarqueeText>
  );
};

const getArtistsText = song => {
  if (song.artists) {
    return song.artists.join(', ');
  }
  return song.artist;
};

const getNewURI = (playlist) => {
  if(playlist.uri && playlist.uri.search(/spotify:user:/i) > -1) {
    return playlist.uri;
  } else {
    return playlist.owner.uri + ":playlist:" + playlist.id;
  }
};

const globals = {
  style,
  sBlue,
  sMiddle,
  sGreen,
  sBlack,
  sGrey,
  darkGrey,
  darkerGrey,
  evenDarkerGrey,
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
  getPlaylistModal,
  getScrollableText,
  getArtistsText,
  getNewURI
};


export default globals;
