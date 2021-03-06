
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
        define(['snd.Source'], factory);
    } else if (typeof exports === 'object') {
        // Node
    } else {
        // Browser globals (root is window)
        root.snd = factory(root.snd);
    }
}(this, function(snd) {
    snd.ScriptProcessor = function(id) {
        snd.AudioUnit.apply(this, arguments);

        Object.defineProperties(this, {
            inputChannels: {
                get: function() {
                    return this._status.inputChannels;
                },
                set: function(val) {
                    if (this._status.inputChannels != val) {
                        this._status.inputChannels = val;
                        this.resetScriptProcessor();
                    }
                }
            },
            outputChannels: {
                get: function() {
                    return this._status.outputChannels;
                },
                set: function(val) {
                    if (this._status.outputChannels != val) {
                        this._status.outputChannels = val;
                        this.resetScriptProcessor();
                    }
                }
            },
            bufferLength: {
                get: function() {
                    return this._status.bufferLength;
                },
                set: function(val) {
                    if (this._status.bufferLength != val) {
                        this._status.bufferLength = val;
                        this.resetScriptProcessor();
                    }
                }
            },
            script: {
                get: function() {
                    return this._status.script;
                },
                set: function(val) {
                    this._status.script = val;
                }
            }
        });

        this.resetScriptProcessor();
    };
    snd.ScriptProcessor.prototype = Object.create(snd.Source.prototype);
    snd.ScriptProcessor.prototype.constructor = snd.ScriptProcessor;

    snd.ScriptProcessor.CLASS_NAME = "snd.SciptProcessorUnit";

    snd.ScriptProcessor.prototype.resetScriptProcessor = function() {
        var _this = this;

        this._gain.channelCount = this._status.outputChannels;

        if (this._unit != null) {
            this._unit.disconnect(this._gain);
            delete this._unit;
        }
        this._unit = snd.AUDIO_CONTEXT.createScriptProcessor(this._status.bufferLength, this._status.inputChannels, this._status.outputChannels);
        this._unit.onaudioprocess = function(evt) {
            if (_this.script != null) {
                if (typeof (_this.script) == "function") {
                    _this._status.script(evt);
                } else {
                    eval(_this._status.script);
                }
            }
        };

        this._unit.connect(this._gain);
    };
    
    snd.ScriptProcessor.prototype.getParamDescription = function() {
        var ret = snd.Source.prototype.getParamDescription.apply(this, arguments);
        
        ret.bufferLength = {
            type: snd.params.type.ENUM,
            value: [
                0,
                256,
                512,
                1024,
                2048,
                4096,
                8192,
                16384
            ],
            default: 4096
        };
        ret.script = {
            type: snd.params.type.VALUE,
            default: undefined,
            max: undefined,
            min: undefined
        };
        
        return ret;
    };
    
    snd.ScriptProcessor.prototype.getConnector = function() {
        return this._unit;
    };
    
    snd.ScriptProcessor.prototype.getOutputConnector = function() {
        return this._gain;
    };

    snd.ScriptProcessor.prototype.createStatus = function() {
        var ret = snd.AudioUnit.prototype.createStatus.call(this);
        
        ret.className = "snd.ScriptProcessor";
        
        return ret;
    };

    snd.ScriptProcessor.prototype.loadData = function(data) {
        snd.Source.prototype.loadData.apply(this, arguments);

        this._status.inputChannels = (data.inputChannels > 0) ? data.inputChannels : 0;
        this._status.outputChannels = (data.outputChannels > 0) ? data.outputChannels : 0;
        this._status.bufferLength = (data.bufferLength > 0) ? data.bufferLength : 0;
        this._status.script = (data.script != null) ? data.script : "";

        this.resetScriptProcessor();
    };

    snd.ScriptProcessor.loadJSON = function(json) {
        var data = JSON.parse(json);
        if (data.className != snd.ScriptProcessor.CLASS_NAME) {
            throw new snd.Exception(data.id + " is not instanceof 'snd.ScriptProcessorUnit'.");
        }

        var ret = new snd.ScriptProcessor(data.id);
        ret.loadData(data);

        return ret;
    };
    
    return snd;
}));
