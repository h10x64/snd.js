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
define(["snd.AudioUnit"],function(a){var b=function(a,b,c,d,e){for(var f=0;f<a.numberOfChannels;f++){var g=a.getChannelData(f),h=0;for(i=0;i<a.length;i++)g[i]=(2*Math.random()-1)*d;Math.random()<e&&a.length>0&&(h=Math.round(Math.random()*(a.length-1)),g[h]=(Math.random()>=.5?1:-1)*(Math.random()*(b-c)+c))}};return a.VinylNoise=function(c,d,e){a.AudioUnit.apply(this,arguments);var f=this;this._noise=a.AUDIO_CONTEXT.createScriptProcessor(d?d:1024,1,e?e:1),this._gain=a.AUDIO_CONTEXT.createGain(),this._num=0,this._gain.channelCount=e?e:1,this._noise.onaudioprocess=function(a){0==f._num?b(a.outputBuffer,f.maxPetitNoiseSize,f.minPetitNoiseSize,f.maxNoiseSize,f.probability):b(a.outputBuffer,f.maxPetitNoiseSize,f.minPetitNoiseSize,f.maxNoiseSize,0),f._num=(f._num+1)%f.often},Object.defineProperties(this,{channelCount:{get:function(){return this._status.channelCount}},volume:{get:function(){return this._gain.gain.value},set:function(a){this._gain.gain.value=a,this._status.gain=a}},volumeParam:{get:function(){var a=this._gain.gain;return a.id=this.id+".gain",a}},often:{get:function(){return this._status.often},set:function(a){this._status.often=Math.abs(1>=a?1:a)}},maxPetitNoiseSize:{get:function(){return this._status.maxPetitNoiseSize},set:function(a){this._status.maxPetitNoiseSize=0>a?0:a,this._status.maxPetitNoiseSize<this._status.minPetitNoiseSize&&(this._status.minPetitNoiseSize=this._status.maxPetitNoiseSize)}},minPetitNoiseSize:{get:function(){return this._status.minPetitNoiseSize},set:function(a){this._status.minPetitNoiseSize=0>a?0:a,this._status.minPetitNoiseSize>this._status.maxPetitNoiseSize&&(this._status.maxPetitNoiseSize=this._status.minPetitNoiseSize)}},maxNoiseSize:{get:function(){return this._status.maxNoiseSize},set:function(a){this._status.maxNoiseSize=0>a?0:a}},probability:{get:function(){return this._status.probability},set:function(a){this._status.probability=a}}}),this._noise.connect(this._gain)},a.VinylNoise.prototype=Object.create(a.AudioUnit.prototype),a.VinylNoise.prototype.constructor=a.VinylNoise,a.VinylNoise.prototype.connect=function(b,c,d){a.AudioUnit.prototype.connect.apply(this,arguments),b.isAudioUnit||null!=b.getConnector?this._gain.connect(b.getConnector(),c,d):d?this._gain.connect(b,c,d):this._gain.connect(b,c)},a.VinylNoise.prototype.disconnect=function(b,c){a.AudioUnit.prototype.disconnect.apply(this,arguments),null!=b.getConnector?this._gain.disconnect(b.getConnector(),c):this._gain.disconnect(b,c)},a.VinylNoise.prototype.createStatus=function(){return new a.VinylNoise.Status},a.VinylNoise.prototype.getConnector=function(){return this._gain},a.VinylNoise.prototype.loadData=function(b){a.AudioUnit.prototype.loadData.apply(this,arguments),this.gain=b.gain},a.VinylNoise.Status=function(){a.AudioUnit.Status.apply(this,arguments),this.gain=1,this.channelCount=1,this.often=57,this.maxPetitNoiseSize=.5,this.minPetitNoiseSize=0,this.maxNoiseSize=.0025,this.probability=.8},a.VinylNoise.Status.prototype=Object.create(a.AudioUnit.Status.prototype),a.VinylNoise.Status.prototype.constructor=a.VinylNoise.Status,a});