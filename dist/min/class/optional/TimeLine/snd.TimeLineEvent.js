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
!function(a,b){"function"==typeof define&&define.amd?define(["snd"],b):"object"==typeof exports||(a.snd=b(a.snd))}(this,function(a){return a.TimeLineEvent=function(b,c,d,e){this._id=b,this._target=c,this._startTime=d,this._endTime=e,this._status=a.status.NONE,this._timerID=null,this._startEventListeners=[],this._endEventListeners=[],this._startTimeChangedEventListeners=[],this._endTimeChangedEventListeners=[],Object.defineProperties(this,{id:{get:function(){return this._id}},target:{get:function(){return this._target}},startTime:{get:function(){return this._startTime},set:function(a){this._startTime=a,this.fireChangeStartTimeEvent(a)}},endTime:{get:function(){return this._endTime},set:function(a){this._endTime=a,this.fireChangeEndTimeEvent(a)}},status:{get:function(){return this._status}}})},a.TimeLineEvent.prototype.start=function(b,c){if(this.target&&this.target.start&&this._status!=a.status.STARTED){var d=this,e=this.startTime-b,f=0>e?0:e,g=0>e?Math.abs(e):0,h=this.endTime-this.startTime-g;this.target.start(f+(null==c?a.CURRENT_TIME:c),g,h),this._status=a.status.STARTED,"function"==typeof this.target.addOnEndedEventListener?this.target.addOnEndedEventListener(this.receiveOnEndedEvent):this._timerID=setTimeout(function(b){b.status=a.status.READY}(d),h),this.fireStartEvent()}},a.TimeLineEvent.prototype.fireStartEvent=function(){this.onStart(this);for(var a in this._startEventListeners)this._startEventListeners[a](this)},a.TimeLineEvent.prototype.onStart=function(){},a.TimeLineEvent.prototype.stop=function(b){this.target&&this.target.stop&&(this.target.stop(b),this._status=a.status.READY,this._timerID||clearTimeout(this._timerID))},a.TimeLineEvent.prototype.resetStatus=function(){this._status=a.status.READY,this._timerID||clearTimeout(this._timerID)},a.TimeLineEvent.prototype.fireChangeStartTimeEvent=function(a){this.onStartTimeChanged(this,a);for(var b=0;b<this._startTimeChangedEventListeners.length;b++)this._startTimeChangedEventListeners[b](this,a)},a.TimeLineEvent.prototype.addStartTimeChangedEventListener=function(a){this._startTimeChangedEventListeners.push(a)},a.TimeLineEvent.prototype.removeStartTimeChnagedEventListener=function(a){var b=this._startTimeChangedEventListeners.indexof(a);b>=0&&this._startTimeChangedEventListeners.splice(b,1)},a.TimeLineEvent.prototype.onStartTimeChanged=function(){},a.TimeLineEvent.prototype.fireChangeEndTimeEvent=function(a){this.onEndTimeChanged(this,a);for(var b=0;b<this._endTimeChangedEventListeners.length;b++)this._endTimeChangedEventListeners[b](this,a)},a.TimeLineEvent.prototype.addEndTimeChangedEventListener=function(a){this._endTimeChangedEventListeners.push(a)},a.TimeLineEvent.prototype.removeEndTimeChnagedEventListener=function(a){var b=this._endTimeChangedEventListeners.indexof(a);b>=0&&this._endTimeChangedEventListeners.splice(b,1)},a.TimeLineEvent.prototype.onEndTimeChanged=function(){},a.TimeLineEvent.prototype.receiveOnEndedEvent=function(b){b==this._target&&(this._status=a.status.STOPPED,this._timerID||clearTimeout(this._timerID))},a.TimeLineEvent.compare=function(a,b){return a&&a.startTime?b&&b.startTime?a.startTime<b.startTime?-1:a.startTime==b.startTime?0:1:1:-1},a});