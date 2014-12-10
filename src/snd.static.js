
snd._AUDIO_CONTEXT = null;
snd._MASTER = null;
snd._AUDIO_DATA_MANAGER = null;
snd._DOES_MP3_SUPPORTED = false;
snd._DOES_WAV_SUPPORTED = false;
snd._DOES_OGG_SUPPORTED = false;
snd._DOES_AAC_SUPPORTED = false;
snd._DOES_M4A_SUPPORTED = false;

(function () {
    // 対応フォーマットのチェック
    var __audio__ = document.createElement("audio");
    snd._DOES_MP3_SUPPORTED = !(__audio__.canPlayType('audio/mpeg;') === "");
    snd._DOES_M4A_SUPPORTED = !(__audio__.canPlayType('audio/mp4; codecs="mp4a.40.2"') === "");
    snd._DOES_AAC_SUPPORTED = snd._DOES_M4A_SUPPORTED;
    snd._DOES_WAV_SUPPORTED = !(__audio__.canPlayType('audio/wav; codecs="1"') === "");
    snd._DOES_OGG_SUPPORTED = !(__audio__.canPlayType('audio/ogg; codecs="vorbis"') === "");
    delete __audio__;
})();

/**
 * snd.initメソッドが終了した際に呼び出されるメソッドのリストです。<br/>
 * プラグインの初期化など、sndの初期化完了と同時に走らせたいメソッドをここに入れてください。<br/>
 * <br/>
 * ここへ追加したメソッドは snd.init メソッドの完了時に呼び出されます。<br/>
 * (引数なしの、snd.INIT_EVENT_LISTENERS[index]() の形で、添字の昇順で呼び出されます。)
 * 
 * @type Array 初期化完了時に呼び出される関数のリスト
 */
snd.INIT_EVENT_LISTENERS = [];

/**
 * snd.jsを初期化します。
 * @memberOf snd
 */
