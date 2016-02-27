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
            channelCount: {
                get: function() {
                    return this._status.channelCount;
                }
            }
        });

        this.setChannelCount(channels);
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
        this.setChannelCount(data.channelCount);
    };

    snd.ChannelMerger.prototype.createStatus = function() {
        return new snd.ChannelMerger.Status();
    };

    /**
     * @private
     */
    snd.ChannelMerger.prototype.setChannelCount = function(channelCount) {
        this._status.channelCount = (channelCount == null) ? snd.MAX_CHANNEL_COUNT : channelCount;
        if (this._merger != null)
            delete this._merger;
        this._merger = snd.AUDIO_CONTEXT.createChannelMerger(this._status.channelCount);
    };

    snd.ChannelMerger.Status = function() {
        snd.AudioUnit.Status.apply(this, arguments);
    };
    snd.ChannelMerger.Status.prototype = Object.create(snd.AudioUnit.Status);
    snd.ChannelMerger.Status.prototype.constructor = snd.ChannelMerger.Status;
    
    return snd;
}));
