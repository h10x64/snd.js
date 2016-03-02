
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
        define(['snd.TimeLineEvent', 'snd.Envelope'], factory);
    } else if (typeof exports === 'object') {
        // Node
    } else {
        // Browser globals (root is window)
        root.snd = factory(root.snd);
    }
}(this, function(snd) {
    
    /**
     * 
     * @class 1つのタイムラインを表すクラスです。<br/>
     */
    snd.TimeLine = function(id) {
        this._id = id;
        this._interval = 0.025;
        this._queueingLength = 4 * this._interval;
        this._startAt = 0;
        
        this._startedTime = 0;
        this._elapsedTime = -1;
        
        this._events = [];
        this._intervalID = null;
        this._timeoutID = null;
        
        this._lastEventId = 0;
        
        this._status = snd.status.READY;
        
        Object.defineProperties(this, {
            id: {
                get: function() {
                    return this._id;
                }
            },
            status: {
                get: function() {
                    return this._status;
                }
            },
            startAt: {
                get: function() {
                    return this._startAt;
                },
                set: function(val) {
                    if (val <= 0) {
                        console.log("TimeLine.startAt must greater than 0s.");
                        return;
                    }
                    
                    this.setStartAt(val);
                }
            },
            elapsedTime: {
                get: function() {
                    if (this.status != snd.status.STARTED) {
                        return 0;
                    } else {
                        return snd.CURRENT_TIME - this._startedTime;
                    }
                }
            },
            now: {
                get: function() {
                    if (this.status != snd.status.STARTED) {
                        return this._startAt;
                    } else {
                        return this._startAt + this.elapsedTime;
                    }
                }
            },
            interval: {
                get: function() {
                    return this._interval;
                },
                set: function(val) {
                    if (val <= 0) {
                        console.log("TimeLine.interval must greater than 0s.")
                        return;
                    }
                    
                    this._interval = val;
                }
            },
            queueingLength: {
                get: function() {
                    return this._queueingLength;
                },
                set: function(val) {
                    if (val <= 0) {
                        console.log("TimeLine.queueingLength must greater than 0s.")
                        return;
                    }
                    
                    this._queueingLength = val;
                }
            }
        });
    };
    
    snd.TimeLine.prototype.push = function(timeLineEvent) {
        timeLineEvent.addStartTimeChangedEventListener(this.onTimeLineEventStartTimeChanged);
        
        this._events.push(timeLineEvent);
        
        this._events.sort(snd.TimeLineEvent.compare);
        
        this.onTimeLineEventAdded(timeLineEvent);
    };
    
    snd.TimeLine.prototype.onTimeLineEventAdded = function(evt) {
    };
    
    snd.TimeLine.prototype.size = function() {
        return this._events.length;
    };
    
    snd.TimeLine.prototype.getEvent = function(i) {
        if (i >= 0 && i < this._events.length) {
            return this._events[i];
        } else {
            console.log("Index out of range. Return undefined. (timeline.size = " + this._events.length + ", i = " + i + ")");
            return undefined;
        }
    };
    
    snd.TimeLine.prototype.removeEvent = function(timeLineEvent) {
        var i = this._events.indexof(timeLineEvent);
        this.remove(i);
    };
    
    snd.TimeLine.prototype.remove = function(i) {
        if (i >= 0 && i < this._events.length) {
            var evt = this._events[i];
            
            evt.removeStartTimeChangedEventListener(this.onTimeLineEventStartTimeChanged);
            
            this._events.splice(i, 1);
            
            this.onTimeLineEventRemoved(evt);
        }
    };
    
    snd.TimeLine.prototype.onTimeLineEventRemoved = function(evt) {
    };
    
    snd.TimeLine.prototype.start = function() {
        if (this.status == snd.status.STARTED) {
            console.log("TimeLine already started.");
            return;
        }
        if (this.interval <= 0) {
            console.log("TimeLine.interval must more or equals than 0.0s");
            return;
        }
        if (this.endTime <= 0) {
            console.log("TimeLine.endTime must more than 0.0s");
            return;
        }
        
        this._status = snd.status.STARTED;
        
        this._startedTime = snd.CURRENT_TIME;
        
        this.startInterval();
        
        this.onstarted(this._startedTime);
    };
    
    snd.TimeLine.prototype.onstarted = function(startedTime) {
    };
    
    /**
     * このタイムラインを停止します。<br/>
     * このメソッドが呼び出されると、このタイムラインに追加済みのイベントの中から演奏途中のものを選んで、
     * stopメソッドを実行します。<br/>
     * イベントが演奏途中かどうかの判定には以下の条件を使用します。
     * <ul>
     * <li>
     * 開始時刻がタイムラインの現在時刻の以前 かつ 終了時刻がタイムラインの現在時刻より以後<br/>
     * (event.startTime <= this.now && this.now <= event.endTime)
     * </li>
     * </ul>
     * @returns {undefined}
     */
    snd.TimeLine.prototype.stop = function(when) {
        var now = this.now;
        
        window.clearInterval(this._intervalID);
        
        var currentEvents = this.searchEvents(now);
        for (var i in currentEvents) {
            currentEvents[i].stop(when);
        }
        
        this.resetAllEvents();
        
        this._status = snd.status.READY;
        
        this.onstopped(this.now);
    };
    
    snd.TimeLine.prototype.onstopped = function(now) {
    };
    
    snd.TimeLine.prototype.setStartAt = function(t) {
        if (this._currentEvents != null) {
            this.stop();
            this._currentEvents = null;
        }
        
        this._startAt = t;
        
        this.onStartAtChanged(t);
    };
    
    snd.TimeLine.prototype.onStartAtChanged = function(t) {
        
    };
    
    snd.TimeLine.prototype.tick = function(_this) {
        var now = _this.now;
        var events = _this.searchEventsBySpan(now, now + _this.queueingLength);
        
        for (var i in events) {
            var event = events[i];
            if (event.status != snd.status.STARTED && event.status != snd.status.STOPPED) {
                event.start(now);
            }
        }
    };
    
    snd.TimeLine.prototype.startInterval = function() {
        var _this = this;
        
        this.tick(_this);
        
        this._intervalID = window.setInterval(_this.tick, Math.max(1, _this.interval * 1000), _this);
    };
    
    snd.TimeLine.prototype.resetAllEvents = function() {
        for (var i = 0; i < this._events.length; i++) {
            this._events[i].resetStatus();
        }
    };
    
    /**
     * 指定された区間で再生が予定されているイベント全てを配列で返します。
     * @param {type} lt 検索開始時刻
     * @param {type} rt 検索終了時刻
     * @returns {Array} 指定された時間区切りの間に開始するイベントの配列
     */
    snd.TimeLine.prototype.searchEventsBySpan = function(lt, rt) {
        var ret = [];
        
        for (var i = 0; i < this._events.length; i++) {
            var st = this._events[i].startTime;
            var et = this._events[i].endTime;
            
            if (((lt <= et && st <= rt) || (lt <= et && et <= rt))
                || (st <= lt && lt <= et) || (st <= rt && rt <= et)){
                ret.push(this._events[i]);
            } else if (rt < st) {
                break;
            }
        }
        
        return ret;
    };
    
    /**
     * 指定された時刻で未終了のイベント全ての配列を返します。
     * @param {type} t タイムライン時刻
     * @returns {Array} tの時点で未終了のイベントの配列
     */
    snd.TimeLine.prototype.searchEvents = function(t) {
        var ret = [];
        
        for (var i = 0; i < this._events.length; i++) {
            var st = this._events[i].startTime;
            var et = this._events[i].endTime;
            
            if (st <= t && t <= et) {
                ret.push(this._events[i]);
            }
        }
        
        return ret;
    };
    
    snd.TimeLine.prototype.onTimeLineEventStartTimeChanged = function(evt, t) {
        this._events.sort(snd.TimeLineEvent.compare);
    };
    
    return snd;
}));
