//@flow
import {Jsonp as jsonp} from 'playkit-js'
import Hlsjs from 'hls.js'

/**
 * A plugin override for the loader function in hls.js. It checks if it should use jsonp for the manifest first, else - the regular
 * loader is called.
 * @export
 */
export default class pLoader extends Hlsjs.DefaultConfig.loader {
  /**
   * @constructor
   * @param {Object} config - hlsjs config object. it also contains the jsonp callback function
   */
  constructor(config: Object) {
    super(config);
    const load = this.load.bind(this);
    const jsonpCallback = config.redirectForExternalStreamsCallback;
    this.load = function (context, config, callbacks) {
      const url = context.url;
      if (context.type == 'manifest') {
        jsonp(url, jsonpCallback).then(uri => {
          context.url = uri;
          load(context, config, callbacks);
        })
      } else {
        load(context, config, callbacks);
      }
    };
  }
}
