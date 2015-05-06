
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

/**
 * コンストラクタです。<br/>
 * 引数 message にエラー内容を表す文字列を設定してください。
 * @class snd.jsで使用される例外クラスです。<br/>
 * JSON文字列からのデータロードなどで例外が発生した場合に使用されます。<br/>
 * @param {String} message エラー内容を表す文字列
 */
snd.Exception = function(message) {
    this._message = message;
    
    Object.defineProperties(this, {
        message: {
            enumerable: true,
            get: function() {
                return this._message;
            }
        }
    });
};



snd.CLASS_DEF.push(function() {
    /**
     * コンストラクタは使用せず、snd.AUDIO_DATA_MANAGERを使用してください。<br/>
     * @class AudioBufferの管理を行うクラスです。<br/>
     * データの読み込みだけでなく、複数のAudioBufferのローディングを待機するときなどに使用してください。
     */
    snd.AudioDataManager = function() {
        /**
         * リクエストを格納するマップ<br>
         * {キー:XMLHttpRequest}
         */
        this._requests = {};
        /**
         * データを格納するマップ<br>
         * {キー:{data:AudioBuffer, doesLoaded:boolean}}
         */
        this._dataMap = {};
        /**
         * イベントの送り先を格納するマップ<br>
         * {キー:{onload:[function]}}
         */
        this._eventListeners = {};
        this._allLoadEventListeners = [];

        Object.defineProperties(this, {
            data: {
                get: function() {
                    var ret = {};
                    var keys = Object.keys(this._dataMap);
                    for (var i = 0; i < keys.length; i++) {
                        (function(obj, key, thisarg) {
                            var prop = {};
                            prop[key] = {
                                get: function() {
                                    return thisarg._dataMap[key].data;
                                }
                            };
                            Object.defineProperties(obj, prop);
                        })(ret, keys[i], this);
                    }
                    return ret;
                }
            }
        });

    };

    /**
     * 全データの読み込みが完了したときに呼ばれるメソッドです。<br/>
     * イベントをリスナに送る際にこのオブジェクトの内部で使用されるメソッドなので、書き換えないようにしてください。<br/>
     * 全データの読み込みが完了したときに呼ばれるコールバック関数を設定したい場合、addAllDataLoadListenerメソッドを使用してください。
     */
    snd.AudioDataManager.prototype.onload = function() {
        for (var i = 0; i < this._allLoadEventListeners.length; i++) {
            this._allLoadEventListeners[i]();
        }
    };

    /**
     * 全データ読込み終了イベントのリスナへfuncで指定されたメソッドを追加します。
     * @param {type} func 全データの読込みが終了した際に呼び出されるメソッド。呼び出す時は引数なしでfunc()を実行します。
     */
    snd.AudioDataManager.prototype.addAllDataLoadListener = function(func) {
        this._allLoadEventListeners.push(func);
    };

    /**
     * 全データ読込み終了イベントのリスナからfuncで指定されたメソッドを削除します。
     * @param {type} func リストから外すメソッド
     * @returns {Boolean} 削除した場合はtrue, 削除しなかった場合はfalse
     */
    snd.AudioDataManager.prototype.removeAllDataLoadListener = function(func) {
        for (var i = 0; i < this._allLoadEventListeners.length; i++) {
            var f = this._allLoadEventListeners[i];
            if (f === func) {
                this._allLoadEventListeners.splice(i, 1);
                return true;
            }
        }
        return false;
    };

    /**
     * keyで指定されたAudioBufferの読込が終了した際に呼ばれるコールバック関数を設定します。<br/>
     * 全てのAudioBufferの読込が終了した時に呼ばれるコールバック関数を設定したい場合、snd.AudioDataManager.onloadをオーバーライドしてください。
     * @param {type} key AudioBufferをあらわすキー値
     * @param {function} func keyで指定されたAudioBufferの読込が終了した時点で呼び出されるコールバック関数
     * @see {snd.AudioDataManager.onload}
     */
    snd.AudioDataManager.prototype.addOnLoadListener = function(key, func) {
        if (this._eventListeners[key] == null) {
            this._eventListeners[key] = {
                onload: []
            };
        }
        this._eventListeners[key].onload.push(func);
    };

    /**
     * keyで指定されたAudioBufferの読込が終了した際に呼び出されるコールバック関数を削除します。<br/>
     * 指定されたkeyで追加されたコールバック関数がない場合、削除は行いません。
     * @param {type} key
     * @returns {undefined}
     */
    snd.AudioDataManager.prototype.removeOnLoadListener = function(key) {
        if (this._eventListeners[key] != null) {
            delete this._eventListeners[key];
            return true;
        }

        return false;
    };

    /**
     * keyで指定されたAudioBufferを取得します。
     * @param {type} key
     * @returns {AudioBuffer} 音データオブジェクト
     */
    snd.AudioDataManager.prototype.getAudioBuffer = function(key) {
        if (this._dataMap[key] != null) {
            return this._dataMap[key].data;
        } else {
            null;
        }
    };

    /**
     * keyがキー値となるAudioBufferを追加します。
     * @param {type} key 追加されるAudioBufferのキー値
     * @param {type} url 追加されるAudioBufferが読込むURL
     */
    snd.AudioDataManager.prototype.add = function(key, url) {
        var _this = this;
        this._dataMap[key] = {doesLoaded: false};

        var request = new XMLHttpRequest();
        request.open("GET", url, true);
        request.responseType = "arraybuffer";

        request.onload = function() {
            snd.AUDIO_CONTEXT.decodeAudioData(
                    request.response,
                    function(buf) {
                        _this._dataMap[key].data = buf;
                        _this._dataMap[key].doesLoaded = true;
                        _this.loaded(key, buf);
                    });
        };

        this._requests[key] = request;
    };

    /**
     * keyがキー値となるAudioBufferを追加します。<br/>
     * このメソッドはBase64形式のデータ文字列をAudioBufferにデコードして使用します。
     * @param {String} key キー値
     * @param {String} base64String Base64形式のデータ文字列
     **/
    snd.AudioDataManager.prototype.addBase64 = function(key, base64String) {
        var _this = this;
        this._dataMap[key] = {doesLoaded: false};

        var base64DataString = "";
        var matches = base64String.toLowerCase().match(/^data:audio.*base64,(.*)$/);
        if (matches) {
            base64DataString = matches[1];
        } else {
            base64DataString = base64String;
        }

        var data = atob(base64DataString);
        var dataArray = new ArrayBuffer(data.length);
        var dataBytes = new Uint8Array(dataArray);
        for (var i = 0; i < dataArray.byteLength; i++) {
            dataBytes[i] = data.charCodeAt(i) & 0xFF;
        }

        this._requests[key] = {};
        this._requests[key].send = function() {
            snd.AUDIO_CONTEXT.decodeAudioData(
                    dataArray,
                    function(buf) {
                        _this.loaded(key, buf);
                    });
        }
    };

    /**
     * 設定された全データのロードが完了しているかどうかを返します。
     * @returns {Boolean} 全データのロードが完了しているか否か
     */
    snd.AudioDataManager.prototype.doesAllDataLoaded = function() {
        for (var key in this._dataMap) {
            if (!this._dataMap[key].doesLoaded) {
                return false;
            }
        }
        return true;
    };

    /**
     * dataSetsで渡された全てのurlを追加します。<br/>
     * dataSetsには{キー:URL}となっているハッシュマップを渡してください。<br/>
     * キーが追加されるAudioBufferのキー値として使用され、URLがAudioBufferが読込むURLとして設定されます。<br/>
     * 渡されたURLが正規表現「/^data:audio.*base64,.*$/」とマッチする場合はDataURI文字列とし、base64の文字列部分をデータとして使用します。
     * <br/>
     * addAllを使用した時点ではまだ読込は開始されません。<br/>
     * データの読込を開始するには、load関数を使用する必要があります。
     * @param {HashMap} キー値と読み込むURLを指定したハッシュマップ
     * @see {snd.AudioDataManager.load}
     */
    snd.AudioDataManager.prototype.addAll = function(dataSets) {
        var keys = Object.keys(dataSets);
        for (var i = 0; i < keys.length; i++) {
            var key = keys[i];
            var uri = dataSets[key];
            if (uri != null) {
                var uriMatches = uri.match(/^data:audio.*base64,(.*)$/);
                if (uriMatches) {
                    var base64Data = uriMatches[1];
                    this.addBase64(key, base64Data);
                } else {
                    this.add(key, uri);
                }
            }
        }
    };

    /**
     * キーで指定されたデータをこのオブジェクトから削除します。
     * @param {type} key
     */
    snd.AudioDataManager.prototype.removeData = function(key) {
        if (this._requests[key] != null) {
            delete this._requests[key];
        }
        if (this._dataMap[key] != null) {
            delete this._dataMap[key];
        }
        if (this._eventListeners[key] != null) {
            delete this.eventLiteners[key];
        }
    }

    /**
     * keySetで指定された全てのデータをこのオブジェクトから削除します
     * @param {Array} keySet key文字列の配列
     */
    snd.AudioDataManager.prototype.removeAll = function(keySet) {
        for (var i = 0; i < keySet.length; i++) {
            removeData(keySet[i]);
        }
    }

    /**
     * keyで指定されたAudioBufferの読込を開始します。<br/>
     * 引数なし(またはkey==null)で、追加済みの全てのAudioBufferの読込を開始します。<br/>
     * 全てのデータの読込が終了した時点でonloadメソッドが呼ばれます。<br/>
     * (一つでも読込が終了していないAudioBufferがあるとonloadメソッドは呼ばれない点に注意してください。)<br/>
     * ある特定のAudioBufferに対して、読込終了時のコールバック関数を指定したい場合、setOnloadListenerメソッドを使用してください。
     * @param {String} key nullの場合全データロード
     * @see {snd.AudioDataManager.onload}
     * @see {snd.AudioDataManager.setOnloadListener}
     */
    snd.AudioDataManager.prototype.load = function(key) {
        if (!key) {
            var reqKeys = Object.keys(this._requests);
            for (var i = 0; i < reqKeys.length; i++) {
                var reqKey = reqKeys[i];
                if (this._dataMap[reqKey].doesLoaded == false) {
                    if (this._requests[reqKey].readyState == null || this._requests[reqKey].readyState < 2) {
                        this._requests[reqKey].send();
                    }
                }
            }
        } else {
            if (this._requests[key].readyState == null || this._requests[key].readyState < 2) {
                this._requests[key].send();
            }
        }
    };

    /**
     * keyで取得されるAudioBufferの読込が終了した際にsnd.AUDIO_CONTEXTから呼ばれるコールバック関数です。<br/>
     * AudioDataManagerが内部で使用するための関数なので、オーバーライドはしないでください。
     * @param {type} key 読み込みの終了したキー
     * @param {buffer} buf 読込んだバッファ
     */
    snd.AudioDataManager.prototype.loaded = function(key, buffer) {
        this._dataMap[key].data = buffer;
        this._dataMap[key].doesLoaded = true;
        if (this._eventListeners[key]) {
            for (var i = 0; i < this._eventListeners[key].onload.length; i++) {
                this._eventListeners[key].onload[i](buffer);
            }
        }

        for (var k in this._dataMap) {
            if (!this._dataMap[k].doesLoaded) {
                return;
            }
        }
        this.onload();
    };
});

snd.CLASS_DEF.push(function() {
    /**
     * コンストラクタは使用せず、snd.MASTERを使用してください。
     * @class ミキサークラスです。<br/>
     * snd.initメソッドでsnd.MASTERにインスタンスが生成されます。
     */
    snd.AudioMaster = function() {
        this.unitList = {};
        this._gain = snd.AUDIO_CONTEXT.createGain();
        this._gain.channelCount = snd.MAX_CHANNEL_COUNT;
        this._gain.connect(snd.AUDIO_CONTEXT.destination);
        this.id = snd.AudioMaster.ID;
    };

    snd.AudioMaster.ID = "snd.MASTER";

    /**
     * 新しくaudioUnitで指定されたユニットを接続します。
     * @param {type} key 接続するユニットを表すキー値
     * @param {snd.AudioUnit} audioUnit 接続するユニット
     */
    snd.AudioMaster.prototype.connectAudioUnit = function(key, audioUnit) {
        if (key == null && audioUnit.id == null) {
            throw "key == null && audioUnit.id == null";
        }

        if (key == null) {
            if (this.unitList[audioUnit.id] == null) {
                this.unitList[audioUnit.id] = audioUnit;
                audioUnit.connect(this._gain, snd.AudioMaster.ID);
            }
        } else {
            this.unitList[key] = audioUnit;
            audioUnit.connect(this._gain, snd.AudioMaster.ID);
        }
    };

    /**
     * 接続済みのユニットを取得します。
     * @param {String} key キー値
     */
    snd.AudioMaster.prototype.getAudioUnit = function(key) {
        return this.unitList[key];
    };

    /**
     * 接続されたユニットを切断します。
     * @param {String} key 切断するユニット
     */
    snd.AudioMaster.prototype.disconnectAudioUnit = function(key) {
        var audioUnit = this.unitList[key];
        audioUnit.getConnector().disconnect(this._gain);
        delete this.unitList[key];
    };

    snd.AudioMaster.prototype.getConnector = function() {
        return this._gain;
    };
});

