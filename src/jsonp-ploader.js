//@flow
import {Utils} from 'playkit-js'
import Hlsjs from 'hls.js'

/**
 * A plugin override for the loader function in hls.js.
 * It checks if it should use jsonp for the manifest first, else - the regular
 * loader is called.
 */
export default class pLoader extends Hlsjs.DefaultConfig.loader {
  /**
   * redirect external stream handler function
   * @param {string} uri - the original uri
   * @returns {string} uri - the redirected URI
   * @static
   */
  static redirectExternalStreamsHandler: Function = uri => uri;

  /**
   * @constructor
   * @param {Object} config - hlsjs config object. it also contains the jsonp callback function
   */
  constructor(config: Object) {
    super(config);
    const loadOrig = this.load.bind(this);
    const callback = pLoader.redirectExternalStreamsHandler;
    this.load = (context, config, callbacks) => {
      const url = context.url;
      if (context.type === 'manifest') {
        Utils.Http.jsonp(url, callback, {
          timeout: pLoader.redirectExternalStreamsTimeout
        }).then(uri => {
          context.url = uri;
          loadOrig(context, config, callbacks);
        }).catch(() => loadOrig(context, config, callbacks));
      } else {
        loadOrig(context, config, callbacks);
      }
    };
  }
}
