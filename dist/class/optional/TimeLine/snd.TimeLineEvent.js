
/**
 * snd.js
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
 
 

(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD
        define(['snd'], factory);
    } else if (typeof exports === 'object') {
        // Node
    } else {
        // Browser globals (root is window)
        root.snd = factory(root.snd);
    }
}(this, function(snd) {

    snd.TimeLineEvent = function(id, target, startTime, endTime) {
        this._id = id;
        this._target = target;
        this._startTime = startTime;
        this._endTime = endTime;
        this._status = snd.status.NONE;
        this._timerID = null;
        
        this._startEventListeners = [];
        this._endEventListeners = [];
        this._startTimeChangedEventListeners = [];
        this._endTimeChangedEventListeners = [];

        Object.defineProperties(this, {
            id: {
                get: function() {
                    return this._id;
                }
            },
            target: {
                get: function() {
                    return this._target;
                }
            },
            startTime: {
                get: function() {
                    return this._startTime;
                },
                set: function(val) {
                    this._startTime = val;
                    this.fireChangeStartTimeEvent(val);
                }
            },
            endTime: {
                get: function() {
                    return this._endTime;
                },
                set: function(val) {
                    this._endTime = val;
                    this.fireChangeEndTimeEvent(val);
                }
            },
            status: {
                get: function() {
                    return this._status;
                }
            }
        });
    };

    snd.TimeLineEvent.prototype.start = function(time, currentTime) {
        if (this.target && this.target.start && this._status != snd.status.STARTED) {
            var _this = this;
            var diff = this.startTime - time;
            var when = (diff < 0) ? 0 : diff;
            var offset = (diff < 0) ? Math.abs(diff) : 0;
            var duration = this.endTime - this.startTime - offset;

            this.target.start(when + ((currentTime == null) ? snd.CURRENT_TIME : currentTime), offset, duration);

            this._status = snd.status.STARTED;
            if (typeof(this.target.addOnEndedEventListener) == "function") {
                this.target.addOnEndedEventListener(this.receiveOnEndedEvent);
            } else {
                this._timerID = setTimeout((function(thisarg){thisarg.status = snd.status.READY;})(_this), duration);
            }
            
            this.fireStartEvent();
        }
    };
    
    snd.TimeLineEvent.prototype.fireStartEvent = function() {
        this.onStart(this);
        for (var i in this._startEventListeners) {
            this._startEventListeners[i](this);
        }
    };
    
    snd.TimeLineEvent.prototype.onStart = function(timeLineEvent) {
        
    };

    snd.TimeLineEvent.prototype.stop = function(time) {
        if (this.target && this.target.stop) {
            this.target.stop(time);

            this._status = snd.status.READY;
            if (!this._timerID) {
                clearTimeout(this._timerID);
            }
        }
    };

    snd.TimeLineEvent.prototype.resetStatus = function() {
        this._status = snd.status.READY;
        if (!this._timerID) {
            clearTimeout(this._timerID);
        }
    };
    
    snd.TimeLineEvent.prototype.fireChangeStartTimeEvent = function(time) {
        this.onStartTimeChanged(this, time);
        for (var i = 0; i < this._startTimeChangedEventListeners.length; i++) {
            this._startTimeChangedEventListeners[i](this, time);
        }
    };
    
    snd.TimeLineEvent.prototype.addStartTimeChangedEventListener = function(listener) {
        this._startTimeChangedEventListeners.push(listener);
    };
    
    snd.TimeLineEvent.prototype.removeStartTimeChnagedEventListener = function(listener) {
        var i = this._startTimeChangedEventListeners.indexof(listener);
        if (i >= 0) {
            this._startTimeChangedEventListeners.splice(i, 1);
        }
    };

    snd.TimeLineEvent.prototype.onStartTimeChanged = function(timeLineEvent, time) {
    };
    
    snd.TimeLineEvent.prototype.fireChangeEndTimeEvent = function(time) {
        this.onEndTimeChanged(this, time);
        for (var i = 0; i < this._endTimeChangedEventListeners.length; i++) {
            this._endTimeChangedEventListeners[i](this, time);
        }
    };
    
    snd.TimeLineEvent.prototype.addEndTimeChangedEventListener = function(listener) {
        this._endTimeChangedEventListeners.push(listener);
    };
    
    snd.TimeLineEvent.prototype.removeEndTimeChnagedEventListener = function(listener) {
        var i = this._endTimeChangedEventListeners.indexof(listener);
        if (i >= 0) {
            this._endTimeChangedEventListeners.splice(i, 1);
        }
    };

    snd.TimeLineEvent.prototype.onEndTimeChanged = function(timeLineEvent, time) {
    }
    
    snd.TimeLineEvent.prototype.receiveOnEndedEvent = function(obj) {
        if (obj == this._target) {
            this._status = snd.status.STOPPED;
            if (!this._timerID) {
                clearTimeout(this._timerID);
            }
        }
    };

    /**
     * 配列のソートで使用される関数です。<br/>
     * startTimeを基準にソートします。
     * @param {TimeLineEvent} a 比較するTimeLineEvent
     * @param {TimeLineEvent} b 比較するTimeLineEvent
     * @returns {Number} Array.sortで使用される基準値
     */
    snd.TimeLineEvent.compare = function(a, b) {
        if (!a || !a.startTime) {
            return -1;
        }
        if (!b || !b.startTime) {
            return 1;
        }

        if (a.startTime < b.startTime) {
            return -1;
        } else if (a.startTime == b.startTime) {
            return 0;
        } else {
            return 1;
        }
    };

    return snd;
}));
