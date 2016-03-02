declare module snd {
  export class MediaStreamAudioSource extends AudioUnit {
    constructor (
      id:string,
      mediaStream:any,
      useAudio:boolean,
      useVideo:boolean,
      callback:(src:snd.MediaStreamAudioSource)=>void,
      errorCallback:(src:snd.MediaStreamAudioSource)=>void
    );

    stream:any;
  }
}
