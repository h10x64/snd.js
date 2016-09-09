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
        var ret = snd.AudioUnit.prototype.getParamDescription.apply(this, arguments);
        
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
        var ret = snd.AudioUnit.prototype.createStatus.call(this);
        
        ret.className = "snd.Gain";
        
        return ret;
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
    
    return snd;
}));
