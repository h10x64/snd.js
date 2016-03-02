declare module snd {
  export module MIDI {
    export var MIDI_ACCESS:any;
    export var INPUTS:any;
    export var OUTPUTS:any;

    export var DISCONNECTED:string;
    export var CONNECTED:string;
    export var OPEN:string;
    export var CLOSED:string;
    export var PENDING:string;

    export function init(opt?:any, successCallback?:(midiAccess:any)=>void, failureCallback?:(exception:any)=>void):void;
  }
}
