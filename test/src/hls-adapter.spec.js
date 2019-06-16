import loadPlayer, {VideoTrack, AudioTrack, TextTrack, EventType, registerMediaSourceAdapter} from '@playkit-js/playkit-js';
import * as TestUtils from '../utils/test-utils';
import {Adapter} from '../../src';
import * as hls_sources from './json/hls_sources.json';
import * as hls_tracks from './json/hls_tracks.json';
import * as player_tracks from './json/player_tracks.json';

const targetId = 'player-placeholder_hls-adapter.spec';

describe('Adapter.canPlayDrm', function() {
  it('should return false for any input', function() {
    Adapter.canPlayDrm().should.be.false;
    Adapter.canPlayDrm(null).should.be.false;
    Adapter.canPlayDrm(null).should.be.false;
    Adapter.canPlayDrm([
      {
        certificate: undefined,
        licenseUrl:
          'https://udrm.kaltura.com//cenc/playready/license?custom_data=eyJjYV9zeXN0ZW0iOiJPVlAiLCJ1c2VyX3Rva2VuIjoiWlRGaU56azRNbU01TWpKaVl6a3dPRGxpTXpRelpUUTNZMkk0TXpJd1lUSXpNbVF6TVRNeFlud3hNRFk0TWpreU96RXdOamd5T1RJN01UUTVNREkxTWprNU1qc3dPekUwT1RBeE5qWTFPVEl1T0RVeU1Uc3dPM1pwWlhjNktpeDNhV1JuWlhRNk1UczciLCJhY2NvdW50X2lkIjoxMDY4MjkyLCJjb250ZW50X2lkIjoiMV9yd2JqM2owYSIsImZpbGVzIjoiMV85MmRmeXJ6NSwxXzlkaGg2bTBpLDFfenVkb3V1YWgsMV9yMHd1Nnk3NywxX296MzQza2xhIn0%3D&signature=AZaaKvEx5j8CAh6VMSZbGzmUK1A%3D',
        scheme: 'com.microsoft.playready'
      },
      {
        certificate: undefined,
        licenseUrl:
          'https://udrm.kaltura.com//cenc/widevine/license?custom_data=eyJjYV9zeXN0ZW0iOiJPVlAiLCJ1c2VyX3Rva2VuIjoiWlRGaU56azRNbU01TWpKaVl6a3dPRGxpTXpRelpUUTNZMkk0TXpJd1lUSXpNbVF6TVRNeFlud3hNRFk0TWpreU96RXdOamd5T1RJN01UUTVNREkxTWprNU1qc3dPekUwT1RBeE5qWTFPVEl1T0RVeU1Uc3dPM1pwWlhjNktpeDNhV1JuWlhRNk1UczciLCJhY2NvdW50X2lkIjoxMDY4MjkyLCJjb250ZW50X2lkIjoiMV9yd2JqM2owYSIsImZpbGVzIjoiMV85MmRmeXJ6NSwxXzlkaGg2bTBpLDFfenVkb3V1YWgsMV9yMHd1Nnk3NywxX296MzQza2xhIn0%3D&signature=AZaaKvEx5j8CAh6VMSZbGzmUK1A%3D',
        scheme: 'com.widevine.alpha'
      }
    ]).should.be.false;
  });
});

