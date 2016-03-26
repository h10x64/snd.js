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
!function(a,b){"function"==typeof define&&define.amd?define(["snd"],b):"object"==typeof exports||(a.snd=b(a.snd))}(this,function(a){return a.TimeValue=function(a,b){this._time=a,this._value=b,this._timeValueChangeEventListeners=[],Object.defineProperties(this,{time:{get:function(){return this._time},set:function(a){var b=this._time;this._time=a,this.fireTimeValueChangeEvent(this,b,this._value)}},value:{get:function(){return this._value},set:function(a){var b=this._value;this._value=a,this.fireTimeValueChangeEvent(this,this._time,b)}}})},a.TimeValue.prototype.onTimeValueChanged=function(){},a.TimeValue.prototype.addTimeValueChangeEventListener=function(a){this._timeValueChangeEventListeners.push(a)},a.TimeValue.prototype.removeTimeValueChangeEventListener=function(a){var b=this._timeChangeEventListeners.indexOf(a);b>0&&this._timeValueChangeEventListeners.splice(b,1)},a.TimeValue.prototype.set=function(a,b){var c=this._time,d=this._value;this._time=a,this._value=b,this.fireTimeValueChangeEvent(this,c,d)},a.TimeValue.prototype.fireTimeValueChangeEvent=function(a,b,c){this.onTimeValueChanged(a,b,c);for(var d in this._timeValueChangeEventListeners)"function"==typeof this._timeValueChangeEventListeners[d]&&this._timeValueChangeEventListeners[d](a,b,c)},a});