snd.CLASS_DEF.push(function() {
    /**
     * 新しいオーディオユニットを生成します。
     * @class 1つのオーディオユニットを定義する抽象クラスです。<br/>
     * 引数にAudioUnitを要求するメソッドに渡すオブジェクトは、ここで定義されている各メソッドを実装している必要があります。<br/>
     * パラメータ "_status" はオーディオユニットのパラメータをまとめたオブジェクトで、JSONを使って保存・読み込みする際に使用されます。<br/>
     * _status内の値はプロパティから取得できるようになっているので、直接_statusを使用しないようにしてください。
     * @param id このオーディオユニットのID
     */
    snd.AudioUnit = function(id) {
        this._status = this.createStatus();

        this._status.id = id;

        Object.defineProperties(this, {
            isAudioUnit: {
                enumerable: true,
                get: function() {
                    return this._status.isAudioUnit;
                }
            },
            id: {
                enumerable: true,
                get: function() {
                    return this._status.id;
                }
            },
            connection: {
                enumerable: true,
                get: function() {
                    var ret = Object.create(this._status.connection);
                    return ret;
                }
            }
        });
    };

    /**
     * デフォルトの設定値(_status変数の値)を作るメソッドです。<br/>
     * snd.AudioUnit を継承するクラスはこのメソッドをオーバーライドしてください。<br/>
     * 戻り値は、snd.AudioUnit.Status を継承したクラスである必要があります。<br/>
     * @returns {snd.AudioUnit.Status} このクラスのデフォルト設定値
     */
    snd.AudioUnit.prototype.createStatus = function() {
        // PLEASE OVERRIDE ME
        return new snd.AudioUnit.Status();
    };

    /**
     * このオーディオユニットをconnectToで指定されたオーディオユニットまたはノードに接続します。<br/>
     * <div>
     * このオーディオユニットが出力側となり、connectToで渡される接続先は入力側になります。<br/>
     * 出入力が複数ある場合、任意の出力を任意の入力に接続したい場合は、indexOut, indexIn で出入力の番号を指定します。<br/>
     * indexOut, indexInが両方とも指定されなかった場合は、メソッドを呼び出したオブジェクトの0番の出力を connectTo で渡されたオブジェクトの0番の入力に接続します。<br/>
     * ※indexOut, indexIn の番号の意味はオーディオユニットにより異なります。<br/>
     * </div>
     * <div>
     * このメソッドを使って connectTo に接続した時に connection プロパティに connectTo.id が追加されます。<br/>
     * 引数 connectTo が id を持たない場合（connectTo.id == nullの場合）、connection プロパティには引数 id の値が追加されますので、 gain や frequency など、id を持たないパラメータへ接続する時は、引数 id に値を設定するようにしてください。<br/>
     * connectTo.id, id が両方とも null の場合は connection プロパティには何も追加されません。<br/>
     * connection プロパティに追加される文字列は以下の書式にしたがいます。<br/>
     * <strong>"ID_String[INDEX_OUT:INDEX_IN]"</strong>
     * </div>
     * <div>
     * このクラスを継承するクラスを作る場合、オーバーライドが必要です。(オーバーライドの際、apply必須)
     * </div>
     * @param {snd.AudioUnit} connectTo 接続するAudioUnit
     * @param {Number} indexOut 接続する出力側のアウトプットのインデックス
     * @param {Number} indexIn 接続する入力側のインプットのインデックス
     * @param {String} id connectTo.idがnullの場合に使用されるID
     */
    snd.AudioUnit.prototype.connect = function(connectTo, indexOut, indexIn, id) {
        if (connectTo.id != null || id != null) {
            var str = null;
            if (connectTo.id != null) {
                str = connectTo.id;
            } else if (id != null) {
                str = id;
            }

            str += "[" + ((indexOut != null) ? indexOut : "0") + ":" + ((indexIn != null) ? indexIn : "0") + "]";

            this._status.connection.push(str);
        }

        // PLEASE OVERRIDE ME LIKE THIS
        // SubClass.prototype.connect = function(connectTo, bra, bra) {
        //     AudioUnit.prototype.connect.apply(this, arguments);
        // };
    };

    /**
     * このオーディオユニットをdisconnectFromから切断します。<br/>
     * このメソッドを使って disconnectFrom との接続を切断した時、connection プロパティから disconnectFrom.id が削除されます。<br/>
     * 引数 disconnectFrom が id を持たない場合（disconnectFrom.id == nullの場合）、引数 id に設定された値が connection プロパティから削除されます。<br/>
     * connectTo.id, id が両方とも null の場合は connection プロパティからは何も削除されません。<br/>
     * このクラスを継承するクラスを作る場合、オーバーライドが必要です。(オーバーライドの際、apply必須)
     * @param {snd.AudioUnit} disconnectFrom 切断するAudioUnit
     * @param {Number} indexOut 切断するAudioUnitの出力
     * @param {String} id disconnectFrom.id が null の場合に使用されるID
     */
    snd.AudioUnit.prototype.disconnect = function(disconnectFrom, indexOut, id) {
        if (disconnectFrom.id != null || id != null) {
            var idx = -1;
            var str = "";

            if (disconnectFrom.id != null) {
                str = disconnectFrom.id;
            } else if (id != null) {
                str = id;
            }

            str += "[" + ((indexOut != null) ? indexOut : "0");
            for (var i = 0; i < this._status.connection.length; i++) {
                if (this._status.connection[i].substring(0, str.length) === str) {
                    idx = i;
                    break;
                }
            }

            if (idx >= 0) {
                this._status.connection.splice(idx, 1);
            }
        }

        // PLEASE OVERRIDE ME LIKE THIS
        // SubClass.prototype.connect = function(connectTo, bra, bra) {
        //     AudioUnit.prototype.disconnect.apply(this, arguments);
        // };
    };

    /**
     * このオーディオユニットの入り口となる、connect/disconnectメソッドを持つオブジェクトを返します。<br/>
     * AudioUnitクラス、SoundEnvironmentクラスなどのオブジェクトが使用する他、
     * AudioUnitクラスを既存のWebAudioAPIで作られたチェーンに組み込む場合などに使用されます。<br/>
     * このクラスを継承するクラスを作る場合、オーバーライドが必要です。
     */
    snd.AudioUnit.prototype.getConnector = function() {
        // PLEASE OVERRIDE ME
    };
    
    /**
     * 引数で渡されたAudioParamに接続されたGainノードを作り、返します。<br/>
     * 返されるGainノードには、渡されたAudioParamが持つ各メソッドを移譲したメソッドが定義されます。<br/>
     * AudioUnit内部のノードで再生成が必要となった際、外部からのAudioParamへの接続を維持するために使われます。<br/>
     * AudioUnitを継承するクラスで使用するメソッドなので、外部からは使用しないでください。
     * @param {AudioParam} audioParam 
     * @returns {Gain} 
     */
    snd.AudioUnit.prototype.createParamGain = function(audioParam) {
        var ret = snd.AUDIO_CONTEXT.createGain();
        ret._audioParam = audioParam;
        ret.connect(ret._audioParam);
        
        Object.defineProperties(ret, {
            value: {
                set: function(val) {
                    ret._audioParam.value = val;
                },
                get: function() {
                    return ret._audioParam.value;
                }
            },
            defaultValue: {
                get: function() {
                    return ret._audioParam.defaultValue;
                }
            }
        });
        ret.setValueAtTime = function(value, startTime) {
            ret._audioParam.setValueAtTime(value, startTime);
        };
        ret.linearRampToValueAtTime = function(value, endTime) {
            ret._audioParam.linearRampToValueAtTime(value, endTime);
        };
        ret.exponentialRampToValueAtTime = function(value, endTime) {
            ret._audioParam.exponentialRampToValueAtTime(value, endTime);
        };
        ret.setTargetAtTime = function(target, startTime, timeConstant) {
            ret._audioParam.setTargetAtTime(target, startTime, timeConstant);
        };
        ret.setValueCurveAtTime  = function(values, startTime, duration) {
            ret._audioParam.setValueCurveAtTime(values, startTime, duration);
        };
        ret.cancelScheduledValues = function(startTime) {
            ret._audioParam.cancelScheduledValues(startTime);
        };
        
        ret.setAudioParam = function(audioParam) {
            ret.disconnect(ret._audioParam);
            ret._audioParam = audioParam;
            ret.connect(ret._audioParam);
        }
        
        return ret;
    };
    
    /**
     * JSON.stringifyで使用されるメソッドです。<br/>
     * このメソッドの戻り値がJSON.stringifyの出力に使用されます。
     * @returns {snd.AudioUnit.Status}
     */
    snd.AudioUnit.prototype.toJSON = function() {
        return this._status;
    };

    /**
     * 引数jsonで渡された値をパースし、各種パラメータを設定します。<br/>
     * 接続先のリストは読み込みますが、このメソッドでは<strong>接続やイベントリスナの設定は行いません</strong>。<br/>
     * オーディオユニット同士のチェーンの再構築やイベントリスナの登録は別途で実装が必要です。<br/>
     * JSONの内容に不備があるなど、ロード中にエラーが発生した場合、snd.Exception 例外が throw されます。
     * 
     * @param {String} json 読み込むJSON文字列
     * @throws {snd.Exception} データ読込みでエラーが発生した場合
     */
    snd.AudioUnit.prototype.fromJSON = function(json) {
        var data = JSON.parse(json);

        try {
            this.loadData(data);
            this._status = data;
        } catch (e) {
            this._status = createStatus();
            throw e;
        }
    };

    /**
     * JSON文字列をパースしたデータオブジェクトを使って、このオブジェクトの各種設定値のロードを行います。<br/>
     * また、このメソッドはfromJSONメソッド内で呼び出されます。<br/>
     * このクラスを継承するクラスを作る場合、オーバーライドが必要です。(オーバーライドの際、apply必須)<br/>
     * オーバーライドする時は、toJSON メソッドで出力した内容を含むデータが渡される前提で作成し、不足などのエラーが発生した場合は snd.Exception クラスのオブジェクトを throw してください。
     * 
     * @param {Object} data JSON文字列をパースした結果。
     * @throws {snd.AudioUnit.Exception} データロード中に不足データなどの例外が発生した場合
     */
    snd.AudioUnit.prototype.loadData = function(data) {

        this._status.id = (data["id"] != null) ? data["id"] : "";
        this._status.connection = (data["connection"] != null) ? data["connection"] : [];
        this._status.channelCount = (data["channelCount"] != null) ? data["channelCount"] : 2;
        this._status.channelCountMode = (data["channelCountMode"] != null) ? data["channelCountMode"] : "max";
        this._status.channelInterpretation = (data["channelInterpretation"] != null) ? data["channelInterpretation"] : "discrete";


        // PLEASE OVERRIDE ME LIKE THIS
        // SubClass.prototype.connect = function(connectTo, bra, bra) {
        //     AudioUnit.prototype.loadData.apply(this, arguments);
        // };
    };
    
    /**
     * paramに渡されたAudioParamに所定のパラメータ・メソッドを追加して返します。<br/>
     * AudioUnitを継承するクラス内で使用される前提のメソッドですので、通常は使用しないようにしてください。<br/>
     * 追加されるものは以下の通りです。<br/>
     * <ul>
     *  <li>id プロパティ<br/>何のAudioParamであるかを表すID<br/>"osc0.volume"のように、AudioUnit.id + "." + subIDの形で使用されます。</li>
     *  <li>setScheduledValues メソッド<br/>このAudioParamの時間変化を設定するメソッド。<br/>詳細はsnd.util.setScheduledValuesメソッドの説明を参照してください。</li>
     * </ul>
     * @param {String} subID 何のAudioParamであるかを表すID
     * @param {AudioParam} param パラメータ等を追加するAudioParam 
     * @returns {AudioParam} 所定のパラメータ・メソッドを追加したparam
     */
    snd.AudioUnit.prototype.modAudioParam = function(subID, param) {
        if (!param.id) {
            var _param = param;

            param._id = this.id + "." + subID;

            Object.defineProperties(param, {
                id: {
                    get: function() {
                        return this._id;
                    }
                }
            });

            param.setScheduledValues = function(settings) {
                snd.util.setScheduledValues(_param, settings);
            };
        }
        return param;
    };

    /**
     * JSON.stringifyを使って出力した、AudioUnitオブジェクトのJSON文字列を読み込みます。
     * @param {String} json JSON文字列
     * @returns {snd.AudioUnit|snd.AudioUnit} jsonの内容を読み込んだsnd.AudioUnitオブジェクト 
     */
    snd.AudioUnit.loadJSON = function(json) {
        var ret = new snd.AudioUnit("");
        var data = JSON.parse(json);

        ret.loadData(data);

        return ret;
    };

    /**
     * オーディオユニットの各種設定情報を保持するクラスです。
     * @property {String} className このステータスを持つオブジェクトのクラス名
     * @property {Boolean} isAudioUnit このステータスを持つオブジェクトがsnd.AudioUnitクラスのメソッドを実装していることを表すブール値
     * @property {String} id このステータスを持つオブジェクトのID
     * @property {Array} connection このステータスを持つオブジェクトが接続しているオブジェクトのIDを格納する配列
     */
    snd.AudioUnit.Status = function() {
        this.className = "snd.AudioUnit";
        this.isAudioUnit = true;
        this.id = "";
        this.connection = [];

        this.channelCount = 2;
        this.channelCountMode = "max";
        this.channelInterpretation = "discrete";
    };
});


snd.CLASS_DEF.push(function() {
    /**
     * 音源を生成します。<br/>
     * typeプロパティはsnd.srctype.NONEに<br/>
     * statusプロパティはsnd.status.NONEに<br/>
     * それぞれ設定されます。
     * @class 各種音源クラスの親クラスとなる抽象クラスです。<br/>
     * start, stopなどの抽象メソッドは継承する子クラスで実装してください。
     * @property {Boolean} isSource このオブジェクトがsnd.Sourceであることを表すプロパティです。
     * @property {AudioParam} volumeParam この音源の音量を設定するためのAudioParamです。他のAudioUnitの出力をこのOscillatorの周波数の値に渡す場合などに使用するためのもので、このプロパティに直接値を代入することはできません。<br/>
     * この音源の音量に具体的な数値を設定したい場合は、volumeプロパティを使用してください。
     * @property {Number} volume この音源の音量を取得・設定するプロパティです。<br/>
     * 単位は[倍]です。（デシベルではありません）<br/>
     * @property {String} type この音源のクラス名です。<br/>
     * 値を設定することはできません。
     * @property {snd.status} status この音源の状態を表すプロパティです。<br/>
     * 値を設定することはできません。
     * @param {String} id この音源のID
     */
    snd.Source = function(id) {
        snd.AudioUnit.apply(this, arguments);

        this._gain = snd.AUDIO_CONTEXT.createGain();

        Object.defineProperties(this, {
            isSource: {
                get: function() {
                    return this._status.isSource;
                }
            },
            volumeParam: {
                get: function() {
                    return this.modAudioParam("volume", this._gain.gain);
                }
            },
            volume: {
                get: function() {
                    return this._gain.gain.value;
                },
                set: function(val) {
                    var v = parseFloat(val);
                    this._gain.gain.value = v;
                    this._status.volume = v;
                }
            },
            type: {
                get: function() {
                    return this._status.type;
                }
            },
            status: {
                get: function() {
                    return this._status.status;
                }
            }
        });
    };
    snd.Source.prototype = Object.create(snd.AudioUnit.prototype);
    snd.Source.prototype.constructor = snd.Source;

    snd.Source.CLASS_NAME = "snd.Source";

    /**
     * 音源の再生を開始します。
     */
    snd.Source.prototype.start = function() {
        // PLEASE OVERRIDE ME
    };

    /**
     * 音源の再生を停止します。
     */
    snd.Source.prototype.stop = function() {
        // PLEASE OVERRIDE ME
    };

    /**
     * @deprecated このメソッドは削除予定です。<br/> volumeプロパティを使用するようにしてください。
     */
    snd.Source.prototype.setGain = function(value) {
        this._gain.gain.value = value;
    };

    /**
     * @deprecated このメソッドは削除予定です。 volumeプロパティを使用するようにしてください。
     */
    snd.Source.prototype.getGain = function() {
        return this._gain.gain.value;
    };

    /**
     * 詳細はAudioUnitクラスのconnectを参照してください。
     * @param {AudioUnit} connectTo 接続先
     */
    snd.Source.prototype.connect = function(connectTo, indexIn, indexOut, id) {
        snd.AudioUnit.prototype.connect.apply(this, arguments);

        if (connectTo.isAudioUnit || connectTo.getConnector != null) {
            this._gain.connect(connectTo.getConnector(), indexIn, indexOut);
        } else {
            if (!indexOut) {
                this._gain.connect(connectTo, indexIn);
            } else {
                this._gain.connect(connectTo, indexIn, indexOut);
            }
        }
    };

    /**
     * 詳細はAudioUnitクラスのdisconnectFromを参照してください。
     * @param {AudioUnit} disconnectFrom 切断する接続先
     */
    snd.Source.prototype.disconnect = function(disconnectFrom, id) {
        snd.AudioUnit.prototype.disconnect.apply(this, arguments);

        if (disconnectFrom.isAudioUnit || disconnectFrom.getConnector != null) {
            this._gain.disconnect(disconnectFrom.getConnector());
        } else {
            this._gain.disconnect(disconnectFrom);
        }
    };

    snd.Source.prototype.getConnector = function() {
        return this._gain;
    };

    /**
     * 詳細はAudioUnitクラスの createStatus を参照してください。
     * @return {snd.AudioUnit.Status} このオブジェクトのデフォルト設定値
     */
    snd.Source.prototype.createStatus = function() {
        return new snd.Source.Status();
    };

    snd.Source.prototype.toJSON = function() {
        var ret = snd.AudioUnit.prototype.toJSON.apply(this, arguments);
        // volume プロパティを経由せずに _gain.gain.value に値が設定された場合
        // _status の volume には値が反映されないため、ここで改めて volume に値を設定
        ret.volume = this.volume;

        return ret;
    };

    snd.Source.prototype.loadData = function(data) {
        snd.AudioUnit.prototype.loadData.apply(this, arguments);

        this.volume = (data.volume != null) ? data.volume : 1.0;
    };

    snd.Source.loadJSON = function(json) {
        var data = JSON.parse(json);
        if (!data.isSource) {
            throw new snd.Exception("This JSON String is not instance of 'snd.Source' class.");
        }

        var ret = new snd.Source("");
        ret.loadData(data);
        return ret;
    };

    /**
     * @class snd.Sourceクラスの設定値を保持するステータスクラスです。<br/>
     * 音源の種類、状態、ボリュームなどの情報を持ちます。
     * @property {Boolean} isSource このオブジェクトが snd.Source を継承する音源であることを表す値
     * @property {snd.srctype} type 音源の種類
     * @property {snd.status} status 状態
     * @property {Float} volume ボリューム
     * @property {String} className この設定値を使用しているオブジェクトのクラス名
     */
    snd.Source.Status = function() {
        snd.AudioUnit.Status.apply(this, arguments);

        this.type = snd.srctype.NONE;
        this.status = snd.status.NONE;
        this.volume = 1;
        this.isSource = true;

        this.className = snd.Source.CLASS_NAME;
    };
});

snd.CLASS_DEF.push(function() {
    snd.Analyser = function(id) {
        snd.AudioUnit.apply(this, arguments);

        this._analyser = snd.AUDIO_CONTEXT.createAnalyser();
        this.resetBufferSize();

        /* DEFINE PROPERTIES */
        Object.defineProperties(this, {
            channelCount: {
                get: function() {
                    return this._status.channelCount;
                },
                set: function(val) {
                    this._output.channelCount = val;
                    this._connector.channelCount = val;
                    this._analyser.channelCount = val;
                    this._status.channelCount = val;
                }
            },
            channelCountMode: {
                get: function() {
                    return this._status.channelCountMode;

                },
                set: function(val) {
                    this._output.channelCountMode = val;
                    this._connector.channelCountMode = val;
                    this._analyser.channelCountMode = val;
                    this._status.channelCountMode = val;
                }
            },
            channelInterpretation: {
                get: function() {
                    return this._status.channelInterpretation;
                },
                set: function(val) {
                    this._output.channelInterpretation = val;
                    this._connector.channelInterpretation = val;
                    this._analyser.channelInterpretation = val;
                    this._status.channelInterpretation = val;
                }
            },
            floatFrequencyData: {
                get: function() {
                    this._analyser.getFloatFrequencyData(this._floatFrequencyDataBuffer);
                    return this._floatFrequencyDataBuffer;
                }
            },
            byteFrequencyData: {
                get: function() {
                    this._analyser.getByteFrequencyData(this._byteFrequencyDataBuffer);
                    return this._byteFrequencyDataBuffer;
                }
            },
            floatTimeDomainData: {
                get: function() {
                    this._analyser.getFloatTimeDomainData(this._floatTimeDomainDataBuffer);
                    return this._floatTimeDomainDataBuffer;
                }
            },
            byteTimeDomainData: {
                get: function() {
                    this._analyser.getByteTimeDomainData(this._byteTimeDomainDataBuffer);
                    return this._byteTimeDomainDataBuffer;
                }
            },
            fftSize: {
                get: function() {
                    return this._analyser.fftSize;
                },
                set: function(val) {
                    var v = parseInt(val);
                    this._analyser.fftSize = v;
                    this.resetBufferSize();
                }
            },
            frequencyBinCount: {
                get: function() {
                    return this._analyser.frequencyBinCount;
                }
            },
            minDecibels: {
                get: function() {
                    return this._analyser.minDecibels;
                },
                set: function(val) {
                    var v = parseFloat(val);
                    this._analyser.minDecibels = v;
                }
            },
            maxDecibels: {
                get: function() {
                    return this._analyser.maxDecibels;
                },
                set: function(val) {
                    var v = parseFloat(val);
                    this._analyser.maxDecibels = v;
                }
            },
            smoothingTimeConstant: {
                get: function() {
                    return this._analyser.smoothingTimeConstant;
                },
                set: function(val) {
                    var v = parseFloat(val);
                    this._analyser.smoothingTimeConstant = v;
                }
            }
        });

        this._status.smoothingTimeConstant = this._analyser.smoothingTimeConstant;
        this._status.fftSize = this._analyser.fftSize;
        this._status.maxDecibels = this._analyser.maxDecibels;
        this._status.minDecibels = this._analyser.minDecibels;
    };
    snd.Analyser.prototype = Object.create(snd.AudioUnit.prototype);
    snd.Analyser.prototype.constructor = snd.Gain;
    snd.Analyser.prototype.connect = function(connectTo, indexIn, indexOut, id) {
        snd.AudioUnit.prototype.connect.apply(this, arguments);
        if (connectTo.getConnector != null) {
            this._analyser.connect(connectTo.getConnector(), indexIn, indexOut);
        } else {
            this._analyser.connect(connectTo, indexIn, indexOut);
        }
    };
    snd.Analyser.prototype.disconnect = function(disconnectFrom, indexIn, id) {
        snd.AudioUnit.prototype.disconnect.apply(this, arguments);
        if (disconnectFrom.getConnector != null) {
            this._analyser.disconnect(disconnectFrom.getConnector(), indexIn);
        } else {
            this._analyser.disconnect(disconnectFrom, indexIn);
        }
    };
    snd.Analyser.prototype.createStatus = function() {
        return new snd.Analyser.Status();
    };
    snd.Analyser.prototype.getConnector = function() {
        return this._analyser;
    };
    snd.Analyser.prototype.loadData = function(data) {
        snd.AudioUnit.prototype.loadData.apply(this, arguments);

        this.fftSize = data.fftSize;
        this.maxDecibels = data.maxDecibels;
        this.smoothingTimeConstant = data.smoothingTimeConstant;
    };

    snd.Analyser.prototype.resetBufferSize = function() {
        this._byteFrequencyDataBuffer = new Uint8Array(this._analyser.frequencyBinCount);
        this._floatFrequencyDataBuffer = new Float32Array(this._analyser.frequencyBinCount);
        this._byteTimeDomainDataBuffer = new Uint8Array(this._analyser.fftSize);
        this._floatTimeDomainDataBuffer = new Float32Array(this._analyser.fftSize);
    };

    snd.Analyser.Status = function() {
        snd.AudioUnit.Status.apply(this, arguments);

        this.fftSize = 2048;
        this.maxDecibels = -30;
        this.minDecibels = -100;
        this.smoothingTimeConstant = 0.1;
    };
    snd.Analyser.Status.prototype = Object.create(snd.AudioUnit.Status.prototype);
    snd.Analyser.Status.prototype.constructor = snd.Analyser.Status;
});

