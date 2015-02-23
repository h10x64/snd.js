
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
    snd.WaveShaper = function(id) {
        snd.AudioUnit.apply(this, arguments);

        this._output = snd.AUDIO_CONTEXT.createGain();
        this._connector = snd.AUDIO_CONTEXT.createGain();
        this._shaper = snd.AUDIO_CONTEXT.createWaveShaper();

        this._connector.connect(this._shaper);
        this._shaper.connect(this._output);

        /* DEFINE PROPERTIES */
        Object.defineProperties(this, {
            channelCount: {
                get: function() {
                    return this._status.channelCount;
                },
                set: function(val) {
                    this._output.channelCount = val;
                    this._connector.channelCount = val;
                    this._shaper.channelCount = val;
                    this._status.channelCount = val;
                }
            },
            channelCountMode: {
                get: function() {
                    return this._status.channelCountMode;

                },
                set: function(val) {
                    this._output.channelCountMode = val;
                    this._connector.channelCountMode = val;
                    this._shaper.channelCountMode = val;
                    this._status.channelCountMode = val;
                }
            },
            channelInterpretation: {
                get: function() {
                    return this._status.channelInterpretation;
                },
                set: function(val) {
                    this._output.channelInterpretation = val;
                    this._connector.channelInterpretation = val;
                    this._shaper.channelInterpretation = val;
                    this._status.channelInterpretation = val;
                }
            },
            curve: {
                get: function() {
                    return this._shaper.curve;
                },
                set: function(val) {
                    this._shaper.curve = val;
                    this._status.curve = val;
                }
            },
            oversample: {
                get: function() {
                    return this._shaper.oversample;
                },
                set: function(val) {
                    this._shaper.oversample = val;
                    this._status.oversample = val;
                }
            },
            gain: {
                get: function() {
                    return this._output.gain.value;
                },
                set: function(val) {
                    var v = parseFloat(val);
                    this._output.gain.value = v;
                    this._status.gain = v;
                }
            }
        });
    };
    snd.WaveShaper.prototype = Object.create(snd.AudioUnit.prototype);
    snd.WaveShaper.prototype.constructor = snd.Gain;

    snd.WaveShaper.prototype.connect = function(connectTo, indexIn, indexOut, id) {
        snd.AudioUnit.prototype.connect.apply(this, arguments);
        if (connectTo.getConnector != null) {
            this._output.connect(connectTo.getConnector(), indexIn, indexOut);
        } else {
            this._output.connect(connectTo, indexIn, indexOut);
        }
    };
    snd.WaveShaper.prototype.disconnect = function(disconnectFrom, indexIn, id) {
        snd.AudioUnit.prototype.disconnect.apply(this, arguments);
        if (disconnectFrom.getConnector != null) {
            this._output.disconnect(disconnectFrom.getConnector(), indexIn);
        } else {
            this._output.disconnect(disconnectFrom, indexIn);
        }
    };
    snd.WaveShaper.prototype.createStatus = function() {
        return new snd.WaveShaper.Status();
    };
    snd.WaveShaper.prototype.getConnector = function() {
        return this._connector;
    };
    snd.WaveShaper.prototype.loadData = function(data) {
        snd.AudioUnit.prototype.loadData.apply(this, arguments);

        this.curve = data.curve;
        this.oversample = data.oversample;
    };

    snd.WaveShaper.Status = function() {
        snd.AudioUnit.Status.apply(this, arguments);

        this.curve = null;
        this.oversample = snd.WaveShaper.OVERSAMPLE_NONE;
        this.gain = 1.0;
    };
    snd.WaveShaper.Status.prototype = Object.create(snd.AudioUnit.Status.prototype);
    snd.WaveShaper.Status.prototype.constructor = snd.WaveShaper.Status;
});
