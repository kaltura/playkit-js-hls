//@flow
import Hlsjs from 'hls.js'
import {registerMediaSourceAdapter} from 'playkit-js'

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
    this._hls = new Hlsjs();
    this._addBindings();
  }

  _addBindings(): void {
    this._hls.on(Hlsjs.Events.MANIFEST_LOADED, this._onManifestLoaded.bind(this));
  }

  _onManifestLoaded(event: string, data: any): void {
    if (data.audioTracks) {
      let audioTracks = data.audioTracks;
      for (let i = 0; i < audioTracks.length; i++) {
        // Create audio tracks
      }
    }
    if (data.levels) {
      let videoTracks = data.levels;
      for (let i = 0; i < videoTracks.length; i++) {
        // Create video tracks
      }
    }
    if (data.subtitles) {
      let textTracks = data.subtitles;
      for (let i = 0; i < textTracks.length; i++) {
        // Create text tracks
      }
    }
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
   * Destroying the hls adapter
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