snd.CLASS_DEF.push(function() {
    snd.BiquadFilter = function(id) {
        snd.AudioUnit.apply(this, arguments);

        this._connector = snd.AUDIO_CONTEXT.createGain();
        this._output = snd.AUDIO_CONTEXT.createGain();
        this._filter = snd.AUDIO_CONTEXT.createBiquadFilter();

        this._connector.connect(this._filter);
        this._filter.connect(this._output);

        /* DEFINE PROPERTIES */
        Object.defineProperties(this, {
            channelCount: {
                get: function() {
                    return this._status.channelCount;
                },
                set: function(val) {
                    this._connector.channelCount = val;
                    this._output.channelCount = val;
                    this._filter.channelCount = val;
                    this._status.channelCount = val;
                }
            },
            channelCountMode: {
                get: function() {
                    return this._status.channelCountMode;

                },
                set: function(val) {
                    this._connector.channelCountMode = val;
                    this._output.channelCountMode = val;
                    this._filter.channelCountMode = val;
                    this._status.channelCountMode = val;
                }
            },
            channelInterpretation: {
                get: function() {
                    return this._status.channelInterpretation;
                },
                set: function(val) {
                    this._connector.channelInterpretation = val;
                    this._output.channelInterpretation = val;
                    this._filter.channelInterpretation = val;
                    this._status.channelInterpretation = val;
                }
            },
            type: {
                get: function() {
                    return this._filter.type;
                },
                set: function(val) {
                    this._filter.type = val;
                    this._status.type = val;
                }
            },
            frequency: {
                get: function() {
                    return this._filter.frequency.value;
                },
                set: function(val) {
                    var v = parseFloat(val);
                    this._filter.frequency.value = v;
                    this._status.frequency = v;
                }
            },
            frequencyParam: {
                get: function() {
                    return this.modAudioParam("frequency", this._filter.frequency)
                }
            },
            detune: {
                get: function() {
                    return this._filter.detune.value;
                },
                set: function(val) {
                    var v = parseFloat(val);
                    this._filter.detune.value = v;
                    this._status.detune = v;
                }
            },
            detuneParam: {
                get: function() {
                    return this.modAudioParam("detune", this._filter.detune);
                }
            },
            Q: {
                get: function() {
                    return this._filter.Q.value;
                },
                set: function(val) {
                    var v = parseFloat(val);
                    this._filter.Q.value = v;
                    this._status.Q = v;
                }
            },
            QParam: {
                get: function() {
                    return this.modAudioParam("q", this._filter.Q);
                }
            },
            gain: {
                get: function() {
                    return this._filter.gain.value;
                },
                set: function(val) {
                    var v = parseFloat(val);
                    this._filter.gain.value = v;
                    this._status.gain = v;
                }
            },
            gainParam: {
                get: function() {
                    return this.modAudioParam("gain", this._filter.gain);
                }
            }
        });
    };
    snd.BiquadFilter.prototype = Object.create(snd.AudioUnit.prototype);
    snd.BiquadFilter.prototype.constructor = snd.Gain;

    snd.BiquadFilter.prototype.connect = function(connectTo, indexIn, indexOut, id) {
        snd.AudioUnit.prototype.connect.apply(this, arguments);
        if (connectTo.getConnector != null) {
            this._output.connect(connectTo.getConnector(), indexIn, indexOut);
        } else {
            this._output.connect(connectTo, indexIn, indexOut);
        }
    };
    snd.BiquadFilter.prototype.disconnect = function(disconnectFrom, indexIn, id) {
        snd.AudioUnit.prototype.disconnect.apply(this, arguments);
        if (disconnectFrom.getConnector != null) {
            this._output.disconnect(disconnectFrom.getConnector(), indexIn);
        } else {
            this._output.disconnect(disconnectFrom, indexIn);
        }
    };
    snd.BiquadFilter.prototype.createStatus = function() {
        return new snd.BiquadFilter.Status();
    };
    snd.BiquadFilter.prototype.getConnector = function() {
        return this._connector;
    };
    snd.BiquadFilter.prototype.loadData = function(data) {
        snd.AudioUnit.prototype.loadData.apply(this, arguments);

        // PLEASE WRITE LOADING METHODS HERE
    };

    snd.BiquadFilter.Status = function() {
        snd.AudioUnit.Status.apply(this, arguments);

        this.type = snd.LOWPASS;
        this.frequency = 350;
        this.detune = 0;
        this.Q = 1.0;
        this.gain = 0;
    };
    snd.BiquadFilter.Status.prototype = Object.create(snd.AudioUnit.Status.prototype);
    snd.BiquadFilter.Status.prototype.constructor = snd.BiquadFilter.Status;
});


snd.CLASS_DEF.push(function() {
    /**
     * AudioBufferを使用する音源を新しく生成します。
     * @class AudioBufferを使用してバイナリデータを再生する音源です。<br/>
     * 詳細はWebAudioAPIの仕様を参照してください。<br/>
     * wav, mp3などが再生可能ですが、ブラウザにより対応状況が異なります。
     * @param {String} id この音源のID
     */
    snd.BufferSource = function(id) {
        snd.Source.apply(this, arguments);

        this._source = null;
        this.audioBuffer = null;
        this._key = "";

        Object.defineProperties(this, {
            loop: {
                get: function() {
                    return this._status.loop;
                },
                set: function(loop) {
                    if (this._source && loop) {
                        this._source.loop = loop;
                        this._status.loop = loop;
                    }
                }
            },
            loopStart: {
                get: function() {
                    return this._status.loopStart;
                },
                set: function(val) {
                    var v = parseFloat(val);
                    if (this._source && v) {
                        this._source.loopStart = v;
                        this._status.loopStart = v;
                    }
                }
            },
            loopEnd: {
                get: function() {
                    return this._status.loopEnd;
                },
                set: function(val) {
                    var v = parseFloat(val);
                    if (this._source != null && v != null) {
                        this._source.loopEnd = v;
                        this._status.loopEnd = v;
                    }
                }
            }
        });

        this._eventListeners = {
            onended: [],
            onload: []
        };
    };
    snd.BufferSource.prototype = Object.create(snd.Source.prototype);
    snd.BufferSource.prototype.constructor = snd.BufferSource;

    snd.BufferSource.CLASS_NAME = "snd.BufferSource";

    /**
     * srcプロパティに設定された文字列がsnd.AUDIO_DATA_MANAGERのキー値かどうかを判定する際に使われる正規表現です。
     * @type RegExp
     */
    snd.BufferSource.REGEX_KEY = /^key:(.*)$/;

    /**
     * この音源の再生を開始します。<br/>
     * 一時停止はできません。<br/>
     * start()とすると、すぐにデータの頭から終わりまでの再生が開始されます。
     * 
     * @param {Number} when 何秒後に再生を開始するか
     * @param {Number} offset 音源の再生開始位置（単位:秒）
     * @param {Number} duration 音源の再生終了位置（単位:秒）
     */
    snd.BufferSource.prototype.start = function(when, offset, duration) {
        if (this._source != null && this.status == snd.status.READY) {
            if (when == null) {
                this._source.start(0);
            } else if (offset == null) {
                this._source.start(when);
            } else if (duration == null) {
                this._source.start(when, offset);
            } else {
                this._source.start(when, offset, duration);
            }
            this._status.status = snd.status.STARTED;
        } else {
            if (this.audioBuffer != null) {
                if (this.status == snd.status.STARTED) {
                    this.stop(0);
                    this._status.status = snd.status.STOPPED;
                } else {
                    this.setAudioBuffer(this.audioBuffer);
                }
                this.start(when, offset, duration);
            }
        }
    };

    /**
     * この音源を停止します。<br/>
     * 停止後も再度startメソッドを呼ぶことで何度でも再生が可能です。
     * @param {Number} when 何秒後に再生を停止するか 
     */
    snd.BufferSource.prototype.stop = function(when) {
        if (this._source != null && this.status == snd.status.STARTED) {
            if (when == null) {
                this._source.stop(0);
            } else {
                this._source.stop(when);
            }
        }
    };

    /**
     * @deprecated loop プロパティを使用してください。
     */
    snd.BufferSource.prototype.setLoop = function(status) {
        this.loop = status;
    };

    /**
     * @deprecated loop プロパティを使用してください。
     */
    snd.BufferSource.prototype.getLoop = function() {
        return this.loop;
    };

    /**
     * @deprecated loopStart プロパティを使用してください。
     */
    snd.BufferSource.prototype.setLoopStart = function(when) {
        this.loopStart = when;
    };

    /**
     * @deprecated loopStart プロパティを使用してください。
     */
    snd.BufferSource.prototype.getLoopStart = function() {
        return this.loopStart;
    };

    /**
     * @deprecated loopEnd プロパティを使用してください。
     */
    snd.BufferSource.prototype.setLoopEnd = function(when) {
        this.loopEnd = when;
    };

    /**
     * @deprecated loopEnd プロパティを使用してください。
     */
    snd.BufferSource.prototype.getLoopEnd = function() {
        return this.loopEnd;
    };

    /**
     * 与えられたURLのデータを読込みます。<br/>
     * 
     * @param {String} url
     */
    snd.BufferSource.prototype.loadURL = function(url) {
        var _this = this;

        this._status.src = url;
        
        var buf = snd.AUDIO_DATA_MANAGER.getAudioBuffer(url);
        if (!buf) {
            this._key = url;
            snd.AUDIO_DATA_MANAGER.add(this._key, url);
            snd.AUDIO_DATA_MANAGER.addOnLoadListener(this._key, function() {
                var audioBuffer = snd.AUDIO_DATA_MANAGER.getAudioBuffer(_this._key);
                _this.setAudioBuffer(audioBuffer);
                _this.fireOnLoadEvent();
            });
            snd.AUDIO_DATA_MANAGER.load(this._key);
        } else {
            this.setAudioBuffer(buf);
            _this.fireOnLoadEvent();
        }
    };

    /**
     * Base64文字列（DataURISchemeを含みます）を読み込みます。<br/>
     * 与えられた文字列がDataURISchemeの場合、srcプロパティに その文字列がそのまま設定されます。<br/>
     * そうでない場合は、与えられた文字列の頭に "data:audio/unknown;base64," を追加した文字列が src プロパティに設定されます。<br/>
     * DataURISchemeでない場合に文字列が追加されるのは、JSON.stringify でJSON文字列にした BufferSource オブジェクトを JSON.parse したオブジェクトを loadData メソッドで読み込む際に、srcがBase64文字列であることを認識させるためです。
     * @param {String} base64 Base64文字列（DataURISchemeを含む）
     */
    snd.BufferSource.prototype.loadBase64 = function(base64) {
        var _this = this;

        if (snd.util.REGEX_DATA_URI_SCHEME.exec(base64) != null) {
            this._status.src = base64;
        } else {
            //@TODO Detect audio encodings automatically.
            this._status.src = "data:audio/unknown;base64," + base64;
        }

        this._key = snd.util.getNewKey(this.id);
        snd.AUDIO_DATA_MANAGER.addBase64(this._key, base64);
        snd.AUDIO_DATA_MANAGER.addOnLoadListener(this._key, function() {
            var audioBuffer = snd.AUDIO_DATA_MANAGER.getAudioBuffer(_this._key);
            _this.setAudioBuffer(audioBuffer);
            _this.fireOnLoadEvent();
        });
        snd.AUDIO_DATA_MANAGER.load(this._key);
    };

    /**
     * keyで指定されたキー値を使用して、snd.AUDIO_DATA_MANAGERからAudioBufferを読み込みます。
     * @param {type} key snd.AUDIO_DATA_MANAGERから読み込むデータのキー値
     */
    snd.BufferSource.prototype.loadAudioBuffer = function(key) {
        this._status.src = "key:" + key;

        var buffer = snd.AUDIO_DATA_MANAGER.getAudioBuffer(key);
        this.setAudioBuffer(buffer);
        this.fireOnLoadEvent();
    }

    /**
     * AudioBufferを設定します。<br/>
     * このメソッドは、クラス内部で使用するためのものです。<br/>
     * 通常はloadAudioBufferメソッドを使用するようにし、このメソッドは使用しないでください。<br/>
     * src プロパティへの値の設定が行われないため、JSONを使用してオブジェクトを保存・読込みする際に正しく動作しなくなる可能性があります。
     * @param {AudioBuffer} audioBuffer 設定するAudioBuffer
     */
    snd.BufferSource.prototype.setAudioBuffer = function(audioBuffer) {
        this.audioBuffer = audioBuffer;

        var src = snd.AUDIO_CONTEXT.createBufferSource();
        if (this._source != null) {
            this._source.disconnect(this._gain);
        }
        delete this._source;
        this._source = src;
        this._source.buffer = this.audioBuffer;
        this._source.connect(this._gain);
        this.resetEventMethods(this._source);

        this._source.loop = this.loop;
        if (this.loopStart != null) {
            this._source.loopStart = this.loopStart;
        }
        if (this.loopEnd != null) {
            this._source.loopEnd = this.loopEnd;
        }
        this._status.status = snd.status.READY;
    };

    /* Add/Remove Event Listener Methods */

    /**
     * 渡されたイベントリスナーをこの音源の再生終了イベントのリスナーリストへ追加します。<br/>
     * 追加されたlistenerは、この音源の再生が終了したとき(onendedイベント発生時)にコールバックメソッドとして呼び出されます<br/>
     * @param {function} listener 音源の再生終了イベント発生時に呼び出されるコールバックメソッド
     */
    snd.BufferSource.prototype.addOnEndedEventListener = function(listener) {
        this._eventListeners['onended'].push(listener);
    };

    /**
     * 渡されたイベントリスナーをこの音源の再生終了イベントのリスナーリストから削除します。<br/>
     * 与えられたlistenerが見つかった場合、削除を行いtrueを返します。<br/>
     * 見つからなかった場合は、何もせずにfalseを返します。
     * @param {function} listener イベントのリスナー
     * @return {boolean} listenerが見つかり、実際に削除が行われたらtrue, そうでなければfalse
     */
    snd.BufferSource.prototype.removeOnEndedEventListener = function(listener) {
        var res = this._eventListeners['onended'].indexOf(listener);
        if (res > 0) {
            this._eventListeners['onended'].splice(res);
            return true;
        }
        return false;
    };

    snd.BufferSource.prototype.fireOnEndedEvent = function() {
        var _this = this;

        var listeners = this._eventListeners['onended'];
        for (i = 0; i < listeners.length; i++) {
            listeners[i].onended(_this);
        }
    };

    /**
     * 渡されたイベントリスナーをこの音源のロード終了イベントのリスナーリストへ追加します。<br/>
     * 注意: ロード終了イベントを受け取るには、<b>loadURL メソッドや loadBase64 メソッドを実行する前にこのメソッドでイベントリスナーを設定する必要があります。<b>
     * @param {type} listener ロード終了イベント発生時に呼び出されるコールバックメソッド
     */
    snd.BufferSource.prototype.addOnLoadEventListener = function(listener) {
        this._eventListeners['onload'].push(listener);
    };

    /**
     * 渡されたイベントリスナーをこの音源のロード終了イベントのリスナーリストから削除します。<br/>
     * 与えられたlistenerが見つかった場合、削除を行いtrueを返します。<br/>
     * 見つからなかった場合は、何もせずにfalseを返します。
     * @param {type} listener
     * @returns {Boolean} 削除が行われた場合True, 行われなかった場合 False
     */
    snd.BufferSource.prototype.removeOnLoadEventListener = function(listener) {
        var res = this._eventListeners['onload'].indexOf(listener);
        if (res > 0) {
            this._eventListeners['onload'].splice(i, 1);
            return true;
        }
        return false;
    };

    snd.BufferSource.prototype.fireOnLoadEvent = function() {
        var _this = this;

        var listeners = this._eventListeners['onload'];
        for (i = 0; i < listeners.length; i++) {
            listeners[i].onload(_this);
        }
    };

    snd.BufferSource.prototype.resetEventMethods = function() {
        var _this = this;

        this._source.onended = function() {
            _this._status.status = snd.status.STOPPED;
            _this.fireOnEndedEvent();
        };
    };

    snd.BufferSource.prototype.createStatus = function() {
        return new snd.BufferSource.Status();
    };

    snd.BufferSource.prototype.toJSON = function() {
        return this._status;
    };

    snd.BufferSource.prototype.loadData = function(data) {
        snd.Source.prototype.loadData.apply(this, arguments);

        var isDataURI = snd.util.REGEX_DATA_URI_SCHEME.exec(data.src);
        var isAudioManagerKey = snd.BufferSource.REGEX_KEY.exec(data.src);
        if (isDataURI != null) {
            this.loadBase64(data.src);
        } else if (isAudioManagerKey != null) {
            this.loadAudioBuffer(isAudioManagerKey[1]);
        } else if (data.src) {  // data.src == URL
            this.loadURL(data.src);
        }

        if (data.loop == true) {
            this.loop = true;
        }
        this.loopStart = data.loopStart;
        this.loopEnd = data.loopEnd;
    };

    snd.BufferSource.loadJSON = function(json) {
        var data = JSON.parse(json);
        if (data.className != snd.BufferSource.CLASS_NAME) {
            throw new snd.Exception(data.id + " is not instance of 'snd.BufferSource' class.");
        }

        var ret = new snd.BufferSource("");
        ret.loadData(data);

        return ret;
    };

    /**
     * @class BufferSourceの設定値を保持するクラスです。<br/>
     * ループ関連の設定値や、音データのパスなどを保持します。
     * @property {Boolean} loop ループするか否か
     * @property {Float} loopStart ループ開始地点[秒]
     * @property {Float} loopEnd ループ終了地点[秒]
     * @property {String} src 音データのパス<br/>
     * 下記の表に基づいて、「URL」,「DataURIScheme」,「snd.AUDIO_DATA_MANAGERのキー値」のいずれかが設定されます。<br/>
     * <table>
     * <tr><th>種類</th><th>判定</th><th>例</th></tr>
     * <tr><td>DataURI</td><td>/^data:audio.*base64,.*$/</td><td>data:audio/mpeg:base64,…（BASE64文字列）…</td></tr>
     * <tr><td>snd.AUDIO_DATA_MANAGERのキー値</td><td>/^key:.*$/</td><td>key:…（snd.AUDIO_DATA_MANAGERのキー値）…</td></tr>
     * <tr><td>URL</td><td>上記に当てはまらない文字列</td><td>./sound/data.mp3</td></tr>
     * </table>
     */
    snd.BufferSource.Status = function() {
        snd.Source.Status.apply(this, arguments);

        this.className = "snd.BufferSource";
        this.type = snd.srctype.AUDIO_BUFFER;
        this.loop = false;
        this.loopStart = null;
        this.loopEnd = null;
        this.src = "";
    };
});


