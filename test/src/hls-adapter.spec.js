import loadPlayer from 'playkit-js'
import {VideoTrack, AudioTrack, TextTrack} from 'playkit-js'
import * as TestUtils from 'playkit-js/test/src/utils/test-utils'
import HlsAdapter from '../../src/hls-adapter.js'
import * as hls_sources from './json/hls_sources.json'
import * as hls_tracks from './json/hls_tracks.json'
import * as player_tracks from './json/player_tracks.json'

const targetId = 'player-placeholder_hls-adapter.spec';

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

  it('should return false to invalid mimetype', function () {
    HlsAdapter.canPlayType('dummy').should.be.false;
  });

  it('should return false to nullable mimetype', function () {
    HlsAdapter.canPlayType(null).should.be.false;
  });

  it('should return false to empty mimetype', function () {
    HlsAdapter.canPlayType().should.be.false;
  });
});

describe('HlsAdapter.id', function () {
  it('should be named HlsAdapter', function () {
    HlsAdapter.id.should.equal('HlsAdapter');
  });
});

describe('HlsAdapter Instance - Unit', function () {
  this.timeout(10000);

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
    hlsAdapterInstance._hls.should.exist;
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
      },
      off: function () {
      }
    };
    let audioTracks = hlsAdapterInstance._parseAudioTracks(hls_tracks.audioTracks);
    JSON.parse(JSON.stringify(audioTracks)).should.deep.equal(player_tracks.audioTracks);
  });

  it('should parse the hls levels into player video tracks', function () {
    hlsAdapterInstance._hls = {
      startLevel: 1,
      detachMedia: function () {
      },
      destroy: function () {
      },
      off: function () {
      }
    };
    let videoTracks = hlsAdapterInstance._parseVideoTracks(hls_tracks.levels);
    JSON.parse(JSON.stringify(videoTracks)).should.deep.equal(player_tracks.videoTracks);
  });

  it('should parse the video tag text tracks into player text tracks', function () {
    hlsAdapterInstance._hls = {
      detachMedia: function () {
      },
      destroy: function () {
      },
      off: function () {
      }
    };
    let textTracks = hlsAdapterInstance._parseTextTracks(hls_tracks.subtitles);
    JSON.parse(JSON.stringify(textTracks)).should.deep.equal(player_tracks.textTracks);
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
      },
      off: function () {
      }
    };
    let tracks = hlsAdapterInstance._parseTracks(data);
    let allTracks = player_tracks.audioTracks.concat(player_tracks.videoTracks).concat(player_tracks.textTracks);
    JSON.parse(JSON.stringify(tracks)).should.deep.equal(allTracks);
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

  it('should hide the active text track', function () {
    hlsAdapterInstance._videoElement = {
      textTracks: hls_tracks.subtitles
    };
    hlsAdapterInstance._videoElement.textTracks[0].mode = 'showing';
    hlsAdapterInstance.hideTextTrack();
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
      },
      off: function () {
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
      },
      off: function () {
      }
    };
    hlsAdapterInstance._playerTracks = [
      new VideoTrack({
        "bandwidth": 2962000,
        "active": false,
        "label": "Main",
        "language": "",
        "index": 0
      }),
      new VideoTrack({
        "bandwidth": 1427000,
        "active": true,
        "label": "Main",
        "language": "",
        "index": 1
      }),
      new VideoTrack({
        "bandwidth": 688000,
        "active": false,
        "label": "Main",
        "language": "",
        "index": 2
      }),
      new VideoTrack({
        "bandwidth": 331000,
        "active": false,
        "label": "Main",
        "language": "",
        "index": 3
      })
    ];

    sandbox.stub(hlsAdapterInstance, 'dispatchEvent').callsFake(function (event) {
      event.type.should.equal(HlsAdapter.CustomEvents.VIDEO_TRACK_CHANGED);
      event.payload.selectedVideoTrack.should.exist;
      event.payload.selectedVideoTrack.should.deep.equal(hlsAdapterInstance._playerTracks[3]);
      done();
    });
    hlsAdapterInstance._onLevelSwitched('hlsLevelSwitched', data);
  });
});

