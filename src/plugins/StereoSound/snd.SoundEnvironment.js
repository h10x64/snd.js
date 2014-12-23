snd.SoundEnvironment = function(channelCount) {
    this._channelCount = (channelCount == null) ? snd.MAX_CHANNEL_COUNT : channelCount;
    this._sounds = {};
    
    Object.defineProperties(this, {
        channelCount: {
            get: function() {
                return this.channelCount;
            }
        },
        LISTENER: {
            get: function() {
                return snd._LISTENER;
            }
        }
    });
};

snd.SoundEnvironment.addSound = function(id) {
    var mode = "";
    switch (this.channelCount) {
        case 2:
            mode = snd.Panner.MODE_HEADPHONE;
            break;
        case 4:
            mode = snd.Panner.MODE_4CH;
            break;
        case 6:
            mode = snd.Panner.MODE_6CH;
            break;
        default:
            mode = snd.Panner.MODE_HEADPHONE;
    }
    
    var ret = new snd.Panner(id, mode);
    
    this._sounds[id] = ret;
    
    return ret;
};

snd.SoundEnvironment.removeSound = function(id) {
    delete this._sounds[id];
};
