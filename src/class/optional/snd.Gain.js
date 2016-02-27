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
    snd.Gain = function(id) {
        snd.AudioUnit.apply(this, arguments);

        this._gain = snd.AUDIO_CONTEXT.createGain();
        this._gain.channelCount = this._status.channelCount;

        /* DEFINE PROPERTIES */
        Object.defineProperties(this, {
            channelCount: {
                get: function() {
                    return this._status.channelCount;
                },
                set: function(val) {
                    this._gain.channelCount = val;
                    this._status.channelCount = val;
                }
            },
            channelCountMode: {
                get: function() {
                    return this._status.channelCountMode;

                },
                set: function(val) {
                    this._gain.channelCountMode = val;
                    this._status.channelCountMode = val;
                }
            },
            channelInterpretation: {
                get: function() {
                    return this._status.channelInterpretation;
                },
                set: function(val) {
                    this._gain.channelInterpretation = val;
                    this._status.channelInterpretation = val;
                }
            },
            gain: {
                get: function() {
                    return this._gain.gain.value;
                },
                set: function(val) {
                    var v = parseFloat(val);
                    this._gain.gain.value = v;
                    this._status.gain = v;
                }
            },
            gainParam: {
                get: function() {
                    return this.modAudioParam("gain", this._gain.gain);
                }
            }
        });
    };
    snd.Gain.prototype = Object.create(snd.AudioUnit.prototype);
    snd.Gain.prototype.constructor = snd.Gain;
    
    snd.Gain.prototype.getParamDescription = function() {
        var ret = snd.AudioUnit.prototype.getAudioParams.apply(this, arguments);
        
        ret.gain = {
            type: snd.params.type.AUDIO_PARAM,
            value: this.gainParam,
            default: 1.0,
            max: Infinity,
            min: -Infinity
        };
        
        return ret;
    };
    
    snd.Gain.prototype.createStatus = function() {
        return new snd.Gain.Status();
    };
    
    snd.Gain.prototype.getConnector = function() {
        return this._gain;
    };
    
    snd.Gain.prototype.getOutputConnector = function() {
        return this._gain;
    };
    
    snd.Gain.prototype.loadData = function(data) {
        snd.AudioUnit.prototype.loadData.apply(this, arguments);

        this.gain = data.gain;
    };

    snd.Gain.Status = function() {
        snd.AudioUnit.Status.apply(this, arguments);
        this.gain = 1.0;
    };
    snd.Gain.Status.prototype = Object.create(snd.AudioUnit.Status.prototype);
    snd.Gain.Status.prototype.constructor = snd.Gain.Status;
    
    return snd;
}));
