//@flow
import Hlsjs from 'hls.js';
import DefaultConfig from './default-config';
import {type ErrorDetailsType, HlsJsErrorMap} from './errors';
import {AudioTrack, BaseMediaSourceAdapter, Env, Error, EventType, TextTrack, Track, Utils, VideoTrack, RequestType} from '@playkit-js/playkit-js';
import pLoader from './jsonp-ploader';
import loader from './loader';

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
   * last recover date from decoding error
   * @type {number}
   * @private
   */
  _recoverDecodingErrorDate: number;

  /**
   * last recover date from audio swap codec operation
   * @type {number}
   * @private
   */
  _recoverSwapAudioCodecDate: number;

  /**
   * indicate if external redirect was performed
   * @type {boolean}
   * @private
   */
  _triedReloadWithRedirect: boolean = false;

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
   * stream start time in seconds
   * @type {?number}
   * @private
   */
  _startTime: ?number = 0;
  /**
   * Reference to _onVideoError function
   * @member {?Function} - _onVideoErrorCallback
   * @type {?Function}
   * @private
   */
  _onVideoErrorCallback: ?Function;
  /**
   * The last time detach occurred
   * @type {number}
   * @private
   */
  _lastTimeDetach: number = 0;
  /**
   * Reference to _onRecoveredCallback function
   * @member {?Function} - _onRecoveredCallback
   * @type {?Function}
   * @private
   */
  _onRecoveredCallback: ?Function;
  _onAddTrack: Function;
  _onMediaAttached: Function;
  _mediaAttachedPromise: Promise<*>;
  _requestFilterError: boolean = false;

  /**
   * Factory method to create media source adapter.
   * @function createAdapter
   * @param {HTMLVideoElement} videoElement - The video element that the media source adapter work with.
   * @param {PKMediaSourceObject} source - The source Object.
   * @param {Object} config - The player configuration.
   * @returns {IMediaSourceAdapter} - New instance of the run time media source adapter.
   * @static
   */
  static createAdapter(videoElement: HTMLVideoElement, source: PKMediaSourceObject, config: Object): IMediaSourceAdapter {
    let adapterConfig: Object = Utils.Object.copyDeep(DefaultConfig);
    if (Utils.Object.hasPropertyPath(config, 'sources.options')) {
      const options = config.sources.options;
      adapterConfig.forceRedirectExternalStreams = options.forceRedirectExternalStreams;
      adapterConfig.redirectExternalStreamsHandler = options.redirectExternalStreamsHandler;
      adapterConfig.redirectExternalStreamsTimeout = options.redirectExternalStreamsTimeout;
      pLoader.redirectExternalStreamsHandler = adapterConfig.redirectExternalStreamsHandler;
      pLoader.redirectExternalStreamsTimeout = adapterConfig.redirectExternalStreamsTimeout;
    }
    if (Utils.Object.hasPropertyPath(config, 'playback.startTime')) {
      const startTime = Utils.Object.getPropertyPath(config, 'playback.startTime');
      if (startTime > -1) {
        adapterConfig.hlsConfig.startPosition = config.playback.startTime;
      }
    }
    if (Utils.Object.hasPropertyPath(config, 'playback.useNativeTextTrack')) {
      adapterConfig.subtitleDisplay = Utils.Object.getPropertyPath(config, 'playback.useNativeTextTrack');
    }
    if (Utils.Object.hasPropertyPath(config, 'abr.fpsDroppedFramesInterval')) {
      adapterConfig.hlsConfig.fpsDroppedFramesInterval = config.abr.fpsDroppedFramesInterval;
    }
    if (Utils.Object.hasPropertyPath(config, 'abr.fpsDroppedMonitoringThreshold')) {
      adapterConfig.hlsConfig.fpsDroppedMonitoringThreshold = config.abr.fpsDroppedMonitoringThreshold;
    }
    if (Utils.Object.hasPropertyPath(config, 'abr.capLevelOnFPSDrop')) {
      adapterConfig.hlsConfig.capLevelOnFPSDrop = config.abr.capLevelOnFPSDrop;
    }
    adapterConfig.hlsConfig.enableCEA708Captions = config.playback.enableCEA708Captions;
    adapterConfig.hlsConfig.captionsTextTrack1Label = config.playback.captionsTextTrack1Label;
    adapterConfig.hlsConfig.captionsTextTrack1LanguageCode = config.playback.captionsTextTrack1LanguageCode;
    adapterConfig.hlsConfig.captionsTextTrack2Label = config.playback.captionsTextTrack2Label;
    adapterConfig.hlsConfig.captionsTextTrack2LanguageCode = config.playback.captionsTextTrack2LanguageCode;

    if (Utils.Object.hasPropertyPath(config, 'abr')) {
      const abr = config.abr;
      if (typeof abr.enabled === 'boolean') {
        adapterConfig.abr.enabled = abr.enabled;
      }
      if (typeof abr.capLevelToPlayerSize === 'boolean') {
        adapterConfig.hlsConfig.capLevelToPlayerSize = abr.capLevelToPlayerSize;
      }
      if (abr.defaultBandwidthEstimate) {
        adapterConfig.hlsConfig.abrEwmaDefaultEstimate = abr.defaultBandwidthEstimate;
      }

      if (abr.restrictions) {
        if (abr.restrictions.minBitrate > 0) {
          adapterConfig.hlsConfig.minAutoBitrate = abr.restrictions.minBitrate;
        }
        if (abr.restrictions.maxBitrate < Infinity) {
          //You can either set capping by size or bitrate, if bitrate is set then disable size capping
          adapterConfig.hlsConfig.capLevelToPlayerSize = false;
          adapterConfig.abr.restrictions = abr.restrictions;
        }
      }
    }
    if (Utils.Object.hasPropertyPath(config, 'playback.options.html5.hls')) {
      Utils.Object.mergeDeep(adapterConfig.hlsConfig, config.playback.options.html5.hls);
    }
    adapterConfig.network = config.network;
    return new this(videoElement, source, adapterConfig);
  }

  /**
   * Checks if hls adapter can play a given mime type.
   * @function canPlayType
   * @param {string} mimeType - The mime type to check.
   * @returns {boolean} - Whether the hls adapter can play a specific mime type.
   * @static
   */
  static canPlayType(mimeType: string): boolean {
    let canHlsPlayType =
      typeof mimeType === 'string' ? HlsAdapter._hlsMimeTypes.includes(mimeType.toLowerCase()) && HlsAdapter.isSupportedMSE() : false;
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
   * @param {PKMediaSourceObject} source - The source object
   * @param {Object} config - The media source adapter configuration
   */
  constructor(videoElement: HTMLVideoElement, source: PKMediaSourceObject, config: Object) {
    HlsAdapter._logger.debug('Creating adapter. Hls version: ' + Hlsjs.version);
    super(videoElement, source, config);
    this._config = Utils.Object.mergeDeep({}, DefaultConfig, this._config);
    this._init();
  }
  /**
   * init the hls adapter
   * @function _init
   * @private
   * @returns {void}
   */
  _init(): void {
    if (this._config.forceRedirectExternalStreams) {
      this._config.hlsConfig['pLoader'] = pLoader;
    }
    this._maybeSetFilters();
    this._hls = new Hlsjs(this._config.hlsConfig);
    this._capabilities.fpsControl = true;
    this._hls.subtitleDisplay = this._config.subtitleDisplay;
    this._addBindings();
  }

  _maybeSetFilters(): void {
    if (typeof Utils.Object.getPropertyPath(this._config, 'network.requestFilter') === 'function') {
      HlsAdapter._logger.debug('Register request filter');
      Utils.Object.mergeDeep(this._config.hlsConfig, {
        loader,
        xhrSetup: (xhr, url, context) => {
          try {
            const pkRequest: PKRequestObject = {url, body: null, headers: {}};
            if (context.type === 'manifest') {
              this._config.network.requestFilter(RequestType.MANIFEST, pkRequest);
            }
            if (context.frag && context.frag.type !== 'subtitle') {
              this._config.network.requestFilter(RequestType.SEGMENT, pkRequest);
            }
            context.url = pkRequest.url;
            xhr.open('GET', pkRequest.url, true);
            Object.entries(pkRequest.headers).forEach(entry => {
              xhr.setRequestHeader(...entry);
            });
          } catch (error) {
            this._requestFilterError = true;
            throw error;
          }
        }
      });
    }
  }

  /**
   * Adds the required bindings locally and with hls.js.
   * @function _addBindings
   * @private
   * @returns {void}
   */
  _addBindings(): void {
    this._hls.on(Hlsjs.Events.ERROR, (e, data) => this._onError(data));
    this._hls.on(Hlsjs.Events.MANIFEST_LOADED, (e, data) => this._onManifestLoaded(data));
    this._hls.on(Hlsjs.Events.LEVEL_SWITCHED, this._onLevelSwitched.bind(this));
    this._hls.on(Hlsjs.Events.AUDIO_TRACK_SWITCHED, this._onAudioTrackSwitched.bind(this));
    this._hls.on(Hlsjs.Events.FPS_DROP, (e, data) => this._onFpsDrop(data));
    this._hls.on(Hlsjs.Events.FRAG_PARSING_METADATA, (e, data) => this._onFragParsingMetadata(data));
    this._hls.on(Hlsjs.Events.FRAG_LOADED, (e, data) => this._onFragLoaded(data));
    this._mediaAttachedPromise = new Promise(resolve => (this._onMediaAttached = resolve));
    this._hls.on(Hlsjs.Events.MEDIA_ATTACHED, () => this._onMediaAttached());
    this._onRecoveredCallback = () => this._onRecovered();
    this._onAddTrack = this._onAddTrack.bind(this);
    this._eventManager.listen(this._videoElement, 'addtrack', this._onAddTrack);
    this._videoElement.textTracks.onaddtrack = this._onAddTrack;
  }

  _onFpsDrop(data: Object): void {
    this._trigger(EventType.FPS_DROP, data);
  }

  _onFragParsingMetadata(data: Object): void {
    this._trigger('hlsFragParsingMetadata', data);
  }

  _onAddTrack(event: any) {
    if (!this._hls.subtitleTracks.length) {
      // parse CEA 608/708 captions that not exposed on hls.subtitleTracks API
      const CEATextTrack = this._parseCEATextTrack(event.track);
      if (CEATextTrack) {
        HlsAdapter._logger.debug('A CEA 608/708 caption has found', CEATextTrack);
        this._playerTracks.push(CEATextTrack);
        this._trigger(EventType.TRACKS_CHANGED, {tracks: this._playerTracks});
      }
    }
  }
  /**
   * attach media - return the media source to handle the video tag
   * @public
   * @returns {void}
   */
  attachMediaSource(): void {
    if (!this._hls) {
      if (this._videoElement && this._videoElement.src) {
        Utils.Dom.setAttribute(this._videoElement, 'src', '');
        Utils.Dom.removeAttribute(this._videoElement, 'src');
      }
      this._init();
      const _seekAfterDetach = () => {
        if (parseInt(this._lastTimeDetach) === parseInt(this.duration)) {
          this.currentTime = 0;
        } else {
          this.currentTime = this._lastTimeDetach;
        }
        this._lastTimeDetach = NaN;
      };
      if (!isNaN(this._lastTimeDetach)) {
        this._eventManager.listenOnce(this._videoElement, EventType.LOADED_DATA, () => _seekAfterDetach());
      }
    }
  }
  /**
   * detach media - will remove the media source from handling the video
   * @public
   * @returns {void}
   */
  detachMediaSource(): void {
    if (this._hls) {
      this._lastTimeDetach = this.currentTime;
      this._reset();
      this._loadPromise = null;
      this._hls = null;
    }
  }
  /**
   * video error event handler.
   * @param {MediaError} error - the media error
   * @public
   * @returns {boolean} if hls-adapter will try to recover
   */
  handleMediaError(error: MediaError): boolean {
    if (error.code === error.MEDIA_ERR_DECODE) {
      HlsAdapter._logger.debug(
        'The video playback was aborted due to a corruption problem or because the video used features your browser did not support.',
        error.message
      );
      return this._handleMediaError();
    } else {
      return false;
    }
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
      this._startTime = startTime;
      this._loadPromise = new Promise(resolve => {
        this._resolveLoad = resolve;
        this._loadInternal();
      });
    }
    return this._loadPromise;
  }

  /**
   * Load the video source
   * @function load
   * @returns {void}
   * @private
   */
  _loadInternal() {
    if (this._hls && this._sourceObj && this._sourceObj.url) {
      this._hls.loadSource(this._sourceObj.url);
      this._hls.attachMedia(this._videoElement);
      this._trigger(EventType.ABR_MODE_CHANGED, {mode: this.isAdaptiveBitrateEnabled() ? 'auto' : 'manual'});
    }
  }

  /**
   * Load the video source with installed playlist loader
   * @function _reloadWithDirectManifest
   * @returns {void}
   * @private
   */
  _reloadWithDirectManifest() {
    // Mark that we tried once to redirect
    this._triedReloadWithRedirect = true;
    // reset hls.js
    this._reset();
    // re-init hls.js with the external redirect playlist loader
    this._config.hlsConfig['pLoader'] = pLoader;
    this._hls = new Hlsjs(this._config.hlsConfig);
    this._addBindings();
    this._loadInternal();
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
      this._reset();
    });
  }

  /**
   * reset hls.js instance and its bindings
   * @private
   * @returns {void}
   */
  _reset(): void {
    this._removeBindings();
    this._requestFilterError = false;
    this._hls.detachMedia();
    this._hls.destroy();
  }

  /**
   * Parse the hls tracks into player tracks.
   * @returns {Array<Track>} - The parsed tracks.
   * @private
   */
  _parseTracks(): Array<Track> {
    const audioTracks = this._parseAudioTracks(this._hls.audioTracks || []);
    const videoTracks = this._parseVideoTracks(this._hls.levels || []);
    const textTracks = this._parseTextTracks(this._hls.subtitleTracks || []);
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
   * Parse a CEA 608/708 text track which not expose on hlsjs api into player text tracks.
   * @param {Object} CEATextTrack - A video element text track.
   * @returns {?TextTrack} - A parsed text track if the param is a CEA 608/708 caption.
   * @private
   */
  _parseCEATextTrack(CEATextTrack: Object): ?TextTrack {
    let textTrack = null;
    if (CEATextTrack.kind === 'captions') {
      const settings = {
        id: CEATextTrack.id,
        active: CEATextTrack.mode === 'showing',
        label: CEATextTrack.label,
        kind: CEATextTrack.kind,
        language: CEATextTrack.language,
        index: this._playerTracks.filter(track => track instanceof TextTrack).length
      };
      textTrack = new TextTrack(settings);
    }
    return textTrack;
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
        this._trigger(EventType.ABR_MODE_CHANGED, {mode: 'manual'});
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
    if (textTrack instanceof TextTrack && !textTrack.active && this._hls) {
      if (this._hls.subtitleTracks.length) {
        this._hls.subtitleTrack = textTrack.id;
        this._notifyTrackChanged(textTrack);
      } else {
        this._selectNativeTextTrack(textTrack);
      }
    }
  }

  /**
   * Select a video element text track.
   * @function _selectNativeTextTrack
   * @param {TextTrack} textTrack - the track to select.
   * @returns {void}
   * @private
   */
  _selectNativeTextTrack(textTrack: TextTrack): void {
    const selectedTrack = Array.from(this._videoElement.textTracks).find(track => track.language === textTrack.language);
    if (selectedTrack) {
      this._disableNativeTextTracks();
      selectedTrack.mode = this._config.subtitleDisplay ? 'showing' : 'hidden';
      this._notifyTrackChanged(textTrack);
    }
  }

  _notifyTrackChanged(textTrack: TextTrack): void {
    HlsAdapter._logger.debug('Text track changed', textTrack);
    this._onTrackChanged(textTrack);
  }

  /**
   * Disables all the video element text tracks.
   * @private
   * @returns {void}
   */
  _disableNativeTextTracks(): void {
    Array.from(this._videoElement.textTracks).forEach(track => {
      track.mode = 'disabled';
    });
  }

  /** Hide the text track
   * @function hideTextTrack
   * @returns {void}
   * @public
   */
  hideTextTrack(): void {
    if (this._hls) {
      if (this._hls.subtitleTracks.length) {
        this._hls.subtitleTrack = -1;
      } else {
        this._disableNativeTextTracks();
      }
    }
  }

  /**
   * Enables adaptive bitrate switching according to hls.js logic.
   * @function enableAdaptiveBitrate
   * @returns {void}
   * @public
   */
  enableAdaptiveBitrate(): void {
    if (!this.isAdaptiveBitrateEnabled()) {
      this._trigger(EventType.ABR_MODE_CHANGED, {mode: 'auto'});
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
    if (this._hls) {
      return this._hls.autoLevelEnabled;
    } else {
      return false;
    }
  }

  /**
   * Returns the details of hls level
   * @function _getLevelDetails
   * @returns {Object} - Level details
   * @private
   */
  _getLevelDetails(): Object {
    const level =
      this._hls.levels[this._hls.currentLevel] ||
      this._hls.levels[this._hls.nextLevel] ||
      this._hls.levels[this._hls.nextAutoLevel] ||
      this._hls.levels[this._hls.nextLoadLevel];
    return level && level.details ? level.details : {};
  }

  /**
   * Returns the live edge
   * @returns {number} - live edge
   * @private
   */
  _getLiveEdge(): number {
    try {
      let liveEdge;
      if (this._hls.liveSyncPosition) {
        liveEdge = this._hls.liveSyncPosition;
      } else if (this._hls.config.liveSyncDuration) {
        liveEdge = this._videoElement.duration - this._hls.config.liveSyncDuration;
      } else {
        liveEdge = this._videoElement.duration - this._hls.config.liveSyncDurationCount * this._getLevelDetails().targetduration;
      }
      return liveEdge > 0 ? liveEdge : this._videoElement.duration;
    } catch (e) {
      HlsAdapter._logger.debug('Live edge calculation failed, fall back to duration');
      return this._videoElement.duration;
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
      return !!this._getLevelDetails().live;
    } catch (e) {
      return false;
    }
  }

  /**
   * Fired after manifest has been loaded.
   * @function _onManifestLoaded
   * @param {any} data - the data of the manifest load event
   * @private
   * @returns {void}
   */
  _onManifestLoaded(data: any): void {
    HlsAdapter._logger.debug('The source has been loaded successfully');
    if (!this._hls.config.autoStartLoad) {
      this._hls.startLoad(this._startTime);
    }
    this._playerTracks = this._parseTracks();
    this._maybeApplyAbrRestrictions();
    this._mediaAttachedPromise.then(() => {
      this._resolveLoad({tracks: this._playerTracks});
    });
    const manifestDownloadTime = data.stats.tload - data.stats.trequest;
    this._trigger(EventType.MANIFEST_LOADED, {miliSeconds: manifestDownloadTime});
  }

  /**
   * apply ABR restrictions
   * @private
   * @returns {void}
   */
  _maybeApplyAbrRestrictions(): void {
    if (this._config.abr.enabled) {
      if (this._config.abr.restrictions) {
        const restrictions = this._config.abr.restrictions;
        if (restrictions.maxBitrate) {
          const minBitrate = restrictions.minBitrate ? restrictions.minBitrate : 0;
          if (restrictions.maxBitrate > minBitrate) {
            //Get the first level that is above our bitrate restriction
            //If the corresponding level is not in the edges (level 0 or last level) then get the previous level index
            //which has a bitrate value which is lower then the max bitrate restriction
            let maxLevel = this._hls.levels.findIndex(level => level.bitrate > restrictions.maxBitrate);
            if (maxLevel > 0) {
              maxLevel = maxLevel - 1;
            }
            this._hls.autoLevelCapping = maxLevel;
          } else {
            HlsAdapter._logger.warn(
              'Invalid maxBitrate restriction, maxBitrate must be greater than minBitrate',
              minBitrate,
              restrictions.maxBitrate
            );
          }
        }
      }
    } else {
      this._hls.currentLevel = 0;
    }
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
    let videoTrack = this._playerTracks.find(track => {
      return track instanceof VideoTrack && track.index === data.level;
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
    let audioTrack = this._playerTracks.find(track => {
      return track instanceof AudioTrack && track.id === data.id;
    });
    HlsAdapter._logger.debug('Audio track changed', audioTrack);
    this._onTrackChanged(audioTrack);
    this._handleWaitingUponAudioTrackSwitch();
  }

  /**
   * Trigger a playing event whenever an audio track is changed & time_update event is fired.
   * This align Edge and IE behaviour to other browsers. When an audio track changed in IE & Edge, they trigger
   * waiting event but not playing event.
   * @returns {void}
   * @private
   */
  _handleWaitingUponAudioTrackSwitch(): void {
    const affectedBrowsers = ['IE', 'Edge'];
    if (affectedBrowsers.includes(Env.browser.name)) {
      const timeUpdateListener = () => {
        this._trigger(EventType.PLAYING);
      };
      this._eventManager.listenOnce(this._videoElement, EventType.TIME_UPDATE, timeUpdateListener);
    }
  }

  /**
   * Creates a detailed Error Object according to the relevant error name
   * @param {any} data - The event data object.
   * @private
   * @returns {any} - the relevant error data object
   */
  _getErrorDataObject(data: any): any {
    let errorDataObject = {};
    errorDataObject.name = data.details;
    switch (errorDataObject.name) {
      case Hlsjs.ErrorDetails.MANIFEST_LOAD_ERROR:
      case Hlsjs.ErrorDetails.LEVEL_LOAD_ERROR:
      case Hlsjs.ErrorDetails.AUDIO_TRACK_LOAD_ERROR:
        errorDataObject.url = data.url;
        errorDataObject.responseCode = data.response ? data.response.code : null;
        break;
      case Hlsjs.ErrorDetails.MANIFEST_LOAD_TIMEOUT:
      case Hlsjs.ErrorDetails.LEVEL_LOAD_TIMEOUT:
      case Hlsjs.ErrorDetails.AUDIO_TRACK_LOAD_TIMEOUT:
        errorDataObject.url = data.url;
        break;
      case Hlsjs.ErrorDetails.MANIFEST_PARSING_ERROR:
        errorDataObject.url = data.url;
        errorDataObject.reason = data.reason;
        break;
      case Hlsjs.ErrorDetails.LEVEL_SWITCH_ERROR:
        errorDataObject.level = data.level;
        errorDataObject.reason = data.reason;
        break;
      case Hlsjs.ErrorDetails.FRAG_LOAD_ERROR:
        errorDataObject.fragUrl = data.frag ? data.frag.url : null;
        errorDataObject.responseCode = data.response ? data.response.code : null;
        break;
      case Hlsjs.ErrorDetails.FRAG_LOAD_TIMEOUT:
        errorDataObject.fragUrl = data.frag ? data.frag.url : null;
        break;
      case Hlsjs.ErrorDetails.FRAG_DECRYPT_ERROR:
      case Hlsjs.ErrorDetails.FRAG_PARSING_ERROR:
        errorDataObject.reason = data.reason;
        break;
      case Hlsjs.ErrorDetails.KEY_LOAD_ERROR:
        errorDataObject.fragDecryptedDataUri = data.frag && data.frag.decryptdata ? data.frag.decryptdata.uri : null;
        errorDataObject.responseCode = data.response ? data.response.code : null;
        break;
      case Hlsjs.ErrorDetails.KEY_LOAD_TIMEOUT:
        errorDataObject.fragDecryptedDataUri = data.frag && data.frag.decryptdata ? data.frag.decryptdata.uri : null;
        break;
      case Hlsjs.ErrorDetails.BUFFER_ADD_CODEC_ERROR:
        errorDataObject.mimeType = data.mimeType;
        errorDataObject.errorMsg = data.err ? data.err.message : null;
        break;
      case Hlsjs.ErrorDetails.BUFFER_STALLED_ERROR:
        errorDataObject.buffer = data.buffer;
        break;
    }
    if (this._requestFilterError) {
      errorDataObject.reason = data.response.text;
    }
    return errorDataObject;
  }

  /**
   * Handles hls errors.
   * @param {any} data - The event data object.
   * @private
   * @returns {void}
   */
  _onError(data: any): void {
    const errorType = data.type;
    const errorName = data.details;
    const errorFatal = data.fatal;
    let errorDataObject = this._getErrorDataObject(data);
    if (errorFatal) {
      let error: typeof Error;
      switch (errorType) {
        case Hlsjs.ErrorTypes.NETWORK_ERROR:
          if (
            [Hlsjs.ErrorDetails.MANIFEST_LOAD_ERROR, Hlsjs.ErrorDetails.MANIFEST_LOAD_TIMEOUT].includes(errorName) &&
            !this._triedReloadWithRedirect &&
            !this._config.forceRedirectExternalStreams
          ) {
            this._reloadWithDirectManifest();
          } else {
            const code = this._requestFilterError ? Error.Code.REQUEST_FILTER_ERROR : Error.Code.HTTP_ERROR;
            error = new Error(Error.Severity.CRITICAL, Error.Category.NETWORK, code, errorDataObject);
          }
          break;
        case Hlsjs.ErrorTypes.MEDIA_ERROR:
          if (this._handleMediaError()) {
            error = new Error(Error.Severity.RECOVERABLE, Error.Category.MEDIA, Error.Code.HLS_FATAL_MEDIA_ERROR, errorDataObject);
          } else {
            error = new Error(Error.Severity.CRITICAL, Error.Category.MEDIA, Error.Code.HLS_FATAL_MEDIA_ERROR, errorDataObject);
          }
          break;
        default:
          error = new Error(Error.Severity.CRITICAL, Error.Category.PLAYER, Error.Code.HLS_FATAL_MEDIA_ERROR, errorDataObject);
          break;
      }
      this._trigger(EventType.ERROR, error);
      if (error && error.severity === Error.Severity.CRITICAL) {
        this.destroy();
      }
    } else {
      const {category, code}: ErrorDetailsType = this._requestFilterError
        ? {category: Error.Category.NETWORK, code: Error.Code.REQUEST_FILTER_ERROR}
        : HlsJsErrorMap[errorName] || {category: 0, code: 0};
      HlsAdapter._logger.warn(new Error(Error.Severity.RECOVERABLE, category, code, errorDataObject));
    }
    this._requestFilterError = false;
  }

  /**
   * Tries to handle media errors via hls.js error handlers
   * @returns {boolean} - if media error is handled or not
   * @private
   */
  _handleMediaError(): boolean {
    const now: number = performance.now();
    let recover = true;
    if (this._checkTimeDeltaHasPassed(now, this._recoverDecodingErrorDate, this._config.recoverDecodingErrorDelay)) {
      this._eventManager.listen(this._videoElement, EventType.LOADED_METADATA, this._onRecoveredCallback);
      this._recoverDecodingError();
    } else {
      if (this._checkTimeDeltaHasPassed(now, this._recoverSwapAudioCodecDate, this._config.recoverSwapAudioCodecDelay)) {
        this._eventManager.listen(this._videoElement, EventType.LOADED_METADATA, this._onRecoveredCallback);
        this._recoverSwapAudioCodec();
      } else {
        recover = false;
        HlsAdapter._logger.error('cannot recover, last media error recovery failed');
      }
    }
    return recover;
  }

  /**
   * trigger mediarecovered event if metadata is loaded (means the recovery succeeded)
   * @returns {void}
   * @private
   */
  _onRecovered(): void {
    this._trigger(EventType.MEDIA_RECOVERED);
    this._videoElement.removeEventListener(EventType.LOADED_METADATA, this._onRecoveredCallback);
  }

  /**
   * Check if time ahs passed a certain delta
   * @param {number} now - current time
   * @param {number} then - previous time
   * @param {number} delay - time delta in ms
   * @returns {boolean} - if time delta has
   * @private
   */
  _checkTimeDeltaHasPassed(now: number, then: number, delay: number): boolean {
    return !then || now - then > delay;
  }

  /**
   * handle recover from decoding error
   * @returns {void}
   * @private
   */
  _recoverDecodingError(): void {
    this._recoverDecodingErrorDate = performance.now();
    HlsAdapter._logger.warn('try to recover media Error');
    this._hls.recoverMediaError();
  }

  /**
   * handle recover from decoding error by swaping audio codec
   * @returns {void}
   * @private
   */
  _recoverSwapAudioCodec(): void {
    this._recoverSwapAudioCodecDate = performance.now();
    HlsAdapter._logger.warn('try to swap Audio Codec and recover media Error');
    this._hls.swapAudioCodec();
    this._hls.recoverMediaError();
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
    this._hls.off(Hlsjs.Events.MANIFEST_LOADED, this._onManifestLoaded);
    this._hls.off(Hlsjs.Events.FPS_DROP, this._onFpsDrop);
    this._videoElement.textTracks.onaddtrack = null;
    this._onRecoveredCallback = null;
    if (this._eventManager) {
      this._eventManager.removeAll();
    }
  }

  /**
   * Get the start time of DVR window in live playback in seconds.
   * @returns {Number} - start time of DVR window.
   * @public
   */
  getStartTimeOfDvrWindow(): number {
    if (this.isLive()) {
      try {
        const nextLoadLevel = this._hls.levels[this._hls.nextLoadLevel],
          details = nextLoadLevel.details,
          fragments = details.fragments,
          fragLength = fragments.length,
          start = fragments[0].start + fragments[0].duration,
          end = fragments[fragLength - 1].start + fragments[fragLength - 1].duration,
          maxLatency =
            this._hls.config.liveMaxLatencyDuration !== undefined
              ? this._hls.config.liveMaxLatencyDuration
              : this._hls.config.liveMaxLatencyDurationCount * details.targetduration,
          minPosToSeek = Math.max(start - this._hls.config.maxFragLookUpTolerance, end - maxLatency);
        return minPosToSeek;
      } catch (e) {
        HlsAdapter._logger.debug('Unable obtain the start of DVR window');
        return 0;
      }
    } else {
      return 0;
    }
  }

  /**
   * called when a fragment is loaded
   * @private
   * @param {any} data - the event data of the loaded fragment
   * @returns {void}
   */
  _onFragLoaded(data: any): void {
    const fragmentDownloadTime = data.stats.tload - data.stats.trequest;
    this._trigger(EventType.FRAG_LOADED, {miliSeconds: fragmentDownloadTime, bytes: data.stats.loaded, url: data.frag.url});
  }

  /**
   * returns value the player targets the buffer
   * @returns {number} buffer target length in seconds
   */
  get targetBuffer(): number {
    let targetBufferVal = NaN;
    if (!this._hls) return NaN;
    //distance from playback duration is the relevant buffer
    if (this.isLive()) {
      targetBufferVal = this._getLiveTargetBuffer() - (this._videoElement.currentTime - this._getLiveEdge());
    } else {
      // consideration of the end of the playback in the target buffer calc
      targetBufferVal = this._videoElement.duration - this._videoElement.currentTime;
    }
    targetBufferVal = Math.min(targetBufferVal, this._hls.config.maxMaxBufferLength + this._getLevelDetails().targetduration);
    return targetBufferVal;
  }

  _getLiveTargetBuffer() {
    // if defined in the configuration object, liveSyncDuration will take precedence over the default liveSyncDurationCount
    if (this._hls.config.liveSyncDuration) {
      return this._hls.config.liveSyncDuration;
    } else {
      return this._hls.config.liveSyncDurationCount * this._getLevelDetails().targetduration;
    }
  }
}
