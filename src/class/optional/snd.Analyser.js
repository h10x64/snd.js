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

    snd.Analyser.prototype.getParamDescription = function() {
        var ret = snd.AudioUnit.prototype.getParamDescription.call(this, arguments);

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
        var ret = snd.AudioUnit.prototype.createStatus.call(this);
        
        ret.className = "snd.Analyser";
        
        return ret;
    };

    snd.Analyser.prototype.getConnector = function() {
        return this._analyser;
    };

    snd.Analyser.prototype.getOutputConnector = function() {
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

    return snd;
}));