snd.CLASS_DEF.push(function() {
    snd.Convolver = function(id) {
        snd.AudioUnit.apply(this, arguments);

        this._connector = snd.AUDIO_CONTEXT.createGain();
        this._output = snd.AUDIO_CONTEXT.createGain();
        this._convolver = snd.AUDIO_CONTEXT.createConvolver();
        this._status.audioBuffer = this._convolver.buffer;

        this._connector.connect(this._convolver);
        this._convolver.connect(this._output);

        this._key = "";

        /* DEFINE PROPERTIES */
        Object.defineProperties(this, {
            channelCount: {
                get: function() {
                    return this._status.channelCount;
                },
                set: function(val) {
                    this._output.channelCount = val;
                    this._connector.channelCount = val;
                    this._convolver.channelCount = val;
                    this._status.channelCount = val;
                }
            },
            channelCountMode: {
                get: function() {
                    return this._status.channelCountMode;

                },
                set: function(val) {
                    this._output.channelCountMode = val;
                    this._conector.channelCountMode = val;
                    this._convolver.channelCountMode = val;
                    this._status.channelCountMode = val;
                }
            },
            channelInterpretation: {
                get: function() {
                    return this._status.channelInterpretation;
                },
                set: function(val) {
                    this._output.channelInterpretation = val;
                    this._connector.channelInterpretation = val;
                    this._convolver.channelInterpretation = val;
                    this._status.channelInterpretation = val;
                }
            },
            buffer: {
                get: function() {
                    return this._convolver.buffer;
                },
                set: function(val) {
                    this._convolver.buffer = val;
                }
            },
            normalize: {
                get: function() {
                    return this._convolver.normalize;
                },
                set: function(val) {
                    this._convolver.normalize = val;
                    // ノーマライズの設定はバッファの再設定がないと反映されない
                    this.buffer = this.buffer;
                }
            }
        });

        this.channelCount = this._status.channelCount;
    };
    snd.Convolver.prototype = Object.create(snd.AudioUnit.prototype);
    snd.Convolver.prototype.constructor = snd.Gain;
    snd.Convolver.prototype.connect = function(connectTo, indexIn, indexOut, id) {
        snd.AudioUnit.prototype.connect.apply(this, arguments);
        if (connectTo.getConnector != null) {
            this._output.connect(connectTo.getConnector(), indexIn, indexOut);
        } else {
            this._output.connect(connectTo, indexIn, indexOut);
        }
    };
    snd.Convolver.prototype.disconnect = function(disconnectFrom, indexIn, id) {
        snd.AudioUnit.prototype.disconnect.apply(this, arguments);
        if (disconnectFrom.getConnector != null) {
            this._output.disconnect(disconnectFrom.getConnector(), indexIn);
        } else {
            this._output.disconnect(disconnectFrom, indexIn);
        }
    };
    snd.Convolver.prototype.createStatus = function() {
        return new snd.Convolver.Status();
    };
    snd.Convolver.prototype.getConnector = function() {
        return this._connector;
    };

    /**
     * URLのデータをバッファへ読み込みます。<br/>
     * 読み込み可能なデータのフォーマットは環境により異なる可能性があるため、snd.DOES_MP3_SUPPORTED定数などを参照してください。
     * @param {String} url 読み込むデータが配置されたURL
     */
    snd.Convolver.prototype.loadURL = function(url) {
        var _this = this;

        this._status.src = url;
        this._key = url;
        
        var buf = snd.AUDIO_DATA_MANAGER.getAudioBuffer(this._key);
        if (!buf) {
            snd.AUDIO_DATA_MANAGER.add(this._key, url);
            snd.AUDIO_DATA_MANAGER.addOnLoadListener(this._key, function() {
                _this.buffer = snd.AUDIO_DATA_MANAGER.getAudioBuffer(_this._key);
            });
            snd.AUDIO_DATA_MANAGER.load(this._key);
        } else {
            this.buffer = buf;
        }
    };

    /**
     * BASE64形式の文字列(DataURISchemeを含みます)をバッファへ読み込みます。<br/>
     * @param {type} base64String
     */
    snd.Convolver.prototype.loadBase64 = function(base64String) {
        var _this = this;

        if (snd.util.REGEX_DATA_URI_SCHEME.exec(base64String) != null) {
            this._status.src = base64String;
        } else {
            //@TODO Detect audio encodings automatically.
            this._status.src = "data:audio/unknown;base64," + base64String;
        }

        this._key = snd.util.getNewKey(this.id);
        snd.AUDIO_DATA_MANAGER.addBase64(this._key, base64String);
        snd.AUDIO_DATA_MANAGER.addOnLoadListener(this._key, function() {
            _this.buffer = snd.AUDIO_DATA_MANAGER.getAudioBuffer(_this._key);
        });
        snd.AUDIO_DATA_MANAGER.load(this._key);
    };

    /**
     * キー値でsnd.AUDIO_DATA_MANAGERからデータを取得し、バッファへ設定します。
     * @param {type} audioManagerKey
     */
    snd.Convolver.prototype.loadAudioBuffer = function(audioManagerKey) {
        this._key = audioManagerKey;
        this.buffer = snd.AUDIO_DATA_MANAGER.getAudioBuffer(audioManagerKey);
        this._status.src = "key:" + audioManagerKey;
    };

    snd.Convolver.prototype.loadData = function(data) {
        snd.AudioUnit.prototype.loadData.apply(this, arguments);

        this._status.src = data.src;
        if (snd.util.isAudioManagerKey(this._status.src)) {
            this.loadAudioBuffer(snd.util.stripAudioManagerKey(this._status.src));
        } else if (snd.util.isDataURI(this._status.src)) {
            this.loadBase64(this._status.src);
        } else {
            this.loadURL(this._status.src);
        }

        this._status.normalize = data.normalize;
    };

    snd.Convolver.Status = function() {
        snd.AudioUnit.Status.apply(this, arguments);
        this.src = "";
        this.normalize = true;
    };
    snd.Convolver.Status.prototype = Object.create(snd.AudioUnit.Status.prototype);
    snd.Convolver.Status.prototype.constructor = snd.Convolver.Status;
});

snd.CLASS_DEF.push(function() {
    snd.DynamicsCompressor = function(id) {
        snd.AudioUnit.apply(this, arguments);

        this._output = snd.AUDIO_CONTEXT.createGain();
        this._connector = snd.AUDIO_CONTEXT.createGain();
        this._compressor = snd.AUDIO_CONTEXT.createDynamicsCompressor();

        this._connector.connect(this._compressor);
        this._compressor.connect(this._output);

        /* DEFINE PROPERTIES */
        Object.defineProperties(this, {
            channelCount: {
                get: function() {
                    return this._status.channelCount;
                },
                set: function(val) {
                    this._connector.channelCount = val;
                    this._output.channelCount = val;
                    this._compressor.channelCount = val;
                    this._status.channelCount = val;
                }
            },
            channelCountMode: {
                get: function() {
                    return this._status.channelCountMode;

                },
                set: function(val) {
                    this._connector.channelCountMode = val;
                    this._output.channelCountMode = val;
                    this._compressor.channelCountMode = val;
                    this._status.channelCountMode = val;
                }
            },
            channelInterpretation: {
                get: function() {
                    return this._status.channelInterpretation;
                },
                set: function(val) {
                    this._connector.channelInterpretation = val;
                    this._output.channelInterpretation = val;
                    this._compressor.channelInterpretation = val;
                    this._status.channelInterpretation = val;
                }
            },
            attack: {
                get: function() {
                    return this._compressor.attack.value;
                },
                set: function(val) {
                    var v = parseFloat(val);
                    this._compressor.attack.value = v;
                    this._status.attack = v;
                }
            },
            attackParam: {
                get: function() {
                    return this.modAudioParam("attack", this._compressor.attack);
                }
            },
            knee: {
                get: function() {
                    return this._compressor.knee.value;
                },
                set: function(val) {
                    var v = parseFloat(val);
                    this._compressor.knee.value = v;
                    this._status.knee = v;
                }
            },
            kneeParam: {
                get: function() {
                    return this.modAudioParam("knee", this._compressor.knee);
                }
            },
            ratio: {
                get: function() {
                    return this._compressor.ratio.value;
                },
                set: function(val) {
                    var v = parseFloat(val);
                    this._compressor.ratio.value = v;
                    this._status.ratio = v;
                }
            },
            ratioParam: {
                get: function() {
                    return this.modAudioParam("ratio", this._compressor.ratio);
                }
            },
            reduction: {
                get: function() {
                    return this._compressor.reduction.value;
                }
            },
            release: {
                get: function() {
                    return this._compressor.release.value;
                },
                set: function(val) {
                    var v = parseFloat(val);
                    this._compressor.release.value = v;
                    this._status.release = v;
                }
            },
            releaseParam: {
                get: function() {
                    return this.modAudioParam("release", this._compressor.release);
                }
            },
            threshold: {
                get: function() {
                    return this._compressor.threshold.value;
                },
                set: function(val) {
                    var v = parseFloat(val);
                    this._compressor.threshold.value = v;
                    this._status.threshold = v;
                }
            },
            thresholdParam: {
                get: function() {
                    return this.modAudioParam("threshold", this._compressor.threshold);
                }
            },
        });
    };
    snd.DynamicsCompressor.prototype = Object.create(snd.AudioUnit.prototype);
    snd.DynamicsCompressor.prototype.constructor = snd.Gain;
    snd.DynamicsCompressor.prototype.connect = function(connectTo, indexIn, indexOut, id) {
        snd.AudioUnit.prototype.connect.apply(this, arguments);
        if (connectTo.getConnector != null) {
            this._output.connect(connectTo.getConnector(), indexIn, indexOut);
        } else {
            this._output.connect(connectTo, indexIn, indexOut);
        }
    };
    snd.DynamicsCompressor.prototype.disconnect = function(disconnectFrom, indexIn, id) {
        snd.AudioUnit.prototype.disconnect.apply(this, arguments);
        if (disconnectFrom.getConnector != null) {
            this._output.disconnect(disconnectFrom.getConnector(), indexIn);
        } else {
            this._output.disconnect(disconnectFrom, indexIn);
        }
    };
    snd.DynamicsCompressor.prototype.createStatus = function() {
        return new snd.DynamicsCompressor.Status();
    };
    snd.DynamicsCompressor.prototype.getConnector = function() {
        return this._connector;
    };
    snd.DynamicsCompressor.prototype.loadData = function(data) {
        snd.AudioUnit.prototype.loadData.apply(this, arguments);

        this.attack = data.attack;
        this.knee = data.knee;
        this.ratio = data.ratio;
        this.threshold = data.threshold;
        this.release = data.release;
    };

    snd.DynamicsCompressor.Status = function() {
        snd.AudioUnit.Status.apply(this, arguments);

        this.attack = 0.003;
        this.knee = 30;
        this.ratio = 12;
        this.threshold = -24;
        this.release = 0.250;
    };
    snd.DynamicsCompressor.Status.prototype = Object.create(snd.AudioUnit.Status.prototype);
    snd.DynamicsCompressor.Status.prototype.constructor = snd.DynamicsCompressor.Status;
});

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

snd.CLASS_DEF.push(function() {
    snd.Gain = function(id) {
        snd.AudioUnit.apply(this, arguments);

        this._gain = snd.AUDIO_CONTEXT.createGain();
        this._gain.channelCount = this._status.channelCount;

        /* DEFINE PROPERTIES */
        Object.defineProperties(this, {
            channelCount: {
                get: function() {
                    return this._status.channelCount;
                },
                set: function(val) {
                    this._gain.channelCount = val;
                    this._status.channelCount = val;
                }
            },
            channelCountMode: {
                get: function() {
                    return this._status.channelCountMode;

                },
                set: function(val) {
                    this._gain.channelCountMode = val;
                    this._status.channelCountMode = val;
                }
            },
            channelInterpretation: {
                get: function() {
                    return this._status.channelInterpretation;
                },
                set: function(val) {
                    this._gain.channelInterpretation = val;
                    this._status.channelInterpretation = val;
                }
            },
            gain: {
                get: function() {
                    return this._gain.gain.value;
                },
                set: function(val) {
                    var v = parseFloat(val);
                    this._gain.gain.value = v;
                    this._status.gain = v;
                }
            },
            gainParam: {
                get: function() {
                    return this.modAudioParam("gain", this._gain.gain);
                }
            }
        });
    };
    snd.Gain.prototype = Object.create(snd.AudioUnit.prototype);
    snd.Gain.prototype.constructor = snd.Gain;

    snd.Gain.prototype.connect = function(connectTo, indexIn, indexOut, id) {
        snd.AudioUnit.prototype.connect.apply(this, arguments);
        if (connectTo.getConnector != null) {
            this._gain.connect(connectTo.getConnector(), indexIn, indexOut);
        } else {
            this._gain.connect(connectTo, indexIn, indexOut);
        }
    };
    snd.Gain.prototype.disconnect = function(disconnectFrom, indexIn, id) {
        snd.AudioUnit.prototype.disconnect.apply(this, arguments);
        if (disconnectFrom.getConnector != null) {
            this._gain.disconnect(disconnectFrom.getConnector(), indexIn);
        } else {
            this._gain.disconnect(disconnectFrom, indexIn);
        }
    };
    snd.Gain.prototype.createStatus = function() {
        return new snd.Gain.Status();
    };
    snd.Gain.prototype.getConnector = function() {
        return this._gain;
    };
    snd.Gain.prototype.loadData = function(data) {
        snd.AudioUnit.prototype.loadData.apply(this, arguments);

        this.gain = data.gain;
    };

    snd.Gain.Status = function() {
        snd.AudioUnit.Status.apply(this, arguments);
        this.gain = 1.0;
    };
    snd.Gain.Status.prototype = Object.create(snd.AudioUnit.Status.prototype);
    snd.Gain.Status.prototype.constructor = snd.Gain.Status;
});

