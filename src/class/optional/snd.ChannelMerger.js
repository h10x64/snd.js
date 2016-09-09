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
    snd.ChannelMerger = function(id, channels) {
        snd.AudioUnit.apply(this, arguments);
        
        Object.defineProperties(this, {
            numberOfInputs: {
                get: function() {
                    return this._status.numberOfInputs;
                },
                set: function(val) {
                    this._setNumberOfInputs(val);
                }
            }
        });

        this._setNumberOfInputs(channels);
    };
    snd.ChannelMerger.prototype = Object.create(snd.AudioUnit.prototype);
    snd.ChannelMerger.prototype.constructor = snd.ChannelMerger;

    snd.ChannelMerger.prototype.getConnector = function() {
        return this._merger;
    };
    
    snd.ChannelMerger.prototype.getOutputConnector = function() {
        return this._merger;
    };

    snd.ChannelMerger.prototype.loadData = function(data) {
        snd.AudioUnit.prototype.loadData.apply(this, arguments);
        this.numberOfInputs = data.numberOfInputs;
    };
    
    snd.ChannelMerger.prototype.getParamDescription = function() {
        var ret = snd.Source.prototype.getParamDescription.apply(this, arguments);
        
        ret.numberOfInputs = {
          type: snd.params.type.VALUE,
          default: 6,
          max: snd.MAX_CHANNEL_COUNT,
          min: 1,
          loader: function(obj, val) {
            obj.numberOfInputs = val;
          }
        };
        
        return ret;
    };

    snd.ChannelMerger.prototype.createStatus = function() {
        var ret = snd.AudioUnit.prototype.createStatus.call(this);
        
        ret.className = "snd.ChannelMerger";
        
        return ret;
    };

    /**
     * @private
     */
    snd.ChannelMerger.prototype._setNumberOfInputs = function(channelCount) {
        this._status.channelCount = (channelCount == null) ? snd.MAX_CHANNEL_COUNT : channelCount;
        if (this._merger != null)
            delete this._merger;
        this._merger = snd.AUDIO_CONTEXT.createChannelMerger(this._status.channelCount);
    };

    return snd;
}));
