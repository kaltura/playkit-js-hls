//@flow
import Hlsjs from 'hls.js';
import DefaultConfig from './default-config';
import {type ErrorDetailsType, HlsJsErrorMap} from './errors';
import {
  AudioTrack,
  BaseMediaSourceAdapter,
  Env,
  Error as PKError,
  EventType,
  TextTrack,
  Track,
  Utils,
  VideoTrack,
  RequestType,
  filterTracksByRestriction,
  PKABRRestrictionObject,
  TimedMetadata,
  createTimedMetadata
} from '@playkit-js/playkit-js';
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
   * The Hls lib
   * @type {any}
   * @private
   */
  _hlsjsLib: any = Hlsjs;
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
   * the _loadPromise handlers
   * @member {{resolve: (result: Promise<R> | R) => void, reject: (error: any) => void}} - _loadPromiseHandlers
   * @type {{resolve: (result: Promise<R> | R) => void, reject: (error: any) => void}}
   * @private
   */
  _loadPromiseHandlers: {resolve: (result: Promise<*> | *) => void, reject: (error: any) => void} | null;

  /**
   * Reference to the player tracks.
   * @member {Array<Track>} - _playerTracks
   * @type {Array<Track>}
   * @private
   */
  _playerTracks: Array<Track> = [];
  /**
   * stream start time in seconds
   * @type {?number}
   * @private
   */
  _startTime: ?number = 0;
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
  _responseFilterError: boolean = false;
  _nativeTextTracksMap = {};
  _lastLoadedFragSN: number = -1;
  _sameFragSNLoadedCount: number = 0;
  /**
   * an object containing all the events we bind and unbind to.
   * @member {Object} - _adapterEventsBindings
   * @type {Object}
   * @private
   */
  _adapterEventsBindings: {[name: string]: Function} = {
    [Hlsjs.Events.ERROR]: (e, data) => this._onError(data),
    [Hlsjs.Events.MANIFEST_LOADED]: (e, data) => this._onManifestLoaded(data),
    [Hlsjs.Events.LEVEL_SWITCHED]: (e, data) => this._onLevelSwitched(e, data),
    [Hlsjs.Events.AUDIO_TRACK_SWITCHED]: (e, data) => this._onAudioTrackSwitched(e, data),
    [Hlsjs.Events.FPS_DROP]: (e, data) => this._onFpsDrop(data),
    [Hlsjs.Events.FRAG_PARSING_METADATA]: (e, data) => this._onFragParsingMetadata(data),
    [Hlsjs.Events.FRAG_LOADED]: (e, data) => this._onFragLoaded(data),
    [Hlsjs.Events.MEDIA_ATTACHED]: () => this._onMediaAttached(),
    [Hlsjs.Events.LEVEL_LOADED]: (e, data) => this._onLevelLoaded(e, data)
  };

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
    if (Utils.Object.hasPropertyPath(config, 'sources.startTime')) {
      const startTime = Utils.Object.getPropertyPath(config, 'sources.startTime');
      if (startTime > -1) {
        adapterConfig.hlsConfig.startPosition = config.sources.startTime;
      }
    }
    if (Utils.Object.hasPropertyPath(config, 'text.useNativeTextTrack')) {
      adapterConfig.subtitleDisplay = Utils.Object.getPropertyPath(config, 'text.useNativeTextTrack');
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
    if (Utils.Object.hasPropertyPath(config, 'text')) {
      adapterConfig.hlsConfig.enableCEA708Captions = config.text.enableCEA708Captions;
      adapterConfig.hlsConfig.captionsTextTrack1Label = config.text.captionsTextTrack1Label;
      adapterConfig.hlsConfig.captionsTextTrack1LanguageCode = config.text.captionsTextTrack1LanguageCode;
      adapterConfig.hlsConfig.captionsTextTrack2Label = config.text.captionsTextTrack2Label;
      adapterConfig.hlsConfig.captionsTextTrack2LanguageCode = config.text.captionsTextTrack2LanguageCode;
    }

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
        Utils.Object.createPropertyPath(adapterConfig, 'abr.restrictions', abr.restrictions);
      }
    }
    if (Utils.Object.hasPropertyPath(config, 'streaming.lowLatencyMode')) {
      adapterConfig.hlsConfig.lowLatencyMode = Utils.Object.getPropertyPath(config, 'streaming.lowLatencyMode');
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
      typeof mimeType === 'string' ? HlsAdapter._hlsMimeTypes.includes(mimeType.toLowerCase()) && HlsAdapter.isMSESupported() : false;
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
          let requestFilterPromise;
          const pkRequest: PKRequestObject = {url, body: null, headers: {}};
          try {
            if (context.type === 'manifest') {
              requestFilterPromise = this._config.network.requestFilter(RequestType.MANIFEST, pkRequest);
            }
            if (context.frag && context.frag.type !== 'subtitle') {
              requestFilterPromise = this._config.network.requestFilter(RequestType.SEGMENT, pkRequest);
            }
          } catch (error) {
            requestFilterPromise = Promise.reject(error);
          }
          requestFilterPromise = requestFilterPromise || Promise.resolve(pkRequest);
          return requestFilterPromise
            .then(updatedRequest => {
              context.url = updatedRequest.url;
              xhr.open('GET', updatedRequest.url, true);
              Object.entries(updatedRequest.headers).forEach(entry => {
                xhr.setRequestHeader(...entry);
              });
              if (typeof updatedRequest.withCredentials === 'boolean') {
                xhr.withCredentials = updatedRequest.withCredentials;
              }
            })
            .catch(error => {
              this._requestFilterError = true;
              throw error;
            });
        }
      });
    }

    if (typeof Utils.Object.getPropertyPath(this._config, 'network.responseFilter') === 'function') {
      const self = this;
      HlsAdapter._logger.debug('Register response filter');
      Utils.Object.mergeDeep(this._config.hlsConfig, {
        loader,
        readystatechange: function (event) {
          let xhr = event.currentTarget,
            readyState = xhr.readyState,
            stats = this.stats,
            context = this.context,
            config = this.config;

          // don't proceed if xhr has been aborted
          if (stats.aborted) {
            return;
          }

          // >= HEADERS_RECEIVED
          if (readyState >= 2) {
            // clear xhr timeout and rearm it if readyState less than 4
            window.clearTimeout(this.requestTimeout);
            const {loading} = stats;
            if (loading.first === 0) {
              loading.first = Math.max(performance.now(), loading.start);
            }

            if (readyState === 4) {
              let status = xhr.status;
              // http status between 200 to 299 are all successful
              if (status >= 200 && status < 300) {
                loading.end = Math.max(stats.tfirst, performance.now());
                let data, len;
                if (context.responseType === 'arraybuffer') {
                  data = xhr.response;
                  len = data.byteLength;
                } else {
                  data = xhr.responseText;
                  len = data.length;
                }
                stats.loaded = stats.total = len;

                const pkResponse: PKResponseObject = {
                  url: xhr.responseURL,
                  originalUrl: context.url,
                  data,
                  headers: Utils.Http.convertHeadersToDictionary(xhr.getAllResponseHeaders())
                };
                let responseFilterPromise;
                try {
                  if (context.type === 'manifest') {
                    responseFilterPromise = self._config.network.responseFilter(RequestType.MANIFEST, pkResponse);
                  }
                  if (context.frag && context.frag.type !== 'subtitle') {
                    responseFilterPromise = self._config.network.responseFilter(RequestType.SEGMENT, pkResponse);
                  }
                } catch (error) {
                  responseFilterPromise = Promise.reject(error);
                }
                responseFilterPromise = responseFilterPromise || Promise.resolve(pkResponse);
                return responseFilterPromise
                  .then(updatedResponse => {
                    this.callbacks.onSuccess(updatedResponse, stats, context, xhr);
                  })
                  .catch(error => {
                    self._responseFilterError = true;
                    this.callbacks.onError({code: status, text: error.message}, context, xhr);
                  });
              } else {
                // if max nb of retries reached or if http status between 400 and 499 (such error cannot be recovered, retrying is useless), return error
                if (stats.retry >= config.maxRetry || (status >= 400 && status < 499)) {
                  HlsAdapter._logger.error(`${status} while loading ${context.url}`);
                  this.callbacks.onError({code: status, text: xhr.statusText}, context, xhr);
                } else {
                  // retry
                  HlsAdapter._logger.warn(`${status} while loading ${context.url}, retrying in ${this.retryDelay}...`);
                  // aborts and resets internal state
                  this.destroy();
                  // schedule retry
                  this.retryTimeout = window.setTimeout(this.loadInternal.bind(this), this.retryDelay);
                  // set exponential backoff
                  this.retryDelay = Math.min(2 * this.retryDelay, config.maxRetryDelay);
                  stats.retry++;
                }
              }
            } else {
              // readyState >= 2 AND readyState !==4 (readyState = HEADERS_RECEIVED || LOADING) rearm timeout as xhr not finished yet
              this.requestTimeout = window.setTimeout(this.loadtimeout.bind(this), config.timeout);
            }
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
    this._mediaAttachedPromise = new Promise(resolve => (this._onMediaAttached = resolve));
    for (const [event, callback] of Object.entries(this._adapterEventsBindings)) {
      this._hls.on(event, callback);
    }
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
    const id3Track = Array.from(this._videoElement?.textTracks).find(track => track.label === 'id3');
    const id3Cues = Array.from(id3Track?.cues || []);
    const newCues = [];
    data?.samples.forEach(sample => {
      const cue = Utils.binarySearch(id3Cues, cue => cue.startTime - sample.pts);
      if (cue) {
        const timedMetadata: TimedMetadata = createTimedMetadata(cue);
        newCues.push(timedMetadata);
      }
    });
    if (newCues.length) {
      this._trigger(EventType.TIMED_METADATA_ADDED, {cues: newCues});
    }
  }

  _onAddTrack(event: any) {
    if (!this._hls.subtitleTracks.length) {
      // parse CEA 608/708 captions that not exposed on hls.subtitleTracks API
      const CEATextTrack = this._parseCEATextTrack(event.track);
      if (CEATextTrack) {
        HlsAdapter._logger.debug('A CEA 608/708 caption has been found', CEATextTrack);
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
    }
  }

  /**
   * detach media - will remove the media source from handling the video
   * @public
   * @returns {void}
   */
  detachMediaSource(): void {
    if (this._hls) {
      // 1 second different between duration and current time will signal as end - will enable replay button
      if (Math.floor(this.duration - this.currentTime) === 0) {
        this._config.hlsConfig.startPosition = 0;
      } else if (this.currentTime > 0) {
        this._config.hlsConfig.startPosition = this.currentTime;
      }
      this._reset();

      this._loadPromiseHandlers?.reject(
        new PKError(PKError.Severity.CRITICAL, PKError.Category.PLAYER, PKError.Code.HLS_FATAL_MEDIA_ERROR, 'media detached while loading')
      );
      this._loadPromiseHandlers = null;
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
      this._loadPromise = new Promise((resolve, reject) => {
        this._loadPromiseHandlers = {resolve, reject};
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
    } else {
      this._loadPromiseHandlers?.reject(
        new PKError(PKError.Severity.CRITICAL, PKError.Category.PLAYER, PKError.Code.HLS_FATAL_MEDIA_ERROR, 'no url provided')
      );
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
    return new Promise((resolve, reject) => {
      super.destroy().then(
        () => {
          HlsAdapter._logger.debug('destroy');
          this._playerTracks = [];
          this._nativeTextTracksMap = {};
          this._sameFragSNLoadedCount = 0;
          this._lastLoadedFragSN = -1;
          this._loadPromiseHandlers?.reject(
            new PKError(
              PKError.Severity.CRITICAL,
              PKError.Category.PLAYER,
              PKError.Code.HLS_FATAL_MEDIA_ERROR,
              'The adapter has been destroyed while loading'
            )
          );
          this._loadPromiseHandlers = null;
          this._loadPromise = null;
          this._reset();
          resolve();
        },
        () => reject()
      );
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
    this._responseFilterError = false;
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
    for (const hlsTextTrack of hlsTextTracks) {
      // Create text tracks
      let settings = {
        id: hlsTextTrack.id,
        active: false,
        default: hlsTextTrack.default,
        label: hlsTextTrack.name,
        kind: hlsTextTrack.type.toLowerCase(),
        language: hlsTextTrack.lang
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
        language: CEATextTrack.language
      };
      textTrack = new TextTrack(settings);
      this._nativeTextTracksMap[textTrack.index] = CEATextTrack;
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
    const selectedTrack = this._nativeTextTracksMap[textTrack.index];
    if (selectedTrack) {
      this.disableNativeTextTracks();
      selectedTrack.mode = this._config.subtitleDisplay ? 'showing' : 'hidden';
      this._notifyTrackChanged(textTrack);
    }
  }

  _notifyTrackChanged(textTrack: TextTrack): void {
    this._onTrackChanged(textTrack);
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
        this.disableNativeTextTracks();
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
   * Apply ABR restriction.
   * @function applyABRRestriction
   * @param {PKABRRestrictionObject} restrictions - abr restrictions config
   * @returns {void}
   * @public
   */
  applyABRRestriction(restrictions: PKABRRestrictionObject): void {
    Utils.Object.createPropertyPath(this._config, 'abr.restrictions', restrictions);
    if (!this._hls.capLevelToPlayerSize) {
      this._maybeApplyAbrRestrictions(restrictions);
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
   * Gets the segment duration of the stream
   * @return {number} - Segment duration in seconds
   */
  getSegmentDuration(): number {
    const fragCurrent = Utils.Object.getPropertyPath(this._hls, 'streamController.fragCurrent');
    return fragCurrent ? fragCurrent.duration : 0;
  }

  /**
   * Gets the live duration
   * @return {number} - live duration
   */
  get liveDuration(): number {
    return this._getLiveEdge() + this.getSegmentDuration();
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
    // set current level to disable the auto selection in hls
    if (!this._config.abr.enabled) {
      this._hls.currentLevel = 0;
    }
    this._mediaAttachedPromise.then(() => {
      this._loadPromiseHandlers?.resolve({tracks: this._playerTracks});
      this._loadPromiseHandlers = null;
    });
    const {loading} = data.stats;
    const manifestDownloadTime = loading.end - loading.start;
    this._trigger(EventType.MANIFEST_LOADED, {miliSeconds: manifestDownloadTime});
  }

  /**
   * apply ABR restrictions
   * @private
   * @param {PKABRRestrictionObject} restrictions - abt config object
   * @returns {void}
   */
  _maybeApplyAbrRestrictions(restrictions: PKABRRestrictionObject): void {
    const videoTracks = this._playerTracks.filter(track => track instanceof VideoTrack);
    const availableTracks = filterTracksByRestriction(videoTracks, restrictions);
    if (availableTracks.length) {
      const minLevel = availableTracks[0];
      const maxLevel = availableTracks.pop();
      this._hls.config.minAutoBitrate = minLevel.bandwidth;
      this._hls.autoLevelCapping = maxLevel.index;

      const activeTrackInRange = availableTracks.some(track => track.active);
      if (!this.isAdaptiveBitrateEnabled() && !activeTrackInRange) {
        this.selectVideoTrack(minLevel);
      }
    } else {
      HlsAdapter._logger.warn('Invalid restrictions, there are not tracks within the restriction range');
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
    if (this._requestFilterError || this._responseFilterError) {
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
      let error: typeof PKError;
      switch (errorType) {
        case Hlsjs.ErrorTypes.NETWORK_ERROR:
          {
            let code;
            if (this._requestFilterError) {
              code = PKError.Code.REQUEST_FILTER_ERROR;
            } else if (this._responseFilterError) {
              code = PKError.Code.RESPONSE_FILTER_ERROR;
            } else {
              code = PKError.Code.HTTP_ERROR;
            }
            if (
              [Hlsjs.ErrorDetails.MANIFEST_LOAD_ERROR, Hlsjs.ErrorDetails.MANIFEST_LOAD_TIMEOUT].includes(errorName) &&
              !this._triedReloadWithRedirect &&
              !this._config.forceRedirectExternalStreams &&
              !this._requestFilterError &&
              !this._responseFilterError
            ) {
              error = new PKError(PKError.Severity.RECOVERABLE, PKError.Category.NETWORK, code, errorDataObject);
              this._reloadWithDirectManifest();
            } else {
              error = new PKError(PKError.Severity.CRITICAL, PKError.Category.NETWORK, code, errorDataObject);
            }
          }
          break;
        case Hlsjs.ErrorTypes.MEDIA_ERROR:
          if (this._handleMediaError()) {
            error = new PKError(PKError.Severity.RECOVERABLE, PKError.Category.MEDIA, PKError.Code.HLS_FATAL_MEDIA_ERROR, errorDataObject);
          } else {
            error = new PKError(PKError.Severity.CRITICAL, PKError.Category.MEDIA, PKError.Code.HLS_FATAL_MEDIA_ERROR, errorDataObject);
          }
          break;
        default:
          error = new PKError(PKError.Severity.CRITICAL, PKError.Category.PLAYER, PKError.Code.HLS_FATAL_MEDIA_ERROR, errorDataObject);
          break;
      }
      this._trigger(EventType.ERROR, error);
      if (error && error.severity === PKError.Severity.CRITICAL) {
        if (this._loadPromiseHandlers) {
          this._loadPromiseHandlers?.reject(error);
          this._loadPromiseHandlers = null;
          this._loadPromise = null;
        }
        this.destroy();
      }
    } else {
      const {category, code}: ErrorDetailsType =
        this._requestFilterError || this._responseFilterError
          ? {
              category: PKError.Category.NETWORK,
              code: this._requestFilterError ? PKError.Code.REQUEST_FILTER_ERROR : PKError.Code.RESPONSE_FILTER_ERROR
            }
          : HlsJsErrorMap[errorName] || {category: 0, code: 0};
      HlsAdapter._logger.warn(new PKError(PKError.Severity.RECOVERABLE, category, code, errorDataObject));
    }
    this._requestFilterError = false;
    this._responseFilterError = false;
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
    for (const [event, callback] of Object.entries(this._adapterEventsBindings)) {
      this._hls.off(event, callback);
    }
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
   * called when a level is loaded
   * @private
   * @param {any} e - the event object
   * @param {any} data - the event data
   * @returns {void}
   */
  _onLevelLoaded = (e: any, data: any) => {
    if (this.isLive()) {
      const {
        details: {endSN}
      } = data;
      if (this._lastLoadedFragSN === endSN) {
        this._sameFragSNLoadedCount++;
        HlsAdapter._logger.debug(`Same frag SN. Count is: ${this._sameFragSNLoadedCount}, Max is: ${this._config.network.maxStaleLevelReloads}`);
        if (this._sameFragSNLoadedCount >= this._config.network.maxStaleLevelReloads) {
          HlsAdapter._logger.error(`Same frag loading reached max count`);
          const error = new PKError(PKError.Severity.CRITICAL, PKError.Category.NETWORK, PKError.Code.LIVE_MANIFEST_REFRESH_ERROR, {
            fragSN: endSN
          });
          this._trigger(EventType.ERROR, error);
          return this.destroy();
        }
        HlsAdapter._logger.debug(`Last frag SN is: ${endSN}`);
      } else {
        this._sameFragSNLoadedCount = 0;
      }
      this._lastLoadedFragSN = endSN;
    }
  };

  /**
   * called when a fragment is loaded
   * @private
   * @param {any} data - the event data of the loaded fragment
   * @returns {void}
   */
  _onFragLoaded(data: any): void {
    if (Utils.Object.hasPropertyPath(data, 'frag.stats.loading')) {
      const {stats} = data.frag;
      const fragmentDownloadTime = stats.loading.end - stats.loading.start;
      this._trigger(EventType.FRAG_LOADED, {
        miliSeconds: fragmentDownloadTime,
        bytes: stats.loaded,
        url: data.frag.url
      });
    }
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
