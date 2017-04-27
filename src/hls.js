//@flow
import Hlsjs from 'hls.js'
import {BaseMediaSourceAdapter, registerAdapter} from 'playkit-js'

export default class HlsAdapter extends BaseMediaSourceAdapter {
  static _name = 'HlsAdapter';
  static _mimeTypes = ['application/x-mpegurl'];

  static isSupported(): boolean {
    return Hlsjs.isSupported();
  }

  constructor(engine: IEngine, source: Object, config: Object) {
    super(engine, source, config);
    this._source = source.url;
    this._msPlayer = new Hlsjs();
  }

  load(): void {
    this._msPlayer.loadSource(this._source);
    this._msPlayer.attachMedia(this._engine.getVideoElement());
  }

  destroy(): void {
    this._msPlayer.destroy();
  }
}

if (HlsAdapter.isSupported()) {
  registerAdapter(HlsAdapter);
}
