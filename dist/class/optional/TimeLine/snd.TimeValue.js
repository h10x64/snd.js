
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

    snd.TimeValue = function(time, value) {
        this._time = time;
        this._value = value;

        this._timeValueChangeEventListeners = [];

        Object.defineProperties(this, {
            time: {
                get: function() {
                    return this._time;
                },
                set: function(val) {
                    var prevTime = this._time;
                    this._time = val;
                    this.fireTimeValueChangeEvent(this, prevTime, this._value);
                }
            },
            value: {
                get: function() {
                    return this._value;
                },
                set: function(val) {
                    var prevValue = this._value;
                    this._value = val;
                    this.fireTimeValueChangeEvent(this, this._time, prevValue);
                }
            }
        });
    };

    snd.TimeValue.prototype.onTimeValueChanged = function(obj, prevTime, prevValue) {};

    snd.TimeValue.prototype.addTimeValueChangeEventListener = function(listener) {
        this._timeValueChangeEventListeners.push(listener);
    };

    snd.TimeValue.prototype.removeTimeValueChangeEventListener = function(listener) {
        var idx = this._timeChangeEventListeners.indexOf(listener);
        if (idx > 0) {
            this._timeValueChangeEventListeners.splice(idx, 1);
        }
    };

    snd.TimeValue.prototype.set = function(time, value) {
        var prevTime = this._time;
        var prevValue = this._value;

        this._time = time;
        this._value = value;

        this.fireTimeValueChangeEvent(this, prevTime, prevValue);
    };

    snd.TimeValue.prototype.fireTimeValueChangeEvent = function(obj, prevTime, prevValue) {
        this.onTimeValueChanged(obj, prevTime, prevValue);
        for (var i in this._timeValueChangeEventListeners) {
            if (typeof(this._timeValueChangeEventListeners[i]) == 'function') {
                this._timeValueChangeEventListeners[i](obj, prevTime, prevValue);
            }
        }
    };

    return snd;
}));
