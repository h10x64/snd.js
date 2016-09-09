
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
    snd.Delay = function(id) {
        snd.AudioUnit.apply(this, arguments);

        this._output = snd.AUDIO_CONTEXT.createGain();
        this._connector = snd.AUDIO_CONTEXT.createGain();

        this._delay = snd.AUDIO_CONTEXT.createDelay(this._status.maxDelayTime);
        this._delay.delayTime.value = 0;

        this._connector.connect(this._delay);
        this._delay.connect(this._output);

        /* DEFINE PROPERTIES */
        Object.defineProperties(this, {
            maxDelay: {
                get: function() {
                    return this._status.maxDelay;
                },
                set: function(val) {
                    var v = parseFloat(val);
                    if (v > 0 && v < 180) {
                        this._connector.disconnect(this._delay);
                        delete this._delay;

                        this._delay = snd.AUDIO_CONTEXT.createDelay(v);
                        this.delayTime = this._status.delayTime;

                        this._connector.connect(this._delay);
                        this._delay.connect(this._output);

                        this._status.maxDelay = v;
                    } else {
                        if (v < 0) {
                            cosole.log("maxDelay must grater than 0")
                        } else {
                            console.log("maxDelay must lesser than 180");
                        }
                    }
                }
            },
            delayTime: {
                get: function() {
                    return this._status.delayTime;
                },
                set: function(val) {
                    var v = parseFloat(val);
                    if (v >= 0 && v < 180) {
                        this._delay.delayTime.value = v;
                        this._status.delayTime = v;
                    } else {
                        if (v < 0) {
                            cosole.log("delayTime must grater than 0")
                        } else {
                            console.log("delayTime must lesser than 180");
                        }
                    }
                }
            },
            delayTimeParam: {
                get: function() {
                    return this.modAudioParam("delayTime", this._delay.delayTime);
                }
            }
        });
    };
    snd.Delay.prototype = Object.create(snd.AudioUnit.prototype);
    snd.Delay.prototype.constructor = snd.Delay;
    
    snd.Delay.prototype.getParamDescription = function() {
        var ret = snd.AudioUnit.prototype.getParamDescription.apply(this, arguments);
        
        ret.maxDelayTime = {
            type: snd.params.type.VALUE,
            default: 60,
            max: 180,
            min: 0
        }
        ret.delayTime = {
            type: snd.params.type.VALUE,
            default: 0,
            max: ret.maxDelayTime.max,
            min: 0
        };
        ret.delayTimeParam = {
            type: snd.params.type.AUDIO_PARAM,
            default: ret.delayTime.default,
            max: ret.delayTime.max,
            min: ret.delayTime.min
        };
        
        return ret;
    };
    
    snd.Delay.prototype.createStatus = function() {
        var ret = snd.AudioUnit.prototype.createStatus.call(this);
        
        ret.className = "snd.Delay";
        
        return ret;
    };
    
    snd.Delay.prototype.getConnector = function() {
        return this._connector;
    };
    
    snd.Delay.prototype.getOutputConnector = function() {
        return this._output;
    };
    
    snd.Delay.prototype.loadData = function(data) {
        snd.AudioUnit.prototype.loadData.apply(this, arguments);

        this.maxDelayTime = data.maxDelayTime;
        this.delayTime = data.delayTime;
    };

    return snd;
}));
