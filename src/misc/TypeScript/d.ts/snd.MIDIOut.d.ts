declare module snd {
  /* Interfaces */
  export interface MidiOutMessage {
    ch:number;
    val:number;
    second:number[];
  }

  /* Classes */
  export class MIDIOut {
    constructor (midiOut:any, midiDef:{[eventName:string]:snd.MidiOutMessage});

    sendMassage(message:string, ch:number, no:number, pos:number, values:number[], timestamp:number):snd.MIDIOut;
    send(messageBytes:number[], timestamp:number):snd.MIDIOut;
  }

  /* Const Objects */
  export var GENERAL_MIDI_OUT:{[eventName:string]:snd.MidiOutMessage};
}
