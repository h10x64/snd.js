
snd.StereoSound.init = function(channelCount) {
    snd._API_LISTENER = snd.AUDIO_CONTEXT.listener;
    snd._LISTENER = new snd.Listener(snd._API_LISTENER);
    
    snd._SOUND_ENVIRONMENT = new snd.SoundEnvironment(channelCount);
    
    Object.defineProperties(snd, {
        SOUND_ENVIRONMENT: {
            get: function() {
                return this._SOUND_ENVIRONMENT;
            }
        },
        LISTENER: {
            get: function() {
                return this._SOUND_ENVIRONMENT.LISTENER;
            }
        }
    });
};

