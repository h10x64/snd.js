define(["snd.AudioUnit"], function(snd) {
    snd.ChannelSplitter = function(id, channelCount) {
        snd.AudioUnit.apply(this, arguments);

        Object.defineProperties(this, {
            channels: {
                get: function() {
                    return this._status.channels;
                }
            }
        });

        this.setChannelCount(channelCount);
    };

    snd.ChannelSplitter.prototype.connect = function(connectTo, indexIn, indexOut, id) {
        snd.AudioUnit.prototype.connect.apply(this, arguments);
        this._splitter.connect(connectTo, indexIn, indexOut, id);
    };

    snd.ChannelSplitter.prototype.disconnect = function(disconnectFrom, indexOut, id) {
        snd.AudioUnit.prototype.disconnect.apply(this, arguments);
        this._splitter.disconnect(disconnectFrom, indexOut, id);
    };

    snd.ChannelSplitter.prototype.getConnector = function() {
        return this._splitter;
    };

    snd.ChannelSplitter.prototype.loadData = function(data) {
        snd.AudioUnit.prototype.loadData.apply(this, arguments);

        this._setChannelCount(data.channelCount);
    };

    snd.ChannelSplitter.prototype.createStatus = function() {
        return new snd.ChannelSplitter.Status();
    }

    /**
     * @private
     */
    snd.ChannelSplitter.prototype._setChannelCount = function(channelCount) {
        this._status.channelCount = (channelCount == null) ? snd.MAX_CNANNEL_COUNT : channelCount;
        if (this._splitter != null)
            delete this._splitter;
        this._splitter = snd.AUDIO_CONTEXT.createChannelSplitter(this._status.channelCount);
    };

    snd.ChannelsSplitter.Status = function() {
        snd.AudioUnit.Status.apply(this);

        this.channelCount = 1;
    };
    snd.ChannelSplitter.Status.prototype = Object.create(snd.AudioUnit.Status.prototype);
    snd.ChannelSplitter.Status.prototype.constructor = snd.ChannelSplitter;
    
    return snd;
});
