declare module snd {
  export interface PeriodicWave {
    realArray:Float32Array;
    imagArray:Float32Array;
  }

  export class OscillatorSource extends Source {
    constructor (id:string);

    /* Properties */
    public periodicWave:snd.PeriodicWave;
    public oscillatorType:string;
    public frequency:number;
    public detune:number;
    public frequencyParam:any;
    public detuneParam:any;

    /* Methods */
    public addOnEndedEventListener(callback:(src:snd.OscillatorSource)=>void):void;
    public removeOnEndedEventListener(callback:(src:snd.OscillatorSource)=>void):void;
  }

  export module OscillatorSource {
    export var DEFAULT_FREQUENCY:number;
  }
}
