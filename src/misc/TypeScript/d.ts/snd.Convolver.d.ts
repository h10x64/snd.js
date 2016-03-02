declare module snd {
  export class Convolver extends snd.AudioUnit {
    constructor (id:string);

    buffer:any;
    normalize:boolean;
  }
}
