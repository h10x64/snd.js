/* Base Classes */

/**
 * @private
 * @class PannerBase
 * THIS CLASS IS ABSTRACT
 */
snd.PannerBase = function(parent) {
    // Please set outputGain.channelCount in the inherited class's constructor
    
    this._parent = parent;
    this._inputGain = snd.AUDIO_CONTEXT.createGain();
    this._outputGain = snd.AUDIO_CONTEXT.createGain();
    
    this._inputGain.channelCount = 1;
};

snd.PannerBase.prototype.setPosition = function(x, y, z) {
    // PLEASE OVERRIDE ME
};

snd.PannerBase.prototype.setOrientation = function(x, y, z, upX, upY, upZ) {
    // PLEASE OVERRIDE ME
};

snd.PannerBase.prototype.connect = function(connectTo, indexIn, indexOut, id) {
    if (connectTo.getConnector != null) {
        this._outputGain.connect(connectTo.getConnector(), indexIn, indexOut);
    } else {
        this._outputGain.connect(connectTo, indexIn, indexOut);
    }
};

snd.PannerBase.prototype.disconnect = function(disconnectFrom, indexOut, id) {
    if (disconnectFrom.getConnector != null) {
        this._outputGain.disconnect(disconnectFrom.getConnector(), indexOut);
    } else {
        this._outputGain.disconnect(disconnectFrom, indexOut);
    }
};

snd.PannerBase.prototype.getConnector = function() {
    return this._inputGain;
};

/**
 * @private
 * @class StereoOutPanner
 * THIS CLASS IS ABSTRACT
 */
snd.StereoOutPanner = function (id) {
    // Please set _panner in the inherited class's counstructor
    
    snd.SoundObject.apply(this, arguments);
    snd.AudioUnit.apply(this, arguments);
};
snd.StereoOutPanner.prototype = Object.create(snd.AudioUnit.prototype);
snd.StereoOutPanner.prototype.constructor = snd.StereoOutPanner;

snd.StereoOutPanner.prototype.setPosition = function (x, y, z) {
    snd.SoundObject.prototype.setPosition.apply(this, arguments);
    this._panner.setPosition(x, y, z);
};

snd.StereoOutPanner.prototype.setOrientation = function (x, y, z) {
    snd.SoundObject.prototype.setOrientation.apply(this, arguments);
    this._panner.setOrientation(x, y, z);
};

snd.StereoOutPanner.prototype.getConnector = function () {
    return this._panner.getConnector();
};

snd.StereoOutPanner.prototype.connect = function (connectTo, indexIn, indexOut, id) {
    snd.AudioUnit.prototype.connect.apply(this, arguments);

    this._panner.connect(connectTo, indexIn, indexOut, id);
};

snd.StereoOutPanner.prototype.disconnect = function (disconnectFrom, indexIn, indexOut, id) {
    snd.AudioUnit.prototype.disconnect.apply(this, arguments);

    this._panner.disconnect(disconnectFrom, indexIn, indexOut, id);
};

snd.StereoOutPanner.prototype.createStatus = function () {
    return new snd.StereoOutPanner.Status();
};

snd.StereoOutPanner.Status = function () {
    snd.AudioUnit.Status.apply(this, arguments);
    snd.SoundObject.Status.apply(this, arguments);
    this.velocity = glMatrix.vec3.create();
};



/* N-ch Output Panner Classes */

/**
 * 2-ch Output Panner Class
 * @private
 */
snd.DoubleOutPanner = function (parent) {
    snd.PannerBase.apply(this, arguments);
    this._outputGain.channelCount = 2;

    this._connector = snd.AUDIO_CONTEXT.createGain();
    this._connector.channelCount = 1;
    
    this._panner = snd.AUDIO_CONTEXT.createPanner();
    
    this._connector.connect(this._panner);
};
snd.DoubleOutPanner.prototype = Object.create(snd.PannerBase.prototype);
snd.DoubleOutPanner.prototype.constructor = snd.DoubleOutPanner;

snd.DoubleOutPanner.prototype.setPosition = function(x, y, z) {
    snd.PannerBase.prototype.setPosition.apply(this, arguments);
    this._panner.setPosition(x, y, z);
};