snd.CLASS_DEF.push(function() {
    /**
     * 新しくメディアタグを使用する音源を生成します。
     * @class HTMLのメディア要素（Audioタグなど）を音源として使用する音源クラスです。<br/>
     * 使用するタグに id が設定されている場合は、JSON.stringify メソッドを使用した際にその id が出力されるようになります。
     * @param {String} id この音源のID
     * @param {HTMLMediaElement} htmlMediaElement HTMLのメディアタグ要素
     * @memberof snd
     */
    snd.MediaElementAudioSource = function(id, htmlMediaElement) {
        snd.Source.apply(this, arguments);

        this.id = id;

        this.listeners = {
            onplay: [],
            onpause: [],
            onended: [],
            onabort: [],
            oncanplay: [],
            oncanplaythrough: [],
            ondurationchange: [],
            onemptied: [],
            onerror: [],
            onloadeddata: [],
            onloadedmetadata: [],
            onloadstart: [],
            onplaying: [],
            onprogress: [],
            onratechange: [],
            onseeked: [],
            onseeking: [],
            onstalled: [],
            onsuspend: [],
            ontimeupdate: [],
            onvolumechange: [],
            onwaiting: []
        };

        Object.defineProperties(this, {
            element: {
                get: function() {
                    return this._element;
                },
                set: function(elem) {
                    var _this = this;

                    this._source = snd.AUDIO_CONTEXT.createMediaElementSource(elem);
                    this._source.connect(this._gain);
                    this._element = elem;

                    if (this._element.id != null) {
                        this._status.element = this._element.id;
                    }

                    this._element.onplay = function() {
                        _this._status.status = snd.status.STARTED;
                        for (var i = 0; i < _this.listeners['onplay'].length; i++) {
                            _this.listeners['onplay'][i](_this);
                        }
                    };
                    this._element.onpause = function() {
                        _this._status.status = snd.status.PAUSED;
                        for (var i = 0; i < _this.listeners['onpause'].length; i++) {
                            _this.listeners['onpause'][i](_this);
                        }
                    };
                    this._element.onended = function() {
                        _this._status.status = snd.status.PAUSED;
                        for (var i = 0; i < _this.listeners['onended'].length; i++) {
                            _this.listeners['onended'][i](_this);
                        }
                    };
                    this._element.onabort = function() {
                        for (var i = 0; i < _this.listeners['onabort'].length; i++) {
                            _this.listeners['onabort'][i](_this);
                        }
                    };
                    this._element.oncanplay = function() {
                        if (_this.status == snd.status.NONE) {
                            _this._status.status = snd.status.READY;
                        }
                        for (var i = 0; i < _this.listeners['oncanplay'].length; i++) {
                            _this.listeners['oncanplay'][i](_this);
                        }
                    };
                    this._element.oncanplaythrough = function() {
                        for (var i = 0; i < _this.listeners['oncanplaythrough'].length; i++) {
                            _this.listeners['oncanplaythrough'][i](_this);
                        }
                    };
                    this._element.ondurationchange = function() {
                        for (var i = 0; i < _this.listeners['ondurationchange'].length; i++) {
                            _this.listeners['ondurationchange'][i](_this);
                        }
                    };
                    this._element.onemptied = function() {
                        for (var i = 0; i < _this.listeners['onemptied'].length; i++) {
                            _this.listeners['onemptied'][i](_this);
                        }
                    };
                    this._element.onerror = function() {
                        for (var i = 0; i < _this.listeners['onerror'].length; i++) {
                            _this.listeners['onerror'][i](_this);
                        }
                    };
                    this._element.onloadeddata = function() {
                        for (var i = 0; i < _this.listeners['onloadeddata'].length; i++) {
                            _this.listeners['onloadeddata'][i](_this);
                        }
                    };
                    this._element.onloadedmetadata = function() {
                        for (var i = 0; i < _this.listeners['onloadedmetadata'].length; i++) {
                            _this.listeners['onloadedmetadata'][i](_this);
                        }
                    };
                    this._element.onloadedstart = function() {
                        for (var i = 0; i < _this.listeners['onloadstart'].length; i++) {
                            _this.listeners['onloadstart'][i](_this);
                        }
                    };
                    this._element.onplaying = function() {
                        for (var i = 0; i < _this.listeners['onplaying'].length; i++) {
                            _this.listeners['onplaying'][i](_this);
                        }
                    };
                    this._element.onprogress = function() {
                        for (var i = 0; i < _this.listeners['onprogress'].length; i++) {
                            _this.listeners['onprogress'][i](_this);
                        }
                    };
                    this._element.onratechange = function() {
                        for (var i = 0; i < _this.listeners['onratechange'].length; i++) {
                            _this.listeners['onratechange'][i](_this);
                        }
                    };
                    this._element.onseeked = function() {
                        for (var i = 0; i < _this.listeners['onseeked'].length; i++) {
                            _this.listeners['onseeked'][i](_this);
                        }
                    };
                    this._element.onseeking = function() {
                        for (var i = 0; i < _this.listeners['onseeking'].length; i++) {
                            _this.listeners['onseeking'][i](_this);
                        }
                    };
                    this._element.onstalled = function() {
                        for (var i = 0; i < _this.listeners['onstalled'].length; i++) {
                            _this.listeners['onstalled'][i](_this);
                        }
                    };
                    this._element.onsuspend = function() {
                        for (var i = 0; i < _this.listeners['onsuspend'].length; i++) {
                            _this.listeners['onsuspend'][i](_this);
                        }
                    };
                    this._element.ontimeupdate = function() {
                        for (var i = 0; i < _this.listeners['ontimeupdate'].length; i++) {
                            _this.listeners['ontimeupdate'][i](_this);
                        }
                    };
                    this._element.onvolumechange = function() {
                        for (var i = 0; i < _this.listeners['onvolumechange'].length; i++) {
                            _this.listeners['onvolumechange'][i](_this);
                        }
                    };
                    this._element.onwaiting = function() {
                        for (var i = 0; i < _this.listeners['onwaiting'].length; i++) {
                            _this.listeners['onwaiting'][i](_this);
                        }
                    };
                }
            },
            src: {
                get: function() {
                    return this._element.src;
                },
                set: function(uri) {
                    this._element.src = uri;
                }
            }
        });

        if (htmlMediaElement != null) {
            this.element = htmlMediaElement;
        }
    };
    snd.MediaElementAudioSource.prototype = Object.create(snd.Source.prototype);
    snd.MediaElementAudioSource.prototype.constructor = snd.MediaElementAudioSource;

    snd.MediaElementAudioSource.CLASS_NAME = "snd.MediaElementAudioSource";

    /**
     * この音源の読み込みを開始します。
     */
    snd.MediaElementAudioSource.prototype.load = function() {
        this._element.load();
    };

    /**
     * この音源の再生を開始します。
     */
    snd.MediaElementAudioSource.prototype.start = function() {
        this._element.play();
    };

    /**
     * この音源を一時停止します。
     */
    snd.MediaElementAudioSource.prototype.pause = function() {
        this._element.pause();
    };

    /**
     * この音源を停止し、時刻を0へ戻します。
     */
    snd.MediaElementAudioSource.prototype.stop = function() {
        this._element.pause();
        this._element.currentTime = 0;
    };

    /**
     * この音源をループ再生するかどうかを設定します。<br/>
     * Audioタグを使用するため、ループ終点からループ始点に戻る速度がBufferSoundSourceと比較して遅く、間にブレイクが入る可能性があります。<br/>
     * なめらかにループしたい場合はBufferSoundSourceの使用を検討してください。
     * @param {type} doesLoop ループ再生するか否か
     */
    snd.MediaElementAudioSource.prototype.setLoop = function(doesLoop) {
        this._element.loop = doesLoop;
    };

    /* Add/Remove Listener Methods */

    /**
     * この音源のonplayイベント発生時に呼び出すコールバックメソッドを追加します。
     * @param {function} listener 追加するコールバックメソッド
     */
    snd.MediaElementAudioSource.prototype.addOnPlayEventListener = function(listener) {
        this.listeners['onplay'].push(listener);
    };

    /**
     * listenerで指定されたコールバックメソッドをonplayイベント発生時に呼び出されるリストから削除します。
     * @param {function} listener 削除するコールバックメソッド
     * @returns 削除されたらtrue, 削除されなかったらfalse
     */
    snd.MediaElementAudioSource.prototype.removeOnPlayEventListener = function(listener) {
        var a = this.listeners['onplay'];
        for (var i = 0; i < a.length; i++) {
            if (a[i] === listener) {
                a.splice(i, 1);
                return true;
            }
        }
        return false;
    };

    /**
     * この音源のイベント発生時に呼び出すコールバックメソッドを追加します。
     * @param {function} listener 追加するコールバックメソッド
     */
    snd.MediaElementAudioSource.prototype.addOnPauseEventListener = function(listener) {
        this.listeners['onPause'].push(listener);
    };

    /**
     * listenerで指定されたコールバックメソッドをイベント発生時に呼び出されるリストから削除します。
     * @param {function} listener 削除するコールバックメソッド
     * @returns 削除されたらtrue, 削除されなかったらfalse
     */
    snd.MediaElementAudioSource.prototype.removeOnPauseEventListener = function(listener) {
        var a = this.listeners['onPause'];
        for (var i = 0; i < a.length; i++) {
            if (a[i] === listener) {
                a.splice(i, 1);
                break;
            }
        }
    };

    /**
     * この音源のonendedイベント発生時に呼び出すコールバックメソッドを追加します。
     * @param {function} listener 追加するコールバックメソッド
     */
    snd.MediaElementAudioSource.prototype.addOnEndedEventListener = function(listener) {
        this.listeners['onended'].push(listener);
    };

    /**
     * listenerで指定されたコールバックメソッドをonendedイベント発生時に呼び出されるリストから削除します。
     * @param {function} listener 削除するコールバックメソッド
     * @returns 削除されたらtrue, 削除されなかったらfalse
     */
    snd.MediaElementAudioSource.prototype.removeOnEndedEventListener = function(listener) {
        var a = this.listeners['onended'];
        for (var i = 0; i < a.length; i++) {
            if (a[i] === listener) {
                a.splice(i, 1);
                return true;
            }
        }
        return false;
    };

    /**
     * この音源のonabortイベント発生時に呼び出すコールバックメソッドを追加します。
     * @param {function} listener 追加するコールバックメソッド
     */
    snd.MediaElementAudioSource.prototype.addOnAbortEventListener = function(listener) {
        this.listeners['onabort'].push(listener);
    };

    /**
     * listenerで指定されたコールバックメソッドをonabortイベント発生時に呼び出されるリストから削除します。
     * @param {function} listener 削除するコールバックメソッド
     * @returns 削除されたらtrue, 削除されなかったらfalse
     */
    snd.MediaElementAudioSource.prototype.removeOnAbortEventListener = function(listener) {
        var a = this.listeners['onabort'];
        for (var i = 0; i < a.length; i++) {
            if (a[i] === listener) {
                a.splice(i, 1);
                return true;
            }
        }
        return false;
    };

    /**
     * この音源のoncanplayイベント発生時に呼び出すコールバックメソッドを追加します。
     * @param {function} listener 追加するコールバックメソッド
     */
    snd.MediaElementAudioSource.prototype.addOnCanPlayEventListener = function(listener) {
        this.listeners['oncanplay'].push(listener);
    };

    /**
     * listenerで指定されたコールバックメソッドをoncanplayイベント発生時に呼び出されるリストから削除します。
     * @param {function} listener 削除するコールバックメソッド
     * @returns 削除されたらtrue, 削除されなかったらfalse
     */
    snd.MediaElementAudioSource.prototype.removeOnCanPlayEventListener = function(listener) {
        var a = this.listeners['oncanplay'];
        for (var i = 0; i < a.length; i++) {
            if (a[i] === listener) {
                a.splice(i, 1);
                return true;
            }
        }
        return false;
    };

    /**
     * この音源のoncanplaythroughイベント発生時に呼び出すコールバックメソッドを追加します。
     * @param {function} listener 追加するコールバックメソッド
     */
    snd.MediaElementAudioSource.prototype.addOnCanPlayThroughEventListener = function(listener) {
        this.listeners['oncanplaythrough'].push(listener);
    };

    /**
     * listenerで指定されたコールバックメソッドをoncanplaythroughイベント発生時に呼び出されるリストから削除します。
     * @param {function} listener 削除するコールバックメソッド
     * @returns 削除されたらtrue, 削除されなかったらfalse
     */
    snd.MediaElementAudioSource.prototype.removeOnCanPlayThroughEventListener = function(listener) {
        var a = this.listeners['onplaythrough'];
        for (var i = 0; i < a.length; i++) {
            if (a[i] === listener) {
                a.splice(i, 1);
                return true;
            }
        }
        return false;
    };

    /**
     * この音源のondurationchangeイベント発生時に呼び出すコールバックメソッドを追加します。
     * @param {function} listener 追加するコールバックメソッド
     */
    snd.MediaElementAudioSource.prototype.addOnDurationChangeEventListener = function(listener) {
        this.listeners['ondurationchange'].push(listener);
    };

    /**
     * listenerで指定されたコールバックメソッドをoncanplaythroughイベント発生時に呼び出されるリストから削除します。
     * @param {function} listener 削除するコールバックメソッド
     * @returns 削除されたらtrue, 削除されなかったらfalse
     */
    snd.MediaElementAudioSource.prototype.removeOnCanPlayThroughEventListener = function(listener) {
        var a = this.listeners['ondurationchange'];
        for (var i = 0; i < a.length; i++) {
            if (a[i] === listener) {
                a.splice(i, 1);
                return true;
            }
        }
        return false;
    };

    /**
     * この音源のonemptiedイベント発生時に呼び出すコールバックメソッドを追加します。
     * @param {function} listener 追加するコールバックメソッド
     */
    snd.MediaElementAudioSource.prototype.addOnEmptiedEventListener = function(listener) {
        this.listeners['onemptied'].push(listener);
    };

    /**
     * listenerで指定されたコールバックメソッドをonemptiedイベント発生時に呼び出されるリストから削除します。
     * @param {function} listener 削除するコールバックメソッド
     * @returns 削除されたらtrue, 削除されなかったらfalse
     */
    snd.MediaElementAudioSource.prototype.removeOnEmptiedEventListener = function(listener) {
        var a = this.listeners['onemptied'];
        for (var i = 0; i < a.length; i++) {
            if (a[i] === listener) {
                a.splice(i, 1);
                return true;
            }
        }
        return false;
    };

    /**
     * この音源のonerrorイベント発生時に呼び出すコールバックメソッドを追加します。
     * @param {function} listener 追加するコールバックメソッド
     */
    snd.MediaElementAudioSource.prototype.addOnErrorEventListener = function(listener) {
        this.listeners['onerror'].push(listener);
    };

    /**
     * listenerで指定されたコールバックメソッドをonerrorイベント発生時に呼び出されるリストから削除します。
     * @param {function} listener 削除するコールバックメソッド
     * @returns 削除されたらtrue, 削除されなかったらfalse
     */
    snd.MediaElementAudioSource.prototype.removeOnErrorEventListener = function(listener) {
        var a = this.listeners['onerror'];
        for (var i = 0; i < a.length; i++) {
            if (a[i] === listener) {
                a.splice(i, 1);
                return true;
            }
        }
        return false;
    };

    /**
     * この音源のonloadeddataイベント発生時に呼び出すコールバックメソッドを追加します。
     * @param {function} listener 追加するコールバックメソッド
     */
    snd.MediaElementAudioSource.prototype.addOnLoadedDataEventListener = function(listener) {
        this.listeners['onloadeddata'].push(listener);
    };

    /**
     * listenerで指定されたコールバックメソッドをonloadeddataイベント発生時に呼び出されるリストから削除します。
     * @param {function} listener 削除するコールバックメソッド
     * @returns 削除されたらtrue, 削除されなかったらfalse
     */
    snd.MediaElementAudioSource.prototype.removeOnLoadedDataEventListener = function(listener) {
        var a = this.listeners['onloadeddata'];
        for (var i = 0; i < a.length; i++) {
            if (a[i] === listener) {
                a.splice(i, 1);
                return true;
            }
        }
        return false;
    };

    /**
     * この音源のonloadedmetadataイベント発生時に呼び出すコールバックメソッドを追加します。
     * @param {function} listener 追加するコールバックメソッド
     */
    snd.MediaElementAudioSource.prototype.addOnLoadedMetadataEventListener = function(listener) {
        this.listeners['onloadedmetadata'].push(listener);
    };

    /**
     * listenerで指定されたコールバックメソッドをonloadedmetadataイベント発生時に呼び出されるリストから削除します。
     * @param {function} listener 削除するコールバックメソッド
     * @returns 削除されたらtrue, 削除されなかったらfalse
     */
    snd.MediaElementAudioSource.prototype.removeOnLoadedMetaDataEventListener = function(listener) {
        var a = this.listeners['onloadedmetadata'];
        for (var i = 0; i < a.length; i++) {
            if (a[i] === listener) {
                a.splice(i, 1);
                return true;
            }
        }
        return false;
    };

    /**
     * この音源のonloadstartイベント発生時に呼び出すコールバックメソッドを追加します。
     * @param {function} listener 追加するコールバックメソッド
     */
    snd.MediaElementAudioSource.prototype.addOnLoadStartEventListener = function(listener) {
        this.listeners['onloadstart'].push(listener);
    };

    /**
     * listenerで指定されたコールバックメソッドをonloadstartイベント発生時に呼び出されるリストから削除します。
     * @param {function} listener 削除するコールバックメソッド
     * @returns 削除されたらtrue, 削除されなかったらfalse
     */
    snd.MediaElementAudioSource.prototype.removeOnLoadStartEventListener = function(listener) {
        var a = this.listeners['onloadstart'];
        for (var i = 0; i < a.length; i++) {
            if (a[i] === listener) {
                a.splice(i, 1);
                return true;
            }
        }
        return false;
    };

    /**
     * この音源のonplayingイベント発生時に呼び出すコールバックメソッドを追加します。
     * @param {function} listener 追加するコールバックメソッド
     */
    snd.MediaElementAudioSource.prototype.addOnPlayingEventListener = function(listener) {
        this.listeners['onPlaying'].push(listener);
    };

    /**
     * listenerで指定されたコールバックメソッドをonplayingイベント発生時に呼び出されるリストから削除します。
     * @param {function} listener 削除するコールバックメソッド
     * @returns 削除されたらtrue, 削除されなかったらfalse
     */
    snd.MediaElementAudioSource.prototype.removeOnPlayingEventListener = function(listener) {
        var a = this.listeners['onPlaying'];
        for (var i = 0; i < a.length; i++) {
            if (a[i] === listener) {
                a.splice(i, 1);
                return true;
            }
        }
        return false;
    };

    /**
     * この音源のonprogressイベント発生時に呼び出すコールバックメソッドを追加します。
     * @param {function} listener 追加するコールバックメソッド
     */
    snd.MediaElementAudioSource.prototype.addOnProgressEventListener = function(listener) {
        this.listeners['onprogress'].push(listener);
    };

    /**
     * listenerで指定されたコールバックメソッドをonprogressイベント発生時に呼び出されるリストから削除します。
     * @param {function} listener 削除するコールバックメソッド
     * @returns 削除されたらtrue, 削除されなかったらfalse
     */
    snd.MediaElementAudioSource.prototype.removeOnProgressEventListener = function(listener) {
        var a = this.listeners['onprogress'];
        for (var i = 0; i < a.length; i++) {
            if (a[i] === listener) {
                a.splice(i, 1);
                return true;
            }
        }
        return false;
    };

    /**
     * この音源のonratecahngeイベント発生時に呼び出すコールバックメソッドを追加します。
     * @param {function} listener 追加するコールバックメソッド
     */
    snd.MediaElementAudioSource.prototype.addOnRateChangeEventListener = function(listener) {
        this.listeners['onratechange'].push(listener);
    };

    /**
     * listenerで指定されたコールバックメソッドをonratechangeイベント発生時に呼び出されるリストから削除します。
     * @param {function} listener 削除するコールバックメソッド
     * @returns 削除されたらtrue, 削除されなかったらfalse
     */
    snd.MediaElementAudioSource.prototype.removeOnRateChangeEventListener = function(listener) {
        var a = this.listeners['onratechange'];
        for (var i = 0; i < a.length; i++) {
            if (a[i] === listener) {
                a.splice(i, 1);
                return true;
            }
        }
        return false;
    };

    /**
     * この音源のonseekedイベント発生時に呼び出すコールバックメソッドを追加します。
     * @param {function} listener 追加するコールバックメソッド
     */
    snd.MediaElementAudioSource.prototype.addOnSeekedEventListener = function(listener) {
        this.listeners['onseeked'].push(listener);
    };

    /**
     * listenerで指定されたコールバックメソッドをonseekedイベント発生時に呼び出されるリストから削除します。
     * @param {function} listener 削除するコールバックメソッド
     * @returns 削除されたらtrue, 削除されなかったらfalse
     */
    snd.MediaElementAudioSource.prototype.removeOnSeekedEventListener = function(listener) {
        var a = this.listeners['onseeked'];
        for (var i = 0; i < a.length; i++) {
            if (a[i] === listener) {
                a.splice(i, 1);
                return true;
            }
        }
        return false;
    };

    /**
     * この音源のonseekingイベント発生時に呼び出すコールバックメソッドを追加します。
     * @param {function} listener 追加するコールバックメソッド
     */
    snd.MediaElementAudioSource.prototype.addOnSeekingEventListener = function(listener) {
        this.listeners['onseeking'].push(listener);
    };

    /**
     * listenerで指定されたコールバックメソッドをonseekingイベント発生時に呼び出されるリストから削除します。
     * @param {function} listener 削除するコールバックメソッド
     * @returns 削除されたらtrue, 削除されなかったらfalse
     */
    snd.MediaElementAudioSource.prototype.removeOnSeekingEventListener = function(listener) {
        var a = this.listeners['onseeking'];
        for (var i = 0; i < a.length; i++) {
            if (a[i] === listener) {
                a.splice(i, 1);
                return true;
            }
        }
        return false;
    };

    /**
     * この音源のonstalledイベント発生時に呼び出すコールバックメソッドを追加します。
     * @param {function} listener 追加するコールバックメソッド
     */
    snd.MediaElementAudioSource.prototype.addOnStalledEventListener = function(listener) {
        this.listeners['onstalled'].push(listener);
    };

    /**
     * listenerで指定されたコールバックメソッドをonstalledイベント発生時に呼び出されるリストから削除します。
     * @param {function} listener 削除するコールバックメソッド
     * @returns 削除されたらtrue, 削除されなかったらfalse
     */
    snd.MediaElementAudioSource.prototype.removeOnStalledEventListener = function(listener) {
        var a = this.listeners['onstalled'];
        for (var i = 0; i < a.length; i++) {
            if (a[i] === listener) {
                a.splice(i, 1);
                return true;
            }
        }
        return false;
    };

    /**
     * この音源のonsuspendイベント発生時に呼び出すコールバックメソッドを追加します。
     * @param {function} listener 追加するコールバックメソッド
     */
    snd.MediaElementAudioSource.prototype.addOnSuspendEventListener = function(listener) {
        this.listeners['onsuspend'].push(listener);
    };

    /**
     * listenerで指定されたコールバックメソッドをonsupendイベント発生時に呼び出されるリストから削除します。
     * @param {function} listener 削除するコールバックメソッド
     * @returns 削除されたらtrue, 削除されなかったらfalse
     */
    snd.MediaElementAudioSource.prototype.removeOnSuspendEventListener = function(listener) {
        var a = this.listeners['onsuspend'];
        for (var i = 0; i < a.length; i++) {
            if (a[i] === listener) {
                a.splice(i, 1);
                return true;
            }
        }
        return false;
    };

    /**
     * この音源のnotimeupdateイベント発生時に呼び出すコールバックメソッドを追加します。
     * @param {function} listener 追加するコールバックメソッド
     */
    snd.MediaElementAudioSource.prototype.addOnTimeUpdateEventListener = function(listener) {
        this.listeners['ontimeupdate'].push(listener);
    };

    /**
     * listenerで指定されたコールバックメソッドをontimeupdateイベント発生時に呼び出されるリストから削除します。
     * @param {function} listener 削除するコールバックメソッド
     * @returns 削除されたらtrue, 削除されなかったらfalse
     */
    snd.MediaElementAudioSource.prototype.removeOnTimeUpdateEventListener = function(listener) {
        var a = this.listeners['ontimeupdate'];
        for (var i = 0; i < a.length; i++) {
            if (a[i] === listener) {
                a.splice(i, 1);
                return true;
            }
        }
        return false;
    };

    /**
     * この音源のonvolumechangeイベント発生時に呼び出すコールバックメソッドを追加します。
     * @param {function} listener 追加するコールバックメソッド
     */
    snd.MediaElementAudioSource.prototype.addOnVolumeChangeEventListener = function(listener) {
        this.listeners['onvolumechange'].push(listener);
    };

    /**
     * listenerで指定されたコールバックメソッドをonvolumechangeイベント発生時に呼び出されるリストから削除します。
     * @param {function} listener 削除するコールバックメソッド
     * @returns 削除されたらtrue, 削除されなかったらfalse
     */
    snd.MediaElementAudioSource.prototype.removeOnVolumeChangeEventListener = function(listener) {
        var a = this.listeners['onvolumechange'];
        for (var i = 0; i < a.length; i++) {
            if (a[i] === listener) {
                a.splice(i, 1);
                return true;
            }
        }
        return false;
    };

    /**
     * この音源のonwaitingeイベント発生時に呼び出すコールバックメソッドを追加します。
     * @param {function} listener 追加するコールバックメソッド
     */
    snd.MediaElementAudioSource.prototype.addOnWaitingEventListener = function(listener) {
        this.listeners['onwaiting'].push(listener);
    };

    /**
     * listenerで指定されたコールバックメソッドをonwaitingイベント発生時に呼び出されるリストから削除します。
     * @param {function} listener 削除するコールバックメソッド
     * @returns 削除されたらtrue, 削除されなかったらfalse
     */
    snd.MediaElementAudioSource.prototype.removeOnWaitingEventListener = function(listener) {
        var a = this.listeners['onwaiting'];
        for (var i = 0; i < a.length; i++) {
            if (a[i] === listener) {
                a.splice(i, 1);
                return true;
            }
        }
        return false;
    };

    snd.MediaElementAudioSource.prototype.createStatus = function() {
        return new snd.MediaElementAudioSource.Status();
    }

    snd.MediaElementAudioSource.prototype.toJSON = function() {
        return this._status;
    };

    snd.MediaElementAudioSource.prototype.loadData = function(data) {
        snd.Source.prototype.loadData.apply(this, arguments);

        if (data.element != null) {
            var elem = document.getElementById(data.element);
            if (elem != null) {
                this.element = elem;
            }
        }
    };

    snd.MediaElementAudioSource.loadJSON = function(json) {
        var data = JSON.parse(json);
        if (data.className != snd.MediaElementAudioSource.CLASS_NAME) {
            throw new snd.Exception(data.id + " is not instance of 'snd.MediaElementAudioSource' class.");
        }

        var ret = new snd.MediaElementAudioSource("");
        ret.loadData(data);

        return ret;
    };

    snd.MediaElementAudioSource.Status = function() {
        snd.Source.Status.apply(this, arguments);

        this.className = snd.MediaElementAudioSource.CLASS_NAME;
        this.status = snd.status.NONE;
        this.element = "";
    }
    snd.MediaElementAudioSource.Status.prototype = Object.create(snd.Source.Status.prototype);
    snd.MediaElementAudioSource.Status.prototype.constructor = snd.MediaElementAudioSource.Status;
});



