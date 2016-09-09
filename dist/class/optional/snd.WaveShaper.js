
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
    snd.WaveShaper = function(id) {
        snd.AudioUnit.apply(this, arguments);

        this._output = snd.AUDIO_CONTEXT.createGain();
        this._connector = snd.AUDIO_CONTEXT.createGain();
        this._shaper = snd.AUDIO_CONTEXT.createWaveShaper();

        this._connector.connect(this._shaper);
        this._shaper.connect(this._output);

        /* DEFINE PROPERTIES */
        Object.defineProperties(this, {
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
            },
            gainParam: {
                get: function() {
                    return this.modAudioParam("gain", this._output.gain);
                }
            }
        });
    };
    snd.WaveShaper.prototype = Object.create(snd.AudioUnit.prototype);
    snd.WaveShaper.prototype.constructor = snd.WaveShaper;
    
    snd.WaveShaper.prototype.getParamDescription = function() {
        var ret = snd.AudioUnit.prototype.getParamDescription.apply(this, arguments);
        
            ret.curve = {
                type: snd.params.type.VALUE,
                default: undefined,
                max: undefined,
                min: undefined
            };
            ret.oversample = {
                type: snd.params.type.ENUM,
                value: [
                    snd.OVERSAMPLE_NONE,
                    snd.OVERSAMPLE_DOUBLE,
                    snd.OVERSAMPLE_QUAD
                ],
                default: snd.OVERSAMPLE_NONE
            };
            ret.gain = {
                type: snd.params.type.VALUE,
                default: 1.0,
                max: Infinity,
                min: -Infinity
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
    
    snd.WaveShaper.prototype.createStatus = function() {
        var ret = snd.AudioUnit.prototype.createStatus.call(this);
        
        ret.className = "snd.WaveShaper";
        
        return ret;
    };
    
    snd.WaveShaper.prototype.getConnector = function() {
        return this._connector;
    };
    
    snd.WaveShaper.prototype.getOutputConnector = function() {
        return this._output;
    };
    
    snd.WaveShaper.prototype.loadData = function(data) {
        snd.AudioUnit.prototype.loadData.apply(this, arguments);

        this.curve = data.curve;
        this.oversample = data.oversample;
    };
    
    return snd;
}));
