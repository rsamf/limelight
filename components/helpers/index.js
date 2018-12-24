import { StyleSheet, View, TextInput, ActivityIndicator } from 'react-native';
import { Icon } from 'react-native-elements';
import React from 'react';
import * as AWS from 'aws-sdk';
import { AUTH_TYPE } from "aws-appsync/lib/link/auth-link";
import AWSAppSyncClient from "aws-appsync/lib";
import Spotify from 'rn-spotify-sdk';
import StoredPlaylist from './StoredPlaylist';
import AddPlaylistMutation from '../../GQL/mutations/AddPlaylist';
import AddSongListMutation from '../../GQL/mutations/AddSongList';
import DeletePlaylistMutation from '../../GQL/mutations/DeletePlaylist';


const sBlue = '#43e5f8'//'#84bd00',
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
const createTextInput = (onChangeText, onSubmitEditing) => {
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

const getSongsFromPlaylist = playlist => {
  if(playlist.tracks && playlist.tracks.items) {
    return playlist.tracks.items.map(getSongData);
  }
  return [];
}
const getSongsDataHTTP = (userId, playlistId, callback) => {
  Spotify.sendRequest(`v1/users/${userId}/playlists/${playlistId}/tracks`, "GET", {}, true).then(({items}) => {
    callback(items.map(({track}) => getSongData(track)));
  });
};

const rsa = func => {
  if(!Spotify.isLoggedIn()){
    Spotify.login();
  } else {
    func();
  }
};

const rsa_ud = func => {
  if(!Spotify.isLoggedIn()){
    Spotify.login();
  } else {
    Spotify.getMe().then(func);
  }
};

const addPlaylistToAWS = (playlist, user, callback) => {
  const sendPlaylistMutation = (callback) => {
    const variables = {
      id: playlist.uri,
      name: playlist.name,
      ownerId: user.id,
      ownerName: user.display_name,
      // Elvis-operator plz xD
      image: (playlist.images && playlist.images[0] && playlist.images[0].url) || (user.images && user.images[0] && user.images[0].url)
    };
    client.mutate({
      mutation: AddPlaylistMutation,
      variables
    }).then(({data})=>{callback(data)});
  };
  const sendSongsMutation = (callback) => {
    const variables = { id: playlist.uri, songs: getSongsFromPlaylist(playlist) };
    client.mutate({
      mutation: AddSongListMutation,
      variables
    }).then(({data})=>{callback(data)});
  };
  if(user.id === playlist.owner.id) {
    sendPlaylistMutation(() => {
      sendSongsMutation((data) => {
        callback(data.addSongList.songs);
      });
    });
  } else {
    callback(null);
  }
};

const getPlaylistFromSpotify = (playlistId, callback) => {
  Spotify.sendRequest(`v1/playlists/${playlistId}`, "GET", {}, true)
  .then((data)=>callback(data))
  .catch((error)=>callback(null, error));
};

const getPlaylistId = uri => uri.substring(uri.search(/playlist:/g) + 9);
const getUserId = uri => uri.substring(uri.search(/user:/g) + 5, uri.search(/:playlist/g));
const getMyPlaylists = (user, func) => {
  Spotify.sendRequest('v1/me/playlists', "GET", {}, true).then(({items}) => {
    let filtered = items.filter((playlist) => playlist.owner.id === user.id);
    let mapped = filtered.map(playlist => ({
      id: playlist.uri,
      ownerId: playlist.owner.id,
      image: playlist.images && playlist.images[0] && playlist.images[0].url,
      name: playlist.name
    }));
    func(mapped);
  });
};

const goToBar = (playlist, user, navigation) => {
  if(playlist.ownerId === user.id) {
    getPlaylistFromSpotify(getPlaylistId(playlist.id), (data, error) => {
      if(data) {
        navigation.navigate('Bar', playlist.id);
      } else {
        client.mutate({
          mutation: DeletePlaylistMutation,
          variables: {id: playlist.id}
        });
        //remove from userplaylists and popup message saying playlist was deleted
      }
    });
  } else {
    navigation.navigate('Bar', playlist.id);
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
  darkRed,
  spotifyGreen,
  Loader,
  createSearchTextInput,
  createTextInput,
  client,
  getSongData,
  getSongsDataHTTP,
  getSongsAsObjects,
  rsa,
  rsa_ud,
  addPlaylistToAWS,
  goToBar,
  getPlaylistId,
  getUserId,
  getMyPlaylists,
  localPlaylists: new StoredPlaylist(),
};


export default globals;
