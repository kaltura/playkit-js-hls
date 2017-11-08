//@flow
import Hlsjs from 'hls.js'
import {BaseMediaSourceAdapter} from 'playkit-js'
import {Track, VideoTrack, AudioTrack, TextTrack} from 'playkit-js'
import {Utils} from 'playkit-js'

/**
 * Adapter of hls.js lib for hls content.
 * @classdesc
 */
export default class HlsAdapter extends BaseMediaSourceAdapter {
  /**
   * The id of the adapter.
   * @member {string} id
   * @static
   * @private
   */
  static id: string = 'HlsAdapter';
  /**
   * The adapter logger.
   * @member {any} _logger
   * @static
   * @private
   */
  static _logger = BaseMediaSourceAdapter.getLogger(HlsAdapter.id);
  /**
   * The supported mime types by the hls adapter.
   * @member {Array<string>} _hlsMimeType
   * @static
   * @private
   */
  static _hlsMimeTypes: Array<string> = [
    'application/x-mpegurl',
    'application/vnd.apple.mpegurl',
    'audio/mpegurl',
    'audio/x-mpegurl',
    'video/x-mpegurl',
    'video/mpegurl',
    'application/mpegurl'
  ];
  /**
   * The hls player instance.
   * @member {any} _hls
   * @private
   */
  _hls: any;
  /**
   * The load promise
   * @member {Promise<Object>} - _loadPromise
   * @type {Promise<Object>}
   * @private
   */
  _loadPromise: ?Promise<Object>;
  /**
   * Reference to the player tracks.
   * @member {Array<Track>} - _playerTracks
   * @type {Array<Track>}
   * @private
   */
  _playerTracks: Array<Track>;

  /**
   * Factory method to create media source adapter.
   * @function createAdapter
   * @param {HTMLVideoElement} videoElement - The video element that the media source adapter work with.
   * @param {Object} source - The source Object.
   * @param {Object} config - The player configuration.
   * @returns {IMediaSourceAdapter} - New instance of the run time media source adapter.
   * @static
   */
  static createAdapter(videoElement: HTMLVideoElement, source: Source, config: Object): IMediaSourceAdapter {
    let hlsConfig = {};
    if (Utils.Object.hasPropertyPath(config, 'playback.options.html5.hls')) {
      hlsConfig = config.playback.options.html5.hls;
    }
    return new this(videoElement, source, hlsConfig);
  }

  /**
   * Checks if hls adapter can play a given mime type.
   * @function canPlayType
   * @param {string} mimeType - The mime type to check.
   * @returns {boolean} - Whether the hls adapter can play a specific mime type.
   * @static
   */
  static canPlayType(mimeType: string): boolean {
    let canHlsPlayType = (typeof mimeType === 'string') ? HlsAdapter._hlsMimeTypes.includes(mimeType.toLowerCase()) : false;
    HlsAdapter._logger.debug('canPlayType result for mimeType:' + mimeType + ' is ' + canHlsPlayType.toString());
    return canHlsPlayType;
  }

  /**
   * Checks if hls adapter can play a given drm data.
   * For hls.js it always returns false.
   * @returns {boolean} - Whether the hls adapter can play a specific drm data.
   * @static
   */
  static canPlayDrm(): boolean {
    HlsAdapter._logger.warn('canPlayDrm result is false');
    return false;
  }

  /**
   * Checks if the hls adapter is supported.
   * @function isSupported
   * @returns {boolean} - Whether hls is supported.
   * @static
   */
  static isSupported(): boolean {
    let isHlsSupported = Hlsjs.isSupported();
    HlsAdapter._logger.debug('isSupported:' + isHlsSupported);
    return isHlsSupported;
  }

  /**
   * @constructor
   * @param {HTMLVideoElement} videoElement - The video element which will bind to the hls adapter
   * @param {Object} source - The source object
   * @param {Object} config - The media source adapter configuration
   */
  constructor(videoElement: HTMLVideoElement, source: Source, config: Object) {
    HlsAdapter._logger.debug('Creating adapter. Hls version: ' + Hlsjs.version);
    super(videoElement, source, config);
    this._hls = new Hlsjs(this._config);
    this._addBindings();
  }

