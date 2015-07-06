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
define(["snd","snd.TimeLineEvent"],function(a){return a.TimeLine=function(){this._interval=.25,this._queueingLength=4*this._interval,this._startAt=0,this._startedTime=0,this._elapsedTime=0,this._events=[],this._intervalID=null,this._timeoutID=null,Object.defineProperties(this,{startAt:{get:function(){return this._startAt},set:function(a){return 0>=a?void console.log("TimeLine.startAt must greater than 0s."):void this.setStartAt(a)}},elapsedTime:{get:function(){return this._elapsedTime<0?a.CURRENT_TIME-this._startedTime:this._elapsedTime}},now:{get:function(){return this._startAt+this.elapsedTime}},interval:{get:function(){return this._interval},set:function(a){return 0>=a?void console.log("TimeLine.interval must greater than 0s."):void(this._interval=a)}},queueingLength:{get:function(){return this._queueingLength},set:function(a){return 0>=a?void console.log("TimeLine.queueingLength must greater than 0s."):void(this._queueingLength=a)}}})},a.TimeLine.prototype.push=function(a){this.addEvent(a)},a.TimeLine.prototype.addEvent=function(b){this._events.push(b),this._events.sort(a.TimeLineEvent.compare)},a.TimeLine.prototype.removeEvent=function(a){var b=this._events.indexof(a);b>=0&&this._events.splice(b,1)},a.TimeLine.prototype.start=function(){return this.interval<=0?void console.log("TimeLine.interval must more or equals than 0.0s"):this.endTime<=0?void console.log("TimeLine.endTime must more than 0.0s"):(this._startedTime=a.CURRENT_TIME,this._elapsedTime=-1,void this.startInterval())},a.TimeLine.prototype.stop=function(){window.clearInterval(this._intervalID),this._elapsedTime=a.CURRENT_TIME-this._startedTime;var b=this.searchEvents(this.now);for(var c in b)b[c].stop(this.now)},a.TimeLine.prototype.tick=function(b){var c=b.searchEventsBySpan(b.now,b.now+b.queueingLength);for(var d in c){var e=c[d];e.status!=a.status.STARTED&&e.status!=a.status.STOPPED&&e.start(b.now)}},a.TimeLine.prototype.startInterval=function(){var a=this;this.tick(a),this._intervalID=window.setInterval(a.tick,Math.max(1,1e3*a.interval),a)},a.TimeLine.prototype.setStartAt=function(a){null!=this._currentEvents&&(this.stop(),this._currentEvents=null),this._startAt=a},a.TimeLine.prototype.searchEventsBySpan=function(a,b){for(var c=[],d=0;d<this._events.length;d++){var e=this._events[d].startTime;if(e>=a&&b>=e)c.push(this._events[d]);else if(e>b)break}return c},a.TimeLine.prototype.searchEvents=function(a){for(var b=[],c=0;c<this._events.length;c++){var d=this._events[c].startTime,e=this._events[c].endTime;a>=d&&e>=a&&b.push(this._events[c])}return b},a});