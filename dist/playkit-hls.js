(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("hls.js"), require("playkit-js"));
	else if(typeof define === 'function' && define.amd)
		define(["hls.js", "playkit-js"], factory);
	else if(typeof exports === 'object')
		exports["PlaykitJsHls"] = factory(require("hls.js"), require("playkit-js"));
	else
		root["PlaykitJsHls"] = factory(root["Hls"], root["Playkit"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_1__, __WEBPACK_EXTERNAL_MODULE_2__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _hls = __webpack_require__(1);

var _hls2 = _interopRequireDefault(_hls);

var _playkitJs = __webpack_require__(2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * Adapter of hls.js lib for hls content.
 * @classdesc
 */
var HlsAdapter = function (_BaseMediaSourceAdapt) {
  _inherits(HlsAdapter, _BaseMediaSourceAdapt);

  _createClass(HlsAdapter, null, [{
    key: 'createAdapter',


    /**
     * Factory method to create media source adapter.
     * @function createAdapter
     * @param {HTMLVideoElement} videoElement - The video element that the media source adapter work with.
     * @param {Object} source - The source Object.
     * @param {Object} config - The player configuration.
     * @returns {IMediaSourceAdapter} - New instance of the run time media source adapter.
     * @static
     */

    /**
     * The hls player instance.
     * @member {any} _hls
     * @private
     */

    /**
     * The load promise
     * @member {Promise<Object>} - _loadPromise
     * @type {Promise<Object>}
     * @private
     */

    /**
     * Reference to the player tracks.
     * @member {Array<Track>} - _playerTracks
     * @type {Array<Track>}
     * @private
     */

    /**
     * The adapter logger.
     * @member {any} _logger
     * @static
     * @private
     */
    value: function createAdapter(videoElement, source, config) {
      var hlsConfig = {};
      if (_playkitJs.Utils.Object.hasPropertyPath(config, 'playback.options.html5.hls')) {
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

    /**
     * The supported mime types by the hls adapter.
     * @member {Array<string>} _hlsMimeType
     * @static
     * @private
     */

    /**
     * The id of the adapter.
     * @member {string} id
     * @static
     * @private
     */

  }, {
    key: 'canPlayType',
    value: function canPlayType(mimeType) {
      var canHlsPlayType = typeof mimeType === 'string' ? HlsAdapter._hlsMimeTypes.includes(mimeType.toLowerCase()) : false;
      HlsAdapter._logger.debug('canPlayType result for mimeType:' + mimeType + ' is ' + canHlsPlayType.toString());
      return canHlsPlayType;
    }

    /**
     * Checks if the hls adapter is supported.
     * @function isSupported
     * @returns {boolean} - Whether hls is supported.
     * @static
     */

  }, {
    key: 'isSupported',
    value: function isSupported() {
      var isHlsSupported = _hls2.default.isSupported();
      HlsAdapter._logger.debug('isSupported:' + isHlsSupported);
      return isHlsSupported;
    }

    /**
     * @constructor
     * @param {HTMLVideoElement} videoElement - The video element which will bind to the hls adapter
     * @param {Object} source - The source object
     * @param {Object} config - The media source adapter configuration
     */

  }]);

  function HlsAdapter(videoElement, source, config) {
    _classCallCheck(this, HlsAdapter);

    HlsAdapter._logger.debug('Creating adapter. Hls version: ' + _hls2.default.version);

    var _this = _possibleConstructorReturn(this, (HlsAdapter.__proto__ || Object.getPrototypeOf(HlsAdapter)).call(this, videoElement, source, config));

    _this._hls = new _hls2.default(_this._config);
    _this._addBindings();
    return _this;
  }

  /**
   * Adds the required bindings with hls.js.
   * @function _addBindings
   * @private
   * @returns {void}
   */


  _createClass(HlsAdapter, [{
    key: '_addBindings',
    value: function _addBindings() {
      this._hls.on(_hls2.default.Events.ERROR, this._onError.bind(this));
      this._hls.on(_hls2.default.Events.LEVEL_SWITCHED, this._onLevelSwitched.bind(this));
      this._hls.on(_hls2.default.Events.AUDIO_TRACK_SWITCHED, this._onAudioTrackSwitched.bind(this));
    }

    /**
     * Load the video source
     * @function load
     * @param {number} startTime - Optional time to start the video from.
     * @returns {Promise<Object>} - The loaded data
     * @override
     */

  }, {
    key: 'load',
    value: function load(startTime) {
      var _this2 = this;

      if (!this._loadPromise) {
        this._loadPromise = new Promise(function (resolve) {
          _this2._hls.on(_hls2.default.Events.MANIFEST_LOADED, function (event, data) {
            HlsAdapter._logger.debug('The source has been loaded successfully');
            _this2._playerTracks = _this2._parseTracks(data);
            resolve({ tracks: _this2._playerTracks });
          });
          if (startTime) {
            _this2._hls.startPosition = startTime;
          }
          if (_this2._sourceObj && _this2._sourceObj.url) {
            _this2._hls.loadSource(_this2._sourceObj.url);
            _this2._hls.attachMedia(_this2._videoElement);
          }
        });
      }
      return this._loadPromise;
    }

    /**
     * Destroying the hls adapter.
     * @function destroy
     * @override
     */

  }, {
    key: 'destroy',
    value: function destroy() {
      HlsAdapter._logger.debug('destroy');
      _get(HlsAdapter.prototype.__proto__ || Object.getPrototypeOf(HlsAdapter.prototype), 'destroy', this).call(this);
      this._loadPromise = null;
      this._removeBindings();
      this._hls.detachMedia();
      this._hls.destroy();
    }

    /**
     * Parse the hls tracks into player tracks.
     * @param {any} data - The event data.
     * @returns {Array<Track>} - The parsed tracks.
     * @private
     */

  }, {
    key: '_parseTracks',
    value: function _parseTracks(data) {
      var audioTracks = this._parseAudioTracks(data.audioTracks || []);
      var videoTracks = this._parseVideoTracks(data.levels || []);
      var textTracks = this._parseTextTracks(this._videoElement.textTracks || []);
      return audioTracks.concat(videoTracks).concat(textTracks);
    }

    /**
     * Parse hls audio tracks into player audio tracks.
     * @param {Array<Object>} hlsAudioTracks - The hls audio tracks.
     * @returns {Array<AudioTrack>} - The parsed audio tracks.
     * @private
     */

  }, {
    key: '_parseAudioTracks',
    value: function _parseAudioTracks(hlsAudioTracks) {
      var audioTracks = [];
      for (var i = 0; i < hlsAudioTracks.length; i++) {
        // Create audio tracks
        var settings = {
          id: hlsAudioTracks[i].id,
          active: this._hls.audioTrack === hlsAudioTracks[i].id,
          label: hlsAudioTracks[i].name,
          language: hlsAudioTracks[i].lang,
          index: i
        };
        audioTracks.push(new _playkitJs.AudioTrack(settings));
      }
      return audioTracks;
    }

    /**
     * Parse hls video tracks into player video tracks.
     * @param {Array<Object>} hlsVideoTracks - The hls video tracks.
     * @returns {Array<VideoTrack>} - The parsed video tracks.
     * @private
     */

  }, {
    key: '_parseVideoTracks',
    value: function _parseVideoTracks(hlsVideoTracks) {
      var videoTracks = [];
      for (var i = 0; i < hlsVideoTracks.length; i++) {
        // Create video tracks
        var settings = {
          active: this._hls.startLevel === i,
          label: hlsVideoTracks[i].name,
          bandwidth: hlsVideoTracks[i].bitrate,
          width: hlsVideoTracks[i].width,
          height: hlsVideoTracks[i].height,
          language: '',
          index: i
        };
        videoTracks.push(new _playkitJs.VideoTrack(settings));
      }
      return videoTracks;
    }

    /**
     * Parse native video tag text tracks into player text tracks.
     * @param {TextTrackList} vidTextTracks - The native video tag text tracks.
     * @returns {Array<TextTrack>} - The parsed text tracks.
     * @private
     */

  }, {
    key: '_parseTextTracks',
    value: function _parseTextTracks(vidTextTracks) {
      var textTracks = [];
      for (var i = 0; i < vidTextTracks.length; i++) {
        // Create text tracks
        var settings = {
          active: vidTextTracks[i].mode === 'showing',
          label: vidTextTracks[i].label,
          kind: vidTextTracks[i].kind,
          language: vidTextTracks[i].language,
          index: i
        };
        textTracks.push(new _playkitJs.TextTrack(settings));
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

  }, {
    key: 'selectAudioTrack',
    value: function selectAudioTrack(audioTrack) {
      if (audioTrack instanceof _playkitJs.AudioTrack && !audioTrack.active && this._hls.audioTracks) {
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

  }, {
    key: 'selectVideoTrack',
    value: function selectVideoTrack(videoTrack) {
      if (videoTrack instanceof _playkitJs.VideoTrack && (!videoTrack.active || this._hls.autoLevelEnabled) && this._hls.levels) {
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

  }, {
    key: 'selectTextTrack',
    value: function selectTextTrack(textTrack) {
      if (textTrack instanceof _playkitJs.TextTrack && !textTrack.active && this._videoElement.textTracks) {
        this._disableAllTextTracks();
        this._videoElement.textTracks[textTrack.index].mode = 'showing';
        HlsAdapter._logger.debug('Text track changed', textTrack);
        this._onTrackChanged(textTrack);
      }
    }

    /** Hide the text track
     * @function hideTextTrack
     * @returns {void}
     * @public
     */

  }, {
    key: 'hideTextTrack',
    value: function hideTextTrack() {
      this._disableAllTextTracks();
    }

    /**
     * Enables adaptive bitrate switching according to hls.js logic.
     * @function enableAdaptiveBitrate
     * @returns {void}
     * @public
     */

  }, {
    key: 'enableAdaptiveBitrate',
    value: function enableAdaptiveBitrate() {
      this._hls.nextLevel = -1;
    }

    /**
     * Checking if adaptive bitrate switching is enabled.
     * @function isAdaptiveBitrateEnabled
     * @returns {boolean} - Whether adaptive bitrate is enabled.
     * @public
     */

  }, {
    key: 'isAdaptiveBitrateEnabled',
    value: function isAdaptiveBitrateEnabled() {
      return this._hls.autoLevelEnabled;
    }

    /**
     * Triggers on video track selection (auto or manually) the 'videotrackchanged' event forward.
     * @function _onLevelSwitched
     * @param {string} event - The event name.
     * @param {any} data - The event data object.
     * @private
     * @returns {void}
     */

  }, {
    key: '_onLevelSwitched',
    value: function _onLevelSwitched(event, data) {
      var videoTrack = this._playerTracks.find(function (track) {
        return track instanceof _playkitJs.VideoTrack && track.index === data.level;
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

  }, {
    key: '_onAudioTrackSwitched',
    value: function _onAudioTrackSwitched(event, data) {
      var audioTrack = this._playerTracks.find(function (track) {
        return track instanceof _playkitJs.AudioTrack && track.id === data.id;
      });
      HlsAdapter._logger.debug('Audio track changed', audioTrack);
      this._onTrackChanged(audioTrack);
    }

    /**
     * Disables all the video tag text tracks.
     * @returns {void}
     * @private
     */

  }, {
    key: '_disableAllTextTracks',
    value: function _disableAllTextTracks() {
      var vidTextTracks = this._videoElement.textTracks;
      for (var i = 0; i < vidTextTracks.length; i++) {
        vidTextTracks[i].mode = 'hidden';
      }
    }

    /**
     * Handles hls errors.
     * @param {string} event - The event name.
     * @param {any} data - The event data object.
     * @private
     * @returns {void}
     */

  }, {
    key: '_onError',
    value: function _onError(event, data) {
      var errorType = data.type;
      var errorDetails = data.details;
      var errorFatal = data.fatal;
      if (errorFatal) {
        switch (errorType) {
          case _hls2.default.ErrorTypes.NETWORK_ERROR:
            HlsAdapter._logger.error("fatal network error encountered, try to recover");
            this._hls.startLoad();
            break;
          case _hls2.default.ErrorTypes.MEDIA_ERROR:
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
          case _hls2.default.ErrorDetails.MANIFEST_LOAD_ERROR:
          case _hls2.default.ErrorDetails.MANIFEST_LOAD_TIMEOUT:
          case _hls2.default.ErrorDetails.MANIFEST_PARSING_ERROR:
          case _hls2.default.ErrorDetails.LEVEL_LOAD_ERROR:
          case _hls2.default.ErrorDetails.LEVEL_LOAD_TIMEOUT:
          case _hls2.default.ErrorDetails.LEVEL_SWITCH_ERROR:
          case _hls2.default.ErrorDetails.FRAG_LOAD_ERROR:
          case _hls2.default.ErrorDetails.FRAG_LOOP_LOADING_ERROR:
          case _hls2.default.ErrorDetails.FRAG_LOAD_TIMEOUT:
          case _hls2.default.ErrorDetails.FRAG_PARSING_ERROR:
          case _hls2.default.ErrorDetails.BUFFER_APPEND_ERROR:
          case _hls2.default.ErrorDetails.BUFFER_APPENDING_ERROR:
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

  }, {
    key: '_removeBindings',
    value: function _removeBindings() {
      this._hls.off(_hls2.default.Events.ERROR, this._onError);
      this._hls.off(_hls2.default.Events.LEVEL_SWITCHED, this._onLevelSwitched);
      this._hls.off(_hls2.default.Events.AUDIO_TRACK_SWITCHED, this._onAudioTrackSwitched);
    }

    /**
     * Getter for the src that the adapter plays on the video element.
     * In case the adapter preformed a load it will return the manifest url.
     * @public
     * @returns {string} - The src url.
     */

  }, {
    key: 'src',
    get: function get() {
      if (this._loadPromise && this._sourceObj) {
        return this._sourceObj.url;
      }
      return "";
    }
  }]);

  return HlsAdapter;
}(_playkitJs.BaseMediaSourceAdapter);

// Register hls adapter to the media source adapter provider.


HlsAdapter.id = 'HlsAdapter';
HlsAdapter._logger = _playkitJs.BaseMediaSourceAdapter.getLogger(HlsAdapter.id);
HlsAdapter._hlsMimeTypes = ['application/x-mpegurl', 'application/vnd.apple.mpegurl', 'audio/mpegurl', 'audio/x-mpegurl', 'video/x-mpegurl', 'video/mpegurl', 'application/mpegurl'];
exports.default = HlsAdapter;
if (HlsAdapter.isSupported()) {
  (0, _playkitJs.registerMediaSourceAdapter)(HlsAdapter);
}

/***/ }),
/* 1 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_1__;

/***/ }),
/* 2 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_2__;

/***/ })
/******/ ]);
});
//# sourceMappingURL=playkit-hls.js.map