  /**
   * Adds the required bindings with hls.js.
   * @function _addBindings
   * @private
   * @returns {void}
   */
  _addBindings(): void {
    this._hls.on(Hlsjs.Events.ERROR, this._onError.bind(this));
    this._hls.on(Hlsjs.Events.MANIFEST_LOADED, this._onManifestLoaded.bind(this));
    this._hls.on(Hlsjs.Events.LEVEL_SWITCHED, this._onLevelSwitched.bind(this));
    this._hls.on(Hlsjs.Events.AUDIO_TRACK_SWITCHED, this._onAudioTrackSwitched.bind(this));
  }

  /**
   * Load the video source
   * @function load
   * @param {number} startTime - Optional time to start the video from.
   * @returns {Promise<Object>} - The loaded data
   * @override
   */
  load(startTime: ?number): Promise<Object> {
    if (!this._loadPromise) {
      this._loadPromise = new Promise((resolve) => {
        let onLevelUpdated = () => {
          this._hls.off(Hlsjs.Events.LEVEL_UPDATED, onLevelUpdated);
          resolve({tracks: this._playerTracks});
        };
        this._hls.on(Hlsjs.Events.LEVEL_UPDATED, onLevelUpdated);
        if (startTime) {
          this._hls.startPosition = startTime;
        }
        if (this._sourceObj && this._sourceObj.url) {
          this._hls.loadSource(this._sourceObj.url);
          this._hls.attachMedia(this._videoElement);
          this._trigger(BaseMediaSourceAdapter.CustomEvents.ABR_MODE_CHANGED, {mode: this.isAdaptiveBitrateEnabled() ? 'auto' : 'manual'});
        }
      });
    }
    return this._loadPromise;
  }

  /**
   * Destroys the hls adapter.
   * @function destroy
   * @override
   * @returns {Promise<*>} - The destroy promise.
   */
  destroy(): Promise<*> {
    return super.destroy().then(() => {
      HlsAdapter._logger.debug('destroy');
      this._loadPromise = null;
      this._playerTracks = [];
      this._removeBindings();
      this._hls.detachMedia();
      this._hls.destroy();
    });
  }

  /**
   * Parse the hls tracks into player tracks.
   * @param {any} data - The event data.
   * @returns {Array<Track>} - The parsed tracks.
   * @private
   */
  _parseTracks(data: any): Array<Track> {
    let audioTracks = this._parseAudioTracks(data.audioTracks || []);
    let videoTracks = this._parseVideoTracks(data.levels || []);
    let textTracks = this._parseTextTracks(this._hls.subtitleTracks|| []);
    return audioTracks.concat(videoTracks).concat(textTracks);
  }

  /**
   * Parse hls audio tracks into player audio tracks.
   * @param {Array<Object>} hlsAudioTracks - The hls audio tracks.
   * @returns {Array<AudioTrack>} - The parsed audio tracks.
   * @private
   */
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

  /**
   * Parse hls video tracks into player video tracks.
   * @param {Array<Object>} hlsVideoTracks - The hls video tracks.
   * @returns {Array<VideoTrack>} - The parsed video tracks.
   * @private
   */
  _parseVideoTracks(hlsVideoTracks: Array<Object>): Array<VideoTrack> {
    let videoTracks = [];
    for (let i = 0; i < hlsVideoTracks.length; i++) {
      // Create video tracks
      let settings = {
        active: this._hls.startLevel === i,
        label: hlsVideoTracks[i].name,
        bandwidth: hlsVideoTracks[i].bitrate,
        width: hlsVideoTracks[i].width,
        height: hlsVideoTracks[i].height,
        language: '',
        index: i
      };
      videoTracks.push(new VideoTrack(settings));
    }
    return videoTracks;
  }

  /**
   * Parse hls text tracks into player text tracks.
   * @param {Array<Object>} hlsTextTracks - The hls text tracks.
   * @returns {Array<TextTrack>} - The parsed text tracks.
   * @private
   */
  _parseTextTracks(hlsTextTracks: Array<Object>): Array<TextTrack> {
    let textTracks = [];
    for (let i = 0; i < hlsTextTracks.length; i++) {
      // Create text tracks
      let settings = {
        id: hlsTextTracks[i].id,
        active: hlsTextTracks[i].default,
        label: hlsTextTracks[i].name,
        kind: hlsTextTracks[i].type.toLowerCase(),
        language: hlsTextTracks[i].lang,
        index: i
      };
      textTracks.push(new TextTrack(settings));
    }
    return textTracks;
  }

