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
!function(a,b){"function"==typeof define&&define.amd?define(["snd.AudioUnit"],b):"object"==typeof exports||(a.snd=b(a.snd))}(this,function(a){return a.DynamicsCompressor=function(){a.AudioUnit.apply(this,arguments),this._output=a.AUDIO_CONTEXT.createGain(),this._connector=a.AUDIO_CONTEXT.createGain(),this._compressor=a.AUDIO_CONTEXT.createDynamicsCompressor(),this._connector.connect(this._compressor),this._compressor.connect(this._output),Object.defineProperties(this,{attack:{get:function(){return this._compressor.attack.value},set:function(a){var b=parseFloat(a);this._compressor.attack.value=b,this._status.attack=b}},attackParam:{get:function(){return this.modAudioParam("attack",this._compressor.attack)}},knee:{get:function(){return this._compressor.knee.value},set:function(a){var b=parseFloat(a);this._compressor.knee.value=b,this._status.knee=b}},kneeParam:{get:function(){return this.modAudioParam("knee",this._compressor.knee)}},ratio:{get:function(){return this._compressor.ratio.value},set:function(a){var b=parseFloat(a);this._compressor.ratio.value=b,this._status.ratio=b}},ratioParam:{get:function(){return this.modAudioParam("ratio",this._compressor.ratio)}},reduction:{get:function(){return this._compressor.reduction.value}},release:{get:function(){return this._compressor.release.value},set:function(a){var b=parseFloat(a);this._compressor.release.value=b,this._status.release=b}},releaseParam:{get:function(){return this.modAudioParam("release",this._compressor.release)}},threshold:{get:function(){return this._compressor.threshold.value},set:function(a){var b=parseFloat(a);this._compressor.threshold.value=b,this._status.threshold=b}},thresholdParam:{get:function(){return this.modAudioParam("threshold",this._compressor.threshold)}}})},a.DynamicsCompressor.prototype=Object.create(a.AudioUnit.prototype),a.DynamicsCompressor.prototype.constructor=a.DynamicsCompressor,a.DynamicsCompressor.prototype.getParamDescription=function(){var b=a.AudioUnit.prototype.getParamDescription.apply(this,arguments);return b.attack={type:a.params.type.VALUE,"default":.003,max:1,min:0},b.knee={type:a.params.type.VALUE,"default":30,max:40,min:0},b.ratio={type:a.params.type.VALUE,"default":12,max:20,min:1},b.reduction={type:a.params.type.READ_ONLY},b.release={type:a.params.type.VALUE,"default":.25,max:1,min:0},b.threshold={type:a.params.type.VALUE,"default":-24,max:0,min:-100},b.attackParam={type:a.params.type.AUDIO_PARAM,value:this.attackParam,"default":b.attack["default"],max:b.attack.max,min:b.attack.min},b.kneeParam={type:a.params.type.AUDIO_PARAM,value:this.kneeParam,"default":b.knee["default"],max:b.knee.max,min:b.knee.min},b.ratioParam={type:a.params.type.AUDIO_PARAM,value:this.ratioParam,"default":b.ratio["default"],max:b.ratio.max,min:b.ratio.min},b.releaseParam={type:a.params.type.AUDIO_PARAM,value:this.releaseParam,"default":b.release["default"],max:b.release.max,min:b.release.min},b.thresholdParam={type:a.params.type.AUDIO_PARAM,value:this.thresholdParam,"default":b.threshold["default"],max:b.threshold.max,min:b.threshold.min},b},a.DynamicsCompressor.prototype.createStatus=function(){var b=a.AudioUnit.prototype.createStatus.call(this);return b.className="snd.DynamicsCompressor",b},a.DynamicsCompressor.prototype.getConnector=function(){return this._connector},a.DynamicsCompressor.prototype.getOutputConnector=function(){return this._output},a.DynamicsCompressor.prototype.loadData=function(b){a.AudioUnit.prototype.loadData.apply(this,arguments),this.attack=b.attack,this.knee=b.knee,this.ratio=b.ratio,this.threshold=b.threshold,this.release=b.release},a});