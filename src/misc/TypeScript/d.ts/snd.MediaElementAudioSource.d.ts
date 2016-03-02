declare module snd {
  export class MediaElementAudioSource extends snd.Source {
    constructor (id:string, htmlMediaElement:any);

    /* Properties */
    element:any;
    src:string;

    /* Methods */
    // start/stop method is written in the snd.Source.
    load():void;
    pause():void;

    /* add/remove EventLisetner */
    addOnPlayEventListener(callback:(src:snd.MediaElementAudioSource)=>void):void;
    addOnPauseEventListener(callback:(src:snd.MediaElementAudioSource)=>void):void;
    addOnEndedEventListener(callback:(src:snd.MediaElementAudioSource)=>void):void;
    addOnAbortEventListener(callback:(src:snd.MediaElementAudioSource)=>void):void;
    addOnCanPlayEventListener(callback:(src:snd.MediaElementAudioSource)=>void):void;
    addOnCanPlayThroughEventListener(callback:(src:snd.MediaElementAudioSource)=>void):void;
    addOnDurationChangeEventListener(callback:(src:snd.MediaElementAudioSource)=>void):void;
    addOnEmptiedEventListener(callback:(src:snd.MediaElementAudioSource)=>void):void;
    addOnErrorEventListener(callback:(src:snd.MediaElementAudioSource)=>void):void;
    addOnLoadedDataEventListener(callback:(src:snd.MediaElementAudioSource)=>void):void;
    addOnLoadedMetadataEventListener(callback:(src:snd.MediaElementAudioSource)=>void):void;
    addOnLoadStartEventListener(callback:(src:snd.MediaElementAudioSource)=>void):void;
    addOnPlayingEventListener(callback:(src:snd.MediaElementAudioSource)=>void):void;
    addOnProgressEventListener(callback:(src:snd.MediaElementAudioSource)=>void):void;
    addOnRateChangeEventListener(callback:(src:snd.MediaElementAudioSource)=>void):void;
    addOnSeekedEventListener(callback:(src:snd.MediaElementAudioSource)=>void):void;
    addOnSeekingEventListener(callback:(src:snd.MediaElementAudioSource)=>void):void;
    addOnStalledEventListener(callback:(src:snd.MediaElementAudioSource)=>void):void;
    addOnSuspendEventListener(callback:(src:snd.MediaElementAudioSource)=>void):void;
    addOnTimeUpdateEventListener(callback:(src:snd.MediaElementAudioSource)=>void):void;
    addOnVolumeChangeEventListener(callback:(src:snd.MediaElementAudioSource)=>void):void;
    addOnWaitingEventListener(callback:(src:snd.MediaElementAudioSource)=>void):void;

    removeOnPlayEventListener(callback:(src:snd.MediaElementAudioSource)=>void):void;
    removeOnPauseEventListener(callback:(src:snd.MediaElementAudioSource)=>void):void;
    removeOnEndedEventListener(callback:(src:snd.MediaElementAudioSource)=>void):void;
    removeOnAbortEventListener(callback:(src:snd.MediaElementAudioSource)=>void):void;
    removeOnCanPlayEventListener(callback:(src:snd.MediaElementAudioSource)=>void):void;
    removeOnCanPlayThroughEventListener(callback:(src:snd.MediaElementAudioSource)=>void):void;
    removeOnDurationChangeEventListener(callback:(src:snd.MediaElementAudioSource)=>void):void;
    removeOnErrorEventListener(callback:(src:snd.MediaElementAudioSource)=>void):void;
    removeOnEmptiedEventListener(callback:(src:snd.MediaElementAudioSource)=>void):void;
    removeOnLoadedDataEventListener(callback:(src:snd.MediaElementAudioSource)=>void):void;
    removeOnLoadedMetadataEventListener(callback:(src:snd.MediaElementAudioSource)=>void):void;
    removeOnLoadStartEventListener(callback:(src:snd.MediaElementAudioSource)=>void):void;
    removeOnPlayingEventListener(callback:(src:snd.MediaElementAudioSource)=>void):void;
    removeOnProgressEventListener(callback:(src:snd.MediaElementAudioSource)=>void):void;
    removeOnRateChangeEventListener(callback:(src:snd.MediaElementAudioSource)=>void):void;
    removeOnSeekedEventListener(callback:(src:snd.MediaElementAudioSource)=>void):void;
    removeOnSeekingEventListener(callback:(src:snd.MediaElementAudioSource)=>void):void;
    removeOnStalledEventListener(callback:(src:snd.MediaElementAudioSource)=>void):void;
    removeOnSuspendEventListener(callback:(src:snd.MediaElementAudioSource)=>void):void;
    removeOnTimeUpdateEventListener(callback:(src:snd.MediaElementAudioSource)=>void):void;
    removeOnVolumeChangeEventListener(callback:(src:snd.MediaElementAudioSource)=>void):void;
    removeOnWaitingEventListener(callback:(src:snd.MediaElementAudioSource)=>void):void;
  }
}