  /**
   * Select an audio track.
   * @function selectAudioTrack
   * @param {AudioTrack} audioTrack - the audio track to select.
   * @returns {void}
   * @public
   */
  selectAudioTrack(audioTrack: AudioTrack): void {
    if (audioTrack instanceof AudioTrack && !audioTrack.active && this._hls.audioTracks) {
      this._hls.audioTrack = audioTrack.id;
    }
  }

  /**
   * Select a video track.
   * @function selectVideoTrack
   * @param {VideoTrack} videoTrack - the track to select.
   * @returns {void}
   * @public
   */
  selectVideoTrack(videoTrack: VideoTrack): void {
    if (videoTrack instanceof VideoTrack && (!videoTrack.active || this.isAdaptiveBitrateEnabled()) && this._hls.levels) {
      if (this.isAdaptiveBitrateEnabled()) {
        this._trigger(BaseMediaSourceAdapter.CustomEvents.ABR_MODE_CHANGED, {mode: 'manual'});
      }
      this._hls.currentLevel = videoTrack.index;
    }
  }

  /**
   * Select a text track.
   * @function selectTextTrack
   * @param {TextTrack} textTrack - the track to select.
   * @returns {void}
   * @public
   */
  selectTextTrack(textTrack: TextTrack): void {
    if (textTrack instanceof TextTrack && !textTrack.active && this._videoElement.textTracks) {
      this._disableAllTextTracks();
      this._videoElement.textTracks[textTrack.index].mode = 'hidden';
      HlsAdapter._logger.debug('Text track changed', textTrack);
      this._onTrackChanged(textTrack);
    }
  }

  /** Hide the text track
   * @function hideTextTrack
   * @returns {void}
   * @public
   */
  hideTextTrack(): void {
    this._disableAllTextTracks();
  }

  /**
   * Enables adaptive bitrate switching according to hls.js logic.
   * @function enableAdaptiveBitrate
   * @returns {void}
   * @public
   */
  enableAdaptiveBitrate(): void {
    if (!this.isAdaptiveBitrateEnabled()) {
      this._trigger(BaseMediaSourceAdapter.CustomEvents.ABR_MODE_CHANGED, {mode: 'auto'});
      this._hls.nextLevel = -1;
    }
  }

  /**
   * Checking if adaptive bitrate switching is enabled.
   * @function isAdaptiveBitrateEnabled
   * @returns {boolean} - Whether adaptive bitrate is enabled.
   * @public
   */
  isAdaptiveBitrateEnabled(): boolean {
    return this._hls.autoLevelEnabled;
  }

  /**
   * Returns the live edge
   * @returns {number} - live edge
   * @private
   */
  _getLiveEdge(): number {
    try {
      let liveEdge;
      if (this._hls.config.liveSyncDuration) {
        liveEdge = this._videoElement.duration - this._hls.config.liveSyncDuration;
      } else {
        liveEdge = this._videoElement.duration - this._hls.config.liveSyncDurationCount * this._hls.levels[0].details.targetduration;
      }
      return liveEdge > 0 ? liveEdge : 0;
    } catch (e) {
      return NaN;
    }
  }

  /**
   * Seeking to live edge, calculated according hls configuration - liveSyncDuration or liveSyncDurationCount.
   * @function seekToLiveEdge
   * @returns {void}
   * @public
   */
  seekToLiveEdge(): void {
    try {
      this._videoElement.currentTime = this._getLiveEdge();
    } catch (e) {
      return;
    }
  }

  /**
   * Checking if the current playback is live.
   * @function isLive
   * @returns {boolean} - Whether playback is live.
   * @public
   */
  isLive(): boolean {
    try {
      return this._hls.levels[0].details.live;
    } catch (e) {
      return false;
    }
  }

  /**
   * Fired after manifest has been loaded.
   * @function _onManifestLoaded
   * @param {string} event - The event name.
   * @param {any} data - The event data object.
   * @private
   * @returns {void}
   */
  _onManifestLoaded(event: string, data: any): void {
    HlsAdapter._logger.debug('The source has been loaded successfully');
    this._hls.startLoad();
    this._playerTracks = this._parseTracks(data);
  }

