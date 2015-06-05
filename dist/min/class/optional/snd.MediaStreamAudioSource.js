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
define(["snd.Source"],function(a){return a.MediaStreamAudioSource=function(b,c,d,e){if(a.Source.apply(this,arguments),this._status.type=a.srctype.MEDIA_STREAM,this._status.className="snd.MediaStreamAudioSource",this._status.status=a.status.NONE,c)this._source=a.AUDIO_CONTEXT.createMediaStreamSource(c),this._source.connect(this._gain),this._status.status=a.status.READY;else{var f,g,h=this;f=function(c){h._source=new a.MediaStreamAudioSource(b,c),h._source.connect(h._gain),h._status.status=a.status.READY,d&&d(h)},g=e?e:function(a){console.log("getUserMedia failed: "+a)},navigator.getUserMedia?navigator.getUserMedia({audio:!0},f,g):navigator.mozGetUserMedia?navigator.mozGetUserMedia({audio:!0},f,g):navigator.webkitGetUserMedia&&navigator.webkitGetUserMedia({audio:!0},f,g)}},a.MediaStreamAudioSource.prototype=Object.create(a.Source.prototype),a.MediaStreamAudioSource.prototype.constructor=a.MediaStreamAudioSource,a.MediaStreamAudioSource.prototype.createSource=function(){return new a.MediaStreamAudioSource.Status},a.MediaStreamAudioSource.prototype.toJSON=function(){return this._status},a.MediaStreamAudioSource.prototype.loadData=function(){a.Source.prototype.loadData.apply(this,arguments)},a.MediaStreamAudioSource.Status=function(){a.Source.Status.apply(this,arguments)},a.MediaStreamAudioSource.prototype=Object.create(a.Source.prototype),a.MediaStreamAudioSource.prototype.constructor=a.MediaStreamAudioSource,a});