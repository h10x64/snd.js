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
                    var v = parseFloat(val);
                    if (v > 0 && v < 180) {
                        this._connector.disconnect(this._delay);
                        delete this._delay;

                        this._delay = snd.AUDIO_CONTEXT.createDelay(v);
                        this._delay.delayTime.value = this._status.delayTime;

                        this._connector.connect(this._delay);
                        this._delay.connect(this._output);

                        this._status.maxDelay = v;
                    } else {
                        if (v < 0) {
                            cosole.log("maxDelay must grater than 0")
                        } else {
                            console.log("maxDelay must lesser than 180");
                        }
                    }
                }
            },
            delayTime: {
                get: function() {
                    return this._status.delayTime;
                },
                set: function(val) {
                    var v = parseFloat(val);
                    if (v >= 0 && v < 180) {
                        this._delay.delayTime.value = v;
                        this._status.delayTime = v;
                    } else {
                        if (v < 0) {
                            cosole.log("delayTime must grater than 0")
                        } else {
                            console.log("delayTime must lesser than 180");
                        }
                    }
                }
            },
            delayTimeParam: {
                get: function() {
                    return this.modAudioParam("delayTime", this._delay.delayTime);
                }
            }
        });
    };
    snd.Delay.prototype = Object.create(snd.AudioUnit.prototype);
    snd.Delay.prototype.constructor = snd.Delay;
    
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
    
    snd.Delay.prototype.getParamDescription = function() {
        var ret = snd.AudioUnit.prototype.getParamDescription.apply(this, arguments);
        
        ret.maxDelayTime = {
            type: snd.params.type.VALUE,
            default: 60,
            max: 180,
            min: 0
        }
        ret.delayTime = {
            type: snd.params.type.VALUE,
            default: 0,
            max: ret.maxDelayTime.max,
            min: 0
        };
        ret.delayTimeParam = {
            type: snd.params.type.AUDIO_PARAM,
            default: ret.delayTime.default,
            max: ret.delayTime.max,
            min: ret.delayTime.min
        };
        
        return ret;
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
    
    return snd;
}));