snd.DoubleOutPanner.prototype.setOrientation = function(x, y, z, upX, upY, upZ) {
    snd.PannerBase.prototype.setOrientation.apply(this, arguments);
    this._panner.setOrientation(x, y, z);
};

/**
 * 4-ch Output Panner Class
 * @private
 */
snd.QuadrupleOutPanner = function (parent) {
    snd.PannerBase.apply(this, arguments);
};
snd.QuadrupleOutPanner.prototype = Object.create(snd.PannerBase.prototype);
snd.QuadrupleOutPanner.prototype.constructor = snd.QuadrupleOutPanner;

snd.QuadrupleOutPanner.prototype.setPosition = function(x, y, z) {
    
};

snd.QuadrupleOutPanner.prototype.setOrientation = function(x, y, z, upX, upY, upZ) {
    
};

/**
 * 6-ch(5.1-ch) Output Panner Class
 * @private
 */
snd.SextupleOutPanner = function (parent) {
    snd.PannerBase.apply(this, arguments);
    this._relPos = new snd.SoundObject();
    this._cylRelPos = glMatrix.vec3.create();
    
    this._outputGain.channelCount = 6;
    
    this._marger = snd.AUDIO_CONTEXT.createChannelMerger();
    this._marger.channelCount = 6;
    
    this._distGain = snd.AUDIO_CONTEXT.createGain();
    this._flGain = snd.AUDIO_CONTEXT.createGain();
    this._frGain = snd.AUDIO_CONTEXT.createGain();
    this._cGain = snd.AUDIO_CONTEXT.createGain();
    this._swGain = snd.AUDIO_CONTEXT.createGain();
    this._rlGain = snd.AUDIO_CONTEXT.createGain();
    this._rrGain = snd.AUDIO_CONTEXT.createGain();
    
    this._distGain.channelCount = 1;
    this._flGain.channelCount = 1;
    this._frGain.channelCount = 1;
    this._cGain.channelCount = 1;
    this._swGain.channelCount = 1;
    this._rlGain.channelCount = 1;
    this._rrGain.channelCount = 1;
    
    this._inputGain.connect(this._distGain);
    
    this._distGain.connect(this._flGain);
    this._distGain.connect(this._frGain);
    this._distGain.connect(this._cGain);
    this._distGain.connect(this._swGain);
    this._distGain.connect(this._rlGain);
    this._distGain.connect(this._rrGain);
    
    this._flGain.connect(this._marger, 0, snd.IDX_6CH_FL);
    this._frGain.connect(this._marger, 0, snd.IDX_6CH_FR);
    this._cGain.connect(this._marger, 0, snd.IDX_6CH_C);
    this._swGain.connect(this._marger, 0, snd.IDX_6CH_SW);
    this._rlGain.connect(this._marger, 0, snd.IDX_6CH_RL);
    this._rrGain.connect(this._marger, 0, snd.IDX_6CH_RR);
    
    this._marger.connect(this._outputGain);
};
snd.SextupleOutPanner.prototype = Object.create(snd.PannerBase.prototype);
snd.SextupleOutPanner.prototype.constructor = snd.SextupleOutPanner;

