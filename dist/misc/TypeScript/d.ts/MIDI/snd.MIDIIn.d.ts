declare module snd {
  /* Interfaces */
  export interface MidiInAttributes {
    no:number,    // Number for the events that called same name. (Like GeneralPurposeControllerChange.)
    pos:number    // Byte position number (MSB first). (For example, 0 for "0x00"(BankSelect_MSB) and 1 for "0x20"(BankSelect_LSB).)
  }

  export interface MidiInMessage {
    event:string, // Method name that call when fire the device's event.(For example, "onnoteoff" for define 0x80 event)
    attr:snd.MidiInAttributes,
    second:snd.MidiInMessage
  }

  export interface MidiInEventListener {
    (ch:number, no:number, pos:number, values:number, message:Uint8Array):void;
  }

  /* Classes */
  export class MIDIIn {
    constructor (midiIn:any, midiDef:{[hexStr:string]:snd.MidiInMessage});

    /* Event Listener Arrays */
    onnoteoffEventListeners:MidiInEventListener[];
    onnoteonEventListeners:MidiInEventListener[];
    onpolyphonickeypressureEventListeners:MidiInEventListener[];
    oncontrolchangeEventListeners:MidiInEventListener[];
    onbankselectEventListeners:MidiInEventListener[];
    onmodulationchangeEventListeners:MidiInEventListener[];
    onbreathcontrollerchangeEventListeners:MidiInEventListener[];
    onundefEventListeners:MidiInEventListener[];
    onfootcontrollerchangeEventListeners:MidiInEventListener[];
    onportamentotimechangeEventListeners:MidiInEventListener[];
    ondataentryEventListeners:MidiInEventListener[];
    onvolumechangeEventListeners:MidiInEventListener[];
    onbalancechangeEventListeners:MidiInEventListener[];
    onpanchangeEventListeners:MidiInEventListener[];
    onexpressioncontrollerchangeEventListeners:MidiInEventListener[];
    oneffectcontrolchangeEventListeners:MidiInEventListener[];
    ongeneralpurposecontrollerchangeEventListeners:MidiInEventListener[];
    onholdchangeEventListeners:MidiInEventListener[];
    onportamentoswitchchangeEventListeners:MidiInEventListener[];
    onsostenutochangeEventListeners:MidiInEventListener[];
    onsoftpedalchangeEventListeners:MidiInEventListener[];
    onlagatofootswitchchangeEventListeners:MidiInEventListener[];
    onsoundvariationchangeEventListeners:MidiInEventListener[];
    ontimbrechangeEventListeners:MidiInEventListener[];
    onreleasetimechangeEventListeners:MidiInEventListener[];
    onattacktimechangeEventListeners:MidiInEventListener[];
    onbrightnesschangeEventListeners:MidiInEventListener[];
    ondecaytimechangeEventListeners:MidiInEventListener[];
    onvibratoratechangeEventListeners:MidiInEventListener[];
    onvibratodepthchangeEventListeners:MidiInEventListener[];
    onvibratodelaychangeEventListeners:MidiInEventListener[];
    onsoundcontrolchangeEventListeners:MidiInEventListener[];
    onportamentcontrolchangeEventListeners:MidiInEventListener[];
    onhighresolutionvelocityprefixchangeEventListeners:MidiInEventListener[];
    oneffectdepthchangeEventListeners:MidiInEventListener[];
    ondataincrementEventListeners:MidiInEventListener[];
    ondatadecrementEventListeners:MidiInEventListener[];
    onnrpmEventListeners:MidiInEventListener[];
    onrpmEventListeners:MidiInEventListener[];
    onallsoundoffEventListeners:MidiInEventListener[];
    onresetallcontrollerEventListeners:MidiInEventListener[];
    onlocalcontrolchangeEventListeners:MidiInEventListener[];
    onallnotesoffEventListeners:MidiInEventListener[];
    onomnimodeoffEventListeners:MidiInEventListener[];
    onomnimodeonEventListeners:MidiInEventListener[];
    onmonomodeonEventListeners:MidiInEventListener[];
    onpolymodeonEventListeners:MidiInEventListener[];
    onprogramchangeEventListeners:MidiInEventListener[];
    onchannelpressureEventListeners:MidiInEventListener[];
    onpitchbendchangeEventListeners:MidiInEventListener[];
    onsysexEventListeners:MidiInEventListener[];
    onquarterframeEventListeners:MidiInEventListener[];
    onsongselectEventListeners:MidiInEventListener[];
    onsysundefEventListeners:MidiInEventListener[];
    ontunerrequestEventListeners:MidiInEventListener[];
    onendexEventListeners:MidiInEventListener[];
    ontimingclockEventListeners:MidiInEventListener[];
    onstartEventListeners:MidiInEventListener[];
    oncontinueEventListeners:MidiInEventListener[];
    onstopEventListeners:MidiInEventListener[];
    onactivesensingEventListeners:MidiInEventListener[];
    onresetEventListeners:MidiInEventListener[];

    /* Event Methods */
    onnoteoff:snd.MidiInEventListener;
    onnoteon:snd.MidiInEventListener;
    onpolyphonickeypressure:snd.MidiInEventListener;
    oncontrolchange:snd.MidiInEventListener;
    onbankselect:snd.MidiInEventListener;
    onmodulationchange:snd.MidiInEventListener;
    onbreathcontrollerchange:snd.MidiInEventListener;
    onundef:snd.MidiInEventListener;
    onfootcontrollerchange:snd.MidiInEventListener;
    onportamentotimechange:snd.MidiInEventListener;
    ondataentry:snd.MidiInEventListener;
    onvolumechange:snd.MidiInEventListener;
    onbalancechange:snd.MidiInEventListener;
    onpanchange:snd.MidiInEventListener;
    onexpressioncontrollerchange:snd.MidiInEventListener;
    oneffectcontrolchange:snd.MidiInEventListener;
    ongeneralpurposecontrollerchange:snd.MidiInEventListener;
    onholdchange:snd.MidiInEventListener;
    onportamentoswitchchange:snd.MidiInEventListener;
    onsostenutochange:snd.MidiInEventListener;
    onsoftpedalchange:snd.MidiInEventListener;
    onlagatofootswitchchange:snd.MidiInEventListener;
    onsoundvariationchange:snd.MidiInEventListener;
    ontimbrechange:snd.MidiInEventListener;
    onreleasetimechange:snd.MidiInEventListener;
    onattacktimechange:snd.MidiInEventListener;
    onbrightnesschange:snd.MidiInEventListener;
    ondecaytimechange:snd.MidiInEventListener;
    onvibratoratechange:snd.MidiInEventListener;
    onvibratodepthchange:snd.MidiInEventListener;
    onvibratodelaychange:snd.MidiInEventListener;
    onsoundcontrolchange:snd.MidiInEventListener;
    onportamentcontrolchange:snd.MidiInEventListener;
    onhighresolutionvelocityprefixchange:snd.MidiInEventListener;
    oneffectdepthchange:snd.MidiInEventListener;
    ondataincrement:snd.MidiInEventListener;
    ondatadecrement:snd.MidiInEventListener;
    onnrpm:snd.MidiInEventListener;
    onrpm:snd.MidiInEventListener;
    onallsoundoff:snd.MidiInEventListener;
    onresetallcontroller:snd.MidiInEventListener;
    onlocalcontrolchange:snd.MidiInEventListener;
    onallnotesoff:snd.MidiInEventListener;
    onomnimodeoff:snd.MidiInEventListener;
    onomnimodeon:snd.MidiInEventListener;
    onmonomodeon:snd.MidiInEventListener;
    onpolymodeon:snd.MidiInEventListener;
    onprogramchange:snd.MidiInEventListener;
    onchannelpressure:snd.MidiInEventListener;
    onpitchbendchange:snd.MidiInEventListener;
    onsysex:snd.MidiInEventListener;
    onquarterframe:snd.MidiInEventListener;
    onsongselect:snd.MidiInEventListener;
    onsysundef:snd.MidiInEventListener;
    ontunerrequest:snd.MidiInEventListener;
    onendex:snd.MidiInEventListener;
    ontimingclock:snd.MidiInEventListener;
    onstart:snd.MidiInEventListener;
    oncontinue:snd.MidiInEventListener;
    onstop:snd.MidiInEventListener;
    onactivesensing:snd.MidiInEventListener;
    onreset:snd.MidiInEventListener;
  }

  /* Const Objects */
  export var GENERAL_MIDI_IN:{[hexStr:string]:snd.MidiInMessage};  // Default midiDef for constructor.
}
