import { StyleSheet, View, TextInput, ActivityIndicator } from 'react-native';
import { Icon } from 'react-native-elements';
import React from 'react';
import * as AWS from 'aws-sdk';
import { AUTH_TYPE } from "aws-appsync/lib/link/auth-link";
import AWSAppSyncClient from "aws-appsync/lib";
import Spotify from 'rn-spotify-sdk';
import StoredPlaylist from './StoredPlaylist';


const sBlue = '#43e5f8'//'#84bd00',
      sMiddle = '#20f3cb',
      sGreen = '#04fea6'
      sBlack = '#000000',
      sGrey = '#929292',
      darkGrey = '#333333',
      darkerGrey = '#282828',
      sSand = '#ecebe8',
      sWhite = '#ffffff',
      spotifyGreen = "#1DB954";

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
    marginLeft: 10,
    flex: .75
  }
});

const createSearchTextInput = (onChangeText, onSubmitEditing) => {
  return () => (
    <View style={style.textInputContainer}>
      <Icon type="evilicons" name="search" color={sWhite}/>
      <TextInput 
        style={style.textInput} 
        blurOnSubmit={true} 
        enablesReturnKeyAutomatically={true} 
        autoCapitalize="none" 
        spellCheck={false}
        onChangeText={onChangeText}
        onSubmitEditing={onSubmitEditing}
      />
    </View>
  );
};
const Loader = () => {
  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <ActivityIndicator size="large" color={globals.sWhite}/>
    </View>
  );
};

const getSongsAsObjects = (songs) => {
  return songs.map(s => JSON.parse(s));
};

const getSongData = (track) => {
  return {
    id: track.id,
    name: track.name,
    artist: track.artists[0].name,
    duration: track.duration_ms/1000,
    image: track.album.images[0] && track.album.images[0].url
  };
};

const getSongsDataHTTP = (userId, playlistId, callback) => {
  Spotify.sendRequest(`v1/users/${userId}/playlists/${playlistId}/tracks`, "GET", {}, true).then(({items}) => {
    callback(items.map(({track}) => getSongData(track)));
  });
};

const requireSpotifyAuthorization = func => {
  if(!Spotify.isLoggedIn()){
    Spotify.login();
  } else {
    func();
  }
};

const requireSpotifyAuthorizationAndInjectUserDetails = func => {
  if(!Spotify.isLoggedIn()){
    Spotify.login();
  } else {
    Spotify.getMe().then(func);
  }
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
  spotifyGreen,
  Loader,
  createSearchTextInput,
  client,
  getSongData,
  getSongsDataHTTP,
  getSongsAsObjects,
  requireSpotifyAuthorization,
  requireSpotifyAuthorizationAndInjectUserDetails,
  localPlaylists: new StoredPlaylist(),
};


export default globals;
