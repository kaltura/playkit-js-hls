//@flow
import Hlsjs from 'hls.js'
import {registerMediaSourceAdapter} from 'playkit-js'

export default class HlsAdapter implements IMediaSourceAdapter {

  static _name: string = 'HlsAdapter';
  static _hlsMimeType: string = 'application/x-mpegurl';

  _config: Object;
  _engine: IEngine;
  _source: string;
  _hls: any;

  static get name(): string {
    return HlsAdapter._name;
  }

  static canPlayType(mimeType: string): boolean {
    return (mimeType === HlsAdapter._hlsMimeType);
  }

  static createAdapter(engine: IEngine, source: Object, config: Object): IMediaSourceAdapter {
    return new this(engine, source, config);
  }

  static isSupported(): boolean {
    return Hlsjs.isSupported();
  }

  constructor(engine: IEngine, source: Object, config: Object) {
    this._engine = engine;
    this._config = config;
    this._source = source.url;
    this._hls = new Hlsjs();
    this._addBindings();
  }

  _addBindings(): void {
    this._hls.on(Hlsjs.Events.MANIFEST_LOADED, this._onManifestLoaded.bind(this));
  }

  _onManifestLoaded(event, data): void {
    if (data.audioTracks) {
      let audioTracks = data.audioTracks;
      for (let i = 0; i < audioTracks.length; i++) {
        console.log(audioTracks[i]);
      }
    }
    if (data.levels) {
      let videoTracks = data.levels;
      for (let i = 0; i < videoTracks.length; i++) {
        console.log(videoTracks[i]);
      }
    }
    if (data.subtitles) {
      let textTracks = data.subtitles;
      for (let i = 0; i < textTracks.length; i++) {
        console.log(textTracks[i]);
      }
    }
  }

  load(): void {
    this._hls.loadSource(this._source);
    this._hls.attachMedia(this._engine.getVideoElement());
  }

  destroy(): void {
    this._hls.detachMedia();
    this._hls.destroy();
  }
}

if (HlsAdapter.isSupported()) {
  registerMediaSourceAdapter(HlsAdapter);
}
