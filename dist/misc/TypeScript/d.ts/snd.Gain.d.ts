declare module snd {
  export class Gain extends snd.AudioUnit {
    new (id:string);

    gain:number;
    gainParam:any;
  }
}
