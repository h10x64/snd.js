/**
 * snd.js - The Sound Library for JavaScript with WebAudioAPI - v.1.0 beta
 * 
 * The MIT License (MIT)
 * copyright (c) 2014 - 2015 N_H <h.10x64@gmail.com>
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 * 
 **/
define(function(){var a={VERSION:"1.0.20150606",IS_BETA:!0,ALIAS:"Seedtime"};return a._AUDIO_CONTEXT=null,a._MASTER=null,a._AUDIO_DATA_MANAGER=null,a._DOES_MP3_SUPPORTED=!1,a._DOES_WAV_SUPPORTED=!1,a._DOES_OGG_SUPPORTED=!1,a._DOES_AAC_SUPPORTED=!1,a._DOES_M4A_SUPPORTED=!1,function(){var b=document.createElement("audio");a._DOES_MP3_SUPPORTED=!(""===b.canPlayType("audio/mpeg;")),a._DOES_M4A_SUPPORTED=!(""===b.canPlayType('audio/mp4; codecs="mp4a.40.2"')),a._DOES_AAC_SUPPORTED=a._DOES_M4A_SUPPORTED,a._DOES_WAV_SUPPORTED=!(""===b.canPlayType('audio/wav; codecs="1"')),a._DOES_OGG_SUPPORTED=!(""===b.canPlayType('audio/ogg; codecs="vorbis"')),delete b}(),a.CLASS_DEF=[],a.PLUGIN_INIT=[],null==a._AUDIO_CONTEXT&&("AudioContext"in window?a._AUDIO_CONTEXT=new AudioContext:"webkitAudioContext"in window&&(a._AUDIO_CONTEXT=new webkitAudioContext),a._AUDIO_CONTEXT.destination.channelCount=a._AUDIO_CONTEXT.destination.maxChannelCount),Object.defineProperties(a,{DOES_MP3_SUPPORTED:{get:function(){return a._DOES_MP3_SUPPORTED}},DOES_WAV_SUPPORTED:{get:function(){return a._DOES_WAV_SUPPORTED}},DOES_OGG_SUPPORTED:{get:function(){return a._DOES_OGG_SUPPORTED}},DOES_AAC_SUPPORTED:{get:function(){return a._DOES_AAC_SUPPORTED}},DOES_M4A_SUPPORTED:{get:function(){return a._DOES_M4A_SUPPORTED}},MAX_CHANNEL_COUNT:{writable:!1,value:a._AUDIO_CONTEXT.destination.maxChannelCount},IDX_2CH_L:{writable:!1,value:0},IDX_2CH_R:{writable:!1,value:1},IDX_4CH_FL:{writable:!1,value:0},IDX_4CH_FR:{writable:!1,value:1},IDX_4CH_RL:{writable:!1,value:2},IDX_4CH_RR:{writable:!1,value:3},IDX_6CH_FL:{writable:!1,value:0},IDX_6CH_FR:{writable:!1,value:1},IDX_6CH_C:{writable:!1,value:2},IDX_6CH_SW:{writable:!1,value:3},IDX_6CH_RL:{writable:!1,value:4},IDX_6CH_RR:{writable:!1,value:5},LOWPASS:{writable:!1,value:"lowpass"},HIGHPASS:{writable:!1,value:"highpass"},BANDPASS:{writable:!1,value:"bandpass"},LOWSHELF:{writable:!1,value:"lowshelf"},HIGHSHELF:{writable:!1,value:"highshelf"},PEAKING:{writable:!1,value:"peaking"},NOTCH:{writable:!1,value:"notch"},ALLPASS:{writable:!1,value:"allpass"},OVERSAMPLE_NONE:{writable:!1,value:"none"},OVERSAMPLE_DOUBLE:{writable:!1,value:"2x"},OVERSAMPLE_QUAD:{writable:!1,value:"4x"},SET:{writable:!1,value:"set"},LINER:{writable:!1,value:"liner"},EXPONENTIALLY:{writable:!1,value:"exponentially"},SINE:{writable:!1,value:"sine"},SQUARE:{writable:!1,value:"square"},SAWTOOTH:{writable:!1,value:"sawtooth"},TRIANGLE:{writable:!1,value:"triangle"},status:{value:function(){var a={};return Object.defineProperties(a,{NONE:{value:"none",writable:!1},READY:{value:"ready",writable:!1},STARTED:{value:"started",writable:!1},PAUSED:{value:"paused",writable:!1},STOPPED:{value:"ended",writable:!1}}),a}(),writable:!1},srctype:{value:function(){var a={};return Object.defineProperties(a,{NONE:{value:"none",writable:!1},AUDIO_BUFFER:{value:"audiobuffer",writable:!1},MEDIA_STREAM:{value:"mediastream",writable:!1},MEDIA_ELEMENT:{value:"mediaelement",writable:!1},OSCILLATOR:{value:"oscillator",writable:!1}}),a}(),writable:!1},oscillatortype:{value:function(){var b={};return Object.defineProperties(b,{SINE:{value:a.SINE,writable:!1},SQUARE:{value:a.SQUARE,writable:!1},SAWTOOTH:{value:a.SAWTOOTH,writable:!1},TRIANGLE:{value:a.TRIANGLE,writable:!1}}),b}(),writable:!1},audioparam:{value:function(){var b={};return Object.defineProperties(b,{type:{value:function(){var b={};return Object.defineProperties(b,{SET:{value:a.SET,writable:!1},LINER:{value:a.LINER,writable:!1},EXPONENTIALLY:{value:a.EXPONENTIALLY,writable:!1}}),b}(),writable:!1}}),b}(),writable:!1},BLOWSER:{get:function(){return window.navigator.userAgent.toLowerCase()}},CURRENT_TIME:{get:function(){return a.AUDIO_CONTEXT.currentTime}},AUDIO_CONTEXT:{get:function(){return a._AUDIO_CONTEXT}},MASTER:{get:function(){return a._MASTER}},AUDIO_DATA_MANAGER:{get:function(){return a._AUDIO_DATA_MANAGER}}}),a});