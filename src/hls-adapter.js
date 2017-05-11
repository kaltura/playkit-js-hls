//@flow
import Hlsjs from 'hls.js'
import {registerMediaSourceAdapter} from 'playkit-js'

// TODO: Remove
import AudioTrack from '../flow-typed/audio-track'
import VideoTrack from '../flow-typed/video-track'
import TextTrack from '../flow-typed/text-track'
import Track from '../flow-typed/track'

/**
 * Adapter of hls.js lib for hls content
 * @classdesc
 */
export default class HlsAdapter implements IMediaSourceAdapter {
  /**
   * The name of the adapter
   * @member {string} _name
   * @static
   * @private
   */
  static _name: string = 'HlsAdapter';

  /**
   * The supported mime type by the HlsAdapter
   * @member {string} _hlsMimeType
   * @static
   * @private
   */
  static _hlsMimeType: string = 'application/x-mpegurl';

  /**
   * The adapter config
   * @member {Object} _config
   * @private
   */
  _config: Object;

  /**
   * The owning engine
   * @member {IEngine} _engine
   * @private
   */
  _engine: IEngine;

  /**
   * The source url
   * @member {string} _source
   * @private
   */
  _source: string;

  /**
   * The hls player instance
   * @member {any} _hls
   * @private
   */
  _hls: any;

  /**
   * Getter for the adapter name
   * @returns {string} - The adapter name
   */
  static get name(): string {
    return HlsAdapter._name;
  }

  /**
   * Checks if HlsAdapter can play a given mime type
   * @function canPlayType
   * @param {string} mimeType - The mime type to check
   * @returns {boolean} - Whether the native adapter can play a specific mime type
   * @static
   */
  static canPlayType(mimeType: string): boolean {
    return (mimeType === HlsAdapter._hlsMimeType);
  }

  /**
   * Factory method to create media source adapter
   * @function createAdapter
   * @param {IEngine} engine - The video engine that the media source adapter work with
   * @param {Object} source - The source Object
   * @param {Object} config - The media source adapter configuration
   * @returns {IMediaSourceAdapter} - New instance of the run time media source adapter
   * @static
   */
  static createAdapter(engine: IEngine, source: Object, config: Object): IMediaSourceAdapter {
    return new this(engine, source, config);
  }

  /**
   * Checks if the HlsAdapter is supported
   * @function isSupported
   * @returns {boolean} -
   * @static
   */
  static isSupported(): boolean {
    return Hlsjs.isSupported();
  }

  /**
   * @constructor
   * @param {IEngine} engine - The video element which bind to DashAdapter
   * @param {Object} source - The source object
   * @param {Object} config - The media source adapter configuration
   */
  constructor(engine: IEngine, source: Object, config: Object) {
    this._engine = engine;
    this._config = config;
    this._source = source.url;
    this._hls = new Hlsjs(this._config);
    this._addBindings();
  }

  _addBindings(): void {
    this._hls.on(Hlsjs.Events.MANIFEST_LOADED, this._onManifestLoaded.bind(this));
  }

  _onManifestLoaded(event: string, data: any): void {
    this._parseTracks(data);
  }

  _parseTracks(data: any): void {
    let audioTracks = HlsAdapter._parseAudioTracks(data.audioTracks || []);
    let videoTracks = HlsAdapter._parseVideoTracks(data.levels || []);
    let textTracks = HlsAdapter._parseTextTracks(data.subtitles || []);
    let tracks = audioTracks.concat(videoTracks).concat(textTracks);
    // TODO: Set tracks on the player somehow
  }

  static _parseAudioTracks(hlsAudioTracks: Object): Array<AudioTrack> {
    let audioTracks = [];
    if (hlsAudioTracks) {
      for (let i = 0; i < hlsAudioTracks.length; i++) {
        // Create audio tracks
        let trackDetails = {
          id: hlsAudioTracks[i].id,
          active: hlsAudioTracks[i].default,
          name: hlsAudioTracks[i].name,
          language: hlsAudioTracks[i].lang
        };
        audioTracks.push(new AudioTrack(trackDetails));
      }
    }
    return audioTracks;
  }

  static _parseVideoTracks(hlsVideoTracks: Object): Array<VideoTrack> {
    let videoTracks = [];
    if (hlsVideoTracks) {
      for (let i = 0; i < hlsVideoTracks.length; i++) {
        // Create video tracks
        let trackDetails = {
          id: hlsVideoTracks[i].id ? hlsVideoTracks[i].id : i,
          active: hlsVideoTracks[i].default,
          name: hlsVideoTracks[i].name,
          width: hlsVideoTracks[i].width,
          height: hlsVideoTracks[i].height,
          bitrate: hlsVideoTracks[i].bitrate
        };
        videoTracks.push(new VideoTrack(trackDetails));
      }
    }
    return videoTracks;
  }

  static _parseTextTracks(hlsTextTracks: Object): Array<TextTrack> {
    // TODO: Do we need to check for textTracks on the video element?
    let textTracks = [];
    if (hlsTextTracks) {
      for (let i = 0; i < hlsTextTracks.length; i++) {
        // Create text tracks
        let trackDetails = {
          id: hlsTextTracks[i].id,
          active: hlsTextTracks[i].default,
          name: hlsTextTracks[i].name,
          language: hlsTextTracks[i].lang
        };
        textTracks.push(new TextTrack(trackDetails));
      }
    }
    return textTracks;
  }

  selectTrack(track: Track): void {
    if (track instanceof AudioTrack) {
      this._selectAudioTrack(track);
    } else if (track instanceof VideoTrack) {
      this._selectVideoTrack(track);
    } else if (track instanceof TextTrack) {
      this._selectTextTrack(track);
    }
  }

  _selectAudioTrack(audioTrack: AudioTrack): void {
    this._hls.audioTrack = audioTrack.id;
    // TODO: Set the current active audio track to false and the new active audio track to true
  }

  _selectVideoTrack(videoTrack: VideoTrack): void {
    this._hls.nextLevel = videoTrack.id;
    // TODO: Set the current active video track to false and the new active video track to true
  }

  _selectTextTrack(textTrack: TextTrack): void {
    let vidElementTextTracks = this._engine.getVideoElement().textTracks;
    if (vidElementTextTracks) {
      for (let i = 0; i < vidElementTextTracks.length; i++) {
        if (i === textTrack.id) {
          vidElementTextTracks[i].mode = "showing";
        } else {
          vidElementTextTracks[i].mode = "hidden";
        }
      }
    }
    // TODO: Set the current active text track to false and the new active text track to true
  }

  /**
   * Load the video source
   * @function load
   * @override
   */
  load(): void {
    this._hls.loadSource(this._source);
    this._hls.attachMedia(this._engine.getVideoElement());
  }

  /**
   * Destroying the _msPlayer
   * @function destroy
   * @override
   */
  destroy(): void {
    this._hls.detachMedia();
    this._hls.destroy();
  }
}

// Register HlsAdapter to the media source adapter manager
if (HlsAdapter.isSupported()) {
  registerMediaSourceAdapter(HlsAdapter);
}
