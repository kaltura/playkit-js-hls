//@flow
import Hlsjs from 'hls.js'
import {registerMediaSourceAdapter} from 'playkit-js'
import {Track, VideoTrack, AudioTrack, TextTrack} from 'playkit-js'
import {LoggerFactory} from 'playkit-js'
import {FakeEventTarget, FakeEvent} from 'playkit-js'
import {CustomEvents} from 'playkit-js'

/**
 * Adapter of hls.js lib for hls content
 * @classdesc
 */
export default class HlsAdapter extends FakeEventTarget implements IMediaSourceAdapter {

  static _name: string = 'HlsAdapter';
  static _logger = LoggerFactory.getLogger(HlsAdapter._name);
  static _hlsMimeTypes: Array<string> = [
    'application/x-mpegurl',
    'application/vnd.apple.mpegurl',
    'audio/mpegurl',
    'audio/x-mpegurl',
    'video/x-mpegurl',
    'video/mpegurl',
    'application/mpegurl'
  ];

  _config: Object;
  _videoElement: HTMLVideoElement;
  _sourceObj: ?Source;
  _hls: any;
  _loadPromise: ?Promise<Object>;
  _playerTracks: Array<Track>;


  static get name(): string {
    return HlsAdapter._name;
  }

  static set name(name: string): void {
    // Do nothing. Just a workaround for flow issue with static getter in an inheritor. See: https://github.com/facebook/flow/issues/3008.
  }

  static canPlayType(mimeType: string): boolean {
    let canHlsPlayType = HlsAdapter._hlsMimeTypes.includes(mimeType);
    HlsAdapter._logger.debug('canPlayType result for mimeType:' + mimeType + ' is ' + canHlsPlayType.toString());
    return canHlsPlayType;
  }

  static createAdapter(videoElement: HTMLVideoElement, source: Source, config: Object): IMediaSourceAdapter {
    HlsAdapter._logger.debug('Creating adapter. Hls version: ' + Hlsjs.version);
    return new this(videoElement, source, config);
  }

  static isSupported(): boolean {
    let isHlsSupported = Hlsjs.isSupported();
    HlsAdapter._logger.debug('isSupported:' + isHlsSupported);
    return isHlsSupported;
  }

  constructor(videoElement: HTMLVideoElement, source: Source, config: Object) {
    super();
    this._videoElement = videoElement;
    this._config = config;
    this._sourceObj = source;
    this._hls = new Hlsjs(this._config);
  }

  load(): Promise<Object> {
    if (!this._loadPromise) {
      this._loadPromise = new Promise((resolve) => {
        this._hls.on(Hlsjs.Events.MANIFEST_LOADED, (event: string, data: any) => {
          this._playerTracks = this._parseTracks(data);
          resolve({tracks: this._playerTracks});
        });
        if (this._sourceObj && this._sourceObj.url) {
          this._hls.loadSource(this._sourceObj.url);
          this._hls.attachMedia(this._videoElement);
        }
      });
    }
    return this._loadPromise;
  }

  destroy(): void {
    HlsAdapter._logger.debug('destroy');
    this._loadPromise = null;
    this._sourceObj = null;
    this._hls.detachMedia();
    this._hls.destroy();
  }

  _parseTracks(data: any): Array<Track> {
    let audioTracks = this._parseAudioTracks(data.audioTracks || []);
    let videoTracks = this._parseVideoTracks(data.levels || []);
    let textTracks = this._parseTextTracks(this._videoElement.textTracks || []);
    return audioTracks.concat(videoTracks).concat(textTracks);
  }

  _parseAudioTracks(hlsAudioTracks: Array<Object>): Array<AudioTrack> {
    let audioTracks = [];
    for (let i = 0; i < hlsAudioTracks.length; i++) {
      // Create audio tracks
      let settings = {
        id: hlsAudioTracks[i].id,
        active: this._hls.audioTrack === hlsAudioTracks[i].id,
        label: hlsAudioTracks[i].name,
        language: hlsAudioTracks[i].lang,
        index: i
      };
      audioTracks.push(new AudioTrack(settings));
    }
    return audioTracks;
  }

  _parseVideoTracks(hlsVideoTracks: Array<Object>): Array<VideoTrack> {
    let videoTracks = [];
    for (let i = 0; i < hlsVideoTracks.length; i++) {
      // Create video tracks
      let settings = {
        id: hlsVideoTracks[i].bitrate,
        active: this._hls.startLevel === i,
        label: hlsVideoTracks[i].bitrate,
        language: '',
        index: i
      };
      videoTracks.push(new VideoTrack(settings));
    }
    return videoTracks;
  }

  _parseTextTracks(vidTextTracks: TextTrackList): Array<TextTrack> {
    let textTracks = [];
    for (let i = 0; i < vidTextTracks.length; i++) {
      // Create text tracks
      let settings = {
        id: i,
        active: vidTextTracks[i].mode === 'showing',
        label: vidTextTracks[i].label,
        kind: vidTextTracks[i].kind,
        language: vidTextTracks[i].language,
        index: i
      };
      textTracks.push(new TextTrack(settings));
    }
    return textTracks;
  }

  selectAudioTrack(audioTrack: AudioTrack): boolean {
    if (audioTrack && audioTrack instanceof AudioTrack && this._hls.audioTracks) {
      this._hls.audioTrack = audioTrack.id;
      return true;
    }
    return false;
  }

  selectVideoTrack(videoTrack: VideoTrack): boolean {
    this._hls.off(Hlsjs.Events.LEVEL_SWITCHED, this._onLevelSwitched);
    if (videoTrack && videoTrack instanceof VideoTrack && this._hls.levels) {
      this._hls.nextLevel = videoTrack.index;
      return true;
    }
    return false;
  }

  selectTextTrack(textTrack: TextTrack): boolean {
    if (textTrack && textTrack instanceof TextTrack && this._videoElement.textTracks) {
      this._disableAllTextTracks();
      this._videoElement.textTracks[textTrack.id].mode = 'showing';
      return true;
    }
    return false;
  }

  enableAdaptiveBitrate(): void {
    this._hls.on(Hlsjs.Events.LEVEL_SWITCHED, this._onLevelSwitched.bind(this));
    this._hls.nextLevel = -1;
  }

  _onLevelSwitched(event: string, data: any): void {
    if (this._hls.autoLevelEnabled) {
      let videoTrack = this._playerTracks.find((track) => {
        return (track instanceof VideoTrack && track.index === data.level);
      });
      let fakeEvent = new FakeEvent(CustomEvents.VIDEO_TRACK_CHANGED, {
        selectedVideoTrack: videoTrack
      });
      this.dispatchEvent(fakeEvent);
    }
  }

  _disableAllTextTracks() {
    let vidTextTracks = this._videoElement.textTracks;
    for (let i = 0; i < vidTextTracks.length; i++) {
      vidTextTracks[i].mode = 'hidden';
    }
  }

  get src(): string {
    if (this._loadPromise != null && this._sourceObj && this._sourceObj.url) {
      return this._sourceObj.url;
    }
    return "";
  }
}

if (HlsAdapter.isSupported()) {
  registerMediaSourceAdapter(HlsAdapter);
}
