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
!function(a,b){"function"==typeof define&&define.amd?define(["snd"],b):"object"==typeof exports||(a.snd=b(a.snd))}(this,function(a){a.util={},a.util.REGEX_DATA_URI_SCHEME=/^data:audio.*;base64,(.*)$/,a.util.REGEX_KEY=/^key:(.*)$/,a.util.createSources=function(b,c,d,e){var f={};f.MediaElement=null!=b.MediaElement?a.util.createMediaElementAudioSources(b.MediaElement,c,d):null,null!=b.AudioBuffer?a.util.createBufferSources(b.AudioBuffer,c,function(a){f.AudioBuffer=a,e(f)}):(f.AudioBuffer=null,e(f))},a.util.getNewKey=function(a){return a+(new Date).getTime().toString()+Math.floor(1e3*Math.random())},a.util.isDataURI=function(b){return null!=a.util.REGEX_DATA_URI_SCHEME.exec(b)},a.util.stripDataURI=function(b){var c=b.match(a.util.REGEX_DATA_URI_SCHEME);return c?c[1]:undefiend},a.util.isAudioManagerKey=function(b){return null!=a.util.REGEX_KEY.exec(b)},a.util.stripAudioManagerKey=function(){var b=uri.match(a.util.REGEX_DATA_URI_SCHEME);return b?b[1]:undefiend},a.util.noteToFrequency=function(a,b){return 440*Math.pow(2,(12*(a-4)+b-9)/12)},a.util.noteToSec=function(a,b){return 60/(a*b/4)};var b="var id = null; var ms = %MILLI_SECOND%;start = function() {  if (id == null) id = %SET_METHOD_NAME%(tick, ms);};stop = function() {  if (id != null) {    %CLEAR_METHOD_NAME%(id);    id = null;  }};setMs = function(val) {  if (val > 0) ms = val;};tick = function() {  postMessage('tick');  %AFTER_MESSAGE%};onmessage = function(e) {  if (e.data == 'start') {    start();  } else if (e.data == 'stop') {    stop();  } else {    if (e.data != null) setMs(parseInt(e.data));  }};",c=function(a,c,d,e,f,g){var h=b.replace(/%MILLI_SECOND%/g,c).replace(/%SET_METHOD_NAME%/g,d).replace(/%CLEAR_METHOD_NAME%/g,e).replace(/%AFTER_MESSAGE%/g,f),i=new Blob([h],{type:"text/javascript"}),j=URL.createObjectURL(i),k=new Worker(j);return k._blob=i,k._url=j,k._callback=a,k._params=g,k._ms=c,Object.defineProperties(k,{ms:{get:function(){return this._ms},set:function(a){this._ms=a,postMessage(a)}}}),k.start=function(){this.postMessage("start")},k.stop=function(){this.postMessage("stop")},k.onmessage=function(a){"tick"==a.data&&this._callback.call(this,this._params)},k};return a.util.createIntervalTimer=function(a,b,d){return c(a,b,"setInterval","clearInterval","",d)},a.util.createTimeoutTimer=function(a,b,d){return c(a,b,"setInterval","clearInterval","stop();",d)},a});