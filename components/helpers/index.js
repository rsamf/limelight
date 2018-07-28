import { StyleSheet, View, ActivityIndicator } from 'react-native';
import React from 'react';
import * as AWS from 'aws-sdk';
import AWSAppSyncClient from "aws-appsync/lib";
import Spotify from 'rn-spotify-sdk';
import StoredPlaylist from './StoredPlaylist';


const sGreen = '#84bd00',
      sBlack = '#000000',
      sGrey = '#828282',
      sSand = '#ecebe8',
      sWhite = '#ffffff';

const style = StyleSheet.create({
  view: {
    backgroundColor: 'black',
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
    backgroundColor: 'white',
    fontFamily: 'Futura',
    fontSize: 24,
    width: 200
  },
  textInputFailed: {
    backgroundColor: 'white',
    fontFamily: 'Futura',
    fontSize: 24,
    width: 200,
    borderBottomColor: 'red',
    borderBottomWidth: 3
  },
  button: {
    margin: 10
  }
});

const Loader = () => {
  return (
    <View style={{height: 100, justifyContent: 'center', alignItems: 'center'}}>
      <ActivityIndicator size="large" color={globals.sGreen}/>
    </View>
  );
};


const getSongData = (track) => {
  return JSON.stringify({
    id: track.id,
    name: track.name,
    artist: track.artists[0].name,
    duration: track.duration_ms/1000,
    image: track.album.images[0].url,
    votes: track.votes || 0,
  });
};

const getSongsData = (tracks) => {
  return tracks.map(t => getSongsData(t));
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
  "apiKey": "da2-sx6yn4py2rf2zpreqrweh7kq3m"
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
  sGreen,
  sBlack,
  sGrey,
  sSand,
  sWhite,
  AppSync,
  Loader,
  client,
  getSongData,
  getSongsData,
  getSongsDataHTTP,
  requireSpotifyAuthorization,
  requireSpotifyAuthorizationAndInjectUserDetails,
  localPlaylists: new StoredPlaylist(),
};


export default globals;