describe('HlsAdapter Instance - Integration', function () {
  this.timeout(20000);

  let player;
  let tracks;
  let videoTracks;
  let audioTracks;
  let textTracks;

  before(function () {
    TestUtils.createElement('DIV', targetId);
  });

  beforeEach(function () {
    player = loadPlayer(targetId, {
      sources: {
        hls: [
          hls_sources.ElephantsDream
        ]
      }
    });
  });

  afterEach(function () {
    player.destroy();
    player = null;
    TestUtils.removeVideoElementsFromTestPage();
  });

  after(function () {
    TestUtils.removeElement(targetId);
  });

  /**
   * onVideoTrackChanged handler
   * @param {Object} done _
   * @param {FakeEvent} event _
   * @returns {void}
   */
  function onVideoTrackChanged(done, event) {
    player.removeEventListener(player.Event.VIDEO_TRACK_CHANGED, onVideoTrackChanged);
    player.addEventListener(player.Event.TEXT_TRACK_CHANGED, onTextTrackChanged.bind(null, done));
    event.payload.selectedVideoTrack.should.exist;
    event.payload.selectedVideoTrack.active.should.be.true;
    event.payload.selectedVideoTrack.index.should.equal(2);
    player.selectTrack(textTracks[6]);
  }

  /**
   * onTextTrackChanged handler
   * @param {Object} done _
   * @param {FakeEvent} event _
   * @returns {void}
   */
  function onTextTrackChanged(done, event) {
    player.removeEventListener(player.Event.TEXT_TRACK_CHANGED, onTextTrackChanged);
    player.addEventListener(player.Event.AUDIO_TRACK_CHANGED, onAudioTrackChanged.bind(null, done));
    event.payload.selectedTextTrack.should.exist;
    event.payload.selectedTextTrack.active.should.be.true;
    event.payload.selectedTextTrack.index.should.equal(6);
    player.selectTrack(audioTracks[2]);
  }

  /**
   * onAudioTrackChanged handler
   * @param {Object} done _
   * @param {FakeEvent} event _
   * @returns {void}
   */
  function onAudioTrackChanged(done, event) {
    player.removeEventListener(player.Event.AUDIO_TRACK_CHANGED, onAudioTrackChanged);
    event.payload.selectedAudioTrack.should.exist;
    event.payload.selectedAudioTrack.active.should.be.true;
    event.payload.selectedAudioTrack.index.should.equal(2);
    done();
  }

  it('should run player with hls adapter', function (done) {
    player.load();
    player.ready().then(() => {
      let mediaSourceAdapter = player._engine._mediaSourceAdapter;
      if (mediaSourceAdapter instanceof HlsAdapter) {
        player.play();
        tracks = player.getTracks();
        videoTracks = player.getTracks(player.Track.VIDEO);
        audioTracks = player.getTracks(player.Track.AUDIO);
        textTracks = player.getTracks(player.Track.TEXT);
        player.src.should.equal(hls_sources.ElephantsDream.url);
        tracks.length.should.equal(14);
        videoTracks.length.should.equal(4);
        audioTracks.length.should.equal(3);
        textTracks.length.should.equal(7);
        player.addEventListener(player.Event.VIDEO_TRACK_CHANGED, onVideoTrackChanged.bind(null, done));
        player.selectTrack(videoTracks[2]);
      } else {
        done();
      }
    });
  });
});

describe.skip('HlsAdapter [debugging and testing manually]', function (done) {
  this.timeout(20000);

  let tracks;
  let videoTracks = [];
  let textTracks = [];
  let audioTracks = [];
  let player;

  before(() => {
    TestUtils.createElement('DIV', targetId);
  });

  after(() => {
    TestUtils.removeElement(targetId);
  });

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
    player = loadPlayer(targetId, {
      sources: {
        hls: [
          hls_sources.ElephantsDream
        ]
      }
    });
    player.ready().then(() => {
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
    });
    player.play();
    window.player = player;
  });
});
