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
define(["snd.AudioUnit"],function(a){return a.DynamicsCompressor=function(){a.AudioUnit.apply(this,arguments),this._output=a.AUDIO_CONTEXT.createGain(),this._connector=a.AUDIO_CONTEXT.createGain(),this._compressor=a.AUDIO_CONTEXT.createDynamicsCompressor(),this._connector.connect(this._compressor),this._compressor.connect(this._output),Object.defineProperties(this,{channelCount:{get:function(){return this._status.channelCount},set:function(a){this._connector.channelCount=a,this._output.channelCount=a,this._compressor.channelCount=a,this._status.channelCount=a}},channelCountMode:{get:function(){return this._status.channelCountMode},set:function(a){this._connector.channelCountMode=a,this._output.channelCountMode=a,this._compressor.channelCountMode=a,this._status.channelCountMode=a}},channelInterpretation:{get:function(){return this._status.channelInterpretation},set:function(a){this._connector.channelInterpretation=a,this._output.channelInterpretation=a,this._compressor.channelInterpretation=a,this._status.channelInterpretation=a}},attack:{get:function(){return this._compressor.attack.value},set:function(a){var b=parseFloat(a);this._compressor.attack.value=b,this._status.attack=b}},attackParam:{get:function(){return this.modAudioParam("attack",this._compressor.attack)}},knee:{get:function(){return this._compressor.knee.value},set:function(a){var b=parseFloat(a);this._compressor.knee.value=b,this._status.knee=b}},kneeParam:{get:function(){return this.modAudioParam("knee",this._compressor.knee)}},ratio:{get:function(){return this._compressor.ratio.value},set:function(a){var b=parseFloat(a);this._compressor.ratio.value=b,this._status.ratio=b}},ratioParam:{get:function(){return this.modAudioParam("ratio",this._compressor.ratio)}},reduction:{get:function(){return this._compressor.reduction.value}},release:{get:function(){return this._compressor.release.value},set:function(a){var b=parseFloat(a);this._compressor.release.value=b,this._status.release=b}},releaseParam:{get:function(){return this.modAudioParam("release",this._compressor.release)}},threshold:{get:function(){return this._compressor.threshold.value},set:function(a){var b=parseFloat(a);this._compressor.threshold.value=b,this._status.threshold=b}},thresholdParam:{get:function(){return this.modAudioParam("threshold",this._compressor.threshold)}}})},a.DynamicsCompressor.prototype=Object.create(a.AudioUnit.prototype),a.DynamicsCompressor.prototype.constructor=a.Gain,a.DynamicsCompressor.prototype.connect=function(b,c,d){a.AudioUnit.prototype.connect.apply(this,arguments),null!=b.getConnector?this._output.connect(b.getConnector(),c,d):this._output.connect(b,c,d)},a.DynamicsCompressor.prototype.disconnect=function(b,c){a.AudioUnit.prototype.disconnect.apply(this,arguments),null!=b.getConnector?this._output.disconnect(b.getConnector(),c):this._output.disconnect(b,c)},a.DynamicsCompressor.prototype.createStatus=function(){return new a.DynamicsCompressor.Status},a.DynamicsCompressor.prototype.getConnector=function(){return this._connector},a.DynamicsCompressor.prototype.loadData=function(b){a.AudioUnit.prototype.loadData.apply(this,arguments),this.attack=b.attack,this.knee=b.knee,this.ratio=b.ratio,this.threshold=b.threshold,this.release=b.release},a.DynamicsCompressor.Status=function(){a.AudioUnit.Status.apply(this,arguments),this.attack=.003,this.knee=30,this.ratio=12,this.threshold=-24,this.release=.25},a.DynamicsCompressor.Status.prototype=Object.create(a.AudioUnit.Status.prototype),a.DynamicsCompressor.Status.prototype.constructor=a.DynamicsCompressor.Status,a});