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
    
    snd.Analyser = function(id) {
        snd.AudioUnit.apply(this, arguments);

        this._analyser = snd.AUDIO_CONTEXT.createAnalyser();
        this.resetBufferSize();

        /* DEFINE PROPERTIES */
        Object.defineProperties(this, {
            channelCount: {
                get: function() {
                    return this._status.channelCount;
                },
                set: function(val) {
                    this._output.channelCount = val;
                    this._connector.channelCount = val;
                    this._analyser.channelCount = val;
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
                    this._analyser.channelCountMode = val;
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
                    this._analyser.channelInterpretation = val;
                    this._status.channelInterpretation = val;
                }
            },
            floatFrequencyData: {
                get: function() {
                    this._analyser.getFloatFrequencyData(this._floatFrequencyDataBuffer);
                    return this._floatFrequencyDataBuffer;
                }
            },
            byteFrequencyData: {
                get: function() {
                    this._analyser.getByteFrequencyData(this._byteFrequencyDataBuffer);
                    return this._byteFrequencyDataBuffer;
                }
            },
            floatTimeDomainData: {
                get: function() {
                    this._analyser.getFloatTimeDomainData(this._floatTimeDomainDataBuffer);
                    return this._floatTimeDomainDataBuffer;
                }
            },
            byteTimeDomainData: {
                get: function() {
                    this._analyser.getByteTimeDomainData(this._byteTimeDomainDataBuffer);
                    return this._byteTimeDomainDataBuffer;
                }
            },
            fftSize: {
                get: function() {
                    return this._analyser.fftSize;
                },
                set: function(val) {
                    var v = parseInt(val);
                    this._analyser.fftSize = v;
                    this.resetBufferSize();
                }
            },
            frequencyBinCount: {
                get: function() {
                    return this._analyser.frequencyBinCount;
                }
            },
            minDecibels: {
                get: function() {
                    return this._analyser.minDecibels;
                },
                set: function(val) {
                    var v = parseFloat(val);
                    this._analyser.minDecibels = v;
                }
            },
            maxDecibels: {
                get: function() {
                    return this._analyser.maxDecibels;
                },
                set: function(val) {
                    var v = parseFloat(val);
                    this._analyser.maxDecibels = v;
                }
            },
            smoothingTimeConstant: {
                get: function() {
                    return this._analyser.smoothingTimeConstant;
                },
                set: function(val) {
                    var v = parseFloat(val);
                    this._analyser.smoothingTimeConstant = v;
                }
            }
        });

        this._status.smoothingTimeConstant = this._analyser.smoothingTimeConstant;
        this._status.fftSize = this._analyser.fftSize;
        this._status.maxDecibels = this._analyser.maxDecibels;
        this._status.minDecibels = this._analyser.minDecibels;
    };
    snd.Analyser.prototype = Object.create(snd.AudioUnit.prototype);
    snd.Analyser.prototype.constructor = snd.Analyser;
    
    snd.Analyser.prototype.connect = function(connectTo, indexIn, indexOut, id) {
        snd.AudioUnit.prototype.connect.apply(this, arguments);
        if (connectTo.getConnector != null) {
            this._analyser.connect(connectTo.getConnector(), indexIn, indexOut);
        } else {
            this._analyser.connect(connectTo, indexIn, indexOut);
        }
    };
    
    snd.Analyser.prototype.disconnect = function(disconnectFrom, indexIn, id) {
        snd.AudioUnit.prototype.disconnect.apply(this, arguments);
        if (disconnectFrom.getConnector != null) {
            this._analyser.disconnect(disconnectFrom.getConnector(), indexIn);
        } else {
            this._analyser.disconnect(disconnectFrom, indexIn);
        }
    };
    
    snd.Analyser.prototype.getParamDescription = function() {
        var ret = snd.AudioUnit.prototype.getParamDescription.apply(this, arguments);
        
        ret.floatFrequencyData = {
            type: snd.params.type.READ_ONLY
        };
        ret.byteFrequencyData = {
            type: snd.params.type.READ_ONLY
        };
        ret.floatTimeDomainData = {
            type: snd.params.type.READ_ONLY
        };
        ret.byteTimeDomainData = {
            type: snd.params.type.READ_ONLY
        };
        ret.fftSize = {
            type: snd.params.type.VALUE,
            default: 2048,
            max: undefined,
            min: 2
        };
        ret.frequencyBinCount = {
            type: snd.params.type.READ_ONLY
        };
        ret.minDecibels = {
            type: snd.params.type.VALUE,
            default: -100,
            max: Infinity,
            min: -Infinity
        };
        ret.maxDecibels = {
            type: snd.params.type.VALUE,
            default: -30,
            max: Infinity,
            min: -Infinity
        };
        ret.smoothingTimeConstant = {
            type: snd.params.type.VALUE,
            default: 0.1,
            max: Infinity,
            min: -Infinity
        };
        
        return ret;
    };
    
    snd.Analyser.prototype.createStatus = function() {
        return new snd.Analyser.Status();
    };
    
    snd.Analyser.prototype.getConnector = function() {
        return this._analyser;
    };
    
    snd.Analyser.prototype.loadData = function(data) {
        snd.AudioUnit.prototype.loadData.apply(this, arguments);

        this.fftSize = data.fftSize;
        this.maxDecibels = data.maxDecibels;
        this.smoothingTimeConstant = data.smoothingTimeConstant;
    };

    snd.Analyser.prototype.resetBufferSize = function() {
        this._byteFrequencyDataBuffer = new Uint8Array(this._analyser.frequencyBinCount);
        this._floatFrequencyDataBuffer = new Float32Array(this._analyser.frequencyBinCount);
        this._byteTimeDomainDataBuffer = new Uint8Array(this._analyser.fftSize);
        this._floatTimeDomainDataBuffer = new Float32Array(this._analyser.fftSize);
    };

    snd.Analyser.Status = function() {
        snd.AudioUnit.Status.apply(this, arguments);

        this.fftSize = 2048;
        this.maxDecibels = -30;
        this.minDecibels = -100;
        this.smoothingTimeConstant = 0.1;
    };
    snd.Analyser.Status.prototype = Object.create(snd.AudioUnit.Status.prototype);
    snd.Analyser.Status.prototype.constructor = snd.Analyser.Status;
    
    return snd;
}));
