snd.Convolver = function (id) {
    snd.AudioUnit.apply(this, arguments);

    this._connector = snd.AUDIO_CONTEXT.createGain();
    this._output = snd.AUDIO_CONTEXT.createGain();
    this._convolver = snd.AUDIO_CONTEXT.createConvolver();
    this._status.audioBuffer = this._convolver.audioBuffer;

    this._connector.connect(this._convolver);
    this._convolver.connect(this._output);

    /* DEFINE PROPERTIES */
    Object.defineProperties(this, {
        channelCount: {
            get: function () {
                return this._status.channelCount;
            },
            set: function (val) {
                this._output.channelCount = val;
                this._connector.channelCount = val;
                this._convolver.channelCount = val;
                this._status.channelCount = val;
            }
        },
        channelCountMode: {
            get: function () {
                return this._status.channelCountMode;

            },
            set: function (val) {
                this._output.channelCountMode = val;
                this._conector.channelCountMode = val;
                this._convolver.channelCountMode = val;
                this._status.channelCountMode = val;
            }
        },
        channelInterpretation: {
            get: function () {
                return this._status.channelInterpretation;
            },
            set: function (val) {
                this._output.channelInterpretation = val;
                this._connector.channelInterpretation = val;
                this._convolver.channelInterpretation = val;
                this._status.channelInterpretation = val;
            }
        },
        buffer: {
            get: function () {
                return this._convolver.buffer;
            },
            set: function (val) {
                this._convolver.buffer = val;
            }
        },
        normalize: {
            get: function () {
                return this._convolver.normalize;
            },
            set: function (val) {
                this.convolver.normalize = val;
            }
        }
    });

    this.channelCount = this._status.channelCount;
};
snd.Convolver.prototype = Object.create(snd.AudioUnit.prototype);
snd.Convolver.prototype.constructor = snd.Gain;
snd.Convolver.prototype.connect = function (connectTo, indexIn, indexOut, id) {
    snd.AudioUnit.prototype.connect.apply(this, arguments);
    if (connectTo.getConnector != null) {
        this._output.connect(connectTo.getConnector(), indexIn, indexOut);
    } else {
        this._output.connect(connectTo, indexIn, indexOut);
    }
};
snd.Convolver.prototype.disconnect = function (disconnectFrom, indexIn, id) {
    snd.AudioUnit.prototype.disconnect.apply(this, arguments);
    if (disconnectFrom.getConnector != null) {
        this._output.disconnect(disconnectFrom.getConnector(), indexIn);
    } else {
        this._output.disconnect(disconnectFrom, indexIn);
    }
};
snd.Convolver.prototype.createStatus = function () {
    return new snd.Convolver.Status();
};
snd.Convolver.prototype.getConnector = function () {
    return this._connector;
};

// @TODO Load/Save AudioBuffer

snd.Convolver.prototype.loadData = function (data) {
    snd.AudioUnit.prototype.loadData.apply(this, arguments);

    this.normalize = data.normalize;
};

snd.Convolver.Status = function () {
    snd.AudioUnit.Status.apply(this, arguments);
    this.audioBuffer = null;
    this.normalize = true;
};
snd.Convolver.Status.prototype = Object.create(snd.AudioUnit.Status.prototype);
snd.Convolver.Status.prototype.constructor = snd.Convolver.Status;