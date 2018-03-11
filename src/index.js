// @flow
import {registerMediaSourceAdapter} from 'playkit-js'
import HlsAdapter from './hls-adapter'

declare var __VERSION__: string;
declare var __NAME__: string;

export default HlsAdapter;
export {__VERSION__ as VERSION, __NAME__ as NAME};

// Register hls adapter to the media source adapter provider.
if (HlsAdapter.isSupported()) {
  registerMediaSourceAdapter(HlsAdapter);
}
