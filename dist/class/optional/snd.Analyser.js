
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
    snd.Analyser = function(id) {
        snd.AudioUnit.apply(this, arguments);

        this._analyser = snd.AUDIO_CONTEXT.createAnalyser();
        this.resetBufferSize();

        /* DEFINE PROPERTIES */
        Object.defineProperties(this, {
            channelCount: {
                get: function() {
                    return this._status.channelCount;
                },
                set: function(val) {
                    this._output.channelCount = val;
                    this._connector.channelCount = val;
                    this._analyser.channelCount = val;
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
                    this._analyser.channelCountMode = val;
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
                    this._analyser.channelInterpretation = val;
                    this._status.channelInterpretation = val;
                }
            },
            floatFrequencyData: {
                get: function() {
                    this._analyser.getFloatFrequencyData(this._floatFrequencyDataBuffer);
                    return this._floatFrequencyDataBuffer;
                }
            },
            byteFrequencyData: {
                get: function() {
                    this._analyser.getByteFrequencyData(this._byteFrequencyDataBuffer);
                    return this._byteFrequencyDataBuffer;
                }
            },
            floatTimeDomainData: {
                get: function() {
                    this._analyser.getFloatTimeDomainData(this._floatTimeDomainDataBuffer);
                    return this._floatTimeDomainDataBuffer;
                }
            },
            byteTimeDomainData: {
                get: function() {
                    this._analyser.getByteTimeDomainData(this._byteTimeDomainDataBuffer);
                    return this._byteTimeDomainDataBuffer;
                }
            },
            fftSize: {
                get: function() {
                    return this._analyser.fftSize;
                },
                set: function(val) {
                    var v = parseInt(val);
                    this._analyser.fftSize = v;
                    this.resetBufferSize();
                }
            },
            frequencyBinCount: {
                get: function() {
                    return this._analyser.frequencyBinCount;
                }
            },
            minDecibels: {
                get: function() {
                    return this._analyser.minDecibels;
                },
                set: function(val) {
                    var v = parseFloat(val);
                    this._analyser.minDecibels = v;
                }
            },
            maxDecibels: {
                get: function() {
                    return this._analyser.maxDecibels;
                },
                set: function(val) {
                    var v = parseFloat(val);
                    this._analyser.maxDecibels = v;
                }
            },
            smoothingTimeConstant: {
                get: function() {
                    return this._analyser.smoothingTimeConstant;
                },
                set: function(val) {
                    var v = parseFloat(val);
                    this._analyser.smoothingTimeConstant = v;
                }
            }
        });

        this._status.smoothingTimeConstant = this._analyser.smoothingTimeConstant;
        this._status.fftSize = this._analyser.fftSize;
        this._status.maxDecibels = this._analyser.maxDecibels;
        this._status.minDecibels = this._analyser.minDecibels;
    };
    snd.Analyser.prototype = Object.create(snd.AudioUnit.prototype);
    snd.Analyser.prototype.constructor = snd.Gain;
    snd.Analyser.prototype.connect = function(connectTo, indexIn, indexOut, id) {
        snd.AudioUnit.prototype.connect.apply(this, arguments);
        if (connectTo.getConnector != null) {
            this._analyser.connect(connectTo.getConnector(), indexIn, indexOut);
        } else {
            this._analyser.connect(connectTo, indexIn, indexOut);
        }
    };
    snd.Analyser.prototype.disconnect = function(disconnectFrom, indexIn, id) {
        snd.AudioUnit.prototype.disconnect.apply(this, arguments);
        if (disconnectFrom.getConnector != null) {
            this._analyser.disconnect(disconnectFrom.getConnector(), indexIn);
        } else {
            this._analyser.disconnect(disconnectFrom, indexIn);
        }
    };
    snd.Analyser.prototype.createStatus = function() {
        return new snd.Analyser.Status();
    };
    snd.Analyser.prototype.getConnector = function() {
        return this._analyser;
    };
    snd.Analyser.prototype.loadData = function(data) {
        snd.AudioUnit.prototype.loadData.apply(this, arguments);

        this.fftSize = data.fftSize;
        this.maxDecibels = data.maxDecibels;
        this.smoothingTimeConstant = data.smoothingTimeConstant;
    };

    snd.Analyser.prototype.resetBufferSize = function() {
        this._byteFrequencyDataBuffer = new Uint8Array(this._analyser.frequencyBinCount);
        this._floatFrequencyDataBuffer = new Float32Array(this._analyser.frequencyBinCount);
        this._byteTimeDomainDataBuffer = new Uint8Array(this._analyser.fftSize);
        this._floatTimeDomainDataBuffer = new Float32Array(this._analyser.fftSize);
    };

    snd.Analyser.Status = function() {
        snd.AudioUnit.Status.apply(this, arguments);

        this.fftSize = 2048;
        this.maxDecibels = -30;
        this.minDecibels = -100;
        this.smoothingTimeConstant = 0.1;
    };
    snd.Analyser.Status.prototype = Object.create(snd.AudioUnit.Status.prototype);
    snd.Analyser.Status.prototype.constructor = snd.Analyser.Status;
});
