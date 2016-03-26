declare module snd {
  class AudioMaster {
    constructor (id:string);

    connectAudioUnit(key:string, unit:snd.AudioUnit):void;
    getAudioUnit(key:string):snd.AudioUnit;
    disconnectAudioUnit(key:string):void;
    /**
     * This method returns GainNode for connect existing WebAudioAPI resources to the snd.js.
     * @see <a href="https://www.w3.org/TR/webaudio/#idl-def-GainNode">WebAudioAPI - 2.7 The GainNode Interface</a>
     */
    getConnector():any;
  }
  
  export module AudioMaster {
      export var ID:string;
  }

  export var MASTER:snd.AudioMaster;
}
