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
    var calcNoise = function(buffer) {
        for (var ch = 0; ch < buffer.numberOfChannels; ch++) {
            var chBuf = buffer.getChannelData(ch);
            
            for (var i = 0; i < buffer.length; i++) {
                chBuf[i] = Math.random() * 2.0 - 1.0;
            }
        }
    };
    
    snd.Noise = function(id, bufferLength, channel) {
        snd.AudioUnit.apply(this, arguments);

        this._noise = snd.AUDIO_CONTEXT.createScriptProcessor(
                (!bufferLength) ? 1024 : bufferLength,
                1,
                (!channel) ? 1 : channel);
        this._gain = snd.AUDIO_CONTEXT.createGain();
        
        this._gain.channelCount = (!channel) ? 1 : channel;
        this._noise.onaudioprocess = function(evt) {
            calcNoise(evt.outputBuffer);
        };
        
        this._noise.connect(this._gain);

        /* DEFINE PROPERTIES */
        Object.defineProperties(this, {
            channelCount: {
                get: function() {
                    return this._status.channelCount;
                }
            },
            volume: {
                get: function() {
                    return this._gain.gain.value;
                },
                set: function(val) {
                    this._gain.gain.value = val;
                    this._status.gain = val;
                }
            },
            volumeParam: {
                get: function() {
                    var ret = this._gain.gain;
                    ret.id = this.id + ".gain";
                    return ret;
                }
            }
        });
    };
    snd.Noise.prototype = Object.create(snd.AudioUnit.prototype);
    snd.Noise.prototype.constructor = snd.Noise;
    
    snd.Noise.prototype.getParamDescription = function() {
        var ret = snd.AudioUnit.prototype.getParamDescription.apply(this, arguments);
        
        ret.volume = {
            type: snd.params.type.VALUE,
            default: 1.0,
            max: Infinity,
            min: -Infinity
        };
        ret.volumeParam = {
            type: snd.params.type.AUDIO_PARAM,
            value: this.volumeParam,
            default: ret.volume.default,
            max: ret.volume.max,
            min: ret.volume.min
        }
        
        return ret;
    };
    
    snd.Noise.prototype.createStatus = function() {
        return new snd.Noise.Status();
    };
    
    snd.Noise.prototype.getConnector = function() {
        return undefined;
    };
    
    snd.Noise.prototype.getOutputConnector = function() {
        return this._gain;
    }
    
    snd.Noise.prototype.loadData = function(data) {
        snd.AudioUnit.prototype.loadData.apply(this, arguments);

        this.gain = data.gain;
    };

    snd.Noise.Status = function() {
        snd.AudioUnit.Status.apply(this, arguments);
        this.gain = 1.0;
        this.channelCount = 1;
    };
    snd.Noise.Status.prototype = Object.create(snd.AudioUnit.Status.prototype);
    snd.Noise.Status.prototype.constructor = snd.Noise.Status;
    
    return snd;
}));