  /**
   * Triggers on video track selection (auto or manually) the 'videotrackchanged' event forward.
   * @function _onLevelSwitched
   * @param {string} event - The event name.
   * @param {any} data - The event data object.
   * @private
   * @returns {void}
   */
  _onLevelSwitched(event: string, data: any): void {
    let videoTrack = this._playerTracks.find((track) => {
      return (track instanceof VideoTrack && track.index === data.level);
    });
    HlsAdapter._logger.debug('Video track changed', videoTrack);
    this._onTrackChanged(videoTrack);
  }

  /**
   * Triggers on audio track selection (auto or manually) the 'audiotrackchanged' event forward.
   * @function _onAudioTrackSwitched
   * @param {string} event - The event name.
   * @param {any} data - The event data object.
   * @private
   * @returns {void}
   */
  _onAudioTrackSwitched(event: string, data: any): void {
    let audioTrack = this._playerTracks.find((track) => {
      return (track instanceof AudioTrack && track.id === data.id);
    });
    HlsAdapter._logger.debug('Audio track changed', audioTrack);
    this._onTrackChanged(audioTrack);
  }

  /**
   * Disables all the video tag text tracks.
   * @returns {void}
   * @private
   */
  _disableAllTextTracks() {
    let vidTextTracks = this._videoElement.textTracks;
    for (let i = 0; i < vidTextTracks.length; i++) {
      vidTextTracks[i].mode = 'disabled';
    }
  }

  /**
   * Handles hls errors.
   * @param {string} event - The event name.
   * @param {any} data - The event data object.
   * @private
   * @returns {void}
   */
  _onError(event: string, data: any): void {
    let errorType = data.type;
    let errorDetails = data.details;
    let errorFatal = data.fatal;
    if (errorFatal) {
      switch (errorType) {
        case Hlsjs.ErrorTypes.NETWORK_ERROR:
          HlsAdapter._logger.error("fatal network error encountered, try to recover");
          this._hls.startLoad();
          break;
        case Hlsjs.ErrorTypes.MEDIA_ERROR:
          HlsAdapter._logger.error("fatal media error encountered, try to recover");
          this._hls.recoverMediaError();
          break;
        default:
          HlsAdapter._logger.error("fatal error, cannot recover");
          this.destroy();
          break;
      }
    } else {
      switch (errorDetails) {
        case Hlsjs.ErrorDetails.MANIFEST_LOAD_ERROR:
        case Hlsjs.ErrorDetails.MANIFEST_LOAD_TIMEOUT:
        case Hlsjs.ErrorDetails.MANIFEST_PARSING_ERROR:
        case Hlsjs.ErrorDetails.LEVEL_LOAD_ERROR:
        case Hlsjs.ErrorDetails.LEVEL_LOAD_TIMEOUT:
        case Hlsjs.ErrorDetails.LEVEL_SWITCH_ERROR:
        case Hlsjs.ErrorDetails.FRAG_LOAD_ERROR:
        case Hlsjs.ErrorDetails.FRAG_LOOP_LOADING_ERROR:
        case Hlsjs.ErrorDetails.FRAG_LOAD_TIMEOUT:
        case Hlsjs.ErrorDetails.FRAG_PARSING_ERROR:
        case Hlsjs.ErrorDetails.BUFFER_APPEND_ERROR:
        case Hlsjs.ErrorDetails.BUFFER_APPENDING_ERROR:
          HlsAdapter._logger.error(errorType, errorDetails);
          break;
        default:
          break;
      }
    }
  }

  /**
   * Removes hls.js bindings.
   * @returns {void}
   * @private
   */
  _removeBindings(): void {
    this._hls.off(Hlsjs.Events.ERROR, this._onError);
    this._hls.off(Hlsjs.Events.LEVEL_SWITCHED, this._onLevelSwitched);
    this._hls.off(Hlsjs.Events.AUDIO_TRACK_SWITCHED, this._onAudioTrackSwitched);
  }

  /**
   * Getter for the src that the adapter plays on the video element.
   * In case the adapter preformed a load it will return the manifest url.
   * @public
   * @returns {string} - The src url.
   */
  get src(): string {
    if (this._loadPromise && this._sourceObj) {
      return this._sourceObj.url;
    }
    return "";
  }

  /**
   * Get the duration in seconds.
   * @returns {Number} - The playback duration.
   * @public
   */
  get duration(): number {
    if (this.isLive()) {
      return this._getLiveEdge();
    } else {
      return super.duration;
    }
  }
}