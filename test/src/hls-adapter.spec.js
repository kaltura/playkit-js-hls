import playkit from 'playkit-js'
import sources from './hls-sources.json'
import {Track, VideoTrack, AudioTrack, TextTrack} from 'playkit-js'
import {TestUtils} from 'playkit-js'
//eslint-disable-next-line no-unused-vars
import HlsAdapter from '../../src/hls-adapter.js'

describe('HlsAdapter', function () {
  this.timeout(10000);
  let tracks;
  let videoTracks = [];
  let textTracks = [];
  let audioTracks = [];
  let player;

  function displayTracksOnScreen() {
    tracks = player.getTracks() || [];
    videoTracks = [];
    textTracks = [];
    audioTracks = [];
    tracks.filter((track) => {
      if (track instanceof AudioTrack) {
        audioTracks.push(track);
      } else if (track instanceof VideoTrack) {
        videoTracks.push(track);
      } else if (track instanceof TextTrack) {
        textTracks.push(track);
      }
    });
    TestUtils.createVideoTrackButtons(player, videoTracks);
    TestUtils.createAudioTrackButtons(player, audioTracks);
    TestUtils.createTextTrackButtons(player, textTracks);
  }

  it.only('should play hls stream - preload none', () => {
    player = playkit({
      sources: [
        sources.multi_subtitles
      ]
    });
    let video = document.getElementsByTagName("video")[0];
    video.onplaying = function () {
    };
    player.load().then(() => {
      displayTracksOnScreen();
      player.play();
      setTimeout(function () {
        player._engine._mediaSourceAdapter.enableAdaptiveBitrate();
        player.addEventListener(player.Event.VIDEO_TRACK_CHANGED, (event) => {
          let at = player._engine._mediaSourceAdapter._playerTracks;
          let pt = player.getTracks();
          at.should.deep.equal(pt);
          // player.destroy();
          // done();
        });
      }, 2000);
    });
  });

  it('should play hls stream - preload auto', (done) => {
    let player = playkit({
      preload: "auto",
      sources: [{
        mimetype: "application/x-mpegurl",
        url: "http://www.streambox.fr/playlists/test_001/stream.m3u8"
      }]
    });
    let video = document.getElementsByTagName("video")[0];
    video.onplaying = function () {
      player.destroy();
      done();
    };
    player.load();
    player.play();
  });
});
