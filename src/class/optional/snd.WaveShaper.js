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
                min: -Inifinity
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
    
    return snd;
}));
