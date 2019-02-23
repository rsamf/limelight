import MusicControl from 'react-native-music-control';
import globals from '../../util';

export default {
  init: (playFunction, pauseFunction, nextFunction) => {
    MusicControl.enableBackgroundMode(true);
    MusicControl.enableControl('play', true);
    MusicControl.enableControl('pause', true);
    MusicControl.enableControl('nextTrack', false);
    MusicControl.on('play', playFunction);
    MusicControl.on('pause', pauseFunction);
    MusicControl.on('nextTrack', nextFunction);
  },
  setSong: (song, playlistName) => {
    console.log("Setting song", song);
    MusicControl.setNowPlaying({
      title: song.name,
      artwork: song.image,
      artist: globals.getArtistsText(song),
      duration: song.duration,
      album: playlistName
    });
    MusicControl.updatePlayback({
      state: MusicControl.STATE_PLAYING, // (STATE_ERROR, STATE_STOPPED, STATE_PLAYING, STATE_PAUSED, STATE_BUFFERING)
      speed: 1, // Playback Rate
      elapsedTime: 0 // (Seconds)
    });
  },
  updateSong: (state, elapsedTime) => {
    console.log("TIME:", elapsedTime);
    MusicControl.updatePlayback({
      state: state ? MusicControl.STATE_PLAYING : MusicControl.STATE_PAUSED, // (STATE_ERROR, STATE_STOPPED, STATE_PLAYING, STATE_PAUSED, STATE_BUFFERING)
      speed: 1, // Playback Rate
      elapsedTime: elapsedTime // (Seconds)
    });
  },
  turnOff: () => {
    MusicControl.resetNowPlaying();
  }
};