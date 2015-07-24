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
!function(a,b){"function"==typeof define&&define.amd?define(["snd.AudioUnit"],b):"object"==typeof exports||(a.snd=b(a.snd))}(this,function(a){return a.Gain=function(){a.AudioUnit.apply(this,arguments),this._gain=a.AUDIO_CONTEXT.createGain(),this._gain.channelCount=this._status.channelCount,Object.defineProperties(this,{channelCount:{get:function(){return this._status.channelCount},set:function(a){this._gain.channelCount=a,this._status.channelCount=a}},channelCountMode:{get:function(){return this._status.channelCountMode},set:function(a){this._gain.channelCountMode=a,this._status.channelCountMode=a}},channelInterpretation:{get:function(){return this._status.channelInterpretation},set:function(a){this._gain.channelInterpretation=a,this._status.channelInterpretation=a}},gain:{get:function(){return this._gain.gain.value},set:function(a){var b=parseFloat(a);this._gain.gain.value=b,this._status.gain=b}},gainParam:{get:function(){return this.modAudioParam("gain",this._gain.gain)}}})},a.Gain.prototype=Object.create(a.AudioUnit.prototype),a.Gain.prototype.constructor=a.Gain,a.Gain.prototype.connect=function(b,c,d){a.AudioUnit.prototype.connect.apply(this,arguments),null!=b.getConnector?this._gain.connect(b.getConnector(),c,d):this._gain.connect(b,c,d)},a.Gain.prototype.disconnect=function(b,c){a.AudioUnit.prototype.disconnect.apply(this,arguments),null!=b.getConnector?this._gain.disconnect(b.getConnector(),c):this._gain.disconnect(b,c)},a.Gain.prototype.createStatus=function(){return new a.Gain.Status},a.Gain.prototype.getConnector=function(){return this._gain},a.Gain.prototype.loadData=function(b){a.AudioUnit.prototype.loadData.apply(this,arguments),this.gain=b.gain},a.Gain.Status=function(){a.AudioUnit.Status.apply(this,arguments),this.gain=1},a.Gain.Status.prototype=Object.create(a.AudioUnit.Status.prototype),a.Gain.Status.prototype.constructor=a.Gain.Status,a});