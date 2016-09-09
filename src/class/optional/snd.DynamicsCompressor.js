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
    snd.DynamicsCompressor = function(id) {
        snd.AudioUnit.apply(this, arguments);

        this._output = snd.AUDIO_CONTEXT.createGain();
        this._connector = snd.AUDIO_CONTEXT.createGain();
        this._compressor = snd.AUDIO_CONTEXT.createDynamicsCompressor();

        this._connector.connect(this._compressor);
        this._compressor.connect(this._output);

        /* DEFINE PROPERTIES */
        Object.defineProperties(this, {
            attack: {
                get: function() {
                    return this._compressor.attack.value;
                },
                set: function(val) {
                    var v = parseFloat(val);
                    this._compressor.attack.value = v;
                    this._status.attack = v;
                }
            },
            attackParam: {
                get: function() {
                    return this.modAudioParam("attack", this._compressor.attack);
                }
            },
            knee: {
                get: function() {
                    return this._compressor.knee.value;
                },
                set: function(val) {
                    var v = parseFloat(val);
                    this._compressor.knee.value = v;
                    this._status.knee = v;
                }
            },
            kneeParam: {
                get: function() {
                    return this.modAudioParam("knee", this._compressor.knee);
                }
            },
            ratio: {
                get: function() {
                    return this._compressor.ratio.value;
                },
                set: function(val) {
                    var v = parseFloat(val);
                    this._compressor.ratio.value = v;
                    this._status.ratio = v;
                }
            },
            ratioParam: {
                get: function() {
                    return this.modAudioParam("ratio", this._compressor.ratio);
                }
            },
            reduction: {
                get: function() {
                    return this._compressor.reduction.value;
                }
            },
            release: {
                get: function() {
                    return this._compressor.release.value;
                },
                set: function(val) {
                    var v = parseFloat(val);
                    this._compressor.release.value = v;
                    this._status.release = v;
                }
            },
            releaseParam: {
                get: function() {
                    return this.modAudioParam("release", this._compressor.release);
                }
            },
            threshold: {
                get: function() {
                    return this._compressor.threshold.value;
                },
                set: function(val) {
                    var v = parseFloat(val);
                    this._compressor.threshold.value = v;
                    this._status.threshold = v;
                }
            },
            thresholdParam: {
                get: function() {
                    return this.modAudioParam("threshold", this._compressor.threshold);
                }
            }
        });
    };
    snd.DynamicsCompressor.prototype = Object.create(snd.AudioUnit.prototype);
    snd.DynamicsCompressor.prototype.constructor = snd.DynamicsCompressor;

    snd.DynamicsCompressor.prototype.getParamDescription = function() {
        var ret = snd.AudioUnit.prototype.getParamDescription.apply(this, arguments);

        ret.attack = {
            type: snd.params.type.VALUE,
            default: 0.003,
            max: 1.0,
            min: 0
        };
        ret.knee = {
            type: snd.params.type.VALUE,
            default: 30,
            max: 40,
            min: 0
        };
        ret.ratio = {
            type: snd.params.type.VALUE,
            default: 12,
            max: 20,
            min: 1
        };
        ret.reduction = {
            type: snd.params.type.READ_ONLY
        };
        ret.release = {
            type: snd.params.type.VALUE,
            default: 0.250,
            max: 1.0,
            min: 0
        };
        ret.threshold = {
            type: snd.params.type.VALUE,
            default: -24,
            max: 0,
            min: -100
        };
        
        ret.attackParam = {
            type: snd.params.type.AUDIO_PARAM,
            value: this.attackParam,
            default: ret.attack.default,
            max: ret.attack.max,
            min: ret.attack.min
        };
        ret.kneeParam = {
            type: snd.params.type.AUDIO_PARAM,
            value: this.kneeParam,
            default: ret.knee.default,
            max: ret.knee.max,
            min: ret.knee.min
        };
        ret.ratioParam = {
            type: snd.params.type.AUDIO_PARAM,
            value: this.ratioParam,
            default: ret.ratio.default,
            max: ret.ratio.max,
            min: ret.ratio.min
        };
        ret.releaseParam = {
            type: snd.params.type.AUDIO_PARAM,
            value: this.releaseParam,
            default: ret.release.default,
            max: ret.release.max,
            min: ret.release.min
        };
        ret.thresholdParam = {
            type: snd.params.type.AUDIO_PARAM,
            value: this.thresholdParam,
            default: ret.threshold.default,
            max: ret.threshold.max,
            min: ret.threshold.min
        };

        return ret;
    };

    snd.DynamicsCompressor.prototype.createStatus = function() {
        var ret = snd.AudioUnit.prototype.createStatus.call(this);
        
        ret.className = "snd.DynamicsCompressor";
        
        return ret;
    };

    snd.DynamicsCompressor.prototype.getConnector = function() {
        return this._connector;
    };
    
    snd.DynamicsCompressor.prototype.getOutputConnector = function() {
        return this._output;
    };

    snd.DynamicsCompressor.prototype.loadData = function(data) {
        snd.AudioUnit.prototype.loadData.apply(this, arguments);

        this.attack = data.attack;
        this.knee = data.knee;
        this.ratio = data.ratio;
        this.threshold = data.threshold;
        this.release = data.release;
    };

    return snd;
}));
