declare module snd {
  export class Noise extends AudioUnit {
    constructor (id:string, bufferLength:number, channels:number);

    /* Properties */
    volume:number;
    volumeParam:number;
  }
}
