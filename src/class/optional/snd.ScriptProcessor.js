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
    
    return snd;
}));
