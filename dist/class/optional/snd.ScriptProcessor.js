
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
    snd.ScriptProcessor = function(id) {
        snd.Source.apply(this, arguments);

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

    snd.ScriptProcessor.prototype.createStatus = function() {
        return new snd.ScriptProcessor.Status();
    };

    snd.ScriptProcessor.prototype.toJSON = function() {
        return this._status;
    }

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

    snd.ScriptProcessor.Status = function() {
        snd.Source.Status.apply(this, arguments);

        this.className = snd.ScriptProcessor.CLASS_NAME;
        this.isSource = true;

        this.inputChannels = 0;
        this.outputChannels = 1;
        this.bufferLength = 4096;
        this.script = "";
    };
    snd.ScriptProcessor.Status.prototype = Object.create(snd.Source.prototype);
    snd.ScriptProcessor.Status.prototype.constructor = snd.ScriptProcessor.Status;
});