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
                    this.changeStartTime(val);
                }
            },
            endTime: {
                get: function() {
                    return this._endTime;
                },
                set: function(val) {
                    this._endTime = val;
                    this.changeEndTime(val);
                }
            },
            status: {
                get: function() {
                    return this._status;
                }
            }
        });
    };

    snd.TimeLineEvent.prototype.start = function(time) {
        if (this.target && this.target.start) {
            var diff = this.startTime - time;
            var when = (diff < 0) ? 0 : diff;
            var offset = (diff < 0) ? Math.abs(diff) : 0;
            var duration = this.endTime - this.startTime - offset;

            this.target.start(when, offset, duration);

            this._status = snd.status.STARTED;
        }
    };

    snd.TimeLineEvent.prototype.stop = function(time) {
        if (this.target && this.target.stop) {
            this.target.stop(0);

            this._status = snd.status.READY;
        }
    };

    snd.TimeLineEvent.prototype.resetStatus = function() {
        this._status = snd.status.READY;
    };

    snd.TimeLineEvent.prototype.changeStartTime = function(time) {
        // PLEASE OVERRIDE ME
    };

    snd.TimeLineEvent.prototype.changeEndTime = function(time) {
        // PLEASE OVERRIDE ME
    }

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
