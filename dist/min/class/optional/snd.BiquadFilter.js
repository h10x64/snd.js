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
!function(a,b){"function"==typeof define&&define.amd?define(["snd.AudioUnit"],b):"object"==typeof exports||(a.snd=b(a.snd))}(this,function(a){return a.BiquadFilter=function(){a.AudioUnit.apply(this,arguments),this._connector=a.AUDIO_CONTEXT.createGain(),this._output=a.AUDIO_CONTEXT.createGain(),this._filter=a.AUDIO_CONTEXT.createBiquadFilter(),this._connector.connect(this._filter),this._filter.connect(this._output),Object.defineProperties(this,{type:{get:function(){return this._filter.type},set:function(a){this._filter.type=a,this._status.type=a}},frequency:{get:function(){return this._filter.frequency.value},set:function(a){var b=parseFloat(a);this._filter.frequency.value=b,this._status.frequency=b}},frequencyParam:{get:function(){return this.modAudioParam("frequency",this._filter.frequency)}},detune:{get:function(){return this._filter.detune.value},set:function(a){var b=parseFloat(a);this._filter.detune.value=b,this._status.detune=b}},detuneParam:{get:function(){return this.modAudioParam("detune",this._filter.detune)}},Q:{get:function(){return this._filter.Q.value},set:function(a){var b=parseFloat(a);this._filter.Q.value=b,this._status.Q=b}},QParam:{get:function(){return this.modAudioParam("q",this._filter.Q)}},gain:{get:function(){return this._filter.gain.value},set:function(a){var b=parseFloat(a);this._filter.gain.value=b,this._status.gain=b}},gainParam:{get:function(){return this.modAudioParam("gain",this._filter.gain)}}})},a.BiquadFilter.prototype=Object.create(a.AudioUnit.prototype),a.BiquadFilter.prototype.constructor=a.BiquadFilter,a.BiquadFilter.prototype.createStatus=function(){var b=a.AudioUnit.prototype.createStatus.call(this);return b.className="snd.BiquadFilter",b},a.BiquadFilter.prototype.getConnector=function(){return this._connector},a.BiquadFilter.prototype.getOutputConnector=function(){return this._output},a.BiquadFilter.prototype.getParamDescription=function(){var b=a.AudioUnit.prototype.getParamDescription.apply(this,arguments);return b.type={type:a.params.type.ENUM,value:[a.LOWPASS,a.HIGHPASS,a.BANDPASS,a.LOWSHELF,a.HIGHSHELF,a.PEAKING,a.NOTCH,a.ALLPASS],"default":a.LOWPASS},b.frequency={type:a.params.type.VALUE,"default":350,max:1/0,min:-1/0},b.detune={type:a.params.type.VALUE,"default":0,max:1/0,min:-1/0},b.Q={type:a.params.type.VALUE,"default":1,max:1/0,min:-1/0},b.gain={type:a.params.type.VALUE,"default":0,max:1/0,min:-1/0},b.frequencyParam={type:a.params.type.AUDIO_PARAM,value:this.frequencyParam,"default":b.frequency["default"],max:b.frequency.max,min:b.frequency.min},b.detuneParam={type:a.params.type.AUDIO_PARAM,value:this.detuneParam,"default":b.detune["default"],max:b.detune.max,min:b.detune.min},b.QParam={type:a.params.type.AUDIO_PARAM,value:this.QParam,"default":b.Q["default"],max:b.Q.max,min:b.Q.min},b.gainParam={type:a.params.type.AUDIO_PARAM,value:this.gainParam,"default":b.gain["default"],max:b.gain.max,min:b.gain.min},b},a.BiquadFilter.prototype.loadData=function(){a.AudioUnit.prototype.loadData.apply(this,arguments)},a});