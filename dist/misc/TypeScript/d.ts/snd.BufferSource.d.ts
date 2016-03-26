declare module snd {
  export class BufferSource extends snd.Source {
    constructor(id:string);

    audioBuffer:any;
    loop : boolean;
    loopStart : number;
    loopEnd : number;

    loadURL(url:string) : void;
    loadBase64(base64Str:string) : void;
    loadAudioBuffer(key:string) : void;
    setAudioBuffer(buffer:any) : void;

    addOnEndedEventListener(listener:(src:BufferSource)=>void) : void;
    removeOnEndedEventListener(listener:(src:BufferSource)=>void) : void;
    addOnLoadEventListener(listener:(src:BufferSource)=>void) : void;
    removeOnLoadEventListener(listener:(src:BufferSource)=>void) : void;
  }
}