snd.init = function () {
    snd.resetAudioContext();
    
    for (var i = 0; i < snd.INIT_EVENT_LISTENERS.length; i++) {
        snd.INIT_EVENT_LISTENERS[i]();
    }

    Object.defineProperties(snd, {
        /* StaticValues */
        DOES_MP3_SUPPORTED: {
            get: function () {
                return snd._DOES_MP3_SUPPORTED;
            }
        },
        DOES_WAV_SUPPORTED: {
            get: function () {
                return snd._DOES_WAV_SUPPORTED;
            }
        },
        DOES_OGG_SUPPORTED: {
            get: function () {
                return snd._DOES_OGG_SUPPORTED;
            }
        },
        DOES_AAC_SUPPORTED: {
            get: function () {
                return snd._DOES_AAC_SUPPORTED;
            }
        },
        DOES_M4A_SUPPORTED: {
            get: function () {
                return snd._DOES_M4A_SUPPORTED;
            }
        },
        MAX_CHANNEL_COUNT: {
            writable: false,
            value: snd._AUDIO_CONTEXT.destination.maxChannelCount
        },
        IDX_2CH_L: {
            writable: false,
            value: 0,
        },
        IDX_2CH_R: {
            writable: false,
            value: 1
        },
        IDX_4CH_FL: {
            writable: false,
            value: 0
        },
        IDX_4CH_FR: {
            writable: false,
            value: 1
        },
        IDX_4CH_RL: {
            writable: false,
            value: 2
        },
        IDX_4CH_RR: {
            writable: false,
            value: 3
        },
        IDX_6CH_FL: {
            writable: false,
            value: 0
        },
        IDX_6CH_FR: {
            writable: false,
            value: 1
        },
        IDX_6CH_C: {
            writable: false,
            value: 2
        },
        IDX_6CH_SW: {
            writable: false,
            value: 3
        },
        IDX_6CH_RL: {
            writable: false,
            value: 4
        },
        IDX_6CH_RR: {
            writable: false,
            value: 5
        },
        LOWPASS: {
            writable: false,
            value: "lowpass"
        },
        HIGHPASS: {
            writable: false,
            value: "highpass"
        },
        BANDPASS: {
            writable: false,
            value: "bandpass"
        },
        LOWSHELF: {
            writable: false,
            value: "lowshelf"},
        HIGHSHELF: {
            writable: false,
            value: "highshelf"},
        PEAKING: {
            writable: false,
            value: "peaking"},
        NOTCH: {
            writable: false,
            value: "notch"},
        ALLPASS: {
            writable: false,
            value: "allpass"},
        OVERSAMPLE_NONE: {
            writable: false,
            value: "none"
        },
        OVERSAMPLE_DOUBLE: {
            writable: false,
            value: "2x"
        },
        OVERSAMPLE_QUAD: {
            writable: false,
            value: "4x"
        },
        status: {
            value: (function () {
                var ret = {};
                Object.defineProperties(ret, {
                    NONE: {
                        value: "none",
                        writable: false
                    },
                    READY: {
                        value: "ready",
                        writable: false
                    },
                    STARTED: {
                        value: "started",
                        writable: false
                    },
                    PAUSED: {
                        value: "paused",
                        writable: false
                    },
                    STOPPED: {
                        value: "ended",
                        writable: false
                    }
                });
                return ret;
            })(),
            writable: false
        },
        srctype: {
            value: (function () {
                var ret = {};
                Object.defineProperties(ret, {
                    NONE: {
                        value: "none",
                        writable: false
                    },
                    AUDIO_BUFFER: {
                        value: "audiobuffer",
                        writable: false
                    },
                    MEDIA_STREAM: {
                        value: "mediastream",
                        writable: false
                    },
                    MEDIA_ELEMENT: {
                        value: "mediaelement",
                        writable: false
                    },
                    OSCILLATOR: {
                        value: "oscillator",
                        writable: false
                    },
                });
                return ret;
            })(),
            writable: false
        },
        oscillatortype: {
            value: (function () {
                var ret = {};
                Object.defineProperties(ret, {
                    SINE: {
                        value: "sine",
                        writable: false
                    },
                    SQUARE: {
                        value: "square",
                        writable: false
                    },
                    SAWTOOTH: {
                        value: "sawtooth",
                        writable: false
                    },
                    TRIANGLE: {
                        value: "triangle",
                        writable: false
                    }
                });
                return ret;
            })(),
            writable: false
        },
        audioparam: {
            value: (function () {
                var ret = {};
                Object.defineProperties(this, {
                    type: {
                        value: (function () {
                            var retret = {};
                            Object.defineProperties(this, {
                                SET: {
                                    value: "set",
                                    writable: false
                                },
                                LINER: {
                                    value: "liner",
                                    writable: false,
                                },
                                EXPONENTIALLY: {
                                    value: "exponentially",
                                    writable: false
                                }
                            });
                            return retret;
                        })(),
                        writable: false
                    }
                });
                return ret;
            })(),
            writable: false
        },
        BLOWSER: {
            get: function () {
                window.navigator.userAgent.toLowerCase();
            }
        },
        /* Objects */
        AUDIO_CONTEXT: {
            get: function () {
                return snd._AUDIO_CONTEXT;
            }
        },
        MASTER: {
            get: function () {
                return snd._MASTER;
            }
        },
        AUDIO_DATA_MANAGER: {
            get: function () {
                return snd._AUDIO_DATA_MANAGER;
            }
        }
    });

    snd._MASTER = new snd.AudioMaster();
    snd._AUDIO_DATA_MANAGER = new snd.AudioDataManager();
};

/**
 * オーディオコンテキストを初期化します。
 * snd#initメソッドから呼び出すためのメソッドですので、特別な理由が無い限り使用しないでください。
 * @private
 */
snd.resetAudioContext = function () {
    if (snd._AUDIO_CONTEXT == null) {
        // Create AudioContext
        if ('AudioContext' in window) {
            // firefox
            snd._AUDIO_CONTEXT = new AudioContext();
        } else if ('webkitAudioContext' in window) {
            // crome etc
            snd._AUDIO_CONTEXT = new webkitAudioContext();
        }
        snd._AUDIO_CONTEXT.destination.channelCount = snd._AUDIO_CONTEXT.destination.maxChannelCount;
    }
};
