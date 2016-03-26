declare module snd {
  export class AudioDataManager {
    new ();

    data : {[key:string]:any}; // {[key:string]: AudioBuffer}

    onload():void;
    addAllDataLoadListener(listener:()=>void):void;
    removeAllDataLoadListener(listener:()=>void):void;
    addOnLoadListener(key:string, listener:()=>void):void;
    removeOnLoadListener(key:string):void;

    getAudioBuffer(key:string):void;
    add(key:string, url:string):void;
    addBase64(key:string, base64Str: string):void;
    doesAllDataLoaded():boolean;
    addAll(dataSet:{[key:string]:string}):void; // {[key:string]: URL}
    removeData(key:string):void;
    removeAll(keys:string[]):void;

    load(key?:string):void;
  }

  export var AUDIO_DATA_MANAGER:AudioDataManager;
}
