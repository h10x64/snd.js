
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
        define(['snd.AudioUnit'], factory);
    } else if (typeof exports === 'object') {
        // Node
    } else {
        // Browser globals (root is window)
        root.snd = factory(root.snd);
    }
}(this, function(snd) {
    snd.BiquadFilter = function(id) {
        snd.AudioUnit.apply(this, arguments);

        this._connector = snd.AUDIO_CONTEXT.createGain();
        this._output = snd.AUDIO_CONTEXT.createGain();
        this._filter = snd.AUDIO_CONTEXT.createBiquadFilter();

        this._connector.connect(this._filter);
        this._filter.connect(this._output);

        /* DEFINE PROPERTIES */
        Object.defineProperties(this, {
            type: {
                get: function() {
                    return this._filter.type;
                },
                set: function(val) {
                    this._filter.type = val;
                    this._status.type = val;
                }
            },
            frequency: {
                get: function() {
                    return this._filter.frequency.value;
                },
                set: function(val) {
                    var v = parseFloat(val);
                    this._filter.frequency.value = v;
                    this._status.frequency = v;
                }
            },
            frequencyParam: {
                get: function() {
                    return this.modAudioParam("frequency", this._filter.frequency)
                }
            },
            detune: {
                get: function() {
                    return this._filter.detune.value;
                },
                set: function(val) {
                    var v = parseFloat(val);
                    this._filter.detune.value = v;
                    this._status.detune = v;
                }
            },
            detuneParam: {
                get: function() {
                    return this.modAudioParam("detune", this._filter.detune);
                }
            },
            Q: {
                get: function() {
                    return this._filter.Q.value;
                },
                set: function(val) {
                    var v = parseFloat(val);
                    this._filter.Q.value = v;
                    this._status.Q = v;
                }
            },
            QParam: {
                get: function() {
                    return this.modAudioParam("q", this._filter.Q);
                }
            },
            gain: {
                get: function() {
                    return this._filter.gain.value;
                },
                set: function(val) {
                    var v = parseFloat(val);
                    this._filter.gain.value = v;
                    this._status.gain = v;
                }
            },
            gainParam: {
                get: function() {
                    return this.modAudioParam("gain", this._filter.gain);
                }
            }
        });
    };
    snd.BiquadFilter.prototype = Object.create(snd.AudioUnit.prototype);
    snd.BiquadFilter.prototype.constructor = snd.BiquadFilter;

    snd.BiquadFilter.prototype.createStatus = function() {
        var ret = snd.AudioUnit.prototype.createStatus.call(this);
        
        ret.className = "snd.BiquadFilter";
        
        return ret;
    };

    snd.BiquadFilter.prototype.getConnector = function() {
        return this._connector;
    };

    snd.BiquadFilter.prototype.getOutputConnector = function() {
        return this._output;
    }

    snd.BiquadFilter.prototype.getParamDescription = function() {
        var ret = snd.AudioUnit.prototype.getParamDescription.apply(this, arguments);

        ret.type = {
            type: snd.params.type.ENUM,
            value: [
                snd.LOWPASS,
                snd.HIGHPASS,
                snd.BANDPASS,
                snd.LOWSHELF,
                snd.HIGHSHELF,
                snd.PEAKING,
                snd.NOTCH,
                snd.ALLPASS
            ],
            default: snd.LOWPASS
        };
        ret.frequency = {
            type: snd.params.type.VALUE,
            default: 350,
            max: Infinity,
            min: -Infinity
        };
        ret.detune = {
            type: snd.params.type.VALUE,
            default: 0,
            max: Infinity,
            min: -Infinity
        };
        ret.Q = {
            type: snd.params.type.VALUE,
            default: 1.0,
            max: Infinity,
            min: -Infinity
        };
        ret.gain = {
            type: snd.params.type.VALUE,
            default: 0,
            max: Infinity,
            min: -Infinity
        };
        ret.frequencyParam = {
            type: snd.params.type.AUDIO_PARAM,
            value: this.frequencyParam,
            default: ret.frequency.default,
            max: ret.frequency.max,
            min: ret.frequency.min
        };
        ret.detuneParam = {
            type: snd.params.type.AUDIO_PARAM,
            value: this.detuneParam,
            default: ret.detune.default,
            max: ret.detune.max,
            min: ret.detune.min
        };
        ret.QParam = {
            type: snd.params.type.AUDIO_PARAM,
            value: this.QParam,
            default: ret.Q.default,
            max: ret.Q.max,
            min: ret.Q.min
        };
        ret.gainParam = {
            type: snd.params.type.AUDIO_PARAM,
            value: this.gainParam,
            default: ret.gain.default,
            max: ret.gain.max,
            min: ret.gain.min
        };

        return ret;
    };

    snd.BiquadFilter.prototype.loadData = function(data) {
        snd.AudioUnit.prototype.loadData.apply(this, arguments);

        // PLEASE WRITE LOADING METHODS HERE
    };

    return snd;
}));