describe('Adapter.canPlayType', function() {
  it('should return true to application/x-mpegurl', function() {
    Adapter.canPlayType('application/x-mpegurl').should.be.true;
  });

  it('should return true to application/X-MpegUrl', function() {
    Adapter.canPlayType('application/X-MpegUrl').should.be.true;
  });

  it('should return true to application/vnd.apple.mpegurl', function() {
    Adapter.canPlayType('application/vnd.apple.mpegurl').should.be.true;
  });

  it('should return true to audio/mpegurl', function() {
    Adapter.canPlayType('audio/mpegurl').should.be.true;
  });

  it('should return true to audio/x-mpegurl', function() {
    Adapter.canPlayType('audio/x-mpegurl').should.be.true;
  });

  it('should return true to video/x-mpegurl', function() {
    Adapter.canPlayType('video/x-mpegurl').should.be.true;
  });

  it('should return true to video/mpegurl', function() {
    Adapter.canPlayType('video/mpegurl').should.be.true;
  });

  it('should return true to application/mpegurl', function() {
    Adapter.canPlayType('application/mpegurl').should.be.true;
  });

  it('should return false to video/mp4', function() {
    Adapter.canPlayType('video/mp4').should.be.false;
  });

  it('should return false to invalid mimetype', function() {
    Adapter.canPlayType('dummy').should.be.false;
  });

  it('should return false to nullable mimetype', function() {
    Adapter.canPlayType(null).should.be.false;
  });

  it('should return false to empty mimetype', function() {
    Adapter.canPlayType().should.be.false;
  });
});

describe('HlsAdapter.id', function() {
  it('should be named HlsAdapter', function() {
    Adapter.id.should.equal('HlsAdapter');
  });
});

