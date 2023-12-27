/* eslint-disable */
// @ts-nocheck
import Hlsjs from 'hls.js';

/**
 * A custom override for the loader function in hls.js.
 * It passes the context for the xhrSetup config
 */
export default class loader extends Hlsjs.DefaultConfig.loader {
  constructor(config: any) {
    super(config);
    if (config && config.readystatechange) {
      this.readystatechange = config.readystatechange;
    }
  }

  loadInternal() {
    let xhr,
      context = this.context;
    xhr = this.loader = new XMLHttpRequest();

    const stats = this.stats;
    stats.tfirst = 0;
    stats.loaded = 0;
    const xhrSetup = this.xhrSetup;

    let xhrSetupPromise;
    try {
      if (xhrSetup) {
        try {
          xhrSetupPromise = xhrSetup(xhr, context.url, context);
        } catch (e) {
          // fix xhrSetup: (xhr, url) => {xhr.setRequestHeader("Content-Language", "test");}
          // not working, as xhr.setRequestHeader expects xhr.readyState === OPEN
          xhr.open('GET', context.url, true);
          xhrSetupPromise = xhrSetup(xhr, context.url, context);
        }
      }
      if (!xhr.readyState) {
        xhr.open('GET', context.url, true);
      }
    } catch (e) {
      // IE11 throws an exception on xhr.open if attempting to access an HTTP resource over HTTPS
      xhrSetupPromise = Promise.reject(e);
    }
    xhrSetupPromise = xhrSetupPromise || Promise.resolve();
    xhrSetupPromise
      .then(() => {
        if (context.rangeEnd) {
          xhr.setRequestHeader('Range', 'bytes=' + context.rangeStart + '-' + (context.rangeEnd - 1));
        }

        xhr.onreadystatechange = this.readystatechange.bind(this);
        xhr.onprogress = this.loadprogress.bind(this);
        xhr.responseType = context.responseType;

        // setup timeout before we perform request
        this.requestTimeout = window.setTimeout(this.loadtimeout.bind(this), this.config.timeout);
        xhr.send();
      })
      .catch(e => {
        this.callbacks.onError({code: xhr.status, text: e.message}, context, xhr);
      });
  }
}
