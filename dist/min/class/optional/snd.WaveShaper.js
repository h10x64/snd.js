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
!function(a,b){"function"==typeof define&&define.amd?define(["snd.AudioUnit"],b):"object"==typeof exports||(a.snd=b(a.snd))}(this,function(a){return a.WaveShaper=function(){a.AudioUnit.apply(this,arguments),this._output=a.AUDIO_CONTEXT.createGain(),this._connector=a.AUDIO_CONTEXT.createGain(),this._shaper=a.AUDIO_CONTEXT.createWaveShaper(),this._connector.connect(this._shaper),this._shaper.connect(this._output),Object.defineProperties(this,{channelCount:{get:function(){return this._status.channelCount},set:function(a){this._output.channelCount=a,this._connector.channelCount=a,this._shaper.channelCount=a,this._status.channelCount=a}},channelCountMode:{get:function(){return this._status.channelCountMode},set:function(a){this._output.channelCountMode=a,this._connector.channelCountMode=a,this._shaper.channelCountMode=a,this._status.channelCountMode=a}},channelInterpretation:{get:function(){return this._status.channelInterpretation},set:function(a){this._output.channelInterpretation=a,this._connector.channelInterpretation=a,this._shaper.channelInterpretation=a,this._status.channelInterpretation=a}},curve:{get:function(){return this._shaper.curve},set:function(a){this._shaper.curve=a,this._status.curve=a}},oversample:{get:function(){return this._shaper.oversample},set:function(a){this._shaper.oversample=a,this._status.oversample=a}},gain:{get:function(){return this._output.gain.value},set:function(a){var b=parseFloat(a);this._output.gain.value=b,this._status.gain=b}},gainParam:{get:function(){return this.modAudioParam("gain",this._output.gain)}}})},a.WaveShaper.prototype=Object.create(a.AudioUnit.prototype),a.WaveShaper.prototype.constructor=a.WaveShaper,a.WaveShaper.prototype.connect=function(b,c,d){a.AudioUnit.prototype.connect.apply(this,arguments),null!=b.getConnector?this._output.connect(b.getConnector(),c,d):this._output.connect(b,c,d)},a.WaveShaper.prototype.disconnect=function(b,c){a.AudioUnit.prototype.disconnect.apply(this,arguments),null!=b.getConnector?this._output.disconnect(b.getConnector(),c):this._output.disconnect(b,c)},a.WaveShaper.prototype.getParamDescription=function(){var b=a.AudioUnit.prototype.getParamDescription.apply(this,arguments);return b.curve={type:a.params.type.VALUE,"default":void 0,max:void 0,min:void 0},b.oversample={type:a.params.type.ENUM,value:[a.OVERSAMPLE_NONE,a.OVERSAMPLE_DOUBLE,a.OVERSAMPLE_QUAD],"default":a.OVERSAMPLE_NONE},b.gain={type:a.params.type.VALUE,"default":1,max:1/0,min:-Inifinity},b.gainParam={type:a.params.type.AUDIO_PARAM,value:this.gainParam,"default":b.gain["default"],max:b.gain.max,min:b.gain.min},b},a.WaveShaper.prototype.createStatus=function(){return new a.WaveShaper.Status},a.WaveShaper.prototype.getConnector=function(){return this._connector},a.WaveShaper.prototype.loadData=function(b){a.AudioUnit.prototype.loadData.apply(this,arguments),this.curve=b.curve,this.oversample=b.oversample},a.WaveShaper.Status=function(){a.AudioUnit.Status.apply(this,arguments),this.curve=null,this.oversample=a.WaveShaper.OVERSAMPLE_NONE,this.gain=1},a.WaveShaper.Status.prototype=Object.create(a.AudioUnit.Status.prototype),a.WaveShaper.Status.prototype.constructor=a.WaveShaper.Status,a});