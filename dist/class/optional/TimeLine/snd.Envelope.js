
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
        define(['snd.TimeLineEvent', 'snd.TimeValue'], factory);
    } else if (typeof exports === 'object') {
        // Node
    } else {
        // Browser globals (root is window)
        root.snd = factory(root.snd);
    }
}(this, function(snd) {
    snd.Envelope = function(id, target) {
        snd.TimeLineEvent.call(this, id, target, 0, Infinity);

        this._timeValueChangeEventListeners = [];
        this._timeValueAddEventListeners = [];
        this._timeValueRemoveEventListeners = [];

        Object.defineProperties(this, {
            length: {
                get: function() {
                    return this._envelope.length;
                }
            }
        });

        // {time: t, value: v}
        this._envelope = [];
    };
    snd.Envelope.prototype = Object.create(snd.TimeLineEvent.prototype);
    snd.Envelope.prototype.constructor = snd.Envelope;

    snd.Envelope.prototype.start = function(time, currentTime) {
        if (this._target && this._status != snd.status.STARTED) {
            var _this = this;
            var diff = this.startTime - time;
            var when = (diff < 0) ? 0 : diff;
            var offset = (diff < 0) ? Math.abs(diff) : 0;
            var duration = this.endTime - this.startTime - offset;

            this.setEnvelope(when, offset, duration, (currentTime == null) ? snd.CURRENT_TIME : currentTime);

            this._status = snd.status.STARTED;
            if (typeof(this.target.addOnEndedEventListener) == "function") {
                this.target.addOnEndedEventListener(this.receiveOnEndedEvent);
            } else {
                this._timerID = setTimeout((function(thisarg){thisarg.status = snd.status.READY;})(_this), duration);
            }

            this.fireStartEvent();
        }
    };

    snd.Envelope.prototype.get = function(i) {
        return this._envelope[i];
    };

    snd.Envelope.prototype.push = function(timeValueObj) {
        var _this = this;

        timeValueObj.addTimeValueChangeEventListener(function(tv,pt,pv){_this.receiveTimeValueChangeEvent(tv,pt,pv);});

        this._envelope.push(timeValueObj);
        this._envelope.sort(snd.Envelope.compareTimeValueArray);

        this.fireTimeValueAddEvent(this, timeValueObj);
    };

    snd.Envelope.prototype.indexOf = function(timeValueObj) {
        return this._envelope.indexOf(timeValueObj);
    };

    snd.Envelope.prototype.remove = function(timeValueObj) {
        var i = this._envelope.indexOf(timeValueObj);
        if (i >= 0) {
            this.splice(i, 1);
        }
    };

    snd.Envelope.prototype.splice = function(i, n) {
        if (i > 0) {
            var timeValueObj = this._envelope[i];

            timeValueObj.removeTimeValueChangeEventListener(this.receiveTimeValueChangeEvent);

            this._envelope.splice(i, n);

            this.fireTimeValueRemoveEvent(this, timeValueObj);
        }
    };

    snd.Envelope.prototype.onTimeValueChanged = function(obj, timeValueObj) {};
    snd.Envelope.prototype.onTimeValueAdded = function(obj, timeValueObj) {};
    snd.Envelope.prototype.onTimeValueRemoved = function(obj, timeValueObj) {};

    snd.Envelope.prototype.addTimeValueAddEventListener = function(listener) {
        this._timeValueAddEventListeners.push(listener);
    };

    snd.Envelope.prototype.removeTimeValueAddEventListener = function(listener) {
        var i = this._timeValueAddEventListeners.indexOf(listener);

        if (i >= 0) {
            this._timeValueAddEventListeners.splice(i, 1);
        }
    };

    snd.Envelope.prototype.addTimeValueChangeEventListener = function(listener) {
        this._timeValueChangeEventListeners.push(listener);
    };

    snd.Envelope.prototype.removeTimeValueChangeEventListener = function(listener) {
        var i = this._timeValueChangeEventListeners.indexOf(listener);
        if (i >= 0) {
            this._timeValueChangeEventListeners.splice(i, 1);
        }
    };

    snd.Envelope.prototype.addTimeValueRemoveEventListener = function(listener) {
        this._timeValueRemoveEventListeners.push(listener);
    };

    snd.Envelope.prototype.removeTimeValueRemoveEventListener = function(listener) {
        var i = this._timeValueRemoveEventListeners.indexOf(listener);
        if (i >= 0) {
            this._timeValueRemoveEventListeners.splice(i, 1);
        }
    };

    snd.Envelope.prototype.fireTimeValueChangeEvent = function(obj, timeValueObj, prevTime, prevValue) {
        this.onTimeValueChanged(obj, timeValueObj, prevTime, prevValue);

        for (var i in this._timeValueChangeEventListeners) {
          if (typeof(this._timeValueChangeEventListeners[i]) == 'function') {
              this._timeValueChangeEventListeners[i](obj, timeValueObj);
          }
        }
    };

    snd.Envelope.prototype.fireTimeValueAddEvent = function(obj, timeValueObj) {
        this.onTimeValueAdded(obj, timeValueObj);

        for (var i in this._timeValueAddEventListeners) {
            if (typeof(this._timeValueAddEventListeners[i]) == 'function') {
                this._timeValueAddEventListeners[i](obj, timeValueObj);
            }
        }
    };

    snd.Envelope.prototype.fireTimeValueRemoveEvent = function(obj, timeValueObj) {
        this.onTimeValueRemoved(obj, timeValueObj);

        for (var i in this._timeValueRemoveEventListeners) {
          if (typeof(this._timeValueRemoveEventListeners[i]) == 'function') {
              this._timeValueRemoveEventListeners[i](obj, timeValueObj);
          }
        }
    };

    snd.Envelope.prototype.receiveTimeValueChangeEvent = function(timeValueObj, prevTime, prevValue) {
        var idx = this._envelope.indexOf(timeValueObj);
        if (idx >= 0) {
            if ((idx - 1 > 0) && (this._envelope[idx].time < this._envelope[idx -1])) {
                this._envelope.sort(snd.Envelope.compareTimeValueArray);
            } else if ((idx + 1 < this._envelope.length) && (this._envelope[idx] > this._envelope[idx + 1])) {
                this._envelope.sort(snd.Envelope.compareTimeValueArray);
            }
        }

        this.fireTimeValueChangeEvent(this, timeValueObj, prevTime, prevValue);
    };

    snd.Envelope.prototype.setEnvelope = function(when, offset, duration, currentTime) {
        if (this._envelope.length > 0) {
            var tv = this.calcSetTime(offset);
            this.setEnvelopeToTarget(currentTime, when, offset, tv.index, tv.left);
        }
    };

    snd.Envelope.prototype.calcSetTime = function(time) {
        var i, left;

        if (time <= this._envelope[0].time) {
            i = 0;
            left = {time: time, value: this._envelope[0].value};
        } else if (this._envelope[this._envelope.length - 1].time <= time) {
            i = this._envelope.length - 1;
            left = this._envelope[i];
        } else {
            var l = null, r = null, nowTimeVal = null;

            for (i = 0; i < this._envelope.length; i++) {
                if (this._envelope[i].time == time) {
                    nowTimeVal = this._envelope[i];
                    break;
                } else if (this._envelope[i].time > time) {
                    l = this._envelope[i - 1];
                    r = this._envelope[i];
                    nowTimeVal = {time: time, value: l.value + (r.value - l.value) * (time - l.time) / (r.time - l.time)};
                    break;
                }
            }

            left = nowTimeVal;
        }

        return {index: i, left: left};
    };

    snd.Envelope.prototype.setEnvelopeToTarget = function(currentTime, when, offset, idx, left) {
        var startAt = currentTime + when;

        this._target.cancelScheduledValues(0);

        if (idx >= this._envelope.length) {
            // Envelope already finished.
            // Set last envelope value to target AudioParam and return this method.
            this._target.setValueAtTime(left.value, startAt);
            return;
        }

        // Set first envelope value to target AudioParam.
        this._target.setValueAtTime(left.value, startAt);

        for (var i = idx; i < this._envelope.length; i++) {
            var e = this._envelope[i];
            this._target.linearRampToValueAtTime(e.value, startAt + e.time - offset);
        }
    };

    snd.Envelope.compareTimeValueArray = function(a, b) {
        if (!a || !a.time) {
            return -1;
        }
        if (!b || !b.time) {
            return 1;
        }

        if (a.time < b.time) {
            return -1;
        } else if (a.time == b.time) {
            return 0;
        } else {
            return 1;
        }
    };

    return snd;
}));
