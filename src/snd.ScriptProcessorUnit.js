
snd.ScriptProcessorUnit = function(id) {
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
snd.ScriptProcessorUnit.prototype = Object.create(snd.Source.prototype);
snd.ScriptProcessorUnit.prototype.constructor = snd.ScriptProcessorUnit;

snd.ScriptProcessorUnit.CLASS_NAME = "snd.SciptProcessorUnit";

snd.ScriptProcessorUnit.prototype.resetScriptProcessor = function() {
    var _this = this;
    
    if (this._unit != null) {
        this._unit.disconnect(this._gain);
        delete this._unit;
    }
    this._unit = snd.AUDIO_CONTEXT.createScriptProcessor(this._status.bufferLength, this._status.inputChannels, this._status.outputChannels);
    this._unit.onaudioprocess = function(evt) {
        if (_this.script != null) {
            eval(_this._status.script);
        }
    };
    
    this._unit.connect(this._gain);
};

snd.ScriptProcessorUnit.prototype.createStatus = function() {
    return new snd.ScriptProcessorUnit.Status();
};

snd.ScriptProcessorUnit.prototype.toJSON = function() {
    return this._status;
}

snd.ScriptProcessorUnit.prototype.loadData = function(data) {
    snd.Source.prototype.loadData.apply(this, arguments);
    
    this._status.inputChannels = (data.inputChannels > 0) ? data.inputChannels : 0;
    this._status.outputChannels = (data.outputChannels > 0) ? data.outputChannels : 0;
    this._status.bufferLength = (data.bufferLength > 0) ? data.bufferLength : 0;
    this._status.script = (data.script != null) ? data.script : "";
    
    this.resetScriptProcessor();
};

snd.ScriptProcessorUnit.loadJSON = function(json) {
    var data = JSON.parse(json);
    if (data.className != snd.ScriptProcessorUnit.CLASS_NAME) {
        throw new snd.Exception(data.id + " is not instanceof 'snd.ScriptProcessorUnit'.");
    }
    
    var ret = new snd.ScriptProcessorUnit(data.id);
    ret.loadData(data);
    
    return ret;
};

snd.ScriptProcessorUnit.Status = function() {
    snd.Source.Status.apply(this, arguments);
    
    this.className = snd.ScriptProcessorUnit.CLASS_NAME;
    this.isSource = true;
    
    this.inputChannels = 0;
    this.outputChannels = 1;
    this.bufferLength = 4096;
    this.script = "";
};
snd.ScriptProcessorUnit.Status.prototype = Object.create(snd.Source.prototype);
snd.ScriptProcessorUnit.Status.prototype.constructor = snd.ScriptProcessorUnit.Status;
