declare module snd {
  export class BiquadFilter extends snd.AudioUnit {
    constructor (id:string);

    type:string;

    frequency:number;
    detune:number;
    Q:number;
    gain:number;

    frequencyParam:any;
    detuneParam:any;
    QParam:any;
    gainParam:any;
  }
}
