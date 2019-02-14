import MusicControl from 'react-native-music-control';

export default {
  init: (playFunction, pauseFunction, nextFunction, seekBackwardFunction) => {
    MusicControl.enableBackgroundMode(true);
    MusicControl.enableControl('play', true);
    MusicControl.enableControl('pause', true);
    MusicControl.enableControl('nextTrack', true);
    MusicControl.enableControl('seekBackward', true);
    MusicControl.on('play', playFunction);
    MusicControl.on('pause', pauseFunction);
    MusicControl.on('nextTrack', nextFunction);
    MusicControl.on('seekBackward', seekBackwardFunction);
  },
  setSong: (song) => {
    MusicControl.setNowPlaying({
      title: song.name,
      artwork: song.image,
      artist: song.artist,
      duration: song.duration
    });
    MusicControl.updatePlayback({
      state: MusicControl.STATE_PLAYING, // (STATE_ERROR, STATE_STOPPED, STATE_PLAYING, STATE_PAUSED, STATE_BUFFERING)
      speed: 1, // Playback Rate
      elapsedTime: 0 // (Seconds)
    });
  },
  updateSong: (state, elapsedTime) => {
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