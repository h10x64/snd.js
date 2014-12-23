
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
    snd.DynamicsCompressor = function(id) {
        snd.AudioUnit.apply(this, arguments);

        this._output = snd.AUDIO_CONTEXT.createGain();
        this._connector = snd.AUDIO_CONTEXT.createGain();
        this._compressor = snd.AUDIO_CONTEXT.createDynamicsCompressor();

        this._connector.connect(this._compressor);
        this._compressor.connect(this._output);

        /* DEFINE PROPERTIES */
        Object.defineProperties(this, {
            channelCount: {
                get: function() {
                    return this._status.channelCount;
                },
                set: function(val) {
                    this._connector.channelCount = val;
                    this._output.channelCount = val;
                    this._compressor.channelCount = val;
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
                    this._compressor.channelCountMode = val;
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
                    this._compressor.channelInterpretation = val;
                    this._status.channelInterpretation = val;
                }
            },
            attack: {
                get: function() {
                    return this._compressor.attack.value;
                },
                set: function(val) {
                    this._compressor.attack.value = val;
                    this._status.attack = val;
                }
            },
            attackParam: {
                get: function() {
                    var ret = this._compressor.attack;
                    ret.id = this.id + ".attack";
                    return ret;
                }
            },
            knee: {
                get: function() {
                    return this._compressor.knee.value;
                },
                set: function(val) {
                    this._compressor.knee.value = val;
                    this._status.knee = val;
                }
            },
            kneeParam: {
                get: function() {
                    var ret = this._compressor.knee;
                    ret.id = this.id + ".knee";
                    return ret;
                }
            },
            ratio: {
                get: function() {
                    return this._compressor.ratio.value;
                },
                set: function(val) {
                    this._compressor.ratio.value = val;
                    this._status.ratio = val;
                }
            },
            ratioParam: {
                get: function() {
                    var ret = this._compressor.ratio;
                    ret.id = this.id + ".ratio";
                    return ret;
                }
            },
            reduction: {
                get: function() {
                    return this._compressor.reduction.value;
                }
            },
            release: {
                get: function() {
                    return this._compressor.release.value;
                },
                set: function(val) {
                    this._compressor.release.value = val;
                    this._status.release = val;
                }
            },
            releaseParam: {
                get: function() {
                    var ret = this._compressor.release;
                    ret.id = this.id + ".release";
                    return ret;
                }
            },
            threshold: {
                get: function() {
                    return this._compressor.threshold.value;
                },
                set: function(val) {
                    this._compressor.threshold.value = val;
                    this._status.threshold = val;
                }
            },
            thresholdParam: {
                get: function() {
                    var ret = this._compressor.threshold;
                    ret.id = this.id + ".threshold";
                    return ret;
                }
            },
        });
    };
    snd.DynamicsCompressor.prototype = Object.create(snd.AudioUnit.prototype);
    snd.DynamicsCompressor.prototype.constructor = snd.Gain;
    snd.DynamicsCompressor.prototype.connect = function(connectTo, indexIn, indexOut, id) {
        snd.AudioUnit.prototype.connect.apply(this, arguments);
        if (connectTo.getConnector != null) {
            this._output.connect(connectTo.getConnector(), indexIn, indexOut);
        } else {
            this._output.connect(connectTo, indexIn, indexOut);
        }
    };
    snd.DynamicsCompressor.prototype.disconnect = function(disconnectFrom, indexIn, id) {
        snd.AudioUnit.prototype.disconnect.apply(this, arguments);
        if (disconnectFrom.getConnector != null) {
            this._output.disconnect(disconnectFrom.getConnector(), indexIn);
        } else {
            this._output.disconnect(disconnectFrom, indexIn);
        }
    };
    snd.DynamicsCompressor.prototype.createStatus = function() {
        return new snd.DynamicsCompressor.Status();
    };
    snd.DynamicsCompressor.prototype.getConnector = function() {
        return this._connector;
    };
    snd.DynamicsCompressor.prototype.loadData = function(data) {
        snd.AudioUnit.prototype.loadData.apply(this, arguments);

        this.attack = data.attack;
        this.knee = data.knee;
        this.ratio = data.ratio;
        this.threshold = data.threshold;
        this.release = data.release;
    };

    snd.DynamicsCompressor.Status = function() {
        snd.AudioUnit.Status.apply(this, arguments);

        this.attack = 0.003;
        this.knee = 30;
        this.ratio = 12;
        this.threshold = -24;
        this.release = 0.250;
    };
    snd.DynamicsCompressor.Status.prototype = Object.create(snd.AudioUnit.Status.prototype);
    snd.DynamicsCompressor.Status.prototype.constructor = snd.DynamicsCompressor.Status;
});
