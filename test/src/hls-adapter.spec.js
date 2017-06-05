import playkit from 'playkit-js'
import sources from './hls-sources.json'
import {Track, VideoTrack, AudioTrack, TextTrack} from 'playkit-js'
//eslint-disable-next-line no-unused-vars
import HlsAdapter from '../../src/hls-adapter.js'

describe('HlsAdapter', function () {
  this.timeout(4000);
  let tracks;
  let videoTracks = [];
  let textTracks = [];
  let audioTracks = [];
  let player;

  function displayTracksOnScreen() {
    tracks = player.getTracks();
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
    createVideoTrackButtons(videoTracks);
    createAudioTrackButtons(audioTracks);
    createTextTrackButtons(textTracks);
  }

  function createTitle(title) {
    let header = document.createElement("header");
    let h4 = document.createElement("h4");
    h4.textContent = title;
    header.appendChild(h4);
    document.body.appendChild(header);
  }

  function createElement(track) {
    let element = document.createElement("BUTTON");
    element.innerText = track.label;
    element.id = track.index;
    document.body.appendChild(element);
    return element;
  }

  function createVideoTrackButtons(videoTracks) {
    createTitle("Video Tracks");
    for (let i = 0; i < videoTracks.length; i++) {
      let element = createElement(videoTracks[i]);
      element.onclick = function () {
        player.selectTrack(videoTracks[i]);
      };
    }
  }

  function createAudioTrackButtons(audioTracks) {
    createTitle("Audio Tracks");
    for (let i = 0; i < audioTracks.length; i++) {
      let element = createElement(audioTracks[i]);
      element.onclick = function () {
        player.selectTrack(audioTracks[i]);
      };
    }
  }

  function createTextTrackButtons(textTracks) {
    createTitle("Text Tracks");
    for (let i = 0; i < textTracks.length; i++) {
      let element = createElement(textTracks[i]);
      element.onclick = function () {
        player.selectTrack(textTracks[i]);
      };
    }
  }

  it.only('should play hls stream - preload none', () => {
    player = playkit({
      sources: [
        sources.multi_subtitles
      ]
    });
    let video = document.getElementsByTagName("video")[0];
    video.onplaying = function () {
      // done();
    };
    player.load().then(() => {
      displayTracksOnScreen();
      player.play();
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
