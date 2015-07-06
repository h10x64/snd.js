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
define(["snd"],function(a){return a.TimeLineEvent=function(b,c,d,e){this._id=b,this._target=c,this._startTime=d,this._endTime=e,this._status=a.status.NONE,Object.defineProperties(this,{id:{get:function(){return this._id}},target:{get:function(){return this._target}},startTime:{get:function(){return this._startTime},set:function(a){this._startTime=a,this.changeStartTime(a)}},endTime:{get:function(){return this._endTime},set:function(a){this._endTime=a,this.changeEndTime(a)}},status:{get:function(){return this._status}}}),this.startTime=0,this.endTime=1},a.TimeLineEvent.prototype.start=function(a){var b=this.startTime-a,c=0>b?Math.abs(b):0,d=0>b?this.endTime-c:this.endTime;this.target&&this.target.start&&this.target.start(b,c,d)},a.TimeLineEvent.prototype.stop=function(){this.target&&this.target.stop&&this.target.stop(0)},a.TimeLineEvent.compare=function(a,b){return a&&a.startTime?b&&b.startTime?a.startTime<b.startTime?-1:a.startTime==b.startTime?0:1:1:-1},a});