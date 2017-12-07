// @flow
import Hlsjs from 'hls.js'
import {Error} from 'playkit-js'

type ErrorDetailsType = {category: number, code: number};
type HlsJsErrorMapType = {[name: string]: ErrorDetailsType};

const HlsJsErrorMap: HlsJsErrorMapType = {
  [Hlsjs.ErrorDetails.MANIFEST_LOAD_ERROR]: {
    category: Error.Category.MANIFEST,
    code: Error.Code.HTTP_ERROR
  },
  [Hlsjs.ErrorDetails.MANIFEST_LOAD_TIMEOUT]: {
    category: Error.Category.MANIFEST,
    code: Error.Code.TIMEOUT
  },
  [Hlsjs.ErrorDetails.MANIFEST_PARSING_ERROR]: {
    category: Error.Category.MANIFEST,
    code: Error.Code.HLSJS_CANNOT_PARSE
  },
  [Hlsjs.ErrorDetails.LEVEL_LOAD_ERROR]: {
    category: Error.Category.NETWORK,
    code: Error.Code.HTTP_ERROR
  },
  [Hlsjs.ErrorDetails.LEVEL_LOAD_TIMEOUT]: {
    category: Error.Category.NETWORK,
    code: Error.Code.TIMEOUT
  },
  [Hlsjs.ErrorDetails.LEVEL_SWITCH_ERROR]: {
    category: Error.Category.PLAYER,
    code: Error.Code.BITRATE_SWITCH_ISSUE
  },
  [Hlsjs.ErrorDetails.FRAG_LOAD_ERROR]: {
    category: Error.Category.NETWORK,
    code: Error.Code.HTTP_ERROR
  },
  [Hlsjs.ErrorDetails.FRAG_LOOP_LOADING_ERROR]: {
    category: Error.Category.NETWORK,
    code: Error.Code.HTTP_ERROR
  },
  [Hlsjs.ErrorDetails.FRAG_LOAD_TIMEOUT]: {
    category: Error.Category.NETWORK,
    code: Error.Code.TIMEOUT
  },
  [Hlsjs.ErrorDetails.FRAG_PARSING_ERROR]: {
    category: Error.Category.MEDIA,
    code: Error.Code.HLS_FRAG_PARSING_ERROR
  },
  [Hlsjs.ErrorDetails.BUFFER_APPEND_ERROR]: {
    category: Error.Category.MEDIA,
    code: Error.Code.HLS_BUFFER_APPEND_ISSUE
  },
  [Hlsjs.ErrorDetails.BUFFER_APPENDING_ERROR]: {
    category: Error.Category.MEDIA,
    code: Error.Code.HLS_BUFFER_APPENDING_ISSUE
  },
  [Hlsjs.ErrorDetails.BUFFER_STALLED_ERROR]: {
    category: Error.Category.MEDIA,
    code: Error.Code.HLS_BUFFER_STALLED_ERROR
  }
};

export {HlsJsErrorMap};
export type {ErrorDetailsType};
