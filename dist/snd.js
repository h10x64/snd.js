
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
snd = {VERSION: "1.0.20150505", IS_BETA:true, ALIAS: "Tango"};

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
 * snd.jsで使用するクラスを定義するメソッドのリストです。<br/>
 * 通常はsnd.*.js読み込み時に自動で追加されますので、変更は必要ありません。<br/>
 * 独自のクラスを定義する場合などはクラス定義を関数でまとめて、ここへ追加してください。<br/>
 * (引数なしの、snd.CLASS_DEF[index]() の形で、添字の昇順で呼び出されます。)
 * @type Array
 */
snd.CLASS_DEF = [];

snd.PLUGIN_INIT = [];

/**
 * snd.jsを初期化します。
 * @memberOf snd
 */
snd.init = function() {
    snd.resetAudioContext();
    
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
            value: (function () {
                var ret = {};
                Object.defineProperties(ret, {
                    type: {
                        value: (function () {
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
        BLOWSER: {
            get: function () {
                return window.navigator.userAgent.toLowerCase();
            }
        },
        CURRENT_TIME: {
            get: function() {
                return snd.AUDIO_CONTEXT.currentTime;
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
    
    var classDefCallback = function() {
        for (var i = 0; i < snd.CLASS_DEF.length; i++) {
            snd.CLASS_DEF[i]();
        }
        for (var i = 0; i < snd.PLUGIN_INIT.length; i++) {
            snd.PLUGIN_INIT[i]();
        }

        snd._MASTER = new snd.AudioMaster();
        snd._AUDIO_DATA_MANAGER = new snd.AudioDataManager();
        
        if (typeof(snd.onload) == "function") {
            snd.onload();
        }
    };
    
    if (typeof(snd.using) == "function") {
        snd.using(classDefCallback);
    } else {
        classDefCallback();
    }
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

/**
 * よく使う処理をまとめたネームスペースです。
 * @namespace
 */
snd.util = {};

/**
 * 文字列がDataURIか否かを判定する際に使用される正規表現です。
 * @type RegExp
 */
snd.util.REGEX_DATA_URI_SCHEME = /^data:audio.*;base64,(.*)$/;

/**
 * 文字列がsnd.AUDIO_DATA_MANAGERのキー値か否かを判定する際に使用される正規表現です。
 * @type RegExp
 */
snd.util.REGEX_KEY = /^key:(.*)$/;

/**
 * dataSetで指定されたURLの音源をまとめて作成します。<br/>
 * connectToMasterがtrueに設定されていた場合、snd.MASTERへの接続が同時に行われます。<br/>
 * elementには&lt;Audio&gt;タグを追加するDOMエレメントを指定してください。<br/>
 * 全ての設定とAudioBufferの読み込みが終了すると、funcに設定されたコールバックメソッドが呼び出されます。<br/>
 * <br/>
 * 以下にdataSetの具体例を例示します。<br/>
 * <br/>
 * dataSet = {<br/>
 *   MediaElement: {'MediaSourceID01': './hoge/fuga/bgm1.wav', 'MediaSourceID02': './hoge/fuga/bgm2.mp3'},<br/>
 *   AudioBuffer: {'BufferSourceID01': './hoge/fuga/sound1.wav', 'BufferSourceID02': './hoge/fuga/sound2.mp3'}<br/>
 * };
 * 
 * @param {HashMap} dataSet 音源のIDとURLをまとめたデータセット
 * @param {boolean} connectToMaster snd.MASTERに接続するかどうか
 * @param {HTMLElement} element Audioタグを追加するDOMエレメント
 * @param {function} func コールバックメソッド
 * @memberOf snd.util
 */
snd.util.createSources = function(dataSet, connectToMaster, element, func) {
    var ret = {};
    
    if (dataSet['MediaElement'] != null) {
        ret['MediaElement'] = snd.util.createMediaElementAudioSources(dataSet['MediaElement'], connectToMaster, element);
    } else {
        ret['MediaElement'] = null;
    }
    
    if (dataSet['AudioBuffer'] != null) {
        snd.util.createBufferSources(dataSet['AudioBuffer'], connectToMaster, function(res) {
            ret['AudioBuffer'] = res;
            func(ret);
        });
    } else {
        ret['AudioBuffer'] = null;
        func(ret);
    }
};

/**
 * AudioBufferを使用した音源を複数作成するメソッドです。<br/>
 * 音源のIDとデータのURLをまとめたハッシュマップdataSetを渡すと、読み込み終了時に
 *コールバック関数funcが呼び出されます。<br/>
 * コールバック関数funcの引数には、BufferSourceクラスのオブジェクトをまとめたハッシュマップが渡されます。<br/>
 * このマップのキー値にはデータセットで設定したIDが使用され、データURLの内容を出力する音源がその値として入っています。<br/>
 * <br/>
 * また、connectToMasterをtrueに設定した場合、自動でsnd.MASTER.connectAudioUnitを実行します。<br/>
 * この場合、funcの中でBufferSourceオブジェクトのstartメソッドを使うだけで音が再生されるようになります。<br/>
 * 音源と出力の間にエフェクトを追加する必要が無い場合、connectToMasterをtrueに設定すると便利です。
 * 
 * @param {HashMap} dataSet 音源のIDと、データURLのハッシュマップ {ID1: "URL1", ID2: "URL2", ... IDn: "URLn"}
 * @param {boolean} connectToMaster 読み込み完了時にsnd.MASTERへ接続するかどうか
 * @param {function} func 読込みが終了し、音源の準備が完了した時に呼ばれるコールバック関数
 * @memberOf snd.util
 */
snd.util.createBufferSources = function(dataSet, connectToMaster, func) {
    if (!snd.BufferSource) {
        throw new snd.Exception("Please load snd.BufferSource.js");
    }
    
    var sourceMap = {};
    var urlMap = {};
    
    for (var id in dataSet) {
        var url = dataSet[id];
        if (sourceMap[url] == null) {
            sourceMap[url] = [];
        }
        
        var source = new snd.BufferSource(id);
        sourceMap[url].push(source);
    }
    
    for (var url in sourceMap) {
        urlMap[url] = url;
    }
    snd.AUDIO_DATA_MANAGER.addAll(urlMap);

    var callback = function() {
        var ret = {};
        
        for (var url in sourceMap) {
            for (var i = 0; i < sourceMap[url].length; i++) {
                sourceMap[url][i].loadAudioBuffer(url);
                ret[sourceMap[url][i].id] = sourceMap[url][i];
                
                if (connectToMaster) {
                    snd.MASTER.connectAudioUnit(sourceMap[url][i].id, sourceMap[url][i]);
                }
            }
        }
        
        snd.AUDIO_DATA_MANAGER.removeAllDataLoadListener(callback);
        func(ret);
    };
    
    snd.AUDIO_DATA_MANAGER.addAllDataLoadListener(callback);
    
    snd.AUDIO_DATA_MANAGER.load();
};

/**
 * Audioタグを使用した音源を複数作成するメソッドです。<br/>
 * 音源のIDとデータのURLをまとめたハッシュマップdataSetを渡すと、指定されたelementにAudioタグを追加し、
 *MediaElementAudioSourceクラスのオブジェクトを生成し、ハッシュマップにまとめて返します。<br/>
 * 戻値のキー値にはデータセットで設定したIDが使用され、src属性がdataSetで指定されたURLとなったAudioタグのエレメントが値として入ります。<br/>
 * <br/>
 * また、connectToMasterをtrueに設定した場合、自動でsnd.MASTER.connectAudioUnitを実行します。<br/>
 * この場合、funcの中でBufferSourceオブジェクトのstartメソッドを使うだけで音が再生されるようになります。<br/>
 * 音源と出力の間にエフェクトを追加する必要が無い場合、connectToMasterをtrueに設定すると便利です。
 * 
 * @param {HashMap} dataSet 音源のIDと、データURLのハッシュマップ {ID1: "URL1", ID2: "URL2", ... IDn: "URLn"}
 * @param {boolean} connectToMaster 読み込み完了時にsnd.MASTERへ接続するかどうか
 * @param {type} parentElem Audioタグを追加するDOMエレメント
 * @returns {HashMap}
 * @memberOf snd.util
 */
snd.util.createMediaElementAudioSources = function(dataSet, connectToMaster, parentElem) {
    if (!snd.MediaElementAudioSource) {
        throw new snd.Exception("Please load snd.MediaElementAudioSource.js");
    }
    
    var ret = {};
    
    for (var id in dataSet) {
        var audioElem;
        var docElem = document.getElementById(id);
        if (docElem == null) {
            audioElem = new Audio(id);
            parentElem.appendChild(audioElem);
        } else {
            audioElem = docElem;
        }
        
        if (dataSet[id] != null && dataSet[id] != "") {
            audioElem.src = dataSet[id];
        }
        
        var source = new snd.MediaElementAudioSource(id, audioElem);
        
        ret[id] = source;
        
        if (connectToMaster) {
            snd.MASTER.connectAudioUnit(id, source);
        }
    }
    
    return ret;
}

/**
 * 引数 prefix を使用したユニークなキー文字列を生成します。<br/>
 * 生成されるキー文字列のフォーマットは以下のとおりです。<br/>
 * prefix + (Date.getTime) + (Math.random 1000桁)
 * @param {String} prefix 生成する文字列の先頭に追加する文字列
 * @returns {String} 生成されたキー文字列
 */
snd.util.getNewKey = function(prefix) {
    return prefix + new Date().getTime().toString() + Math.floor(Math.random() * 1000);
}

/**
 * 与えられた文字列がDataURISchemeの文字列か否かを判定します。
 * @param {String} str 判定する文字列
 * @returns {Boolean} strがDataURIならTrue, そうでなければFalse
 */
snd.util.isDataURI = function(str) {
    return (snd.util.REGEX_DATA_URI_SCHEME.exec(str) != null);
};

/**
 * 与えられた文字列がDataURI文字列だった場合、そのデータ部を抽出して戻します。(バイト列へのパースは行いません)<br/>
 * 文字列がDataURIでは無かった場合は、undefinedを返します。
 * @param {type} str データ部を抽出するDataURI文字列
 * @returns {undefined}
 */
snd.util.stripDataURI = function(str) {
    var uriMatches = str.match(snd.util.REGEX_DATA_URI_SCHEME);
    if (uriMatches) {
        return uriMatches[1];
    } else {
        return undefiend;
    }
};

/**
 * 
 * @param {type} str
 * @returns {Boolean} strがsnd.AUDIO_DATA_MANAGERのキー値を表す文字列ならTrue, そうでなければFalse
 */
snd.util.isAudioManagerKey = function(str) {
    return (snd.util.REGEX_KEY.exec(str) != null);
};

/**
 * 与えられた文字列がsnd.AUDIO_DATA_MANAGERのキー値を表す文字列ならそのキー値を返します。(snd.AUDIO_DATA_MANAGER上にデータがあるかどうかは関係ありません。)<br/>
 * キー値を表す文字列でなければ、undefinedを返します。<br/>
 * 
 * @param {String} str キー値を取得する文字列
 * @returns {String} キー値
 */
snd.util.stripAudioManagerKey = function(str) {
    var keyMatches = uri.match(snd.util.REGEX_DATA_URI_SCHEME);
    if (keyMatches) {
        return keyMatches[1];
    } else {
        return undefiend;
    }
};

/**
 * オクターブと音高から周波数を計算します。<br/>
 * 周波数の基準はA4(440[Hz])です。<br/>
 * 音高の指定は0～12の値(実数)で行い、整数部が1増えるごとに半音上昇します。
 * @param {Number} octave オクターブ
 * @param {Number} pitch 音高(C=0, C#=1, ... B = )
 * @returns {Number} 周波数[hz]
 * @memberOf snd.util
 */
snd.util.noteToFrequency = function(octave, pitch) {
    return 440.0 * Math.pow(2.0, (12 * (octave - 4) + pitch - 9) / 12);
};

/**
 * テンポと音長から秒数を計算します。
 * @param {type} tempo テンポ(1分間に演奏する4分音符の個数)
 * @param {type} noteValue 音長 (全音符=1, 半音符=2, 四分音符=4, 八分音符=8, ... )
 * @returns {Number}
 * @memberOf snd.util
 */
snd.util.noteToSec = function(tempo, noteValue) {
    return 60.0 / (tempo * noteValue / 4);
};

snd.util.setScheduledValues = function(param, settings) {
    var currentTime = snd.CURRENT_TIME;
    param.cancelScheduledValues(currentTime);
    
    for (var i = 0; i < settings.length; i++) {
        var setting = settings[i];
        
        if (setting.type == snd.LINER) {
            param.linearRampToValueAtTime(setting.value, currentTime + setting.time);
        } else if (setting.type == snd.EXPONENTIALLY) {
            param.exponentialRampToValueAtTime(setting.value, currentTime + setting.time);
        } else {
            // DEFAULT: snd.audioparam.type.SET
            param.setValueAtTime(setting.value, currentTime + setting.time);
        }
    }
};
