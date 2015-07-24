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
!function(a,b){"function"==typeof define&&define.amd?define(["snd"],b):"object"==typeof exports||(a.snd=b(a.snd))}(this,function(a){return a.AudioDataManager=function(){this._requests={},this._dataMap={},this._eventListeners={},this._allLoadEventListeners=[],Object.defineProperties(this,{data:{get:function(){for(var a={},b=Object.keys(this._dataMap),c=0;c<b.length;c++)!function(a,b,c){var d={};d[b]={get:function(){return c._dataMap[b].data}},Object.defineProperties(a,d)}(a,b[c],this);return a}}})},a.AudioDataManager.prototype.onload=function(){for(var a=0;a<this._allLoadEventListeners.length;a++)this._allLoadEventListeners[a]()},a.AudioDataManager.prototype.addAllDataLoadListener=function(a){this._allLoadEventListeners.push(a)},a.AudioDataManager.prototype.removeAllDataLoadListener=function(a){for(var b=0;b<this._allLoadEventListeners.length;b++){var c=this._allLoadEventListeners[b];if(c===a)return this._allLoadEventListeners.splice(b,1),!0}return!1},a.AudioDataManager.prototype.addOnLoadListener=function(a,b){null==this._eventListeners[a]&&(this._eventListeners[a]={onload:[]}),this._eventListeners[a].onload.push(b)},a.AudioDataManager.prototype.removeOnLoadListener=function(a){return null!=this._eventListeners[a]?(delete this._eventListeners[a],!0):!1},a.AudioDataManager.prototype.getAudioBuffer=function(a){return null!=this._dataMap[a]?this._dataMap[a].data:void 0},a.AudioDataManager.prototype.add=function(b,c){var d=this;this._dataMap[b]={doesLoaded:!1};var e=new XMLHttpRequest;e.open("GET",c,!0),e.responseType="arraybuffer",e.onload=function(){a.AUDIO_CONTEXT.decodeAudioData(e.response,function(a){d._dataMap[b].data=a,d._dataMap[b].doesLoaded=!0,d.loaded(b,a)})},this._requests[b]=e},a.AudioDataManager.prototype.addBase64=function(b,c){var d=this;this._dataMap[b]={doesLoaded:!1};var e="",f=c.toLowerCase().match(/^data:audio.*base64,(.*)$/);e=f?f[1]:c;for(var g=atob(e),h=new ArrayBuffer(g.length),i=new Uint8Array(h),j=0;j<h.byteLength;j++)i[j]=255&g.charCodeAt(j);this._requests[b]={},this._requests[b].send=function(){a.AUDIO_CONTEXT.decodeAudioData(h,function(a){d.loaded(b,a)})}},a.AudioDataManager.prototype.doesAllDataLoaded=function(){for(var a in this._dataMap)if(!this._dataMap[a].doesLoaded)return!1;return!0},a.AudioDataManager.prototype.addAll=function(a){for(var b=Object.keys(a),c=0;c<b.length;c++){var d=b[c],e=a[d];if(null!=e){var f=e.match(/^data:audio.*base64,(.*)$/);if(f){var g=f[1];this.addBase64(d,g)}else this.add(d,e)}}},a.AudioDataManager.prototype.removeData=function(a){null!=this._requests[a]&&delete this._requests[a],null!=this._dataMap[a]&&delete this._dataMap[a],null!=this._eventListeners[a]&&delete this.eventLiteners[a]},a.AudioDataManager.prototype.removeAll=function(a){for(var b=0;b<a.length;b++)removeData(a[b])},a.AudioDataManager.prototype.load=function(a){if(a)(null==this._requests[a].readyState||this._requests[a].readyState<2)&&this._requests[a].send();else for(var b=Object.keys(this._requests),c=0;c<b.length;c++){var d=b[c];0==this._dataMap[d].doesLoaded&&(null==this._requests[d].readyState||this._requests[d].readyState<2)&&this._requests[d].send()}},a.AudioDataManager.prototype.loaded=function(a,b){if(this._dataMap[a].data=b,this._dataMap[a].doesLoaded=!0,this._eventListeners[a])for(var c=0;c<this._eventListeners[a].onload.length;c++)this._eventListeners[a].onload[c](b);for(var d in this._dataMap)if(!this._dataMap[d].doesLoaded)return;this.onload()},a._AUDIO_DATA_MANAGER=new a.AudioDataManager,a});