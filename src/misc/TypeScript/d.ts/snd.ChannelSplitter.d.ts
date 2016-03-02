declare module snd {
  export class ChannelSplitter extends snd.AudioUnit {
    constructor (id:string);

    channels:number;
  }
}
