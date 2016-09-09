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

    snd.MediaStreamAudioDestination = function(id) {
        snd.AudioUnit.apply(this, arguments);
        
        this._dest = snd.AUDIO_CONTEXT.createMediaStreamDestination();
        this._gain = snd.AUDIO_CONTEXT.createGain();
        
        this._gain.connect(this._dest);
        
        Object.defineProperties(this, {
            volume: {
                get: function() {
                    return this._gain.gain.value;
                },
                set: function(val) {
                    this._gain.gain.value = val;
                }
            },
            volumeParam: {
                get: function() {
                    return this._gain.gain;
                }
            },
            stream: {
                get: function() {
                    return this._dest.stream;
                }
            }
        });
    };
    snd.MediaStreamAudioDestination.prototype = Object.create(snd.AudioUnit.prototype);
    snd.MediaStreamAudioDestination.prototype.constructor = snd.MediaStreamAudioDestination;

    snd.MediaStreamAudioDestination.prototype.getConnector = function() {
        return this._gain;
    };
    
    snd.MediaStreamAudioDestination.prototype.getOutputConnector = function() {
        return undefined;
    };
    
    snd.STREAM_MASTER = new snd.MediaStreamAudioDestination("STREAM_MASTER");
    
    snd.MediaStreamAudioDestination.prototype.getParamDescription = function() {
        var ret = snd.Source.prototype.getParamDescription.apply(this, arguments);

        ret.volume = {
            type: snd.params.type.AUDIO_PARAM,
            value: this.gainParam,
            default: 1.0,
            max: Infinity,
            min: -Infinity
        };
        ret.stream = {
            type: snd.params.type.VALUE,
            default: undefined,
            max: undefined,
            min: undefined
        };

        return ret;
    };
    
    snd.MediaStreamAudioDestination.prototype.createStatus = function() {
        var ret = snd.AudioUnit.prototype.createStatus.call(this);
        
        ret.className = "snd.MediaStreamAudioDestination";
        
        return ret;
    }

    return snd;
}));
