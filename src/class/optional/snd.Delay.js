snd.CLASS_DEF.push(function() {
    snd.Delay = function(id) {
        snd.AudioUnit.apply(this, arguments);

        this._output = snd.AUDIO_CONTEXT.createGain();
        this._connector = snd.AUDIO_CONTEXT.createGain();

        this._delay = snd.AUDIO_CONTEXT.createDelay(this._status.maxDelayTime);
        this._delay.delayTime.value = 0;

        this._connector.connect(this._delay);
        this._delay.connect(this._output);

        /* DEFINE PROPERTIES */
        Object.defineProperties(this, {
            channelCount: {
                get: function() {
                    return this._status.channelCount;
                },
                set: function(val) {
                    this._delay.channelCount = val;
                    this._output.channelCount = val;
                    this._connector.channelCount = val;
                    this._status.channelCount = val;
                }
            },
            channelCountMode: {
                get: function() {
                    return this._status.channelCountMode;
                },
                set: function(val) {
                    this._delay.channelCountMode = val;
                    this._status.channelCountMode = val;
                }
            },
            channelInterpretation: {
                get: function() {
                    return this._status.channelInterpretation;
                },
                set: function(val) {
                    this._delay.channelCountInterpretation = val;
                    this._status.channelInterpretation = val;
                }
            },
            maxDelay: {
                get: function() {
                    return this._status.maxDelay;
                },
                set: function(val) {
                    if (val > 0 && val < 180) {
                        this._connector.disconnect(this._delay);
                        delete this._delay;

                        this._delay = snd.AUDIO_CONTEXT.createDelay(val);
                        this._delay.delayTime.value = this._status.delayTime;

                        this._connector.connect(this._delay);
                        this._delay.connect(this._output);

                        this._status.maxDelay = val;
                    }
                }
            },
            delayTime: {
                get: function() {
                    return this._status.delayTime;
                },
                set: function(val) {
                    if (val >= 0 && val < 180) {
                        this._delay.delayTime.value = val;
                        this._status.delayTime = val;
                    }
                }
            },
            delayTimeParam: {
                get: function() {
                    return this._delay.delayTime;
                }
            }
        });
    };
    snd.Delay.prototype = Object.create(snd.AudioUnit.prototype);
    snd.Delay.prototype.constructor = snd.Gain;
    snd.Delay.prototype.connect = function(connectTo, indexIn, indexOut, id) {
        snd.AudioUnit.prototype.connect.apply(this, arguments);
        if (connectTo.getConnector != null) {
            this._output.connect(connectTo.getConnector(), indexIn, indexOut);
        } else {
            this._output.connect(connectTo, indexIn, indexOut);
        }
    };
    snd.Delay.prototype.disconnect = function(disconnectFrom, indexIn, id) {
        snd.AudioUnit.prototype.disconnect.apply(this, arguments);
        if (disconnectFrom.getConnector != null) {
            this._output.disconnect(disconnectFrom.getConnector(), indexIn);
        } else {
            this._output.disconnect(disconnectFrom, indexIn);
        }
    };
    snd.Delay.prototype.createStatus = function() {
        return new snd.Delay.Status();
    };
    snd.Delay.prototype.getConnector = function() {
        return this._connector;
    };
    snd.Delay.prototype.loadData = function(data) {
        snd.AudioUnit.prototype.loadData.apply(this, arguments);

        this.maxDelayTime = data.maxDelayTime;
        this.delayTime = data.delayTime;
    };

    snd.Delay.Status = function() {
        snd.AudioUnit.Status.apply(this, arguments);
        this.delayTime = 0;
        this.maxDelayTime = 60;
    };
    snd.Delay.Status.prototype = Object.create(snd.AudioUnit.Status.prototype);
    snd.Delay.Status.prototype.constructor = snd.Delay.Status;
});
