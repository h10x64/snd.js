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
!function(a,b){"function"==typeof define&&define.amd?define(["snd.AudioUnit"],b):"object"==typeof exports||(a.snd=b(a.snd))}(this,function(a){return a.Envelope=function(){a.AudioUnit.apply(this,arguments);var b=this;this._startAt=-1,this._when=0,this._offset=0,this._duration=1/0,this._stopAt=-1,this._stopWhen=1/0,this._onendedFired=!1,this._proc=a.AUDIO_CONTEXT.createScriptProcessor(1024,1,1),this._dummyGain=a.AUDIO_CONTEXT.createGain(),this._dummyGain.gain.value=1e-9,this._dummyGain.connect(a.MASTER.getConnector()),this._onaudioprocess=function(c){var d=c.outputBuffer,e=c.playbackTime-b._startAt,f=Math.min(b._duration+b._when,b._stopWhen);if(b._startAt<0||e>f)for(var g=0;g<d.length;g++)for(var h=0;h<d.numberOfChannels;h++)d.getChannelData(h)[g]=0;else{0==b._startAt&&(b._startAt=c.playbackTime);for(var g=0;g<d.length;g++){var i=g/a.SAMPLE_RATE,j=e+i;if(b._when<=j&&f>=j)for(var k=b.getValueAt(Math.max(0,j-b._when+b._offset)),h=0;h<d.numberOfChannels;h++)d.getChannelData(h)[g]=k;else for(var h=0;h<d.numberOfChannels;h++)d.getChannelData(h)[g]=0}f<e+d.length/a.SAMPLE_RATE&&!b._onendedFired&&(b.onended(a.CURRENT_TIME),b._onendedFired=!0)}},this._proc.onaudioprocess=this._onaudioprocess,this._proc.connect(this._dummyGain)},a.Envelope.prototype=Object.create(a.AudioUnit.prototype),a.Envelope.prototype.constructor=a.Envelope,a.Envelope.prototype.start=function(a,b,c){this._startAt=0,this._when=a>=0?a:0,this._offset=b>=0?b:0,this._duration=c>=0?c:1/0,this._stopWhen=1/0,this._onendedFired=!1},a.Envelope.prototype.stop=function(b){this._startAt=-1,this._stopWhen=a.CURRENT_TIME-this._startAt+(0>b)?0:b},a.Envelope.prototype.onended=function(){},a.Envelope.prototype.getValueAt=function(){},a});