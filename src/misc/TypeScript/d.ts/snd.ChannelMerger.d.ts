declare module snd {
  export class ChannelMerger extends snd.AudioUnit {
    constructor (id:string);

    channelCount:number;
  }
}