snd.CLASS_DEF.push(function() {
    /**
     * 新しくストリーム音源を作ります。
     * @class 音声ストリームを音源として使用する音源クラスです。<br/>
     * WebRTCのGetUserMediaで取得したストリームを使用することができます。
     * @param {String} id この音源のID
     * @param {MediaStream} mediaStream 再生するデータストリーム<br/>
     * nullの場合、自動で音声ストリームを取得します。
     * @param {function} callback オブジェクトの生成に成功した時に呼び出されるコールバックメソッドです。(未設定可)<br/>
     * 呼び出される際は、引数として生成されたオブジェクトが渡されます。<br/>
     * mediaStreamがnullの場合のみ使用される引数で、mediaStreamに値が設定されている場合は使用されません。
     * @param {function} オブジェクトの生成に失敗した時に呼び出されるエラーコールバックです。(未設定可)<br/>
     * 呼び出される際は、getUserMediaメソッドから返されるエラーオブジェクトが渡されます。<br/>
     * mediaStreamがnullの場合のみ使用される引数で、mediaStreamに値が設定されている場合は使用されません。<br/>
     * 未設定の場合、コンソールへのログ出力のみ行います。
     * @memberOf snd
     */
    snd.MediaStreamAudioSource = function(id, mediaStream, callback, errorCallback) {
        snd.Source.apply(this, arguments);

        this._status.type = snd.srctype.MEDIA_STREAM;
        this._status.className = "snd.MediaStreamAudioSource";
        this._status.status = snd.status.NONE;
        
        if (!mediaStream) {
            var _this = this;
            var cb, ecb;
            cb = function(localMediaStream) {
                _this._source = new snd.MediaStreamAudioSource(id, localMediaStream);
                _this._source.connect(_this._gain);
                _this._status.status = snd.status.READY;
                
                if (callback) {
                    callback(_this);
                }
            };
            if (!errorCallback) {
                ecb = function(err) {
                    console.log("getUserMedia failed: " + err);
                };
            } else {
                ecb = errorCallback;
            }
            
            if (navigator.getUserMedia) {
                navigator.getUserMedia({audio:true}, cb, ecb);
            } else if (navigator.mozGetUserMedia) {
                navigator.mozGetUserMedia({audio:true}, cb, ecb);
            } else if (navigator.webkitGetUserMedia) {
                navigator.webkitGetUserMedia({audio:true}, cb, ecb);
            }
        } else {
            this._source = snd.AUDIO_CONTEXT.createMediaStreamSource(mediaStream);
            this._source.connect(this._gain);
            this._status.status = snd.status.READY;
        }
    };
    snd.MediaStreamAudioSource.prototype = Object.create(snd.Source.prototype);
    snd.MediaStreamAudioSource.prototype.constructor = snd.MediaStreamAudioSource;

    snd.MediaStreamAudioSource.prototype.createSource = function() {
        return new snd.MediaStreamAudioSource.Status();
    };

    snd.MediaStreamAudioSource.prototype.toJSON = function() {
        return this._status;
    };

    snd.MediaStreamAudioSource.prototype.loadData = function() {
        snd.Source.prototype.loadData.apply(this, arguments);
    };

    snd.MediaStreamAudioSource.Status = function() {
        snd.Source.Status.apply(this, arguments);

    };
    snd.MediaStreamAudioSource.prototype = Object.create(snd.Source.prototype);
    snd.MediaStreamAudioSource.prototype.constructor = snd.MediaStreamAudioSource;
});

snd.CLASS_DEF.push(function() {
    /**
     * 新しくオシレータ音源を生成します。
     * @class 任意の波形を再生するオシレータ音源を扱うクラスです。<br/>
     * snd.OscillatorSource.SINEなどの定数値でサイン波・矩形波・のこぎり波・三角波を設定できる他、波形はPeriodicWaveクラスでも定義が可能です。
     * @property {AudioParam} frequencyParam このOscillatorの周波数を変更するためのAudioParamです。他のAudioUnitの出力をこのOscillatorの周波数の値に渡す場合などに使用するためのもので、このプロパティに直接値を代入することはできません。<br/>
     * Oscillatorに具体的な周波数を設定したい場合は、frequencyプロパティを使用してください。<br/>
     * oscillatorが初期化されていない場合、undefinedが戻ります。
     * @property {Number} frequency このOscillatorの周波数です。<br/>
     * frequencyParamとは異なり、数値を直接渡すことが可能です。<br/>
     * 単位は[hz]です。<br/>
     * oscillatorが初期化されていない場合、undefinedが戻ります。
     * @property {AudioParam} detumeParam このOscillatorの周波数を変更するためのAudioParamです。他のAudioUnitの出力をこのOscillatorの周波数の値に渡す場合などに使用するためのもので、このプロパティに直接値を代入することはできません。<br/>
     * Oscillatorに具体的な値を設定したい場合は、detuneプロパティを使用してください。<br/>
     * oscillatorが初期化されていない場合、undefinedが戻ります。
     * @property {Number} detune このOscillatorのdetuneです。<br/>
     * frequencyに対して、音程の微妙な調整を行いたい場合に使用する値です。<br/>
     * detuneParamとは異なり、数値を直接渡すことが可能です。<br/>
     * 単位は[cent]です。（cent … 1/1200オクターブ。半音の1/100）<br/>
     * oscillatorが初期化されていない場合、undefinedが戻ります。
     * @param {String} id この音源をあらわすID
     */
    snd.OscillatorSource = function(id) {
        snd.Source.apply(this, arguments);

        this._periodicWave = null;
        this._source = null;
        
        this._frequencyGain = null;
        this._detuneGain = null;

        this.listeners = {
            onended: []
        };

        Object.defineProperties(this, {
            periodicWave: {
                get: function() {
                    var ret = {};
                    ret.realArray = this._status.periodicWave.realArray;
                    ret.imagArray = this._status.periodicWave.imagArray;
                    return ret;
                },
                set: function(val) {
                    if (val == null) {
                        this._periodicWave = null;
                        this._status.periodicWave = null;

                        if (this._status.oscillatorType == snd.OscillatorSource.CUSTOM) {
                            this._status.oscillatorType = null;
                        }

                        this.setWaveForm();
                    } else if (val.realArray == null || val.imagArray == null) {
                        console.warn("periodicWave property must have realArray and imagArray.");
                    } else {
                        this._status.periodicWave = {
                            realArray: val.realArray,
                            imagArray: val.imagArray
                        };

                        this._status.oscillatorType = snd.OscillatorSource.CUSTOM;

                        this.setWaveForm();
                    }
                }
            },
            oscillatorType: {
                get: function() {
                    return this._status.oscillatorType;
                },
                set: function(val) {
                    this._status.oscillatorType = val;
                    if (this._source) {
                        this._source.type = val;
                    }

                    this._periodicWave = null;
                    this._status.periodicWave = null;
                }
            },
            frequency: {
                get: function() {
                    if (this._source != null) {
                        return this._source.frequency.value;
                    } else {
                        return undefined;
                    }
                },
                set: function(val) {
                    if (this._source != null) {
                        this._source.frequency.value = (val) ? parseFloat(val) : 0.0;
                        this._status.frequency = this._source.frequency.value;
                    }
                }
            },
            frequencyParam: {
                get: function() {
                    if (this._source != null) {
                        return this.modAudioParam("frequency", this._frequencyGain);
                    } else {
                        return undefined;
                    }
                }
            },
            detune: {
                get: function() {
                    if (this._source != null) {
                        return this._source.detune.value;
                    } else {
                        return undefined;
                    }
                },
                set: function(val) {
                    if (this._source != null) {
                        this._source.detune.value = (val) ? parseFloat(val) : 0.0;
                        this._status.detune = val;
                    }
                }
            },
            detuneParam: {
                get: function() {
                    if (this._source != null) {
                        return this.modAudioParam("detune", this._detuneGain);
                    } else {
                        return undefined;
                    }
                }
            }
        });

        this.resetOscillator();
    };
    snd.OscillatorSource.prototype = Object.create(snd.Source.prototype);
    snd.OscillatorSource.prototype.constructor = snd.OscillatorSource;

    snd.OscillatorSource.CLASS_NAME = "snd.OscillatorSource";

    /**
     * 基準となる周波数(440Hz)です。
     * @type Number
     * @memberOf snd.OscillatorSource
     */
    snd.OscillatorSource.DEFAULT_FREQUENCY = 440;

    /**
     * サイン波を表す定数値です。
     * @type String
     * @memberOf snd.OscillatorSource
     */
    snd.OscillatorSource.SINE = "sine";
    /**
     * 矩形波を表す定数値です。
     * @type String
     * @memberOf snd.OscillatorSource
     */
    snd.OscillatorSource.SQUARE = "square";
    /**
     * のこぎり波を表す定数値です。
     * @type String
     * @memberOf snd.OscillatorSource
     */
    snd.OscillatorSource.SAWTOOTH = "sawtooth";
    /**
     * 三角波を表す定数値です。
     * @type String
     * @memberOf snd.OscillatorSource
     */
    snd.OscillatorSource.TRIANGLE = "triangle";
    /**
     * 波形にPeriodicWaveを使用している場合にoscillatorTypeに自動で設定される値です。<br/>
     * この定数は判定に使用するために用意したもので、波形の指定には使用しないでください。
     * @type String
     * @memberOf snd.OscillatorSource
     */
    snd.OscillatorSource.CUSTOM = "custom";

    snd.OscillatorSource.prototype.setWaveForm = function() {
        if (this._status.periodicWave != null) {
            this._periodicWave = snd.AUDIO_CONTEXT.createPeriodicWave(this._status.periodicWave.realArray, this._status.periodicWave.imagArray);
            this._source.setPeriodicWave(this._periodicWave);
        } else if (this._status.oscillatorType != null && this._status.oscillatorType != snd.OscillatorSource.CUSTOM) {
            this._source.type = this._status.oscillatorType;
        } else {
            this._source.type = snd.OscillatorSource.SINE;
            this._status.oscillatorType = snd.OscillatorSource.SINE;
            this._status.periodicWave = null;
            this._periodicWave = null;
        }
    };

    /**
     * 波形の種類を設定します。<br/>
     * 引数には、snd.SINE, snd.SQUARE, snd.SAWTOOTH, snd.oscillatortype.TRIANGLEのいずれかを設定してください。
     * @param {OscillatorType} oscillatorType
     * @deprecated oscillatorTypeプロパティを使用してください。
     */
    snd.OscillatorSource.prototype.setOscillatorType = function(oscillatorType) {
        if (this._source != null) {
            this._source.type = oscillatorType;
        }
    };

    /**
     * このオシレータの波形の種類を返します。<br/>
     * @returns {String} 波形の種類
     * @deprecated oscillatorTypeプロパティを使用してください。
     */
    snd.OscillatorSource.prototype.getOscillatorType = function() {
        return this.oscillatorType;
    };

    /**
     * 周波数を設定します。
     * @param {type} hz 周波数[Hz]
     * @deprecated frequencyプロパティを使用してください。
     */
    snd.OscillatorSource.prototype.setFrequency = function(hz) {
        this.frequency = hz;
    };

    /**
     * 現在の周波数を取得します。
     * @returns {Number} 周波数[Hz]
     * @deprecated frequencyプロパティを使用してください。
     */
    snd.OscillatorSource.prototype.getFrequency = function() {
        return this.frequency;
    };

    /**
     * ピッチシフトの量を設定します。<br/>
     * 単位はセントです。
     * @param {Number} ピッチシフトの量 [cent]
     * @deprecated detuneプロパティを使用してください。
     */
    snd.OscillatorSource.prototype.setDetune = function(cent) {
        this.detune = cent;
    };

    /**
     * ピッチシフトの量を取得します<br/>
     * 単位はセントです。
     * @returns {Number} ピッチシフトの量 [cent]
     * @deprecated detuneプロパティを使用してください。
     */
    snd.OscillatorSource.prototype.getDetune = function() {
        return this.detune;
    };

    /**
     * フーリエ級数で表された波形を、このオシレータの波形として設定します。<br/>
     * @param {Float32Array} realArray フーリエ級数の実数部の配列
     * @param {Float32Array} imagArray フーリエ級数の虚数部の配列
     * @deprecated periodicWaveプロパティを使用してください。
     */
    snd.OscillatorSource.prototype.setPeriodicWave = function(realArray, imagArray) {
        this.periodicWave = {
            realArray: realArray,
            imagArray: imagArray
        };
    };

    /**
     * この音源の波形データを返します。
     * @returns {Object} 実数配列と虚数配列をまとめたオブジェクト（ret = {realArray:Float32Array, imagArray:Float32Array}）
     * @deprecated periodicWaveプロパティを使用してください。
     */
    snd.OscillatorSource.prototype.getPeriodicWave = function() {
        return this._periodicWave;
    }

    /**
     * 波形の再生をスタートします。
     * 
     * @param {float} when 開始時刻 [秒]
     * @param {type} offset 使用しません
     * @param {type} duration 使用しません
     */
    snd.OscillatorSource.prototype.start = function(when, offset, duration) {
        if (this.status == snd.status.STOPPED) {
            this.resetOscillator();
        }

        if (this._source != null && this.status != snd.status.STARTED && this.status != snd.status.STOPPED) {
            if (when == null) {
                this._source.start(0);
            } else {
                this._source.start(when);
            }
            this._status.status = snd.status.STARTED;
        }
    };


    /**
     * 波形の出力を停止します。<br/>
     * !!注意!!<br/>
     * stopメソッドを使って波形の出力を停止すると、再度startメソッドを使っても
     * @param {float} when 終了するタイミング
     */
    snd.OscillatorSource.prototype.stop = function(when) {
        if (this.status == snd.status.STARTED) {
            if (when == null) {
                this._source.stop(0);
            } else {
                this._source.stop(when);
            }
            this._status.status = snd.status.STOPPED;
        }
    };

    snd.OscillatorSource.prototype.resetOscillator = function() {
        var _this = this;

        if (this._source != null) {
            if (this.status == snd.status.STARTED) {
                this.stop(0);
            }
        }

        this._source = snd.AUDIO_CONTEXT.createOscillator();
        this._source.onended = function() {
            _this.fireOnEndedEvent();
        };

        this.setWaveForm();
        this.detune = this._status.detune;
        this.frequency = this._status.frequency;
        
        if (!this._frequencyGain) {
            this._frequencyGain = this.createParamGain(this._source.frequency);
        } else {
            this._frequencyGain.setAudioParam(this._source.frequency);
        }
        if (!this._detuneGain) {
            this._detuneGain = this.createParamGain(this._source.detune);
        } else {
            this._detuneGain.setAudioParam(this._source.detune);
        }

        this._source.connect(this._gain);

        this._status.status = snd.status.READY;
    };

    /* Add/Remove Event Listener Methods */

    snd.OscillatorSource.prototype.addOnEndedEventListener = function(listener) {
        this.listeners['onended'].push(listener);
    };

    snd.OscillatorSource.prototype.removeOnEndedEventListener = function(listener) {
        var a = this.listeners['onended'];
        for (var i = 0; i < a.length; i++) {
            if (a[i] === listener) {
                a.splice(i, 1);
                break;
            }
        }
    };
    
    snd.OscillatorSource.prototype.onended = function(oscillator) {
    };

    snd.OscillatorSource.prototype.fireOnEndedEvent = function() {
        if (typeof(this.onended) == "function") {
            this.onended(this);
        }
        
        var listeners = this.listeners['onended'];
        for (var i = 0; i < listeners; i++) {
            if (typeof(listeners[i]) == "function") {
                listeners[i](this);
            }
        }
    };

    snd.OscillatorSource.prototype.createStatus = function() {
        return new snd.OscillatorSource.Status();
    };

    snd.OscillatorSource.prototype.toJSON = function() {
        return this._status;
    };

    snd.OscillatorSource.prototype.loadData = function(data) {
        snd.Source.prototype.loadData.apply(this, arguments);

        if (data.periodicWave != null) {
            this._status.periodicWave = data.periodicWave;
            this._status.oscillatorType = snd.OscillatorSource.CUSTOM;
        } else {
            this._status.oscillatorType = data.oscillatorType;
            this._status.periodicWave = null;
        }

        this.setWaveForm();

        this.frequency = data.frequency;
        this.detune = data.detune;
    };

    snd.OscillatorSource.loadJSON = function(json) {
        var data = JSON.parse(json);
        if (data.className != snd.OscillatorSource.CLASS_NAME) {
            throw new snd.Exception(data.id + " is not instance of 'snd.OscillatorSource' class.");
        }

        var ret = new snd.OscillatorSource("");
        ret.loadData(data);
        return ret;
    };

    snd.OscillatorSource.Status = function() {
        snd.Source.Status.apply(this, arguments);

        this.className = snd.OscillatorSource.CLASS_NAME;
        this.type = snd.srctype.OSCILLATOR;
        this.status = snd.status.NONE;

        this.periodicWave = null;

        this.oscillatorType = null;

        this.frequency = snd.OscillatorSource.DEFAULT_FREQUENCY;
        this.detune = 0.0;
    };
});

