declare module snd {
  export class ScriptProcessor extends AudioUnit {
    constructor (id:string);

    bufferLength:number;
    script:string;
  }
}
