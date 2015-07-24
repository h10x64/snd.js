(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD
        define(['snd.TimeLineEvent'], factory);
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
                    if (this._elapsedTime < 0) {
                        return snd.CURRENT_TIME - this._startedTime;
                    } else {
                        return this._elapsedTime;
                    }
                }
            },
            now: {
                get: function() {
                    return this._startAt + this.elapsedTime;
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
        this.addEvent(timeLineEvent);
    };
    
    snd.TimeLine.prototype.addEvent = function(target, startTime, endTime) {
        var st = (startTime) ? startTime : 0;
        var et = (endTime) ? endTime : 1;
        
        var eventId = this.id + "." + this.getNewEventId();
        
        var event = new snd.TimeLineEvent(eventId, target, st, et);
        
        this._events.push(event);
        this._events.sort(snd.TimeLineEvent.compare);
    };
    
    snd.TimeLine.prototype.removeEvent = function(time) {
        var removeEvents = this.searchEvents(time);
        
        for (var i in removeEvents) {
            var event = removeEvents[i];
            
            var idx = this._events.indexof(event);
            if (idx >= 0) {
                this._events.splice(idx, 1);
            }
        }
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
        this._elapsedTime = -1;
        
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
    snd.TimeLine.prototype.stop = function() {
        window.clearInterval(this._intervalID);
        
        this._elapsedTime = snd.CURRENT_TIME - this._startedTime;
        
        var currentEvents = this.searchEvents(this.now);
        for (var i in currentEvents) {
            currentEvents[i].stop(this.now);
        }
        
        this.resetAllEvents();
        
        this._status = snd.status.READY;
        
        this.onstopped(this.now);
    };
    
    snd.TimeLine.prototype.onstopped = function(now) {
        
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
    
    snd.TimeLine.prototype.getNewEventId = function() {
        this._lastEventId++;
        return this._lastEventId;
    };
    
    snd.TimeLine.prototype.startInterval = function() {
        var _this = this;
        
        this.tick(_this);
        
        this._intervalID = window.setInterval(_this.tick, Math.max(1, _this.interval * 1000), _this);
    };
    
    snd.TimeLine.prototype.setStartAt = function(t) {
        if (this._currentEvents != null) {
            this.stop();
            this._currentEvents = null;
        }
        
        this._startAt = t;
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
    
    return snd;
}));