snd.CLASS_DEF.push(function() {
    snd.ScriptProcessor = function(id) {
        snd.Source.apply(this, arguments);

        Object.defineProperties(this, {
            inputChannels: {
                get: function() {
                    return this._status.inputChannels;
                },
                set: function(val) {
                    if (this._status.inputChannels != val) {
                        this._status.inputChannels = val;
                        this.resetScriptProcessor();
                    }
                }
            },
            outputChannels: {
                get: function() {
                    return this._status.outputChannels;
                },
                set: function(val) {
                    if (this._status.outputChannels != val) {
                        this._status.outputChannels = val;
                        this.resetScriptProcessor();
                    }
                }
            },
            bufferLength: {
                get: function() {
                    return this._status.bufferLength;
                },
                set: function(val) {
                    if (this._status.bufferLength != val) {
                        this._status.bufferLength = val;
                        this.resetScriptProcessor();
                    }
                }
            },
            script: {
                get: function() {
                    return this._status.script;
                },
                set: function(val) {
                    this._status.script = val;
                }
            }
        });

        this.resetScriptProcessor();
    };
    snd.ScriptProcessor.prototype = Object.create(snd.Source.prototype);
    snd.ScriptProcessor.prototype.constructor = snd.ScriptProcessor;

    snd.ScriptProcessor.CLASS_NAME = "snd.SciptProcessorUnit";

    snd.ScriptProcessor.prototype.resetScriptProcessor = function() {
        var _this = this;

        this._gain.channelCount = this._status.outputChannels;

        if (this._unit != null) {
            this._unit.disconnect(this._gain);
            delete this._unit;
        }
        this._unit = snd.AUDIO_CONTEXT.createScriptProcessor(this._status.bufferLength, this._status.inputChannels, this._status.outputChannels);
        this._unit.onaudioprocess = function(evt) {
            if (_this.script != null) {
                if (typeof (_this.script) == "function") {
                    _this._status.script(evt);
                } else {
                    eval(_this._status.script);
                }
            }
        };

        this._unit.connect(this._gain);
    };

    snd.ScriptProcessor.prototype.createStatus = function() {
        return new snd.ScriptProcessor.Status();
    };

    snd.ScriptProcessor.prototype.toJSON = function() {
        return this._status;
    }

    snd.ScriptProcessor.prototype.loadData = function(data) {
        snd.Source.prototype.loadData.apply(this, arguments);

        this._status.inputChannels = (data.inputChannels > 0) ? data.inputChannels : 0;
        this._status.outputChannels = (data.outputChannels > 0) ? data.outputChannels : 0;
        this._status.bufferLength = (data.bufferLength > 0) ? data.bufferLength : 0;
        this._status.script = (data.script != null) ? data.script : "";

        this.resetScriptProcessor();
    };

    snd.ScriptProcessor.loadJSON = function(json) {
        var data = JSON.parse(json);
        if (data.className != snd.ScriptProcessor.CLASS_NAME) {
            throw new snd.Exception(data.id + " is not instanceof 'snd.ScriptProcessorUnit'.");
        }

        var ret = new snd.ScriptProcessor(data.id);
        ret.loadData(data);

        return ret;
    };

    snd.ScriptProcessor.Status = function() {
        snd.Source.Status.apply(this, arguments);

        this.className = snd.ScriptProcessor.CLASS_NAME;
        this.isSource = true;

        this.inputChannels = 0;
        this.outputChannels = 1;
        this.bufferLength = 4096;
        this.script = "";
    };
    snd.ScriptProcessor.Status.prototype = Object.create(snd.Source.prototype);
    snd.ScriptProcessor.Status.prototype.constructor = snd.ScriptProcessor.Status;
});

snd.CLASS_DEF.push(function() {
    snd.WaveShaper = function(id) {
        snd.AudioUnit.apply(this, arguments);

        this._output = snd.AUDIO_CONTEXT.createGain();
        this._connector = snd.AUDIO_CONTEXT.createGain();
        this._shaper = snd.AUDIO_CONTEXT.createWaveShaper();

        this._connector.connect(this._shaper);
        this._shaper.connect(this._output);

        /* DEFINE PROPERTIES */
        Object.defineProperties(this, {
            channelCount: {
                get: function() {
                    return this._status.channelCount;
                },
                set: function(val) {
                    this._output.channelCount = val;
                    this._connector.channelCount = val;
                    this._shaper.channelCount = val;
                    this._status.channelCount = val;
                }
            },
            channelCountMode: {
                get: function() {
                    return this._status.channelCountMode;

                },
                set: function(val) {
                    this._output.channelCountMode = val;
                    this._connector.channelCountMode = val;
                    this._shaper.channelCountMode = val;
                    this._status.channelCountMode = val;
                }
            },
            channelInterpretation: {
                get: function() {
                    return this._status.channelInterpretation;
                },
                set: function(val) {
                    this._output.channelInterpretation = val;
                    this._connector.channelInterpretation = val;
                    this._shaper.channelInterpretation = val;
                    this._status.channelInterpretation = val;
                }
            },
            curve: {
                get: function() {
                    return this._shaper.curve;
                },
                set: function(val) {
                    this._shaper.curve = val;
                    this._status.curve = val;
                }
            },
            oversample: {
                get: function() {
                    return this._shaper.oversample;
                },
                set: function(val) {
                    this._shaper.oversample = val;
                    this._status.oversample = val;
                }
            },
            gain: {
                get: function() {
                    return this._output.gain.value;
                },
                set: function(val) {
                    var v = parseFloat(val);
                    this._output.gain.value = v;
                    this._status.gain = v;
                }
            }
        });
    };
    snd.WaveShaper.prototype = Object.create(snd.AudioUnit.prototype);
    snd.WaveShaper.prototype.constructor = snd.Gain;

    snd.WaveShaper.prototype.connect = function(connectTo, indexIn, indexOut, id) {
        snd.AudioUnit.prototype.connect.apply(this, arguments);
        if (connectTo.getConnector != null) {
            this._output.connect(connectTo.getConnector(), indexIn, indexOut);
        } else {
            this._output.connect(connectTo, indexIn, indexOut);
        }
    };
    snd.WaveShaper.prototype.disconnect = function(disconnectFrom, indexIn, id) {
        snd.AudioUnit.prototype.disconnect.apply(this, arguments);
        if (disconnectFrom.getConnector != null) {
            this._output.disconnect(disconnectFrom.getConnector(), indexIn);
        } else {
            this._output.disconnect(disconnectFrom, indexIn);
        }
    };
    snd.WaveShaper.prototype.createStatus = function() {
        return new snd.WaveShaper.Status();
    };
    snd.WaveShaper.prototype.getConnector = function() {
        return this._connector;
    };
    snd.WaveShaper.prototype.loadData = function(data) {
        snd.AudioUnit.prototype.loadData.apply(this, arguments);

        this.curve = data.curve;
        this.oversample = data.oversample;
    };

    snd.WaveShaper.Status = function() {
        snd.AudioUnit.Status.apply(this, arguments);

        this.curve = null;
        this.oversample = snd.WaveShaper.OVERSAMPLE_NONE;
        this.gain = 1.0;
    };
    snd.WaveShaper.Status.prototype = Object.create(snd.AudioUnit.Status.prototype);
    snd.WaveShaper.Status.prototype.constructor = snd.WaveShaper.Status;
});

snd.CLASS_DEF.push(function() {
    var calcNoise = function(buffer) {
        for (var ch = 0; ch < buffer.numberOfChannels; ch++) {
            var chBuf = buffer.getChannelData(ch);
            
            for (var i = 0; i < buffer.length; i++) {
                chBuf[i] = Math.random() * 2.0 - 1.0;
            }
        }
    };
    
    snd.Noise = function(id, bufferLength, channel) {
        snd.AudioUnit.apply(this, arguments);

        this._noise = snd.AUDIO_CONTEXT.createScriptProcessor(
                (!bufferLength) ? 1024 : bufferLength,
                1,
                (!channel) ? 1 : channel);
        this._gain = snd.AUDIO_CONTEXT.createGain();
        
        this._gain.channelCount = (!channel) ? 1 : channel;
        this._noise.onaudioprocess = function(evt) {
            calcNoise(evt.outputBuffer);
        };
        
        this._noise.connect(this._gain);

        /* DEFINE PROPERTIES */
        Object.defineProperties(this, {
            channelCount: {
                get: function() {
                    return this._status.channelCount;
                }
            },
            volume: {
                get: function() {
                    return this._gain.gain.value;
                },
                set: function(val) {
                    this._gain.gain.value = val;
                    this._status.gain = val;
                }
            },
            volumeParam: {
                get: function() {
                    var ret = this._gain.gain;
                    ret.id = this.id + ".gain";
                    return ret;
                }
            }
        });
    };
    snd.Noise.prototype = Object.create(snd.AudioUnit.prototype);
    snd.Noise.prototype.constructor = snd.Noise;

    snd.Noise.prototype.connect = function(connectTo, indexIn, indexOut, id) {
        snd.AudioUnit.prototype.connect.apply(this, arguments);
        if (connectTo.getConnector != null) {
            this._gain.connect(connectTo.getConnector(), indexIn, indexOut);
        } else {
            this._gain.connect(connectTo, indexIn, indexOut);
        }
    };
    snd.Noise.prototype.disconnect = function(disconnectFrom, indexIn, id) {
        snd.AudioUnit.prototype.disconnect.apply(this, arguments);
        if (disconnectFrom.getConnector != null) {
            this._gain.disconnect(disconnectFrom.getConnector(), indexIn);
        } else {
            this._gain.disconnect(disconnectFrom, indexIn);
        }
    };
    snd.Noise.prototype.createStatus = function() {
        return new snd.Noise.Status();
    };
    snd.Noise.prototype.getConnector = function() {
        return this._gain;
    };
    snd.Noise.prototype.loadData = function(data) {
        snd.AudioUnit.prototype.loadData.apply(this, arguments);

        this.gain = data.gain;
    };

    snd.Noise.Status = function() {
        snd.AudioUnit.Status.apply(this, arguments);
        this.gain = 1.0;
        this.channelCount = 1;
    };
    snd.Noise.Status.prototype = Object.create(snd.AudioUnit.Status.prototype);
    snd.Noise.Status.prototype.constructor = snd.Noise.Status;
});

if (typeof(snd) == "undefined") snd = {};

/**
 * MIDI機能の基幹ネームスペースです。
 * @property {MidiAccess} MIDI_ACCESS MIDIAccessを取得します。
 * @property {HashMap} INPUTS 接続済みのMIDI入力デバイスを列挙したハッシュマップを取得します。<br/>
 * キー値は各デバイスのIDで、値にはMIDIInputオブジェクトが格納されています。
 * @property {HashMap} OUTPUTS 接続済みのMIDI出力デバイスを列挙したハッシュマップを取得します。<br/>
 * キー値は各デバイスのIDで、値にはMIDIOutputオブジェクトが格納されています。
 * @namespace snd.MIDI
 */
snd.MIDI = {}

snd.MIDI._MIDI_ACCESS = null;
snd.MIDI._INPUTS = {};
snd.MIDI._OUTPUTS = {};