snd.SextupleOutPanner.prototype.setPosition = function(x, y, z) {
    snd.SoundObject.getRelative(this._relPos, snd.LISTENER, this._parent);
    snd.util.convertOrthogonalToCylindrical(this._cylRelPos, this._relPos._status.position);
    
    if (this._cylRelPos[0] <= 1.0) {
        this._distGain.gain.value = 1.0;
    } else {
        this._distGain.gain.value = 1.0 / (this._cylRelPos[0] * this._cylRelPos[0]);
    }
    
    var theta = (this._cylRelPos[1] < 0) ? (this._cylRelPos[1] % (2 * Math.PI)) + 2 * Math.PI : this._cylRelPos[1] % (2 * Math.PI);
    var ratio = 0;
    if (theta >= snd.Panner.POS_6CH_C && theta < snd.Panner.POS_6CH_FR) {
        ratio = (theta - snd.Panner.POS_6CH_C) / (snd.Panner.POS_6CH_FR - snd.Panner.POS_6CH_C);
        this._setGains(1.0 - ratio, ratio, 0, 0, 0);
    } else if (theta >= snd.Panner.POS_6CH_FR && theta < snd.Panner.POS_6CH_RR) {
        ratio = (theta - snd.Panner.POS_6CH_FR) / (snd.Panner.POS_6CH_RR - snd.Panner.POS_6CH_FR);
        this._setGains(0, 1.0 - ratio, ratio, 0, 0);
    } else if (theta >= snd.Panner.POS_6CH_RR && theta < snd.Panner.POS_6CH_RL) {
        ratio = (theta - snd.Panner.POS_6CH_RR) / (snd.Panner.POS_6CH_RL - snd.Panner.POS_6CH_RR);
        this._setGains(0, 0, 1.0 - ratio, ratio, 0);
    } else if (theta >= snd.Panner.POS_6CH_RL && theta < snd.Panner.POS_6CH_FL) {
        ratio = (theta - snd.Panner.POS_6CH_RL) / (snd.Panner.POS_6CH_FL - snd.Panner.POS_6CH_RL);
        this._setGains(0, 0, 0, 1.0 - ratio, ratio);
    } else if (theta >= snd.Panner.POS_6CH_FL && theta < 2 * Math.PI) {
        ratio = (theta - snd.Panner.POS_6CH_FL) / (2 * Math.PI - snd.Panner.POS_6CH_FL);
        this._setGains(ratio, 0, 0, 0, 1.0 - ratio);
    }
};

snd.SextupleOutPanner.prototype.setOrientation = function(x, y, z, upX, upY, upZ) {
    
};

snd.SextupleOutPanner.prototype._setGains = function(c, fr, rr, rl, fl) {
    this._cGain.gain.value = (c == 0) ? 0.00001 : c;
    this._frGain.gain.value = (fr == 0) ? 0.00001 : fr;
    this._rrGain.gain.value = (rr == 0) ? 0.00001 : rr;
    this._rlGain.gain.value = (rl == 0) ? 0.00001 : rl;
    this._flGain.gain.value = (fl == 0) ? 0.00001 : fl;
    this._swGain.gain.value = 0.00001;
};


/**
 * Panner Class
 */

snd.Panner = function (id, mode) {
    snd.StereoOutPanner.apply(this, arguments);
    
    var outputChannelCount = 1;
    switch (mode) {
        case snd.Panner.MODE_HEADPHONE:
            outputChannelCount = 2;
            this._panner = new snd.DoubleOutPanner(this);
            break;
        case snd.Panner.MODE_4CH:
            outputChannelCount = 4;
            this._panner = new snd.QuadrupleOutPanner(this);
            break;
        case snd.Panner.MODE_6CH:
            outputChannelCount = 6;
            this._panner = new snd.SextupleOutPanner(this);
            break;
        default: // includes MODE_2CH
            outputChannelCount = 2;
            this._panner = new snd.DoubleOutPanner(this);
            break;
    }

    console.assert(outputChannelCount <= snd.MAX_CHANNEL_COUNT, "AudioContext.destination.maxChannelCount(" + snd.MAX_CHANNEL_COUNT + "ch) less than the selected output mode(" + outputChannelCount + "ch).\ntThis Panner will down-mix automatically.");
};
snd.Panner.prototype = Object.create(snd.StereoOutPanner.prototype);
snd.Panner.prototype.constructor = snd.Panner;

snd.Panner.MODE_HEADPHONE = "headphone";
snd.Panner.MODE_2CH = "2ch";
snd.Panner.MODE_4CH = "4ch";
snd.Panner.MODE_6CH = "5.1ch";
snd.Panner.MODE_8CH = "7.1ch";

snd.Panner.POS_6CH_C = 0.0 * Math.PI / 180;
snd.Panner.POS_6CH_FR = 30.0 * Math.PI / 180;
snd.Panner.POS_6CH_RR = 110.0 * Math.PI / 180;
snd.Panner.POS_6CH_RL = 250.0 * Math.PI / 180;
snd.Panner.POS_6CH_FL = 330.0 * Math.PI / 180;
