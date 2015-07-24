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
!function(a,b){"function"==typeof define&&define.amd?define(["snd.MIDI"],b):"object"==typeof exports||(a.snd=b(a.snd))}(this,function(a){return a.MIDI.util={},a.MIDI.util.getCh=function(b){return b.length<=0?void 0:b[0]&0!=a.MIDI.NOTE_OFF||b[0]&0!=a.MIDI.NOTE_ON||b[0]&0!=a.MIDI.POLYPHONIC_KEY_PRESSURE||b[0]&0!=a.MIDI.CONTROL_CHANGE||b[0]&0!=a.MIDI.PROGRAM_CHANGE||b[0]&0!=a.MIDI.CHANNEL_PRESSURE||b[0]&0!=a.MIDI.PITCH_BEND?b[0]&a.MIDI.CH_FILTER:void 0},a.MIDI.util.toHz=function(a){return 440*Math.pow(2,(a-69)/12)},a});