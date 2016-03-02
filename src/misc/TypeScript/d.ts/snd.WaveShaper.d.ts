declare module snd {
  export class WaveShaper extends AudioUnit {
    constructor (id:string);

    curve:Float32Array;
    oversample:string;
    gain:number;
    gainParam:any;
  }
}
