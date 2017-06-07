import playkit from 'playkit-js'
import {/* Track, */ VideoTrack, AudioTrack, TextTrack} from 'playkit-js'
import {TestUtils} from 'playkit-js'
import HlsAdapter from '../../src/hls-adapter.js'
import * as hls_sources from './json/hls_sources.json'
import * as hls_tracks from './json/hls_tracks.json'
import * as player_tracks from './json/player_tracks.json'

describe('HlsAdapter.canPlayType', function () {
  it('should return true to application/x-mpegurl', function () {
    HlsAdapter.canPlayType('application/x-mpegurl').should.be.true;
  });

  it('should return true to application/X-MpegUrl', function () {
    HlsAdapter.canPlayType('application/X-MpegUrl').should.be.true;
  });

  it('should return true to application/vnd.apple.mpegurl', function () {
    HlsAdapter.canPlayType('application/vnd.apple.mpegurl').should.be.true;
  });

  it('should return true to audio/mpegurl', function () {
    HlsAdapter.canPlayType('audio/mpegurl').should.be.true;
  });

  it('should return true to audio/x-mpegurl', function () {
    HlsAdapter.canPlayType('audio/x-mpegurl').should.be.true;
  });

  it('should return true to video/x-mpegurl', function () {
    HlsAdapter.canPlayType('video/x-mpegurl').should.be.true;
  });

  it('should return true to video/mpegurl', function () {
    HlsAdapter.canPlayType('video/mpegurl').should.be.true;
  });

  it('should return true to application/mpegurl', function () {
    HlsAdapter.canPlayType('application/mpegurl').should.be.true;
  });

  it('should return false to video/mp4', function () {
    HlsAdapter.canPlayType('video/mp4').should.be.false;
  });

  it('should return false to unvalid mimetype', function () {
    HlsAdapter.canPlayType('dummy').should.be.false;
  });
});

describe('HlsAdapter.name', function () {
  it('should be named HlsAdapter', function () {
    HlsAdapter.name.should.equal('HlsAdapter');
  });

  it('should not set a new name', function () {
    HlsAdapter.name = 'Hls';
    HlsAdapter.name.should.equal('HlsAdapter');
  });
});

describe('HlsAdapter Instance - Unit', function () {
  let hlsAdapterInstance;
  let video;
  let sourceObj;
  let config;
  let sandbox;

  beforeEach(function () {
    sandbox = sinon.sandbox.create();
    video = document.createElement('video');
    sourceObj = hls_sources.ElephantsDream;
    config = {};
    hlsAdapterInstance = HlsAdapter.createAdapter(video, sourceObj, config);
  });

  afterEach(function () {
    sandbox.restore();
    hlsAdapterInstance.destroy();
    hlsAdapterInstance = null;
    video = null;
    TestUtils.removeVideoElementsFromTestPage();
  });

  it('should create hls adapter properties', function () {
    hlsAdapterInstance._videoElement.should.deep.equal(video);
    hlsAdapterInstance._config.should.deep.equal(config);
    hlsAdapterInstance._sourceObj.should.deep.equal(sourceObj);
    hlsAdapterInstance._hls.should.exists;
    hlsAdapterInstance.src.should.be.empty;
  });

  it('should load the adapter', function (done) {
    hlsAdapterInstance.load().then((/* data */) => {
      hlsAdapterInstance._playerTracks.should.be.array;
      hlsAdapterInstance.src.should.equal(hls_sources.ElephantsDream.url);
      done();
    });
  });

  it('should destroy the adapter', function (done) {
    hlsAdapterInstance.load().then((/* data */) => {
      let detachMediaSpier = sandbox.spy(hlsAdapterInstance._hls, 'detachMedia');
      let destroySpier = sandbox.spy(hlsAdapterInstance._hls, 'destroy');
      hlsAdapterInstance.destroy();
      (hlsAdapterInstance._loadPromise === null).should.be.true;
      (hlsAdapterInstance._sourceObj === null).should.be.true;
      detachMediaSpier.should.have.been.called;
      destroySpier.should.have.been.called;
      done();
    });
  });

  it('should parse the hls audio tracks into player audio tracks', function () {
    hlsAdapterInstance._hls = {
      audioTrack: 1,
      detachMedia: function () {
      },
      destroy: function () {
      }
    };
    let audioTracks = hlsAdapterInstance._parseAudioTracks(hls_tracks.audioTracks);
    audioTracks.should.deep.equals(player_tracks.audioTracks);
  });

  it('should parse the hls levels into player video tracks', function () {
    hlsAdapterInstance._hls = {
      startLevel: 1,
      detachMedia: function () {
      },
      destroy: function () {
      }
    };
    let videoTracks = hlsAdapterInstance._parseVideoTracks(hls_tracks.levels);
    videoTracks.should.deep.equals(player_tracks.videoTracks);
  });

  it('should parse the video tag text tracks into player text tracks', function () {
    hlsAdapterInstance._hls = {
      detachMedia: function () {
      },
      destroy: function () {
      }
    };
    let textTracks = hlsAdapterInstance._parseTextTracks(hls_tracks.subtitles);
    textTracks.should.deep.equals(player_tracks.textTracks);
  });

  it('should parse all hls tracks into player tracks', function () {
    let data = {
      audioTracks: hls_tracks.audioTracks,
      levels: hls_tracks.levels
    };
    hlsAdapterInstance._videoElement = {
      textTracks: hls_tracks.subtitles
    };
    hlsAdapterInstance._hls = {
      audioTrack: 1,
      startLevel: 1,
      detachMedia: function () {
      },
      destroy: function () {
      }
    };
    let tracks = hlsAdapterInstance._parseTracks(data);
    let allTracks = player_tracks.audioTracks.concat(player_tracks.videoTracks).concat(player_tracks.textTracks);
    tracks.should.deep.equals(allTracks);
  });

  it('should disable all text tracks', function () {
    hlsAdapterInstance._videoElement = {
      textTracks: hls_tracks.subtitles
    };
    hlsAdapterInstance._disableAllTextTracks();
    for (let i = 0; i < hlsAdapterInstance._videoElement.textTracks.length; i++) {
      hlsAdapterInstance._videoElement.textTracks[i].mode.should.equal('hidden');
    }
  });

  it('should enable adaptive bitrate', function () {
    hlsAdapterInstance._hls = {
      on: function () {
      },
      nextLevel: 0,
      detachMedia: function () {
      },
      destroy: function () {
      }
    };
    hlsAdapterInstance.enableAdaptiveBitrate();
    hlsAdapterInstance._hls.nextLevel.should.equal(-1);
  });

  it('should dispatch event with the selected video track', function (done) {
    let data = {level: 3};
    hlsAdapterInstance._hls = {
      autoLevelEnabled: true,
      detachMedia: function () {
      },
      destroy: function () {
      }
    };
    hlsAdapterInstance._playerTracks = player_tracks.audioTracks.concat(player_tracks.videoTracks).concat(player_tracks.textTracks);
    hlsAdapterInstance._playerTracks.find = function () {
      return hlsAdapterInstance._playerTracks[6];
    };
    sandbox.stub(hlsAdapterInstance, 'dispatchEvent').callsFake(function (event) {
      event.type.should.equal(HlsAdapter.CustomEvents.VIDEO_TRACK_CHANGED);
      event.payload.selectedVideoTrack.should.exists;
      event.payload.selectedVideoTrack.should.deep.equals(hlsAdapterInstance._playerTracks[6]);
      done();
    });
    hlsAdapterInstance._onLevelSwitched('hlsLevelSwitched', data);
  });
});

