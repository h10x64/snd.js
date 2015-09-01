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
!function(a,b){"function"==typeof define&&define.amd?define(["snd.MIDIIn","snd.MIDIOut"],b):"object"==typeof exports||(a.snd=b(a.snd))}(this,function(a){return a.MIDI||(a.MIDI={}),a.MIDI._MIDI_ACCESS=null,a.MIDI._INPUTS={},a.MIDI._OUTPUTS={},Object.defineProperties(a.MIDI,{MIDI_ACCESS:{get:function(){return a.MIDI._MIDI_ACCESS}},INPUTS:{get:function(){return a.MIDI._INPUTS}},OUTPUTS:{get:function(){return a.MIDI._OUTPUTS}},DISCONNECTED:{value:"disconnected",writable:!1},CONNECTED:{value:"connected",writable:!1},OPEN:{value:"open",writable:!1},CLOSED:{value:"closed",writable:!1},PENDING:{value:"pending",writable:!1}}),a.MIDI.init=function(b,c,d){navigator&&"function"==typeof navigator.requestMIDIAccess?navigator.requestMIDIAccess(b).then(function(b){var d=null,e=null;for(a.MIDI._MIDI_ACCESS=b,d=a.MIDI._MIDI_ACCESS.inputs.values();!(e=d.next()).done;)a.MIDI._INPUTS[e.value.name]=new a.MIDI.MIDIIn(e.value);for(d=a.MIDI._MIDI_ACCESS.outputs.values();!(e=d.next()).done;)a.MIDI._OUTPUTS[e.value.name]=new a.MIDI.MIDIOut(e.value);"function"==typeof c&&c(a.MIDI.MIDI_ACCESS)},function(a){"function"==typeof d?d(a):console.log(a)}):d(void 0)},a});