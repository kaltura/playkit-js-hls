// eslint-disable-next-line  @typescript-eslint/ban-ts-comment
// @ts-nocheck
import {Utils} from '@playkit-js/playkit-js';
import loader from './loader';

/**
 * A plugin override for the loader function in hls.js.
 * It checks if it should use jsonp for the manifest first, else - the regular
 * loader is called.
 */
export default class pLoader extends loader {
  /**
   * redirect external stream handler function
   * @param {Object} data - The json object that returns from the server.
   * @param {string} uri - the original uri
   * @returns {string} uri - the redirected URI
   * @static
   */
  public static redirectExternalStreamsHandler = (data, uri): string => uri;

  /**
   * @constructor
   * @param {Object} config - hlsjs config object. it also contains the jsonp callback function
   */
  constructor(config: any) {
    super(config);
    const loadOrig = this.load.bind(this);
    const callback = pLoader.redirectExternalStreamsHandler;
    this.load = (context, config, callbacks): void => {
      const url = context.url;
      if (context.type === 'manifest') {
        Utils.Http.jsonp(url, callback, {
          timeout: pLoader.redirectExternalStreamsTimeout
        })
          .then(uri => {
            context.url = uri;
            loadOrig(context, config, callbacks);
          })
          .catch(() => loadOrig(context, config, callbacks));
      } else {
        loadOrig(context, config, callbacks);
      }
    };
  }
}
