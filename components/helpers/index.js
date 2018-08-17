import { StyleSheet, View, ActivityIndicator } from 'react-native';
import React from 'react';
import * as AWS from 'aws-sdk';
import AWSAppSyncClient from "aws-appsync/lib";
import Spotify from 'rn-spotify-sdk';
import StoredPlaylist from './StoredPlaylist';


const sBlue = '#43e5f8'//'#84bd00',
      sMiddle = '#20f3cb',
      sGreen = '#04fea6'
      sBlack = '#000000',
      sGrey = '#828282',
      sSand = '#ecebe8',
      sWhite = '#ffffff';

const style = StyleSheet.create({
  view: {
    backgroundColor: sBlack,
    flex: 1
  },
  text: {
    color: sWhite,
    fontFamily: 'Futura',
    fontSize: 24
  },
  smallText:{
    color: sSand,
    fontFamily: 'Futura',
    fontSize: 16
  },
  textInput: {
    backgroundColor: sWhite,
    fontFamily: 'Futura',
    fontSize: 24,
    width: 200,
    padding: 20
  },
  smallTextInput: {
    backgroundColor: sWhite,
    fontFamily: 'Futura',
    fontSize: 16,
    width: 100,
    padding: 5
  },
  textInputFailed: {
    backgroundColor: sWhite,
    fontFamily: 'Futura',
    fontSize: 24,
    width: 200,
    borderBottomColor: 'red',
    borderBottomWidth: 3,
    padding: 20
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
  }
});

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

const AppSync = {
  "graphqlEndpoint": "https://347hiw7ofbe5jhcgcaz43mcszy.appsync-api.us-west-2.amazonaws.com/graphql",
  "region": "us-west-2",
  // "authenticationType": "AWS_IAM",
  "authenticationType": "API_KEY",
  "apiKey": "da2-pgysebhe6rbfbosewzj675jgpu"
};

const client = new AWSAppSyncClient({
  url: AppSync.graphqlEndpoint,
  region: AppSync.region,
  auth: {
      type: AppSync.authenticationType,
      apiKey: AppSync.apiKey,
  },
  disableOffline: true
  // credentials: new AWS.Credentials({
  //   accessKeyId: "AKIAJVF5BO4TV7IJIRYA",
  //   secretAccessKey: "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"
  // })
});

const globals = {
  style,
  sBlue,
  sMiddle,
  sGreen,
  sBlack,
  sGrey,
  sSand,
  sWhite,
  AppSync,
  Loader,
  client,
  getSongData,
  getSongsDataHTTP,
  getSongsAsObjects,
  requireSpotifyAuthorization,
  requireSpotifyAuthorizationAndInjectUserDetails,
  localPlaylists: new StoredPlaylist(),
};


export default globals;
