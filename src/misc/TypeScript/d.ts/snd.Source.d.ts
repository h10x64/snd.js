declare module snd {
  export class Source extends AudioUnit {
    constructor (id:string);

    isSource : boolean;
    volumeParam : any;
    volume : number;
    type : string;

    start(when?:number, offset?:number, duration?:number) : void;
    stop(when?:number) : void;
  }
}
