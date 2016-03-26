declare module snd {
  export class MediaStreamAudioDestination extends AudioUnit {
    constructor (id:string);

    stream:any;
    volume:number;

    volumeParam:any;
  }

  export var STREAM_MASTER:snd.MediaStreamAudioDestination;
}
