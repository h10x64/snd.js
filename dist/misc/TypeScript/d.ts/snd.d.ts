declare module snd {
  export var VERSION:string;
  export var IS_BETA:string;

  /* Const Objects */
  export var AUDIO_CONTEXT:any;

  /* Blowser Status */
  export var BLOWSER:string;

  /* Blowser supported file types */
  export var DOES_MP3_SUPPORTED:boolean;
  export var DOES_WAV_SUPPORTED:boolean;
  export var DOES_OGG_SUPPORTED:boolean;
  export var DOES_AAC_SUPPORTED:boolean;
  export var DOES_M4A_SUPPORTED:boolean;

  /* Audio Statuses */
  export var CURRENT_TIME:number;
  export var SAMPLE_RATE:number;

  /* Supported channel count */
  export var MAX_CHANNEL_COUNT:number;

  /* Index values for Multi-channel audio. */
  /* 2ch */
  export var IDX_2CH_L:number;
  export var IDX_2CH_R:number;
  /* 4ch */
  export var IDX_4CH_FL:number;
  export var IDX_4CH_FR:number;
  export var IDX_4CH_RL:number;
  export var IDX_4CH_RR:number;
  /* 6ch(5.1ch) */
  export var IDX_6CH_FL:number;
  export var IDX_6CH_FR:number;
  export var IDX_6CH_C:number;
  export var IDX_6CH_RL:number;
  export var IDX_6CH_RR:number;

  /* Const strings for BiquadFilter */
  export var LOWPASS:string;
  export var HIGHPASS:string;
  export var BANDPASS:string;
  export var LOWSHELF:string;
  export var HIGHSHELF:string;
  export var PEAKING:string;
  export var NOTCH:string;
  export var ALLPASS:string;

  /* Const strings for DinamicsCompressor */
  export var OVERSAMPLE_DOUBLE:string;
  export var OVERSAMPLE_QUAD:string;

  /* Const strings for AudioUnit#*Param#setScheduledValues */
  export var SET:string;
  export var LINER:string;
  export var EXPONENTIALLY:string;

  /* Const strings for Oscillator type */
  export var SINE:string;
  export var SQUARE:string;
  export var SAWTOOTH:string;
  export var TRIANGLE:string;

  /* Const strings for Source's status */
  export module status {
    export var NONE:string;
    export var READY:string;
    export var STARTED:string;
    export var PAUSED:string;
    export var STOPPED:string;
  }
}