Object.defineProperties(snd.MIDI, {
    MIDI_ACCESS: {
        get: function() {
            return snd.MIDI._MIDI_ACCESS;
        }
    },
    INPUTS: {
        get: function() {
            return snd.MIDI._INPUTS;
        }
    },
    OUTPUTS: {
        get: function() {
            return snd.MIDI._OUTPUTS;
        }
    },
    DISCONNECTED: {
        value: "disconnected",
        writable: false
    },
    CONNECTED: {
        value: "connected",
        writable: false
    },
    OPEN: {
        value: "open",
        writable: false
    },
    CLOSED: {
        value: "closed",
        writable: false
    },
    PENDING: {
        value: "pending",
        writable: false
    },
    MESSAGE_FILTER: {
        value: 0xF0,
        writable: false
    },
    CH_FILTER: {
        value: 0x0F,
        writable: false
    },
    NOTE_OFF: {
        value: 0x80,
        writable: false
    },
    NOTE_ON: {
        value: 0x90,
        writable: false
    },
    POLYPHONIC_KEY_PRESSURE: {
        value: 0xA0,
        writable: false
    },
    CONTROL_CHANGE: {
        value: 0xB0,
        writable: false
    },
    PROGRAM_CHANGE: {
        value: 0xC0,
        writable: false
    },
    CHANNEL_PRESSURE: {
        value: 0xD0,
        writable: false
    },
    PITCH_BEND: {
        value: 0xE0,
        writable: false
    },
    MTC: {
        value: 0xF1,
        writable: false
    },
    SONG_POS: {
        value: 0xF2,
        writable: false
    },
    SONG_SEL: {
        value: 0xF3,
        writable: false
    },
    UNDEFINED_1: {
        value: 0xF4,
        writable: false
    },
    UNDEFINED_2: {
        value: 0xF5,
        writable: false
    },
    TUNE_REQ: {
        value: 0xF6,
        writable: false
    },
    EOX: {
        value: 0xF7,
        writable: false
    },
    TIMING_CLOCK: {
        value: 0xF8,
        writable: false
    },
    UNDEFINED_3: {
        value: 0xF9,
        writable: false
    },
    START: {
        value: 0xFA,
        writable: false
    },
    CONTINUE: {
        value: 0xFB,
        writable: false
    },
    STOP: {
        value: 0xFC,
        writable: false
    },
    UNDEFINED_4: {
        value: 0xFD,
        writable: false
    },
    ACTIVE_SENCING: {
        value: 0xFE,
        writable: false
    },
    SYSTEM_RESET: {
        value: 0xFF,
        writable: false
    },
    CTRL_BANK_SELECT: {
        value: 0x00,
        writable: false
    },
    CTRL_MODULATION: {
        value: 0x01,
        writable: false
    },
    CTRL_BREATH_CONTROLLER: {
        value: 0x02,
        writable: false
    },
    CTRL_UNDEFINED1: {
        value: 0x03,
        writable: false
    },
    CTRL_FOOT_CONTROLLER: {
        value: 0x04,
        writable: false
    },
    CTRL_PORTAMENTO_TIME: {
        value: 0x05,
        writable: false
    },
    CTRL_DATA_ENTRY_MSB: {
        value: 0x06,
        writable: false
    },
    CTRL_MAIN_VOLUME: {
        value: 0x07,
        writable: false
    },
    CTRL_BALANCE: {
        value: 0x08,
        writable: false
    },
    CTRL_UNDEFINED2: {
        value: 0x09,
        writable: false
    },
    CTRL_PAN: {
        value: 0x0A,
        writable: false
    },
    CTRL_EXPRESSION_CONTROLLER: {
        value: 0x0B,
        writable: false
    },
    CTRL_EFFECT_CONTROL1: {
        value: 0x0C,
        writable: false
    },
    CTRL_EFFECT_CONTROL2: {
        value: 0x0D,
        writable: false
    },
    CTRL_UNDEFINED3: {
        value: 0x0E,
        writable: false
    },
    CTRL_UNDEFINED4: {
        value: 0x0F,
        writable: false
    },
    CTRL_GENERAL_PURPOSE_CONTROLLER1: {
        value: 0x10,
        writable: false
    },
    CTRL_GENERAL_PURPOSE_CONTROLLER2: {
        value: 0x11,
        writable: false
    },
    CTRL_GENERAL_PURPOSE_CONTROLLER3: {
        value: 0x12,
        writable: false
    },
    CTRL_GENERAL_PURPOSE_CONTROLLER4: {
        value: 0x13,
        writable: false
    },
    CTRL_UNDEFINED5: {
        value: 0x14,
        writable: false
    },
    CTRL_UNDEFINED6: {
        value: 0x15,
        writable: false
    },
    CTRL_UNDEFINED7: {
        value: 0x16,
        writable: false
    },
    CTRL_UNDEFINED8: {
        value: 0x17,
        writable: false
    },
    CTRL_UNDEFINED9: {
        value: 0x18,
        writable: false
    },
    CTRL_UNDEFINED10: {
        value: 0x19,
        writable: false
    },
    CTRL_UNDEFINED11: {
        value: 0x1A,
        writable: false
    },
    CTRL_UNDEFINED12: {
        value: 0x1B,
        writable: false
    },
    CTRL_UNDEFINED13: {
        value: 0x1C,
        writable: false
    },
    CTRL_UNDEFINED14: {
        value: 0x1D,
        writable: false
    },
    CTRL_UNDEFINED15: {
        value: 0x1E,
        writable: false
    },
    CTRL_UNDEFINED16: {
        value: 0x1F,
        writable: false
    },
    CTRL_BANK_SELECT_LSB: {
        value: 0x20,
        writable: false
    },
    CTRL_MODULATION_LSB: {
        value: 0x21,
        writable: false
    },
    CTRL_BREATH_CONTROLLER_LSB: {
        value: 0x22,
        writable: false
    },
    CTRL_UNDEFINED1_LSB: {
        value: 0x23,
        writable: false
    },
    CTRL_FOOT_CONTROLLER_LSB: {
        value: 0x24,
        writable: false
    },
    CTRL_PORTAMENTO_TIME_LSB: {
        value: 0x25,
        writable: false
    },
    CTRL_DATA_ENTRY_MSB_LSB: {
        value: 0x26,
        writable: false
    },
    CTRL_MAIN_VOLUME_LSB: {
        value: 0x27,
        writable: false
    },
    CTRL_BALANCE_LSB: {
        value: 0x28,
        writable: false
    },
    CTRL_UNDEFINED2_LSB: {
        value: 0x29,
        writable: false
    },
    CTRL_PAN_LSB: {
        value: 0x2A,
        writable: false
    },
    CTRL_EXPRESSION_CONTROLLER_LSB: {
        value: 0x2B,
        writable: false
    },
    CTRL_EFFECT_CONTROL1_LSB: {
        value: 0x2C,
        writable: false
    },
    CTRL_EFFECT_CONTROL2_LSB: {
        value: 0x2D,
        writable: false
    },
    CTRL_UNDEFINED3_LSB: {
        value: 0x2E,
        writable: false
    },
    CTRL_UNDEFINED4_LSB: {
        value: 0x2F,
        writable: false
    },
    CTRL_GENERAL_PURPOSE_CONTROLLER1_LSB: {
        value: 0x30,
        writable: false
    },
    CTRL_GENERAL_PURPOSE_CONTROLLER2_LSB: {
        value: 0x31,
        writable: false
    },
    CTRL_GENERAL_PURPOSE_CONTROLLER3_LSB: {
        value: 0x32,
        writable: false
    },
    CTRL_GENERAL_PURPOSE_CONTROLLER4_LSB: {
        value: 0x33,
        writable: false
    },
    CTRL_UNDEFINED5_LSB: {
        value: 0x34,
        writable: false
    },
    CTRL_UNDEFINED6_LSB: {
        value: 0x35,
        writable: false
    },
    CTRL_UNDEFINED7_LSB: {
        value: 0x36,
        writable: false
    },
    CTRL_UNDEFINED8_LSB: {
        value: 0x37,
        writable: false
    },
    CTRL_UNDEFINED9_LSB: {
        value: 0x38,
        writable: false
    },
    CTRL_UNDEFINED10_LSB: {
        value: 0x39,
        writable: false
    },
    CTRL_UNDEFINED11_LSB: {
        value: 0x3A,
        writable: false
    },
    CTRL_UNDEFINED12_LSB: {
        value: 0x3B,
        writable: false
    },
    CTRL_UNDEFINED13_LSB: {
        value: 0x3C,
        writable: false
    },
    CTRL_UNDEFINED14_LSB: {
        value: 0x3D,
        writable: false
    },
    CTRL_UNDEFINED15_LSB: {
        value: 0x3E,
        writable: false
    },
    CTRL_UNDEFINED16_LSB: {
        value: 0x3F,
        writable: false
    },
    CTRL_DAMPER_PEDAL_ON: {
        value: 0x40,
        writable: false
    },
    CTRL_PORTAMENTO_ON: {
        value: 0x41,
        writable: false
    },
    CTRL_SOSTENUTO_ON: {
        value: 0x42,
        writable: false
    },
    CTRL_SOFT_PEDAL_ON: {
        value: 0x43,
        writable: false
    },
    CTRL_LEGATO_FOOT_SWITCH: {
        value: 0x44,
        writable: false
    },
    CTRL_HOLD2: {
        value: 0x45,
        writable: false
    },
    CTRL_SOUND_CONTROLLER1: {
        value: 0x46,
        writable: false
    },
    CTRL_SOUND_CONTROLLER2: {
        value: 0x47,
        writable: false
    },
    CTRL_SOUND_CONTROLLER3: {
        value: 0x48,
        writable: false
    },
    CTRL_SOUND_CONTROLLER4: {
        value: 0x49,
        writable: false
    },
    CTRL_SOUND_CONTROLLER5: {
        value: 0x4A,
        writable: false
    },
    CTRL_SOUND_CONTROLLER6: {
        value: 0x4B,
        writable: false
    },
    CTRL_SOUND_CONTROLLER7: {
        value: 0x4C,
        writable: false
    },
    CTRL_SOUND_CONTROLLER8: {
        value: 0x4D,
        writable: false
    },
    CTRL_SOUND_CONTROLLER9: {
        value: 0x4E,
        writable: false
    },
    CTRL_SOUND_CONTROLLER10: {
        value: 0x4F,
        writable: false
    },
    CTRL_GENERAL_PORPOSE_CONTROLLER5: {
        value: 0x50,
        writable: false
    },
    CTRL_GENERAL_PORPOSE_CONTROLLER6: {
        value: 0x51,
        writable: false
    },
    CTRL_GENERAL_PORPOSE_CONTROLLER7: {
        value: 0x52,
        writable: false
    },
    CTRL_GENERAL_PORPOSE_CONTROLLER8: {
        value: 0x53,
        writable: false
    },
    CTRL_PORTAMENTO: {
        value: 0x54,
        writable: false
    },
    CTRL_UNDEFINED17: {
        value: 0x55,
        writable: false
    },
    CTRL_UNDEFINED18: {
        value: 0x56,
        writable: false
    },
    CTRL_UNDEFINED19: {
        value: 0x57,
        writable: false
    },
    CTRL_HIGH_RESOLUTION_VELOCITY_PREFIX: {
        value: 0x58,
        writable: false
    },
    CTRL_UNDEFINED20: {
        value: 0x59,
        writable: false
    },
    CTRL_UNDEFINED21: {
        value: 0x5A,
        writable: false
    },
    CTRL_EFFECTS1_DEPTH: {
        value: 0x5B,
        writable: false
    },
    CTRL_EFFECTS2_DEPTH: {
        value: 0x5C,
        writable: false
    },
    CTRL_EFFECTS3_DEPTH: {
        value: 0x5D,
        writable: false
    },
    CTRL_EFFECTS4_DEPTH: {
        value: 0x5E,
        writable: false
    },
    CTRL_EFFECTS5_DEPTH: {
        value: 0x5F,
        writable: false
    },
    CTRL_DATA_INCREMENT: {
        value: 0x60,
        writable: false
    },
    CTRL_DATA_DECREMENT: {
        value: 0x61,
        writable: false
    },
    CTRL_NON_REGISTARED_PARAMETER_NUMBER_LSB: {
        value: 0x62,
        writable: false
    },
    CTRL_NON_REGISTARED_PARAMETER_NUMBER_MSB: {
        value: 0x63,
        writable: false
    },
    CTRL_REGISTARED_PARAMETER_NUMBER_LSB: {
        value: 0x64,
        writable: false
    },
    CTRL_REGISTARED_PARAMETER_NUMBER_MSB: {
        value: 0x65,
        writable: false
    },
    CTRL_UNDEFINED22: {
        value: 0x66,
        writable: false
    },
    CTRL_UNDEFINED23: {
        value: 0x67,
        writable: false
    },
    CTRL_UNDEFINED24: {
        value: 0x68,
        writable: false
    },
    CTRL_UNDEFINED25: {
        value: 0x69,
        writable: false
    },
    CTRL_UNDEFINED26: {
        value: 0x6A,
        writable: false
    },
    CTRL_UNDEFINED27: {
        value: 0x6B,
        writable: false
    },
    CTRL_UNDEFINED28: {
        value: 0x6C,
        writable: false
    },
    CTRL_UNDEFINED29: {
        value: 0x6D,
        writable: false
    },
    CTRL_UNDEFINED30: {
        value: 0x6E,
        writable: false
    },
    CTRL_UNDEFINED31: {
        value: 0x6F,
        writable: false
    },
    CTRL_UNDEFINED32: {
        value: 0x70,
        writable: false
    },
    CTRL_UNDEFINED33: {
        value: 0x71,
        writable: false
    },
    CTRL_UNDEFINED34: {
        value: 0x72,
        writable: false
    },
    CTRL_UNDEFINED35: {
        value: 0x73,
        writable: false
    },
    CTRL_UNDEFINED36: {
        value: 0x74,
        writable: false
    },
    CTRL_UNDEFINED37: {
        value: 0x75,
        writable: false
    },
    CTRL_UNDEFINED38: {
        value: 0x76,
        writable: false
    },
    CTRL_UNDEFINED39: {
        value: 0x77,
        writable: false
    },
    CTRL_ALL_SOUND_OFF: {
        value: 0x78,
        writable: false
    },
    CTRL_RESET_ALL_CONTROLLER: {
        value: 0x79,
        writable: false
    },
    CTRL_LOCAL_CONTROL: {
        value: 0x7A,
        writable: false
    },
    CTRL_ALL_NOTE_OFF: {
        value: 0x7B,
        writable: false
    },
    CTRL_MIDI_MODE_OMNI_OFF: {
        value: 0x7C,
        writable: false
    },
    CTRL_MIDI_MODE_OMNI_ON: {
        value: 0x7D,
        writable: false
    },
    CTRL_MIDI_MODE_MONO_MODE: {
        value: 0x7E,
        writable: false
    },
    CTRL_MIDI_MODE_POLY_MODE: {
        value: 0x7F,
        writable: false
    }
});

/**
 * MIDIを初期化します。
 * 
 * @param {MIDIOption} opt MIDIアクセスリクエストに使用されるMIDIOptionを設定します。(未設定可)
 * @param {function} successCallback 初期化成功時に呼び出されるメソッドです。(未設定可)<br/>引数にはMIDIAccessが渡されます。
 * @param {function} failureCallback 初期化失敗時に呼び出されるメソッドです。(未設定可)<br/>引数にはDOMExceptionが渡されます
 * @memberOf snd.MIDI
 */
snd.MIDI.init = function(opt, successCallback, failureCallback) {
    if (navigator && typeof(navigator.requestMIDIAccess) == "function") {
        navigator.requestMIDIAccess(opt).then(
                function(midiAccess) {
                    var values = null, v = null;
                    
                    snd.MIDI._MIDI_ACCESS = midiAccess;
                    
                    values = snd.MIDI._MIDI_ACCESS.inputs.values();
                    while (!(v = values.next()).done) {
                        snd.MIDI._INPUTS[v.value.id] = v.value;
                    }
                    
                    values = snd.MIDI._MIDI_ACCESS.outputs.values();
                    while (!(v = values.next()).done) {
                        snd.MIDI._OUTPUTS[v.value.id] = v.value;
                    }
                    
                    if (typeof(successCallback) == "function") {
                        successCallback(snd.MIDI.MIDI_ACCESS);
                    }
                },
                function(domException) {
                    if (typeof(failureCallback) == "function") {
                        failureCallback(domException);
                    } else {
                        console.log(domException);
                    }
                }
            );
    } else {
        failureCallback(undefined);
    }
};

/**
 * MIDI機能でよく使う機能をまとめたネームスペースです
 * @namespace snd.MIDI.util
 */
snd.MIDI.util = {};

/**
 * MIDIメッセージからチャンネルNoが取得できる場合、そのチャンネルNoを返します。<br/>
 * 取得できなかった場合はundefinedを返します。
 * @param {Array} bytes MIDIメッセージ
 * @returns {Integer} チャンネルが取得できるメッセージの場合はそのチャンネルNo、チャンネルが取得できない場合はundefined
 * @memberOf snd.MIDI.util
 */
snd.MIDI.util.getCh = function(bytes) {
    if (bytes.length <= 0) {
        return undefined;
    }
    
    if (bytes[0] & snd.MIDI.NOTE_OFF != 0
            || bytes[0] & snd.MIDI.NOTE_ON != 0
            || bytes[0] & snd.MIDI.POLYPHONIC_KEY_PRESSURE != 0
            || bytes[0] & snd.MIDI.CONTROL_CHANGE != 0
            || bytes[0] & snd.MIDI.PROGRAM_CHANGE != 0
            || bytes[0] & snd.MIDI.CHANNEL_PRESSURE != 0
            || bytes[0] & snd.MIDI.PITCH_BEND != 0) {
        return bytes[0] & snd.MIDI.CH_FILTER;
    } else {
        return undefined;
    }
};

/**
 * MIDIメッセージで渡されるMIDIノートNo(中央ドが60)を周波数に変換して返します。<br/>
 * MIDIノートNoの範囲外(負の値など)でも計算結果を返します。
 * @param {type} noteNo MIDIノートNo
 * @returns {Number} 周波数
 * @memberOf snd.MIDI.util
 */
snd.MIDI.util.toHz = function(noteNo) {
    return 440.0 * Math.pow(2, (noteNo - 69) / 12);
};
