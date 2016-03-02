declare module snd {
  module util {
    export function createSources(dataSet:{[key:string]:string}, connectToMaster:boolean, element:string, callback:(ret:{[id:string]:AudioBuffer})=>void):void;
    export function getNewKey(prefix:string):void;
    export function isDataURI(uri:string):void;
    export function stripDataURI(uri:string):void;
    export function isAudioManagerKey(key:string):void;
    export function stripAudioManagerKey(key:string):void;
    export function noteToFrequency(octave:number, key:number):void;
    export function noteToSec(tempo:number, noteValue:number):void;
  }
}
