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
    snd.ChannelSplitter = function(id, channelCount) {
        snd.AudioUnit.apply(this, arguments);

        Object.defineProperties(this, {
            numberOfOutputs: {
                get: function() {
                    return this._status.numberOfOutputs;
                },
                set: function(val) {
                    this._setNumberOfOutputs(val);
                }
            }
        });

        this.setChannelCount(channelCount);
    };

    snd.ChannelSplitter.prototype.getConnector = function() {
        return this._splitter;
    };
    
    snd.ChannelSplitter.prototype.getOutputConnector = function() {
        return this._splitter;
    };

    snd.ChannelSplitter.prototype.loadData = function(data) {
        snd.AudioUnit.prototype.loadData.apply(this, arguments);

        this._setChannelCount(data.channelCount);
    };
    
    snd.ChannelMerger.prototype.getParamDescription = function() {
        var ret = snd.Source.prototype.getParamDescription.apply(this, arguments);
        
        ret.numberOfOutputs = {
          type: snd.params.type.VALUE,
          default: 6,
          max: snd.MAX_CHANNEL_COUNT,
          min: 1,
          loader: function(obj, val) {
            obj.numberOfOutputs = val;
          }
        };
        
        return ret;
    };

    snd.ChannelSplitter.prototype.createStatus = function() {
        var ret = snd.AudioUnit.prototype.createStatus.call(this);
        
        ret.className = "snd.ChannelSplitter";
        
        return ret;
    }

    /**
     * @private
     */
    snd.ChannelSplitter.prototype._setNumberOfOutputs = function(channelCount) {
        this._status.channelCount = (channelCount == null) ? snd.MAX_CNANNEL_COUNT : channelCount;
        if (this._splitter != null)
            delete this._splitter;
        this._splitter = snd.AUDIO_CONTEXT.createChannelSplitter(this._status.channelCount);
    };
    
    return snd;
}));
