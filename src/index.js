// @flow
import {registerMediaSourceAdapter} from 'playkit-js'
import {Adapter} from './hls-adapter'

declare var __VERSION__: string;
declare var __NAME__: string;

const VERSION = __VERSION__;
const NAME = __NAME__;

export {VERSION, NAME};
export {Adapter};

// Register hls adapter to the media source adapter provider.
if (Adapter.isSupported()) {
  registerMediaSourceAdapter(Adapter);
}
