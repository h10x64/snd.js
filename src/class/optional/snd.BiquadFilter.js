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
    snd.BiquadFilter = function(id) {
        snd.AudioUnit.apply(this, arguments);

        this._connector = snd.AUDIO_CONTEXT.createGain();
        this._output = snd.AUDIO_CONTEXT.createGain();
        this._filter = snd.AUDIO_CONTEXT.createBiquadFilter();

        this._connector.connect(this._filter);
        this._filter.connect(this._output);

        /* DEFINE PROPERTIES */
        Object.defineProperties(this, {
            channelCount: {
                get: function() {
                    return this._status.channelCount;
                },
                set: function(val) {
                    this._connector.channelCount = val;
                    this._output.channelCount = val;
                    this._filter.channelCount = val;
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
                    this._filter.channelCountMode = val;
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
                    this._filter.channelInterpretation = val;
                    this._status.channelInterpretation = val;
                }
            },
            type: {
                get: function() {
                    return this._filter.type;
                },
                set: function(val) {
                    this._filter.type = val;
                    this._status.type = val;
                }
            },
            frequency: {
                get: function() {
                    return this._filter.frequency.value;
                },
                set: function(val) {
                    var v = parseFloat(val);
                    this._filter.frequency.value = v;
                    this._status.frequency = v;
                }
            },
            frequencyParam: {
                get: function() {
                    return this.modAudioParam("frequency", this._filter.frequency)
                }
            },
            detune: {
                get: function() {
                    return this._filter.detune.value;
                },
                set: function(val) {
                    var v = parseFloat(val);
                    this._filter.detune.value = v;
                    this._status.detune = v;
                }
            },
            detuneParam: {
                get: function() {
                    return this.modAudioParam("detune", this._filter.detune);
                }
            },
            Q: {
                get: function() {
                    return this._filter.Q.value;
                },
                set: function(val) {
                    var v = parseFloat(val);
                    this._filter.Q.value = v;
                    this._status.Q = v;
                }
            },
            QParam: {
                get: function() {
                    return this.modAudioParam("q", this._filter.Q);
                }
            },
            gain: {
                get: function() {
                    return this._filter.gain.value;
                },
                set: function(val) {
                    var v = parseFloat(val);
                    this._filter.gain.value = v;
                    this._status.gain = v;
                }
            },
            gainParam: {
                get: function() {
                    return this.modAudioParam("gain", this._filter.gain);
                }
            }
        });
    };
    snd.BiquadFilter.prototype = Object.create(snd.AudioUnit.prototype);
    snd.BiquadFilter.prototype.constructor = snd.BiquadFilter;

    snd.BiquadFilter.prototype.connect = function(connectTo, indexIn, indexOut, id) {
        snd.AudioUnit.prototype.connect.apply(this, arguments);
        if (connectTo.getConnector != null) {
            this._output.connect(connectTo.getConnector(), indexIn, indexOut);
        } else {
            this._output.connect(connectTo, indexIn, indexOut);
        }
    };
    
    snd.BiquadFilter.prototype.disconnect = function(disconnectFrom, indexIn, id) {
        snd.AudioUnit.prototype.disconnect.apply(this, arguments);
        if (disconnectFrom.getConnector != null) {
            this._output.disconnect(disconnectFrom.getConnector(), indexIn);
        } else {
            this._output.disconnect(disconnectFrom, indexIn);
        }
    };
    
    snd.BiquadFilter.prototype.createStatus = function() {
        return new snd.BiquadFilter.Status();
    };
    
    snd.BiquadFilter.prototype.getConnector = function() {
        return this._connector;
    };
    
    snd.BiquadFilter.prototype.getParamDescription = function() {
        var ret = snd.AudioUnit.prototype.getParamDescription.apply(this, arguments);
        
        ret.type = {
            type: snd.params.type.ENUM,
            value: [
                snd.LOWPASS,
                snd.HIGHPASS,
                snd.BANDPASS,
                snd.LOWSHELF,
                snd.HIGHSHELF,
                snd.PEAKING,
                snd.NOTCH,
                snd.ALLPASS
            ],
            default: snd.LOWPASS
        };
        ret.frequency = {
            type: snd.params.type.VALUE,
            default: 350,
            max: Infinity,
            min: -Infinity
        };
        ret.detune = {
            type: snd.params.type.VALUE,
            default: 0,
            max: Infinity,
            min: -Infinity
        };
        ret.Q = {
            type: snd.params.type.VALUE,
            default: 1.0,
            max: Infinity,
            min: -Infinity
        };
        ret.gain = {
            type: snd.params.type.VALUE,
            default: 0,
            max: Infinity,
            min: -Infinity
        };
        ret.frequencyParam = {
            type: snd.params.type.AUDIO_PARAM,
            value: this.frequencyParam,
            default: ret.frequency.default,
            max: ret.frequency.max,
            min: ret.frequency.min
        };
        ret.detuneParam = {
            type: snd.params.type.AUDIO_PARAM,
            value: this.detuneParam,
            default: ret.detune.default,
            max: ret.detune.max,
            min: ret.detune.min
        };
        ret.QParam = {
            type: snd.params.type.AUDIO_PARAM,
            value: this.QParam,
            default: ret.Q.default,
            max: ret.Q.max,
            min: ret.Q.min
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
    
    snd.BiquadFilter.prototype.loadData = function(data) {
        snd.AudioUnit.prototype.loadData.apply(this, arguments);

        // PLEASE WRITE LOADING METHODS HERE
    };

    snd.BiquadFilter.Status = function() {
        snd.AudioUnit.Status.apply(this, arguments);

        this.type = snd.LOWPASS;
        this.frequency = 350;
        this.detune = 0;
        this.Q = 1.0;
        this.gain = 0;
    };
    snd.BiquadFilter.Status.prototype = Object.create(snd.AudioUnit.Status.prototype);
    snd.BiquadFilter.Status.prototype.constructor = snd.BiquadFilter.Status;
    
    return snd;
}));

