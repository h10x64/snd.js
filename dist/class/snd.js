
/**
 * snd.js
 * 
 * The MIT License (MIT)
 * copyright (c) 2014 - 2015 N_H <h.10x64@gmail.com>
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 * 
 **/
 
 

(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD
        define([], factory);
    } else if (typeof exports === 'object') {
        // Node
    } else {
        // Browser globals (root is window)
        root.snd = factory();
    }
}(this, function() {

    /**
     * snd.jsの基幹ネームスペースです。
     * @property {String} VERSION バージョン番号です。
     * @property {Boolean} IS_BETA ベータ版かどうかを表すブール値です。
     * @property {String} BLOWSER ブラウザ文字列です。
     * @property {Boolean} DOES_MP3_SUPPORTED ブラウザがmp3形式に対応しているかどうかを示すブール値です。
     * @property {Boolean} DOES_WAV_SUPPORTED ブラウザがpcm形式に対応しているかどうかを示すブール値です。
     * @property {Boolean} DOES_OGG_SUPPORTED ブラウザがogg形式に対応しているかどうかを示すブール値です。
     * @property {Boolean} DOES_AAC_SUPPORTED ブラウザがaac形式に対応しているかどうかを示すブール値です。
     * @property {Boolean} DOES_M4A_SUPPORTED ブラウザがm4a形式に対応しているかどうかを示すブール値です。
     * @property {String} srctype.NONE 使用される音源の種類が未定であることを表す値です。
     * @property {String} srctype.AUDIO_BUFFER 使用される音源の種類がAudioBufferNodeであることを表す値です。
     * @property {String} srctype.MEDIA_STREAM 使用される音源の種類がMediaStreamAudioSourceNodeであることを表す値です。
     * @property {String} srctype.MEDIA_ELEMENT 使用される音源の種類がMediaElementAudioSourceNodeであることを表す値です。
     * @property {String} srctype.OSCILLATOR 使用される音源の種類がOscillatorであることを表す値です。
     * @property {String} status.NONE 音源が未設定などの理由で、ステータスがまだ定まっていないことを表す値です。
     * @property {String} status.READY 音源の読込が終了するなどして、音源の再生が可能な状態になっていることを表す値です。
     * @property {String} status.STARTED 音源の再生が開始され、再生中であることを表す値です。
     * @property {String} status.PAUSED 音源の再生が中断し、停止中であることを表す値です。
     * @property {String} status.STOPPED 音源の再生が終了し、停止したことを表す値です。
     * @property {AudioContext} AUDIO_CONTEXT ブラウザから取得したオーディオコンテキストが入ります。<br/>
     * ※snd.initメソッドが呼ばれるまで初期化されず、nullとなっている点に注意してください。
     * @property {snd.AudioMaster} AUDIO_MASTER  snd.jsのPAミキサーです。<br/>
     * ※snd.initメソッドが呼ばれるまで初期化されず、nullとなっている点に注意してください。
     * @property {snd.AudioDataManager} AUDIO_DATA_MANAGER 音データの読み込みなどの管理を行うクラスです。<br/>
     * ※snd.initメソッドが呼ばれるまで初期化されず、nullとなっている点に注意してください。
     */
    var snd = {VERSION: "1.0.20160303", IS_BETA: true, ALIAS: "Kyokusui"};

    snd._AUDIO_CONTEXT = null;
    snd._MASTER = null;
    snd._AUDIO_DATA_MANAGER = null;
    snd._DOES_MP3_SUPPORTED = false;
    snd._DOES_WAV_SUPPORTED = false;
    snd._DOES_OGG_SUPPORTED = false;
    snd._DOES_AAC_SUPPORTED = false;
    snd._DOES_M4A_SUPPORTED = false;

    (function() {
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
     * snd.jsで使用するクラスを定義するメソッドのリストです。<br/>
     * 通常はsnd.*.js読み込み時に自動で追加されますので、変更は必要ありません。<br/>
     * 独自のクラスを定義する場合などはクラス定義を関数でまとめて、ここへ追加してください。<br/>
     * (引数なしの、snd.CLASS_DEF[index]() の形で、添字の昇順で呼び出されます。)
     * @type Array
     */
    snd.CLASS_DEF = [];

    snd.PLUGIN_INIT = [];

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

    Object.defineProperties(snd, {
        /* StaticValues */
        DOES_MP3_SUPPORTED: {
            get: function() {
                return snd._DOES_MP3_SUPPORTED;
            }
        },
        DOES_WAV_SUPPORTED: {
            get: function() {
                return snd._DOES_WAV_SUPPORTED;
            }
        },
        DOES_OGG_SUPPORTED: {
            get: function() {
                return snd._DOES_OGG_SUPPORTED;
            }
        },
        DOES_AAC_SUPPORTED: {
            get: function() {
                return snd._DOES_AAC_SUPPORTED;
            }
        },
        DOES_M4A_SUPPORTED: {
            get: function() {
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
        SET: {
            writable: false,
            value: "set"
        },
        LINER: {
            writable: false,
            value: "liner"
        },
        EXPONENTIALLY: {
            writable: false,
            value: "exponentially"
        },
        SINE: {
            writable: false,
            value: "sine"
        },
        SQUARE: {
            writable: false,
            value: "square"
        },
        SAWTOOTH: {
            writable: false,
            value: "sawtooth"
        },
        TRIANGLE: {
            writable: false,
            value: "triangle"
        },
        status: {
            value: (function() {
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
            value: (function() {
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
            value: (function() {
                var ret = {};
                Object.defineProperties(ret, {
                    SINE: {
                        value: snd.SINE,
                        writable: false
                    },
                    SQUARE: {
                        value: snd.SQUARE,
                        writable: false
                    },
                    SAWTOOTH: {
                        value: snd.SAWTOOTH,
                        writable: false
                    },
                    TRIANGLE: {
                        value: snd.TRIANGLE,
                        writable: false
                    }
                });
                return ret;
            })(),
            writable: false
        },
        audioparam: {
            value: (function() {
                var ret = {};
                Object.defineProperties(ret, {
                    type: {
                        value: (function() {
                            var retret = {};
                            Object.defineProperties(retret, {
                                SET: {
                                    value: snd.SET,
                                    writable: false
                                },
                                LINER: {
                                    value: snd.LINER,
                                    writable: false,
                                },
                                EXPONENTIALLY: {
                                    value: snd.EXPONENTIALLY,
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
        params: {
            value: (function() {
                var ret = {};

                Object.defineProperties(ret, {
                    type: {
                        get: function() {
                            var re = {};

                            Object.defineProperties(re, {
                                READ_ONLY: {
                                    value: "readonly",
                                    writable: false
                                },
                                AUDIO_PARAM: {
                                    value: "audioparam",
                                    writable: false
                                },
                                VALUE: {
                                    value: "value",
                                    writable: false
                                },
                                ENUM: {
                                    value: "enum",
                                    writable: false
                                },
                                FUNCTION: {
                                    value: "function",
                                    writable: false
                                }
                            });

                            return re;
                        }
                    }
                });

                return ret;
            })(),
            writable: false
        },
        BLOWSER: {
            get: function() {
                return window.navigator.userAgent.toLowerCase();
            }
        },
        CURRENT_TIME: {
            get: function() {
                return snd.AUDIO_CONTEXT.currentTime;
            }
        },
        SAMPLE_RATE: {
            get: function() {
                return snd.AUDIO_CONTEXT.sampleRate;
            }
        },
        /* Objects */
        AUDIO_CONTEXT: {
            get: function() {
                return snd._AUDIO_CONTEXT;
            }
        },
        MASTER: {
            get: function() {
                return snd._MASTER;
            }
        },
        AUDIO_DATA_MANAGER: {
            get: function() {
                return snd._AUDIO_DATA_MANAGER;
            }
        }
    });

    return snd;
}));