describe('HlsAdapter Instance - Integration', function () {
  let player;
  let sandbox;
  this.timeout(10000);

  before(() => {
    sandbox = sinon.sandbox.create();
    player = playkit({
      sources: [
        hls_sources.ElephantsDream
      ]
    });
  });

  after(() => {
    sandbox.restore();
    player.destroy();
    player = null;
    TestUtils.removeVideoElementsFromTestPage();
  });

  it('should run player with hls adapter', function (done) {
    player.load().then(() => {
      let mediaSourceAdapter = player._engine._mediaSourceAdapter;
      if (mediaSourceAdapter instanceof HlsAdapter) {
        // Test get tracks api
        let tracks = player.getTracks();
        let videoTracks = player.getTracks(player.Track.VIDEO);
        let audioTracks = player.getTracks(player.Track.AUDIO);
        let textTracks = player.getTracks(player.Track.TEXT);
        player.src.should.equal(hls_sources.ElephantsDream.url);
        tracks.length.should.equal(14);
        videoTracks.length.should.equal(4);
        audioTracks.length.should.equal(3);
        textTracks.length.should.equal(7);
        // Listen to tracks events
        player.addEventListener(player.Event.VIDEO_TRACK_CHANGED, (event) => {
          event.payload.selectedVideoTrack.should.exists;
          event.payload.selectedVideoTrack.active.should.be.true;
          event.payload.selectedVideoTrack.index.should.be.equal(0);
          player.selectTrack(textTracks[0]);
        });
        player.addEventListener(player.Event.TEXT_TRACK_CHANGED, (event) => {
          event.payload.selectedTextTrack.should.exists;
          event.payload.selectedTextTrack.active.should.be.true;
          event.payload.selectedTextTrack.index.should.be.equal(0);
          player.selectTrack(audioTracks[0]);
        });
        player.addEventListener(player.Event.AUDIO_TRACK_CHANGED, (event) => {
          event.payload.selectedAudioTrack.should.exists;
          event.payload.selectedAudioTrack.active.should.be.true;
          event.payload.selectedAudioTrack.index.should.be.equal(0);
          done();
        });
        player.selectTrack(videoTracks[0]);
      } else {
        done();
      }
    });
  });
});

describe.skip('HlsAdapter [debugging and testing manually (skip)]', function (done) {
  this.timeout(10000);
  let tracks;
  let videoTracks = [];
  let textTracks = [];
  let audioTracks = [];
  let player;

  /**
   * Displays track buttons on test page.
   * @returns {void}
   */
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

  it('should play hls stream', () => {
    player = playkit({
      sources: [
        hls_sources.ElephantsDream
      ]
    });
    player.load().then(() => {
      displayTracksOnScreen();
      /*
       player.addEventListener(player.Event.VIDEO_TRACK_CHANGED, (event) => {
       });
       player.addEventListener(player.Event.TEXT_TRACK_CHANGED, (event) => {
       });
       player.addEventListener(player.Event.AUDIO_TRACK_CHANGED, (event) => {
       });
       */
      player.addEventListener(player.Event.PLAYING, (/* event */) => {
        done();
      });
      player.play();
    });
  });
});
