## API Report File for "@playkit-js/playkit-js-hls"

> Do not edit this file. It is a report generated by [API Extractor](https://api-extractor.com/).

```ts

import { AudioTrack } from '@playkit-js/playkit-js';
import { BaseMediaSourceAdapter } from '@playkit-js/playkit-js';
import { ILogger } from 'js-logger';
import { IMediaSourceAdapter } from '@playkit-js/playkit-js';
import { PKABRRestrictionObject } from '@playkit-js/playkit-js';
import { PKMediaSourceObject } from '@playkit-js/playkit-js';
import { TextTrack as TextTrack_2 } from '@playkit-js/playkit-js';
import { VideoTrack } from '@playkit-js/playkit-js';

// @public
class HlsAdapter extends BaseMediaSourceAdapter {
    constructor(videoElement: HTMLVideoElement, source: PKMediaSourceObject, config: any);
    applyABRRestriction(restrictions: PKABRRestrictionObject): void;
    attachMediaSource(): void;
    static canPlayDrm(): boolean;
    static canPlayType(mimeType: string): boolean;
    static createAdapter(videoElement: HTMLVideoElement, source: PKMediaSourceObject, config: any): IMediaSourceAdapter;
    // @override
    destroy(): Promise<void>;
    detachMediaSource(): void;
    enableAdaptiveBitrate(): void;
    protected _getLiveEdge(): number;
    getSegmentDuration(): number;
    getStartTimeOfDvrWindow(): number;
    handleMediaError(error: MediaError): boolean;
    hideTextTrack(): void;
    static id: string;
    isAdaptiveBitrateEnabled(): boolean;
    isLive(): boolean;
    static isSupported(): boolean;
    get liveDuration(): number;
    // @override
    load(startTime?: number): Promise<any>;
    protected static _logger: ILogger;
    seekToLiveEdge(): void;
    selectAudioTrack(audioTrack: AudioTrack): void;
    selectTextTrack(textTrack: TextTrack_2): void;
    selectVideoTrack(videoTrack: VideoTrack): void;
    get targetBuffer(): number;
}
export default HlsAdapter;

// @public (undocumented)
export const NAME: string;

// @public (undocumented)
export const VERSION: string;

// (No @packageDocumentation comment for this package)

```
