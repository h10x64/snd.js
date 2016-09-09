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
!function(a,b){"function"==typeof define&&define.amd?define(["snd.AudioUnit"],b):"object"==typeof exports||(a.snd=b(a.snd))}(this,function(a){return a.Convolver=function(){a.AudioUnit.apply(this,arguments),this._connector=a.AUDIO_CONTEXT.createGain(),this._output=a.AUDIO_CONTEXT.createGain(),this._convolver=a.AUDIO_CONTEXT.createConvolver(),this._status.audioBuffer=this._convolver.buffer,this._connector.connect(this._convolver),this._convolver.connect(this._output),this._key="",this._listeners=[],Object.defineProperties(this,{buffer:{get:function(){return this._convolver.buffer},set:function(a){this._convolver.buffer=a}},normalize:{get:function(){return this._convolver.normalize},set:function(a){this._convolver.normalize=a,this.buffer=this.buffer}}}),this.channelCount=this._status.channelCount},a.Convolver.prototype=Object.create(a.AudioUnit.prototype),a.Convolver.prototype.constructor=a.Convolver,a.Convolver.prototype.createStatus=function(){return new a.Convolver.Status},a.Convolver.prototype.getConnector=function(){return this._connector},a.Convolver.prototype.getOutputConnector=function(){return this._output},a.Convolver.prototype.getParamDescription=function(){var b=a.AudioUnit.prototype.getParamDescription.apply(this,arguments);return b.buffer={type:a.params.type.VALUE,"default":void 0,max:void 0,min:void 0},b.normalize={type:a.params.type.ENUM,value:[!1,!0],"default":!0},b},a.Convolver.prototype.createStatus=function(){var b=a.AudioUnit.prototype.createStatus.call(this);return b.className="snd.Convolver",b},a.Convolver.prototype.loadURL=function(b){var c=this;this._status.src=b,this._key=b;var d=a.AUDIO_DATA_MANAGER.getAudioBuffer(this._key);d?this.buffer=d:(a.AUDIO_DATA_MANAGER.add(this._key,b),a.AUDIO_DATA_MANAGER.addOnLoadListener(this._key,function(){c.buffer=a.AUDIO_DATA_MANAGER.getAudioBuffer(c._key),c.fireOnLoadEvent()}),a.AUDIO_DATA_MANAGER.load(this._key))},a.Convolver.prototype.loadBase64=function(b){var c=this;this._status.src=null!=a.util.REGEX_DATA_URI_SCHEME.exec(b)?b:"data:audio/unknown;base64,"+b,this._key=a.util.getNewKey(this.id),a.AUDIO_DATA_MANAGER.addBase64(this._key,b),a.AUDIO_DATA_MANAGER.addOnLoadListener(this._key,function(){c.buffer=a.AUDIO_DATA_MANAGER.getAudioBuffer(c._key),c.fireOnLoadEvent()}),a.AUDIO_DATA_MANAGER.load(this._key)},a.Convolver.prototype.loadAudioBuffer=function(b){this._key=b,this.buffer=a.AUDIO_DATA_MANAGER.getAudioBuffer(b),this._status.src="key:"+b},a.Convolver.prototype.loadData=function(b){a.AudioUnit.prototype.loadData.apply(this,arguments),this._status.src=b.src,a.util.isAudioManagerKey(this._status.src)?this.loadAudioBuffer(a.util.stripAudioManagerKey(this._status.src)):a.util.isDataURI(this._status.src)?this.loadBase64(this._status.src):this.loadURL(this._status.src),this._status.normalize=b.normalize},a.Convolver.prototype.addOnLoadEventListener=function(a){this._listeners.push(a)},a.Convolver.prototype.removeOnLoadEventListener=function(a){var b=this._listeners.indexOf(a);b>=0&&this._listeners.splice(b,1)},a.Convolver.prototype.fireOnLoadEvent=function(){for(var a in this._listeners){var b=this._listeners[a];"function"==typeof b&&b(this)}},a});