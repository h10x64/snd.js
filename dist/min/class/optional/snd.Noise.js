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
!function(a,b){"function"==typeof define&&define.amd?define(["snd.AudioUnit"],b):"object"==typeof exports||(a.snd=b(a.snd))}(this,function(a){var b=function(a){for(var b=0;b<a.numberOfChannels;b++)for(var c=a.getChannelData(b),d=0;d<a.length;d++)c[d]=2*Math.random()-1};return a.Noise=function(c,d,e){a.AudioUnit.apply(this,arguments),this._noise=a.AUDIO_CONTEXT.createScriptProcessor(d?d:1024,1,e?e:1),this._gain=a.AUDIO_CONTEXT.createGain(),this._gain.channelCount=e?e:1,this._noise.onaudioprocess=function(a){b(a.outputBuffer)},this._noise.connect(this._gain),Object.defineProperties(this,{channelCount:{get:function(){return this._status.channelCount}},volume:{get:function(){return this._gain.gain.value},set:function(a){this._gain.gain.value=a,this._status.gain=a}},volumeParam:{get:function(){var a=this._gain.gain;return a.id=this.id+".gain",a}}})},a.Noise.prototype=Object.create(a.AudioUnit.prototype),a.Noise.prototype.constructor=a.Noise,a.Noise.prototype.connect=function(b,c,d){a.AudioUnit.prototype.connect.apply(this,arguments),null!=b.getConnector?this._gain.connect(b.getConnector(),c,d):this._gain.connect(b,c,d)},a.Noise.prototype.disconnect=function(b,c){a.AudioUnit.prototype.disconnect.apply(this,arguments),null!=b.getConnector?this._gain.disconnect(b.getConnector(),c):this._gain.disconnect(b,c)},a.Noise.prototype.getParamDescription=function(){var b=a.AudioUnit.prototype.getParamDescription.apply(this,arguments);return b.volume={type:a.params.type.VALUE,"default":1,max:1/0,min:-1/0},b.volumeParam={type:a.params.type.AUDIO_PARAM,value:this.volumeParam,"default":b.volume["default"],max:b.volume.max,min:b.volume.min},b},a.Noise.prototype.createStatus=function(){return new a.Noise.Status},a.Noise.prototype.getConnector=function(){return this._gain},a.Noise.prototype.loadData=function(b){a.AudioUnit.prototype.loadData.apply(this,arguments),this.gain=b.gain},a.Noise.Status=function(){a.AudioUnit.Status.apply(this,arguments),this.gain=1,this.channelCount=1},a.Noise.Status.prototype=Object.create(a.AudioUnit.Status.prototype),a.Noise.Status.prototype.constructor=a.Noise.Status,a});