describe('Adapter Instance - Unit', function() {
  let AdapterInstance;
  let video;
  let sourceObj;
  let config;
  let sandbox;

  beforeEach(function() {
    sandbox = sinon.sandbox.create();
    video = document.createElement('video');
    sourceObj = hls_sources.ElephantsDream;
    config = {
      playback: {
        options: {html5: {hls: {}}},
        recoverDecodingErrorDelay: 0,
        recoverSwapAudioCodecDelay: 0
      }
    };
    AdapterInstance = Adapter.createAdapter(video, sourceObj, config);
  });

  afterEach(function(done) {
    sandbox.restore();
    AdapterInstance.destroy().then(() => {
      AdapterInstance = null;
      video = null;
      TestUtils.removeVideoElementsFromTestPage();
      done();
    });
  });

  it('should create hls adapter properties', function() {
    AdapterInstance._videoElement.should.deep.equal(video);
    AdapterInstance._config.should.exist;
    AdapterInstance._sourceObj.should.deep.equal(sourceObj);
    AdapterInstance._hls.should.exist;
    AdapterInstance.src.should.be.empty;
  });

  it('should load the adapter', function(done) {
    AdapterInstance.load().then((/* data */) => {
      AdapterInstance._playerTracks.should.be.an('array');
      AdapterInstance.src.should.equal(hls_sources.ElephantsDream.url);
      done();
    });
  });

  it('should destroy the adapter', function(done) {
    AdapterInstance.load().then((/* data */) => {
      let detachMediaSpier = sandbox.spy(AdapterInstance._hls, 'detachMedia');
      let destroySpier = sandbox.spy(AdapterInstance._hls, 'destroy');
      AdapterInstance.destroy().then(() => {
        (AdapterInstance._loadPromise === null).should.be.true;
        (AdapterInstance._sourceObj === null).should.be.true;
        detachMediaSpier.should.have.been.called;
        destroySpier.should.have.been.called;
        done();
      });
    });
  });

  it('should parse the hls audio tracks into player audio tracks', function() {
    AdapterInstance._hls = {
      audioTrack: 1,
      detachMedia: function() {},
      destroy: function() {
        return Promise.resolve();
      },
      off: function() {}
    };
    let audioTracks = AdapterInstance._parseAudioTracks(hls_tracks.audioTracks);
    JSON.parse(JSON.stringify(audioTracks)).should.deep.equal(player_tracks.audioTracks);
  });

  it('should parse the hls levels into player video tracks', function() {
    AdapterInstance._hls = {
      startLevel: 1,
      detachMedia: function() {},
      destroy: function() {
        return Promise.resolve();
      },
      off: function() {}
    };
    let videoTracks = AdapterInstance._parseVideoTracks(hls_tracks.levels);
    player_tracks.videoTracks.forEach(t => {
      t._label = t._height + 'p';
    });
    JSON.parse(JSON.stringify(videoTracks)).should.deep.equal(player_tracks.videoTracks);
  });

  it('should parse the video tag text tracks into player text tracks', function() {
    AdapterInstance._hls = {
      detachMedia: function() {},
      destroy: function() {
        return Promise.resolve();
      },
      off: function() {}
    };
    let textTracks = AdapterInstance._parseTextTracks(hls_tracks.subtitles);
    JSON.parse(JSON.stringify(textTracks)).should.deep.equal(player_tracks.textTracks);
  });

  it('should parse all hls tracks into player tracks', function() {
    AdapterInstance._videoElement = {
      textTracks: hls_tracks.subtitles,
      removeEventListener: () => {}
    };
    AdapterInstance._hls = {
      audioTracks: hls_tracks.audioTracks,
      subtitleTracks: hls_tracks.subtitles,
      levels: hls_tracks.levels,
      audioTrack: 1,
      startLevel: 1,
      detachMedia: function() {},
      destroy: function() {
        return Promise.resolve();
      },
      off: function() {}
    };
    let tracks = AdapterInstance._parseTracks();
    let allTracks = player_tracks.audioTracks.concat(player_tracks.videoTracks).concat(player_tracks.textTracks);
    JSON.parse(JSON.stringify(tracks)).should.deep.equal(allTracks);
  });

  it('should enable adaptive bitrate', function() {
    AdapterInstance._hls = {
      on: function() {},
      nextLevel: 0,
      detachMedia: function() {},
      destroy: function() {
        return Promise.resolve();
      },
      off: function() {}
    };
    AdapterInstance.enableAdaptiveBitrate();
    AdapterInstance._hls.nextLevel.should.equal(-1);
  });

  it('should dispatch event with the selected video track', function(done) {
    let data = {level: 3};
    AdapterInstance._hls = {
      autoLevelEnabled: true,
      detachMedia: function() {},
      destroy: function() {
        return Promise.resolve();
      },
      off: function() {}
    };
    AdapterInstance._playerTracks = [
      new VideoTrack({
        bandwidth: 2962000,
        active: false,
        label: 'Main',
        language: '',
        index: 0
      }),
      new VideoTrack({
        bandwidth: 1427000,
        active: true,
        label: 'Main',
        language: '',
        index: 1
      }),
      new VideoTrack({
        bandwidth: 688000,
        active: false,
        label: 'Main',
        language: '',
        index: 2
      }),
      new VideoTrack({
        bandwidth: 331000,
        active: false,
        label: 'Main',
        language: '',
        index: 3
      })
    ];

    sandbox.stub(AdapterInstance, 'dispatchEvent').callsFake(function(event) {
      event.type.should.equal(EventType.VIDEO_TRACK_CHANGED);
      event.payload.selectedVideoTrack.should.exist;
      event.payload.selectedVideoTrack.should.deep.equal(AdapterInstance._playerTracks[3]);
      done();
    });
    AdapterInstance._onLevelSwitched('hlsLevelSwitched', data);
  });
});

