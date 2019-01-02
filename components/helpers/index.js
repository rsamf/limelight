import { StyleSheet, View, TextInput, ActivityIndicator } from 'react-native';
import { Icon } from 'react-native-elements';
import React from 'react';
import * as AWS from 'aws-sdk';
import { AUTH_TYPE } from "aws-appsync/lib/link/auth-link";
import AWSAppSyncClient from "aws-appsync/lib";
import Spotify from 'rn-spotify-sdk';

const sBlue = '#23a5c8'//'#43e5f8',//'#84bd00'
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

const createSearchTextInput = (onChangeText, onSubmitEditing) => {
  return () => (
    <View style={style.textInputContainer}>
      <Icon name="search" color={sWhite}/>
      <TextInput 
        style={style.textInput} 
        blurOnSubmit={true} 
        enablesReturnKeyAutomatically={true} 
        autoCapitalize="none" 
        spellCheck={false}
        onChangeText={(text)=>onChangeText(text)}
        onSubmitEditing={onSubmitEditing}
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
      />
    </View>
  )
};
const Loader = () => {
  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <ActivityIndicator size="large" color={globals.sGrey}/>
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
    state: 0
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
  client,
};


export default globals;
