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
!function(a,b){"function"==typeof define&&define.amd?define(["snd.AudioUnit"],b):"object"==typeof exports||(a.snd=b(a.snd))}(this,function(a){var b=function(a,b,c,d,e){for(var f=0;f<a.numberOfChannels;f++){var g=a.getChannelData(f),h=0;for(i=0;i<a.length;i++)g[i]=(2*Math.random()-1)*d;Math.random()<e&&a.length>0&&(h=Math.round(Math.random()*(a.length-1)),g[h]=(Math.random()>=.5?1:-1)*(Math.random()*(b-c)+c))}};return a.VinylNoise=function(c,d,e){a.AudioUnit.apply(this,arguments);var f=this;this._noise=a.AUDIO_CONTEXT.createScriptProcessor(d?d:1024,1,e?e:1),this._gain=a.AUDIO_CONTEXT.createGain(),this._num=0,this._gain.channelCount=e?e:1,this._noise.onaudioprocess=function(a){0==f._num?b(a.outputBuffer,f.maxPetitNoiseSize,f.minPetitNoiseSize,f.maxNoiseSize,f.probability):b(a.outputBuffer,f.maxPetitNoiseSize,f.minPetitNoiseSize,f.maxNoiseSize,0),f._num=(f._num+1)%f.often},Object.defineProperties(this,{volume:{get:function(){return this._gain.gain.value},set:function(a){this._gain.gain.value=a,this._status.gain=a}},volumeParam:{get:function(){var a=this._gain.gain;return a.id=this.id+".gain",a}},often:{get:function(){return this._status.often},set:function(a){this._status.often=Math.abs(1>=a?1:a)}},maxPetitNoiseSize:{get:function(){return this._status.maxPetitNoiseSize},set:function(a){this._status.maxPetitNoiseSize=0>a?0:a,this._status.maxPetitNoiseSize<this._status.minPetitNoiseSize&&(this._status.minPetitNoiseSize=this._status.maxPetitNoiseSize)}},minPetitNoiseSize:{get:function(){return this._status.minPetitNoiseSize},set:function(a){this._status.minPetitNoiseSize=0>a?0:a,this._status.minPetitNoiseSize>this._status.maxPetitNoiseSize&&(this._status.maxPetitNoiseSize=this._status.minPetitNoiseSize)}},maxNoiseSize:{get:function(){return this._status.maxNoiseSize},set:function(a){this._status.maxNoiseSize=0>a?0:a}},probability:{get:function(){return this._status.probability},set:function(a){this._status.probability=a}}}),this._noise.connect(this._gain)},a.VinylNoise.prototype=Object.create(a.AudioUnit.prototype),a.VinylNoise.prototype.constructor=a.VinylNoise,a.VinylNoise.prototype.getParamDescription=function(){var b=a.AudioUnit.prototype.getParamDescription.apply(this,arguments);return b.volume={type:a.params.type.VALUE,"default":1,max:1/0,min:-1/0},b.often={type:a.params.type.VALUE,"default":57,max:1/0,min:0},b.maxPetitNoiseSize={type:a.params.type.VALUE,"default":.5,max:1/0,min:0},b.minPetitNoiseSize={type:a.params.type.VALUE,"default":0,max:1/0,min:0},b.maxNoiseSize={type:a.params.type.VALUE,"default":.0025,max:1/0,min:0},b.probability={type:a.params.type.VALUE,"default":.8,max:1,min:0},b.volumeParam={type:a.params.type.AUDIO_PARAM,value:this.volumeParam,"default":b.volume["default"],max:b.volume.max,min:b.volume.min},b},a.VinylNoise.prototype.createStatus=function(){var b=a.AudioUnit.prototype.createStatus.call(this);return b.className="snd.VinylNoise",b},a.VinylNoise.prototype.getConnector=function(){return void 0},a.VinylNoise.prototype.getOutputConnector=function(){return this._gain},a.VinylNoise.prototype.loadData=function(b){a.AudioUnit.prototype.loadData.apply(this,arguments),this.gain=b.gain},a});