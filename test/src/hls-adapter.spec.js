import loadPlayer, {
  Error,
  RequestType,
  Utils,
  EventType,
  VideoTrack,
  AudioTrack,
  TextTrack,
  createTextTrackCue,
  createTimedMetadata
} from '@playkit-js/playkit-js';
import * as TestUtils from '../utils/test-utils';
import HlsAdapter from '../../src';
import * as hls_sources from './json/hls_sources.json';
import * as hls_tracks from './json/hls_tracks.json';
import * as player_tracks from './json/player_tracks.json';

const targetId = 'player-placeholder_hls-adapter.spec';

describe('HlsAdapter.canPlayDrm', function () {
  it('should return false for any input', function () {
    HlsAdapter.canPlayDrm().should.be.false;
    HlsAdapter.canPlayDrm(null).should.be.false;
    HlsAdapter.canPlayDrm(null).should.be.false;
    HlsAdapter.canPlayDrm([
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
  let hlsAdapterInstance;
  let video;
  let sourceObj;
  let config;
  let sandbox;

  beforeEach(function () {
    sandbox = sinon.createSandbox();
    video = document.createElement('video');
    sourceObj = hls_sources.ElephantsDream;
    config = {
      playback: {
        options: {html5: {hls: {}}},
        recoverDecodingErrorDelay: 0,
        recoverSwapAudioCodecDelay: 0
      }
    };
    hlsAdapterInstance = HlsAdapter.createAdapter(video, sourceObj, config);
  });

  afterEach(function (done) {
    sandbox.restore();
    hlsAdapterInstance.destroy().then(() => {
      hlsAdapterInstance = null;
      video = null;
      TestUtils.removeVideoElementsFromTestPage();
      done();
    });
  });

  it('should create hls adapter properties', function () {
    hlsAdapterInstance._videoElement.should.deep.equal(video);
    hlsAdapterInstance._config.should.exist;
    hlsAdapterInstance._sourceObj.should.deep.equal(sourceObj);
    hlsAdapterInstance._hls.should.exist;
    hlsAdapterInstance.src.should.be.empty;
  });

  it('should load the adapter', async function () {
    await hlsAdapterInstance.load();
    hlsAdapterInstance._playerTracks.should.be.an('array');
    hlsAdapterInstance.src.should.equal(hls_sources.ElephantsDream.url);
  });

  it('should destroy the adapter', async function () {
    await hlsAdapterInstance.load();
    let detachMediaSpier = sandbox.spy(hlsAdapterInstance._hls, 'detachMedia');
    let destroySpier = sandbox.spy(hlsAdapterInstance._hls, 'destroy');
    await hlsAdapterInstance.destroy();
    (hlsAdapterInstance._loadPromise === null).should.be.true;
    (hlsAdapterInstance._sourceObj === null).should.be.true;
    detachMediaSpier.should.have.been.called;
    destroySpier.should.have.been.called;
  });

  it('should parse the hls audio tracks into player audio tracks', function () {
    hlsAdapterInstance._hls = {
      audioTrack: 1,
      detachMedia: function () {},
      destroy: function () {
        return Promise.resolve();
      },
      off: function () {}
    };
    let audioTracks = hlsAdapterInstance._parseAudioTracks(hls_tracks.audioTracks);
    JSON.parse(JSON.stringify(audioTracks)).should.deep.equal(player_tracks.audioTracks);
  });

  it('should parse the hls levels into player video tracks', function () {
    hlsAdapterInstance._hls = {
      startLevel: 1,
      detachMedia: function () {},
      destroy: function () {
        return Promise.resolve();
      },
      off: function () {}
    };
    let videoTracks = hlsAdapterInstance._parseVideoTracks(hls_tracks.levels);
    player_tracks.videoTracks.forEach(t => {
      t._label = t._height + 'p';
    });
    JSON.parse(JSON.stringify(videoTracks)).should.deep.equal(player_tracks.videoTracks);
  });

  it('should parse the video tag text tracks into player text tracks', function () {
    hlsAdapterInstance._hls = {
      detachMedia: function () {},
      destroy: function () {
        return Promise.resolve();
      },
      off: function () {}
    };
    let textTracks = hlsAdapterInstance._parseTextTracks(hls_tracks.subtitles).map(hlsTrack => {
      delete hlsTrack._index;
      return hlsTrack;
    });
    JSON.parse(JSON.stringify(textTracks)).should.deep.equal(player_tracks.textTracks);
  });

  it('should parse all hls tracks into player tracks', function () {
    hlsAdapterInstance._videoElement = {
      textTracks: hls_tracks.subtitles,
      removeEventListener: () => {}
    };
    hlsAdapterInstance._hls = {
      audioTracks: hls_tracks.audioTracks,
      subtitleTracks: hls_tracks.subtitles,
      levels: hls_tracks.levels,
      audioTrack: 1,
      startLevel: 1,
      detachMedia: function () {},
      destroy: function () {
        return Promise.resolve();
      },
      off: function () {}
    };
    let tracks = hlsAdapterInstance._parseTracks().map(hlsTrack => {
      if (hlsTrack._kind === 'subtitles') {
        delete hlsTrack._index;
        return hlsTrack;
      } else {
        return hlsTrack;
      }
    });
    let allTracks = player_tracks.audioTracks.concat(player_tracks.videoTracks).concat(player_tracks.textTracks);
    JSON.parse(JSON.stringify(tracks)).should.deep.equal(allTracks);
  });

  it('should enable adaptive bitrate', function () {
    hlsAdapterInstance._hls = {
      on: function () {},
      nextLevel: 0,
      detachMedia: function () {},
      destroy: function () {
        return Promise.resolve();
      },
      off: function () {}
    };
    hlsAdapterInstance.enableAdaptiveBitrate();
    hlsAdapterInstance._hls.nextLevel.should.equal(-1);
  });

  it('should check onError when reloading manifest returns error object', done => {
    sandbox.stub(hlsAdapterInstance, '_reloadWithDirectManifest').callsFake(() => {});
    hlsAdapterInstance.addEventListener(EventType.ERROR, event => {
      try {
        (event.payload === undefined).should.be.false;
        done();
      } catch (e) {
        done(e);
      }
    });
    try {
      hlsAdapterInstance._onError({
        type: 'networkError',
        details: 'manifestLoadError',
        fatal: true
      });
    } catch (e) {
      done(e);
    }
  });

  it('should dispatch event with the selected video track', function (done) {
    let data = {level: 3};
    hlsAdapterInstance._hls = {
      autoLevelEnabled: true,
      detachMedia: function () {},
      destroy: function () {
        return Promise.resolve();
      },
      off: function () {}
    };
    hlsAdapterInstance._playerTracks = [
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

    sandbox.stub(hlsAdapterInstance, 'dispatchEvent').callsFake(function (event) {
      event.type.should.equal(EventType.VIDEO_TRACK_CHANGED);
      event.payload.selectedVideoTrack.should.exist;
      event.payload.selectedVideoTrack.should.deep.equal(hlsAdapterInstance._playerTracks[3]);
      done();
    });
    hlsAdapterInstance._onLevelSwitched('hlsLevelSwitched', data);
  });
});

describe('HlsAdapter Instance - isLive', () => {
  let hlsAdapterInstance;
  let video;
  let vodSource = hls_sources.ElephantsDream;
  let liveSource = hls_sources.Live;
  let config;
  let sandbox;

  beforeEach(function () {
    sandbox = sinon.createSandbox();
    video = document.createElement('video');
    config = {playback: {options: {html5: {hls: {}}}}};
  });

  afterEach(async function () {
    sandbox.restore();
    hlsAdapterInstance.destroy();
    hlsAdapterInstance = null;
    video = null;
    TestUtils.removeVideoElementsFromTestPage();
  });

  it('should return false for VOD', async () => {
    hlsAdapterInstance = HlsAdapter.createAdapter(video, vodSource, config);
    await hlsAdapterInstance.load();
    hlsAdapterInstance.isLive().should.be.false;
  });

  it('should return false for live before load', () => {
    hlsAdapterInstance = HlsAdapter.createAdapter(video, liveSource, config);
    hlsAdapterInstance.isLive().should.be.false;
  });

  it.skip('should return true for live', async () => {
    hlsAdapterInstance = HlsAdapter.createAdapter(video, liveSource, config);
    await hlsAdapterInstance.load();
    hlsAdapterInstance.isLive().should.be.true;
  });
});

describe('HlsAdapter Instance - seekToLiveEdge', function () {
  let hlsAdapterInstance;
  let video;
  let liveSource = hls_sources.Live;
  let config;
  let sandbox;

  beforeEach(function () {
    sandbox = sinon.createSandbox();
    video = document.createElement('video');
    config = {playback: {options: {html5: {hls: {}}}}};
  });

  afterEach(function (done) {
    sandbox.restore();
    hlsAdapterInstance.destroy().then(() => {
      hlsAdapterInstance = null;
      video = null;
      TestUtils.removeVideoElementsFromTestPage();
      done();
    });
  });

  it('should seek to live edge', async () => {
    hlsAdapterInstance = HlsAdapter.createAdapter(video, liveSource, config);
    await hlsAdapterInstance.load();
    hlsAdapterInstance._videoElement.addEventListener('durationchange', () => {
      if (hlsAdapterInstance._getLiveEdge() > 0) {
        video.currentTime = 0;
        (hlsAdapterInstance._getLiveEdge() - hlsAdapterInstance._videoElement.currentTime > 1).should.be.true;
        hlsAdapterInstance.seekToLiveEdge();
        (hlsAdapterInstance._getLiveEdge() - hlsAdapterInstance._videoElement.currentTime < 1).should.be.true;
      }
    });
  });
});

describe.skip('HlsAdapter Instance - _getLiveEdge', function () {
  let hlsAdapterInstance;
  let video;
  let liveSource = hls_sources.Live;
  let config;
  let sandbox;

  beforeEach(function () {
    sandbox = sinon.createSandbox();
    video = document.createElement('video');
    config = {playback: {options: {html5: {hls: {}}}}};
  });

  afterEach(function (done) {
    sandbox.restore();
    hlsAdapterInstance.destroy().then(() => {
      hlsAdapterInstance = null;
      video = null;
      TestUtils.removeVideoElementsFromTestPage();
      done();
    });
  });

  it('should return live edge', done => {
    hlsAdapterInstance = HlsAdapter.createAdapter(video, liveSource, config);
    hlsAdapterInstance.load().then(() => {
      hlsAdapterInstance._videoElement.addEventListener('durationchange', () => {
        if (hlsAdapterInstance._hls.liveSyncPosition) {
          hlsAdapterInstance._getLiveEdge().should.be.equal(hlsAdapterInstance._hls.liveSyncPosition);
          done();
        } else {
          hlsAdapterInstance._getLiveEdge().should.be.equal(video.duration);
        }
      });
    });
  });
});

describe('HlsAdapter Instance - getStartTimeOfDvrWindow', function () {
  let hlsAdapterInstance;
  let video;
  let vodSource = hls_sources.ElephantsDream;
  let liveSource = hls_sources.Live;
  let config;
  let sandbox;

  beforeEach(function () {
    sandbox = sinon.createSandbox();
    video = document.createElement('video');
    config = {playback: {options: {html5: {hls: {}}}}};
  });

  afterEach(function (done) {
    sandbox.restore();
    hlsAdapterInstance.destroy().then(() => {
      hlsAdapterInstance = null;
      video = null;
      TestUtils.removeVideoElementsFromTestPage();
      done();
    });
  });

  it('should return 0 for VOD', done => {
    hlsAdapterInstance = HlsAdapter.createAdapter(video, vodSource, config);
    hlsAdapterInstance.load().then(() => {
      hlsAdapterInstance.getStartTimeOfDvrWindow().should.equal(0);
      done();
    });
  });

  it.skip('should return the start of DVR window for live', done => {
    hlsAdapterInstance = HlsAdapter.createAdapter(video, liveSource, config);
    hlsAdapterInstance.load().then(() => {
      try {
        hlsAdapterInstance.getStartTimeOfDvrWindow().should.not.equal(0);
        done();
      } catch (e) {
        done(e);
      }
    });
  });
});

describe('HlsAdapter Instance - change media', function () {
  let hlsAdapterInstance;
  let video;
  let source1 = hls_sources.ElephantsDream;
  let source2 = hls_sources.BigBugBunnuy;
  let liveSource = hls_sources.Live;
  let config;
  let sandbox;

  beforeEach(function () {
    sandbox = sinon.createSandbox();
    video = document.createElement('video');
    config = {playback: {options: {html5: {hls: {}}}}};
  });

  afterEach(function (done) {
    sandbox.restore();
    hlsAdapterInstance.destroy().then(() => {
      hlsAdapterInstance = null;
      video = null;
      TestUtils.removeVideoElementsFromTestPage();
      done();
    });
  });

  it('should clean the text tracks on change media', async () => {
    let data;
    hlsAdapterInstance = HlsAdapter.createAdapter(video, source1, config);
    data = await hlsAdapterInstance.load();
    data.tracks.filter(track => track instanceof TextTrack).length.should.equal(6);
    await hlsAdapterInstance.destroy();
    hlsAdapterInstance = HlsAdapter.createAdapter(video, source2, config);
    data = await hlsAdapterInstance.load();
    data.tracks.filter(track => track instanceof TextTrack).length.should.equal(2);
  });

  it('should fire FRAG_LOADED', done => {
    try {
      hlsAdapterInstance = HlsAdapter.createAdapter(video, source1, config);
      hlsAdapterInstance.addEventListener(EventType.FRAG_LOADED, event => {
        event.payload.miliSeconds.should.exist;
        event.payload.bytes.should.exist;
        event.payload.url.should.not.be.empty;
        done();
      });
      hlsAdapterInstance.load();
    } catch (e) {
      done(e);
    }
  });

  it('should fire MANIFEST_LOADED', done => {
    try {
      hlsAdapterInstance = HlsAdapter.createAdapter(video, source1, config);
      hlsAdapterInstance.addEventListener(EventType.MANIFEST_LOADED, event => {
        event.payload.miliSeconds.should.exist;
        done();
      });
    } catch (e) {
      done(e);
    }
    hlsAdapterInstance.load();
  });

  it('should check targetBuffer in VOD far from end of stream', done => {
    try {
      hlsAdapterInstance = HlsAdapter.createAdapter(video, source1, config);
      video.addEventListener(EventType.PLAYING, () => {
        const targetBufferVal = hlsAdapterInstance._hls.config.maxMaxBufferLength + hlsAdapterInstance._getLevelDetails().targetduration;
        Math.floor(hlsAdapterInstance.targetBuffer - targetBufferVal).should.equal(0);

        done();
      });
      hlsAdapterInstance.load().then(() => {
        video.play();
      });
    } catch (e) {
      done(e);
    }
  });

  it('should check targetBuffer in VOD close to end of stream (time left to end of stream is less than targetBuffer)', done => {
    try {
      hlsAdapterInstance = HlsAdapter.createAdapter(video, source1, config);
      video.addEventListener(EventType.PLAYING, () => {
        video.currentTime = video.duration - 1;
        video.addEventListener(EventType.SEEKED, () => {
          const targetBufferVal = video.duration - video.currentTime;
          Math.floor(hlsAdapterInstance.targetBuffer - targetBufferVal).should.equal(0);
          done();
        });
      });
      hlsAdapterInstance.load().then(() => {
        video.play();
      });
    } catch (e) {
      done(e);
    }
  });

  it('should check targetBuffer in LIVE', done => {
    try {
      hlsAdapterInstance = HlsAdapter.createAdapter(
        video,
        liveSource,
        Utils.Object.mergeDeep(config, {network: {}, playback: {options: {html5: {hls: {maxMaxBufferLength: 120}}}}})
      );
      video.addEventListener(EventType.PLAYING, () => {
        let targetBufferVal =
          hlsAdapterInstance._hls.config.liveSyncDurationCount * hlsAdapterInstance._getLevelDetails().targetduration -
          (hlsAdapterInstance._videoElement.currentTime - hlsAdapterInstance._getLiveEdge());

        Math.floor(hlsAdapterInstance.targetBuffer - targetBufferVal).should.equal(0);
        done();
      });

      hlsAdapterInstance.load().then(() => {
        video.play();
      });
    } catch (e) {
      done(e);
    }
  });

  it('should check targetBuffer in LIVE and restricted by maxMaxBufferLength', done => {
    try {
      hlsAdapterInstance = HlsAdapter.createAdapter(
        video,
        liveSource,
        Utils.Object.mergeDeep(config, {playback: {options: {html5: {hls: {maxMaxBufferLength: 10}}}}})
      );
      video.addEventListener(EventType.PLAYING, () => {
        let targetBufferVal = hlsAdapterInstance._hls.config.maxMaxBufferLength + hlsAdapterInstance._getLevelDetails().targetduration;

        Math.floor(hlsAdapterInstance.targetBuffer - targetBufferVal).should.equal(0);
        done();
      });

      hlsAdapterInstance.load().then(() => {
        video.play();
      });
    } catch (e) {
      done(e);
    }
  });
});

describe.skip('HlsAdapter [debugging and testing manually]', function (done) {
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

describe('HlsAdapter Instance request filter', () => {
  let hlsAdapterInstance;
  let video;
  let vodSource = hls_sources.BigBugBunnuy;
  let config;
  let sandbox;

  beforeEach(function () {
    sandbox = sinon.createSandbox();
    video = document.createElement('video');
    config = {playback: {options: {html5: {hls: {}}}}};
  });

  afterEach(function (done) {
    sandbox.restore();
    hlsAdapterInstance.destroy().then(() => {
      hlsAdapterInstance = null;
      video = null;
      TestUtils.removeVideoElementsFromTestPage();
      done();
    });
  });

  const validateFilterError = (e, hlsAdapterInstance) => {
    e.severity.should.equal(hlsAdapterInstance._triedReloadWithRedirect ? Error.Severity.RECOVERABLE : Error.Severity.CRITICAL);
    e.category.should.equal(Error.Category.NETWORK);
    e.code.should.equal(Error.Code.REQUEST_FILTER_ERROR);
    e.data.reason.should.equal('error');
  };

  it('should pass the params to the request filter', done => {
    hlsAdapterInstance = HlsAdapter.createAdapter(
      video,
      vodSource,
      Utils.Object.mergeDeep(config, {
        network: {
          requestFilter: function (type, request) {
            try {
              type.should.equal(RequestType.MANIFEST);
              request.url.should.equal(`${vodSource.url}`);
              Object.prototype.hasOwnProperty.call(request, 'body').should.be.true;
              request.headers.should.be.exist;
              setTimeout(done);
            } catch (e) {
              done(e);
            }
          }
        }
      })
    );
    hlsAdapterInstance.load();
  });

  it('should apply void filter for manifest', done => {
    hlsAdapterInstance = HlsAdapter.createAdapter(
      video,
      vodSource,
      Utils.Object.mergeDeep(config, {
        network: {
          requestFilter: function (type, request) {
            if (type === RequestType.MANIFEST) {
              request.url += '?test';
            }
          }
        }
      })
    );
    hlsAdapterInstance.load();
    sandbox.stub(XMLHttpRequest.prototype, 'open').callsFake(function (type, url) {
      try {
        url.indexOf('?test').should.be.gt(-1);
        done();
      } catch (e) {
        done(e);
      }
    });
  });

  it('should apply promise filter for manifest', done => {
    hlsAdapterInstance = HlsAdapter.createAdapter(
      video,
      vodSource,
      Utils.Object.mergeDeep(config, {
        network: {
          requestFilter: function (type, request) {
            if (type === RequestType.MANIFEST) {
              return new Promise(resolve => {
                request.url += '?test';
                resolve(request);
              });
            }
          }
        }
      })
    );
    hlsAdapterInstance.load();
    sandbox.stub(XMLHttpRequest.prototype, 'open').callsFake(function (type, url) {
      try {
        url.indexOf('?test').should.be.gt(-1);
        done();
      } catch (e) {
        done(e);
      }
    });
  });

  it('should handle error thrown from void filter', done => {
    hlsAdapterInstance = HlsAdapter.createAdapter(
      video,
      vodSource,
      Utils.Object.mergeDeep(config, {
        network: {
          requestFilter: function () {
            throw new window.Error('error');
          }
        }
      })
    );
    hlsAdapterInstance.addEventListener(EventType.ERROR, event => {
      try {
        validateFilterError(event.payload, hlsAdapterInstance);
        done();
      } catch (e) {
        done(e);
      }
    });
    hlsAdapterInstance.load();
  });

  it('should handle error thrown from promise filter', done => {
    hlsAdapterInstance = HlsAdapter.createAdapter(
      video,
      vodSource,
      Utils.Object.mergeDeep(config, {
        network: {
          requestFilter: function () {
            return new Promise(() => {
              throw new window.Error('error');
            });
          }
        }
      })
    );
    hlsAdapterInstance.addEventListener(EventType.ERROR, event => {
      try {
        validateFilterError(event.payload, hlsAdapterInstance);
        done();
      } catch (e) {
        done(e);
      }
    });
    hlsAdapterInstance.load();
  });

  it('should handle error rejected from promise filter', done => {
    hlsAdapterInstance = HlsAdapter.createAdapter(
      video,
      vodSource,
      Utils.Object.mergeDeep(config, {
        network: {
          requestFilter: function (type) {
            if (type === RequestType.MANIFEST) {
              return new Promise((resolve, reject) => {
                reject(new window.Error('error'));
              });
            }
          }
        }
      })
    );
    hlsAdapterInstance.addEventListener(EventType.ERROR, event => {
      try {
        validateFilterError(event.payload, hlsAdapterInstance);
        done();
      } catch (e) {
        done(e);
      }
    });
    hlsAdapterInstance.load();
  });

  it('should handle error rejected from promise filter - segment', done => {
    hlsAdapterInstance = HlsAdapter.createAdapter(
      video,
      vodSource,
      Utils.Object.mergeDeep(config, {
        network: {
          requestFilter: function (type) {
            if (type === RequestType.SEGMENT) {
              return new Promise((resolve, reject) => {
                reject(new window.Error('error'));
              });
            }
          }
        }
      })
    );
    hlsAdapterInstance.addEventListener(EventType.ERROR, event => {
      try {
        validateFilterError(event.payload, hlsAdapterInstance);
        done();
      } catch (e) {
        done(e);
      }
    });
    hlsAdapterInstance.load();
  });
});

describe('HlsAdapter Instance: response filter', () => {
  let video, hlsAdapterInstance, config, sandbox;
  let vodSource = hls_sources.BigBugBunnuy;

  beforeEach(() => {
    video = document.createElement('video');
    config = {playback: {options: {html5: {hls: {forceRedirectExternalStreams: true}}}}};
    sandbox = sinon.createSandbox();
  });

  afterEach(done => {
    sandbox.restore();
    hlsAdapterInstance.destroy().then(() => {
      hlsAdapterInstance = null;
      done();
    });
  });

  after(() => {
    TestUtils.removeVideoElementsFromTestPage();
  });

  const validateFilterError = e => {
    e.severity.should.equal(Error.Severity.CRITICAL);
    e.category.should.equal(Error.Category.NETWORK);
    e.code.should.equal(Error.Code.RESPONSE_FILTER_ERROR);
    e.data.reason.should.equal('error');
  };

  it('should pass the params to the response filter', done => {
    hlsAdapterInstance = HlsAdapter.createAdapter(
      video,
      vodSource,
      Utils.Object.mergeDeep(config, {
        network: {
          responseFilter: function (type, response) {
            try {
              type.should.equal(RequestType.MANIFEST);
              response.url.should.equal(`${vodSource.url}`);
              response.originalUrl.should.equal(`${vodSource.url}`);
              response.data.should.be.exist;
              response.headers['content-type'].should.equal('application/x-mpegurl');
              done();
            } catch (e) {
              done(e);
            }
          }
        }
      })
    );
    hlsAdapterInstance.load();
  });

  it('should apply void filter for manifest', done => {
    hlsAdapterInstance = HlsAdapter.createAdapter(
      video,
      vodSource,
      Utils.Object.mergeDeep(config, {
        network: {
          responseFilter: function (type, response) {
            if (type === RequestType.MANIFEST) {
              response.data += '&test';
            }
          }
        }
      })
    );
    sandbox.stub(hlsAdapterInstance._hls.coreComponents[0], 'loadsuccess').callsFake(value => {
      try {
        value.data.indexOf('&test').should.be.gt(-1);
        done();
      } catch (e) {
        done(e);
      }
    });
    hlsAdapterInstance.load();
  });

  it('should apply promise filter for manifest', done => {
    hlsAdapterInstance = HlsAdapter.createAdapter(
      video,
      vodSource,
      Utils.Object.mergeDeep(config, {
        network: {
          responseFilter: function (type, response) {
            if (type === RequestType.MANIFEST) {
              return new Promise(resolve => {
                response.data += '&test';
                resolve(response);
              });
            }
          }
        }
      })
    );
    sandbox.stub(hlsAdapterInstance._hls.coreComponents[0], 'loadsuccess').callsFake(value => {
      try {
        value.data.indexOf('&test').should.be.gt(-1);
        done();
      } catch (e) {
        done(e);
      }
    });
    hlsAdapterInstance.load();
  });

  it('should handle error thrown from void filter', done => {
    hlsAdapterInstance = HlsAdapter.createAdapter(
      video,
      vodSource,
      Utils.Object.mergeDeep(config, {
        network: {
          responseFilter: function () {
            throw new window.Error('error');
          }
        }
      })
    );
    hlsAdapterInstance.addEventListener(EventType.ERROR, event => {
      try {
        validateFilterError(event.payload, hlsAdapterInstance);
        done();
      } catch (e) {
        done(e);
      }
    });
    hlsAdapterInstance.load();
  });

  it('should handle error thrown from promise filter', done => {
    hlsAdapterInstance = HlsAdapter.createAdapter(
      video,
      vodSource,
      Utils.Object.mergeDeep(config, {
        network: {
          responseFilter: function () {
            return new Promise(() => {
              throw new window.Error('error');
            });
          }
        }
      })
    );
    hlsAdapterInstance.addEventListener(EventType.ERROR, event => {
      try {
        validateFilterError(event.payload, hlsAdapterInstance);
        done();
      } catch (e) {
        done(e);
      }
    });
    hlsAdapterInstance.load();
  });

  it('should handle error rejected from promise filter', done => {
    hlsAdapterInstance = HlsAdapter.createAdapter(
      video,
      vodSource,
      Utils.Object.mergeDeep(config, {
        network: {
          responseFilter: function (type) {
            if (type === RequestType.MANIFEST) {
              return new Promise((resolve, reject) => {
                reject(new window.Error('error'));
              });
            }
          }
        }
      })
    );
    hlsAdapterInstance.addEventListener(EventType.ERROR, event => {
      try {
        validateFilterError(event.payload, hlsAdapterInstance);
        done();
      } catch (e) {
        done(e);
      }
    });
    hlsAdapterInstance.load();
  });

  it('should handle error rejected from promise filter - segment', done => {
    hlsAdapterInstance = HlsAdapter.createAdapter(
      video,
      vodSource,
      Utils.Object.mergeDeep(config, {
        network: {
          responseFilter: function (type) {
            if (type === RequestType.SEGMENT) {
              return new Promise((resolve, reject) => {
                reject(new window.Error('error'));
              });
            }
          }
        }
      })
    );
    hlsAdapterInstance.addEventListener(EventType.ERROR, event => {
      try {
        validateFilterError(event.payload, hlsAdapterInstance);
        done();
      } catch (e) {
        done(e);
      }
    });
    hlsAdapterInstance.load();
  });
});

describe('HlsAdapter Instance - Integration', function () {
  let playerContainer;
  let player;
  let tracks;
  let videoTracks;
  let audioTracks;
  let textTracks;

  before(function () {
    playerContainer = TestUtils.createElement('DIV', targetId);
  });

  beforeEach(function () {
    player = loadPlayer();
    player.setSources({
      hls: [hls_sources.ElephantsDream]
    });
    playerContainer.appendChild(player.getView());
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

  it('should enable adaptive bitrate', function (done) {
    player.load();
    player.ready().then(() => {
      let mediaSourceAdapter = player._engine._mediaSourceAdapter;
      if (mediaSourceAdapter instanceof HlsAdapter) {
        player.play();
        mediaSourceAdapter.enableAdaptiveBitrate();
        mediaSourceAdapter.isAdaptiveBitrateEnabled().should.be.true;
        mediaSourceAdapter._hls.nextLevel.should.equal(-1);
        mediaSourceAdapter._hls.autoLevelEnabled.should.be.true;
      }
      done();
    });
  });

  it('should fire abr mode changed', function (done) {
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
      if (mediaSourceAdapter instanceof HlsAdapter) {
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

describe('HlsAdapter Instance - _onFragParsingMetadata', function () {
  let hlsAdapterInstance;
  let video;
  let vodSource = hls_sources.ElephantsDream;
  let config;
  let sandbox;

  beforeEach(function () {
    sandbox = sinon.createSandbox();
    video = document.createElement('video');
    config = {playback: {options: {html5: {hls: {}}}}};
  });

  afterEach(function (done) {
    sandbox.restore();
    hlsAdapterInstance.destroy().then(() => {
      hlsAdapterInstance = null;
      video = null;
      TestUtils.removeVideoElementsFromTestPage();
      done();
    });
  });

  it('should dispatch TIMED_METADATA_ADDED event on hlsFragParsingMetadata', done => {
    hlsAdapterInstance = HlsAdapter.createAdapter(video, vodSource, config);
    const metadataTrack = video.addTextTrack(TextTrack.KIND.METADATA, 'id3');
    const cue = {
      startTime: 20,
      endTime: 30,
      id: 'id',
      metadata: {
        data: 'data',
        info: 'info',
        type: 'type'
      }
    };
    const textTrackCue = createTextTrackCue(cue);
    metadataTrack.addCue(textTrackCue);
    hlsAdapterInstance.addEventListener(EventType.TIMED_METADATA_ADDED, event => {
      try {
        event.payload.cues[0].should.deep.equal(createTimedMetadata(video.textTracks[0].cues[0]));
        done();
      } catch (e) {
        done(e);
      }
    });
    hlsAdapterInstance._onFragParsingMetadata({
      samples: [{pts: 20}]
    });
  });
});
