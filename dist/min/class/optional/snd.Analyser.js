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
!function(a,b){"function"==typeof define&&define.amd?define(["snd.AudioUnit"],b):"object"==typeof exports||(a.snd=b(a.snd))}(this,function(a){return a.Analyser=function(){a.AudioUnit.apply(this,arguments),this._analyser=a.AUDIO_CONTEXT.createAnalyser(),this.resetBufferSize(),Object.defineProperties(this,{floatFrequencyData:{get:function(){return this._analyser.getFloatFrequencyData(this._floatFrequencyDataBuffer),this._floatFrequencyDataBuffer}},byteFrequencyData:{get:function(){return this._analyser.getByteFrequencyData(this._byteFrequencyDataBuffer),this._byteFrequencyDataBuffer}},floatTimeDomainData:{get:function(){return this._analyser.getFloatTimeDomainData(this._floatTimeDomainDataBuffer),this._floatTimeDomainDataBuffer}},byteTimeDomainData:{get:function(){return this._analyser.getByteTimeDomainData(this._byteTimeDomainDataBuffer),this._byteTimeDomainDataBuffer}},fftSize:{get:function(){return this._analyser.fftSize},set:function(a){var b=parseInt(a);this._analyser.fftSize=b,this.resetBufferSize()}},frequencyBinCount:{get:function(){return this._analyser.frequencyBinCount}},minDecibels:{get:function(){return this._analyser.minDecibels},set:function(a){var b=parseFloat(a);this._analyser.minDecibels=b}},maxDecibels:{get:function(){return this._analyser.maxDecibels},set:function(a){var b=parseFloat(a);this._analyser.maxDecibels=b}},smoothingTimeConstant:{get:function(){return this._analyser.smoothingTimeConstant},set:function(a){var b=parseFloat(a);this._analyser.smoothingTimeConstant=b}}}),this._status.smoothingTimeConstant=this._analyser.smoothingTimeConstant,this._status.fftSize=this._analyser.fftSize,this._status.maxDecibels=this._analyser.maxDecibels,this._status.minDecibels=this._analyser.minDecibels},a.Analyser.prototype=Object.create(a.AudioUnit.prototype),a.Analyser.prototype.constructor=a.Analyser,a.Analyser.prototype.getParamDescription=function(){var b=a.AudioUnit.prototype.getParamDescription.call(this,arguments);return b.floatFrequencyData={type:a.params.type.READ_ONLY},b.byteFrequencyData={type:a.params.type.READ_ONLY},b.floatTimeDomainData={type:a.params.type.READ_ONLY},b.byteTimeDomainData={type:a.params.type.READ_ONLY},b.fftSize={type:a.params.type.VALUE,"default":2048,max:void 0,min:2},b.frequencyBinCount={type:a.params.type.READ_ONLY},b.minDecibels={type:a.params.type.VALUE,"default":-100,max:1/0,min:-1/0},b.maxDecibels={type:a.params.type.VALUE,"default":-30,max:1/0,min:-1/0},b.smoothingTimeConstant={type:a.params.type.VALUE,"default":.1,max:1/0,min:-1/0},b},a.Analyser.prototype.createStatus=function(){var b=a.AudioUnit.prototype.createStatus.call(this);return b.className="snd.Analyser",b},a.Analyser.prototype.getConnector=function(){return this._analyser},a.Analyser.prototype.getOutputConnector=function(){return this._analyser},a.Analyser.prototype.loadData=function(b){a.AudioUnit.prototype.loadData.apply(this,arguments),this.fftSize=b.fftSize,this.maxDecibels=b.maxDecibels,this.smoothingTimeConstant=b.smoothingTimeConstant},a.Analyser.prototype.resetBufferSize=function(){this._byteFrequencyDataBuffer=new Uint8Array(this._analyser.frequencyBinCount),this._floatFrequencyDataBuffer=new Float32Array(this._analyser.frequencyBinCount),this._byteTimeDomainDataBuffer=new Uint8Array(this._analyser.fftSize),this._floatTimeDomainDataBuffer=new Float32Array(this._analyser.fftSize)},a});