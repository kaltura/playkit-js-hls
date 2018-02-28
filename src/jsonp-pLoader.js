//@flow
import {Utils} from 'playkit-js'
import Hlsjs from 'hls.js'

/**
 * A plugin override for the loader function in hls.js. It checks if it should use jsonp for the manifest first, else - the regular
 * loader is called.
 */
export default class pLoader extends Hlsjs.DefaultConfig.loader {
  /**
   * redirect external stream callback function
   * @param {string} uri - the original uri
   * @returns {string} uri - the redirected URI
   * @static
   */
  static redirectExternalStreamsCallback: Function = uri => uri;
  /**
   * @constructor
   * @param {Object} config - hlsjs config object. it also contains the jsonp callback function
   */
  constructor(config: Object) {
    super(config);
    const load = this.load.bind(this);
    const jsonpCallback = pLoader.redirectExternalStreamsCallback;
    this.load = function (context, config, callbacks) {
      const url = context.url;
      if (context.type == 'manifest') {
        Utils.jsonp(url, jsonpCallback).then(uri => {
          context.url = uri;
          load(context, config, callbacks);
        })
      } else {
        load(context, config, callbacks);
      }
    };
  }
}
