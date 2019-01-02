import Spotify from 'rn-spotify-sdk';

export default {
  initialize: () => {
    const spotifyOptions = {
      tokenSwapURL: "https://limelight-server.herokuapp.com/auth/swap",
      tokenRefreshURL: "https://limelight-server.herokuapp.com/auth/refresh",
      clientID: "65a08501d9e64abfb003fb795ee1a540",
      sessionUserDefaultsKey: "SpotifySession",
      redirectURL: "limelight://auth",
      scopes: [
        "playlist-modify-public", 
        "playlist-modify-private",
        "playlist-read-private", 
        "playlist-read-collaborative",
        "user-read-private", 
        "streaming"
      ],
    };
    Spotify.initialize(spotifyOptions).catch(() => {
      Alert.alert("Error in initializing Spotify");
    });
  },
  request: (path, method, data) => new Promise(async (resolve, reject) => {
    const { accessToken } = await Spotify.getAuthAsync();
    // const accessToken = "BQADxaaLpYPgGBIKiUkCo7Lm384YEJIoNSS5nfEC_xRirM5JNwMercRdhTCeXa28M2oihSrqw3s0SbxL84kX3nCBtMVGeyxc8cn6seZH4m6kOQdVTJHInzs81dCEpTrhXdUpZq_nUTDcGJ_TZGFDBChDEZk08DPMeIx35cEfzgLxunlvQu9uuYBwJvA3USWO"
    console.log("ACCESS TOKEN:", accessToken);
    let options = {
      method,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      }
    };
    if(data) {
      options.body = JSON.stringify(body);
    }
    fetch(`https://api.spotify.com/v1${path}`, options)
      .then((response) => response.json())
      .then((json) => {
        resolve(json);
      })
      .catch(reject); 
  })
};