describe('Adapter Instance - Integration', function() {
  let playerContainer;
  let player;
  let tracks;
  let videoTracks;
  let audioTracks;
  let textTracks;

  before(function() {
    playerContainer = TestUtils.createElement('DIV', targetId);
  });

  beforeEach(function() {
    registerMediaSourceAdapter(Adapter);
    player = loadPlayer({
      sources: {
        hls: [hls_sources.ElephantsDream]
      }
    });
    playerContainer.appendChild(player.getView());
  });

  afterEach(function() {
    player.destroy();
    player = null;
    TestUtils.removeVideoElementsFromTestPage();
  });

  after(function() {
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

  it('should run player with hls adapter', function(done) {
    player.load();
    player.ready().then(() => {
      let mediaSourceAdapter = player._engine._mediaSourceAdapter;
      if (mediaSourceAdapter instanceof Adapter) {
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

  it('should enable adaptive bitrate', function(done) {
    player.load();
    player.ready().then(() => {
      let mediaSourceAdapter = player._engine._mediaSourceAdapter;
      if (mediaSourceAdapter instanceof Adapter) {
        player.play();
        mediaSourceAdapter.enableAdaptiveBitrate();
        mediaSourceAdapter.isAdaptiveBitrateEnabled().should.be.true;
        mediaSourceAdapter._hls.nextLevel.should.equal(-1);
        mediaSourceAdapter._hls.autoLevelEnabled.should.be.true;
      }
      done();
    });
  });

  it('should fire abr mode changed', function(done) {
    let mode = 'auto';
    let counter = 0;
    player.addEventListener(player.Event.ABR_MODE_CHANGED, event => {
      event.payload.mode.should.equal(mode);
      counter++;
      if (counter === 3) {
        done();
      }
    });
    player.load();
    player.ready().then(() => {
      let mediaSourceAdapter = player._engine._mediaSourceAdapter;
      if (mediaSourceAdapter instanceof Adapter) {
        player.play();
        videoTracks = player.getTracks(player.Track.VIDEO);
        mode = 'manual';
        player.selectTrack(videoTracks[0]);
        mode = 'auto';
        player.enableAdaptiveBitrate();
      } else {
        done();
      }
    });
  });
});

describe('Adapter Instance - isLive', () => {
  let AdapterInstance;
  let video;
  let vodSource = hls_sources.ElephantsDream;
  let liveSource = hls_sources.Live;
  let config;
  let sandbox;

  beforeEach(function() {
    sandbox = sinon.sandbox.create();
    video = document.createElement('video');
    config = {playback: {options: {html5: {hls: {}}}}};
  });

  afterEach(function(done) {
    sandbox.restore();
    AdapterInstance.destroy().then(() => {
      AdapterInstance = null;
      video = null;
      TestUtils.removeVideoElementsFromTestPage();
      done();
    });
  });

  it('should return false for VOD', done => {
    AdapterInstance = Adapter.createAdapter(video, vodSource, config);
    AdapterInstance.load().then((/* data */) => {
      AdapterInstance.isLive().should.be.false;
      done();
    });
  });

  it('should return false for live before load', () => {
    AdapterInstance = Adapter.createAdapter(video, liveSource, config);
    AdapterInstance.isLive().should.be.false;
  });

  it.skip('should return true for live', done => {
    AdapterInstance = Adapter.createAdapter(video, liveSource, config);
    AdapterInstance.load().then(() => {
      try {
        AdapterInstance.isLive().should.be.true;
        done();
      } catch (e) {
        done(e);
      }
    });
  });
});

describe('Adapter Instance - seekToLiveEdge', function() {
  let AdapterInstance;
  let video;
  let liveSource = hls_sources.Live;
  let config;
  let sandbox;

  beforeEach(function() {
    sandbox = sinon.sandbox.create();
    video = document.createElement('video');
    config = {playback: {options: {html5: {hls: {}}}}};
  });

  afterEach(function(done) {
    sandbox.restore();
    AdapterInstance.destroy().then(() => {
      AdapterInstance = null;
      video = null;
      TestUtils.removeVideoElementsFromTestPage();
      done();
    });
  });

  it('should seek to live edge', done => {
    AdapterInstance = Adapter.createAdapter(video, liveSource, config);
    AdapterInstance.load().then(() => {
      AdapterInstance._videoElement.addEventListener('durationchange', () => {
        if (AdapterInstance._getLiveEdge() > 0) {
          video.currentTime = 0;
          (AdapterInstance._getLiveEdge() - AdapterInstance._videoElement.currentTime > 1).should.be.true;
          AdapterInstance.seekToLiveEdge();
          (AdapterInstance._getLiveEdge() - AdapterInstance._videoElement.currentTime < 1).should.be.true;
          done();
        }
      });
    });
  });
});

describe.skip('Adapter Instance - _getLiveEdge', function() {
  let AdapterInstance;
  let video;
  let liveSource = hls_sources.Live;
  let config;
  let sandbox;

  beforeEach(function() {
    sandbox = sinon.sandbox.create();
    video = document.createElement('video');
    config = {playback: {options: {html5: {hls: {}}}}};
  });

  afterEach(function(done) {
    sandbox.restore();
    AdapterInstance.destroy().then(() => {
      AdapterInstance = null;
      video = null;
      TestUtils.removeVideoElementsFromTestPage();
      done();
    });
  });

  it('should return live edge', done => {
    AdapterInstance = Adapter.createAdapter(video, liveSource, config);
    AdapterInstance.load().then(() => {
      AdapterInstance._videoElement.addEventListener('durationchange', () => {
        if (AdapterInstance._hls.liveSyncPosition) {
          AdapterInstance._getLiveEdge().should.be.equal(AdapterInstance._hls.liveSyncPosition);
          done();
        } else {
          AdapterInstance._getLiveEdge().should.be.equal(video.duration);
        }
      });
    });
  });
});

describe('Adapter Instance - getStartTimeOfDvrWindow', function() {
  let AdapterInstance;
  let video;
  let vodSource = hls_sources.ElephantsDream;
  let liveSource = hls_sources.Live;
  let config;
  let sandbox;

  beforeEach(function() {
    sandbox = sinon.sandbox.create();
    video = document.createElement('video');
    config = {playback: {options: {html5: {hls: {}}}}};
  });

  afterEach(function(done) {
    sandbox.restore();
    AdapterInstance.destroy().then(() => {
      AdapterInstance = null;
      video = null;
      TestUtils.removeVideoElementsFromTestPage();
      done();
    });
  });

  it('should return 0 for VOD', done => {
    AdapterInstance = Adapter.createAdapter(video, vodSource, config);
    AdapterInstance.load().then(() => {
      AdapterInstance.getStartTimeOfDvrWindow().should.equal(0);
      done();
    });
  });

  it.skip('should return the start of DVR window for live', done => {
    AdapterInstance = Adapter.createAdapter(video, liveSource, config);
    AdapterInstance.load().then(() => {
      try {
        AdapterInstance.getStartTimeOfDvrWindow().should.not.equal(0);
        done();
      } catch (e) {
        done(e);
      }
    });
  });
});

describe('Adapter Instance - change media', function() {
  let AdapterInstance;
  let video;
  let source1 = hls_sources.ElephantsDream;
  let source2 = hls_sources.BigBugBunnuy;
  let config;
  let sandbox;

  beforeEach(function() {
    sandbox = sinon.sandbox.create();
    video = document.createElement('video');
    config = {playback: {options: {html5: {hls: {}}}}};
  });

  afterEach(function(done) {
    sandbox.restore();
    AdapterInstance.destroy().then(() => {
      AdapterInstance = null;
      video = null;
      TestUtils.removeVideoElementsFromTestPage();
      done();
    });
  });

  it('should clean the text tracks on change media', done => {
    AdapterInstance = Adapter.createAdapter(video, source1, config);
    AdapterInstance.load().then(data => {
      data.tracks.filter(track => track instanceof TextTrack).length.should.equal(6);
      AdapterInstance.destroy().then(() => {
        AdapterInstance = Adapter.createAdapter(video, source2, config);
        AdapterInstance.load().then(data => {
          data.tracks.filter(track => track instanceof TextTrack).length.should.equal(0);
          done();
        });
      });
    });
  });
});

describe.skip('Adapter [debugging and testing manually]', function(done) {
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
    tracks.filter(track => {
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
    registerMediaSourceAdapter(Adapter);
    player = loadPlayer(targetId, {
      sources: {
        hls: [hls_sources.ElephantsDream]
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
