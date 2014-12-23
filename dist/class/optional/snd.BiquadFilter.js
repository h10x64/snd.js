
/**
 * snd.js
 * 
 * The MIT License (MIT)
 * copyright (c) 2014 N_H <h.10x64@gmail.com>
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
 
 

snd.CLASS_DEF.push(function() {
    snd.BiquadFilter = function(id) {
        snd.AudioUnit.apply(this, arguments);

        this._connector = snd.AUDIO_CONTEXT.createGain();
        this._output = snd.AUDIO_CONTEXT.createGain();
        this._filter = snd.AUDIO_CONTEXT.createBiquadFilter();

        this._connector.connect(this._filter);
        this._filter.connect(this._output);

        /* DEFINE PROPERTIES */
        Object.defineProperties(this, {
            channelCount: {
                get: function() {
                    return this._status.channelCount;
                },
                set: function(val) {
                    this._connector.channelCount = val;
                    this._output.channelCount = val;
                    this._filter.channelCount = val;
                    this._status.channelCount = val;
                }
            },
            channelCountMode: {
                get: function() {
                    return this._status.channelCountMode;

                },
                set: function(val) {
                    this._connector.channelCountMode = val;
                    this._output.channelCountMode = val;
                    this._filter.channelCountMode = val;
                    this._status.channelCountMode = val;
                }
            },
            channelInterpretation: {
                get: function() {
                    return this._status.channelInterpretation;
                },
                set: function(val) {
                    this._connector.channelInterpretation = val;
                    this._output.channelInterpretation = val;
                    this._filter.channelInterpretation = val;
                    this._status.channelInterpretation = val;
                }
            },
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
                    this._filter.frequency.value = val;
                    this._status.frequency = val;
                }
            },
            frequencyParam: {
                get: function() {
                    var ret = this._filter.frequency;
                    ret.id = this.id + ".frequency";
                    return ret;
                }
            },
            detune: {
                get: function() {
                    return this._filter.detune.value;
                },
                set: function(val) {
                    this._filter.detune.value = val;
                    this._status.detune = val;
                }
            },
            detuneParam: {
                get: function() {
                    var ret = this._filter.detune;
                    ret.id = this.id + ".detune";
                    return ret;
                }
            },
            Q: {
                get: function() {
                    return this._filter.Q.value;
                },
                set: function(val) {
                    this._filter.Q.value = val;
                    this._status.Q = val;
                }
            },
            QParam: {
                get: function() {
                    var ret = this._filter.Q;
                    ret.id = this.id + ".Q";
                    return ret;
                }
            },
            gain: {
                get: function() {
                    return this._filter.gain.value;
                },
                set: function(val) {
                    this._filter.gain.value = val;
                    this._status.gain = val;
                }
            },
            gainParam: {
                get: function() {
                    var ret = this._filter.gain;
                    ret.id = this.id + ".gain";
                    return ret;
                }
            }
        });
    };
    snd.BiquadFilter.prototype = Object.create(snd.AudioUnit.prototype);
    snd.BiquadFilter.prototype.constructor = snd.Gain;

    snd.BiquadFilter.prototype.connect = function(connectTo, indexIn, indexOut, id) {
        snd.AudioUnit.prototype.connect.apply(this, arguments);
        if (connectTo.getConnector != null) {
            this._output.connect(connectTo.getConnector(), indexIn, indexOut);
        } else {
            this._output.connect(connectTo, indexIn, indexOut);
        }
    };
    snd.BiquadFilter.prototype.disconnect = function(disconnectFrom, indexIn, id) {
        snd.AudioUnit.prototype.disconnect.apply(this, arguments);
        if (disconnectFrom.getConnector != null) {
            this._output.disconnect(disconnectFrom.getConnector(), indexIn);
        } else {
            this._output.disconnect(disconnectFrom, indexIn);
        }
    };
    snd.BiquadFilter.prototype.createStatus = function() {
        return new snd.BiquadFilter.Status();
    };
    snd.BiquadFilter.prototype.getConnector = function() {
        return this._connector;
    };
    snd.BiquadFilter.prototype.loadData = function(data) {
        snd.AudioUnit.prototype.loadData.apply(this, arguments);

        // PLEASE WRITE LOADING METHODS HERE
    };

    snd.BiquadFilter.Status = function() {
        snd.AudioUnit.Status.apply(this, arguments);

        this.type = snd.LOWPASS;
        this.frequency = 350;
        this.detune = 0;
        this.Q = 1.0;
        this.gain = 0;
    };
    snd.BiquadFilter.Status.prototype = Object.create(snd.AudioUnit.Status.prototype);
    snd.BiquadFilter.Status.prototype.constructor = snd.BiquadFilter.Status;
});

