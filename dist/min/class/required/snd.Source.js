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
!function(a,b){"function"==typeof define&&define.amd?define(["snd.AudioUnit"],b):"object"==typeof exports||(a.snd=b(a.snd))}(this,function(a){return a.Source=function(){a.AudioUnit.apply(this,arguments),this._gain=a.AUDIO_CONTEXT.createGain(),Object.defineProperties(this,{isSource:{get:function(){return this._status.isSource}},volumeParam:{get:function(){return this.modAudioParam("volume",this._gain.gain)}},volume:{get:function(){return this._gain.gain.value},set:function(a){var b=parseFloat(a);this._gain.gain.value=b,this._status.volume=b}},type:{get:function(){return this._status.type}},status:{get:function(){return this._status.status}}})},a.Source.prototype=Object.create(a.AudioUnit.prototype),a.Source.prototype.constructor=a.Source,a.Source.CLASS_NAME="snd.Source",a.Source.prototype.start=function(){},a.Source.prototype.stop=function(){},a.Source.prototype.setGain=function(a){this._gain.gain.value=a},a.Source.prototype.getGain=function(){return this._gain.gain.value},a.Source.prototype.connect=function(b,c,d){a.AudioUnit.prototype.connect.apply(this,arguments),b.isAudioUnit||null!=b.getConnector?this._gain.connect(b.getConnector(),c,d):d?this._gain.connect(b,c,d):this._gain.connect(b,c)},a.Source.prototype.disconnect=function(b){a.AudioUnit.prototype.disconnect.apply(this,arguments),this._gain.disconnect(b.isAudioUnit||null!=b.getConnector?b.getConnector():b)},a.Source.prototype.getConnector=function(){return this._gain},a.Source.prototype.createStatus=function(){return new a.Source.Status},a.Source.prototype.toJSON=function(){var b=a.AudioUnit.prototype.toJSON.apply(this,arguments);return b.volume=this.volume,b},a.Source.prototype.loadData=function(b){a.AudioUnit.prototype.loadData.apply(this,arguments),this.volume=null!=b.volume?b.volume:1},a.Source.loadJSON=function(b){var c=JSON.parse(b);if(!c.isSource)throw new a.Exception("This JSON String is not instance of 'snd.Source' class.");var d=new a.Source("");return d.loadData(c),d},a.Source.Status=function(){a.AudioUnit.Status.apply(this,arguments),this.type=a.srctype.NONE,this.status=a.status.NONE,this.volume=1,this.isSource=!0,this.className=a.Source.CLASS_NAME},a});