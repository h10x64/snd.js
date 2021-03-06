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
!function(a,b){"function"==typeof define&&define.amd?define(["snd.AudioUnit"],b):"object"==typeof exports||(a.snd=b(a.snd))}(this,function(a){return a.Delay=function(){a.AudioUnit.apply(this,arguments),this._output=a.AUDIO_CONTEXT.createGain(),this._connector=a.AUDIO_CONTEXT.createGain(),this._delay=a.AUDIO_CONTEXT.createDelay(this._status.maxDelayTime),this._delay.delayTime.value=0,this._connector.connect(this._delay),this._delay.connect(this._output),Object.defineProperties(this,{maxDelay:{get:function(){return this._status.maxDelay},set:function(b){var c=parseFloat(b);c>0&&180>c?(this._connector.disconnect(this._delay),delete this._delay,this._delay=a.AUDIO_CONTEXT.createDelay(c),this.delayTime=this._status.delayTime,this._connector.connect(this._delay),this._delay.connect(this._output),this._status.maxDelay=c):0>c?cosole.log("maxDelay must grater than 0"):console.log("maxDelay must lesser than 180")}},delayTime:{get:function(){return this._status.delayTime},set:function(a){var b=parseFloat(a);b>=0&&180>b?(this._delay.delayTime.value=b,this._status.delayTime=b):0>b?cosole.log("delayTime must grater than 0"):console.log("delayTime must lesser than 180")}},delayTimeParam:{get:function(){return this.modAudioParam("delayTime",this._delay.delayTime)}}})},a.Delay.prototype=Object.create(a.AudioUnit.prototype),a.Delay.prototype.constructor=a.Delay,a.Delay.prototype.getParamDescription=function(){var b=a.AudioUnit.prototype.getParamDescription.apply(this,arguments);return b.maxDelayTime={type:a.params.type.VALUE,"default":60,max:180,min:0},b.delayTime={type:a.params.type.VALUE,"default":0,max:b.maxDelayTime.max,min:0},b.delayTimeParam={type:a.params.type.AUDIO_PARAM,"default":b.delayTime["default"],max:b.delayTime.max,min:b.delayTime.min},b},a.Delay.prototype.createStatus=function(){var b=a.AudioUnit.prototype.createStatus.call(this);return b.className="snd.Delay",b},a.Delay.prototype.getConnector=function(){return this._connector},a.Delay.prototype.getOutputConnector=function(){return this._output},a.Delay.prototype.loadData=function(b){a.AudioUnit.prototype.loadData.apply(this,arguments),this.maxDelayTime=b.maxDelayTime,this.delayTime=b.delayTime},a});