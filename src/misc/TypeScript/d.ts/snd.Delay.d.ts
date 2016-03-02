declare module snd {
  export class Delay extends snd.AudioUnit {
    constructor (id:string);

    maxDelay:number;
    delayTime:number;

    delayTimeParam:any;
  }
}
