import {registerMediaSourceAdapter} from '@playkit-js/playkit-js';
import HlsAdapter from './hls-adapter';

const VERSION = __VERSION__;
const NAME = __NAME__;

export default HlsAdapter;
export {VERSION, NAME};

// Register hls adapter to the media source adapter provider.
if (HlsAdapter.isSupported()) {
  registerMediaSourceAdapter(HlsAdapter);
}
