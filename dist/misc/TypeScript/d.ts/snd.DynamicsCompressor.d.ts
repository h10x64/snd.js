declare module snd {
  export class DynamicsCompressor extends snd.AudioUnit {
    constructor (id:string);

    attack:number;
    knee:number;
    ratio:number;
    release:number;
    threshold:number;
    reduction:number;

    attackParam:any;
    kneeParam:any;
    ratioParam:any;
    releaseParam:any;
    thresholdParam:any;
    reductionParam:any;
  }
}
