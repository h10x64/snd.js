
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
        define(['snd.AudioUnit'], factory);
    } else if (typeof exports === 'object') {
        // Node
    } else {
        // Browser globals (root is window)
        root.snd = factory(root.snd);
    }
}(this, function(snd) {
    snd.Convolver = function(id) {
        snd.AudioUnit.apply(this, arguments);

        this._connector = snd.AUDIO_CONTEXT.createGain();
        this._output = snd.AUDIO_CONTEXT.createGain();
        this._convolver = snd.AUDIO_CONTEXT.createConvolver();
        this._status.audioBuffer = this._convolver.buffer;

        this._connector.connect(this._convolver);
        this._convolver.connect(this._output);

        this._key = "";
        this._listeners = [];

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
    snd.Convolver.prototype.constructor = snd.Convolver;
    
    snd.Convolver.prototype.createStatus = function() {
        return new snd.Convolver.Status();
    };
    
    snd.Convolver.prototype.getConnector = function() {
        return this._connector;
    };
    
    snd.Convolver.prototype.getOutputConnector = function() {
        return this._output;
    }
    
    snd.Convolver.prototype.getParamDescription = function() {
        var ret = snd.AudioUnit.prototype.getParamDescription.apply(this, arguemtns);
        
        ret.buffer = {
            type: snd.params.type.VALUE,
            default: undefined,
            max: undefined,
            min: undefined
        };
        ret.normalize = {
            type: snd.params.type.ENUM,
            value: [
                false,
                true
            ],
            default: true
        };
        
        return ret;
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
                _this.fireOnLoadEvent();
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
            _this.fireOnLoadEvent();
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
    
    snd.Convolver.prototype.addOnLoadEventListener = function(listener) {
        this._listeners.push(listener);
    };
    
    snd.Convolver.prototype.removeOnLoadEventListener = function(listener) {
        var i = this._listeners.indexOf(listener);
        if (i >= 0) {
            this._listeners.splice(i, 1);
        }
    };
    
    snd.Convolver.prototype.fireOnLoadEvent = function() {
        for (var i in this._listeners) {
            var listener = this._listeners[i];
            if (typeof(listener) == 'function') {
                listener(this);
            }
        }
    };

    snd.Convolver.Status = function() {
        snd.AudioUnit.Status.apply(this, arguments);
        this.src = "";
        this.normalize = true;
    };
    snd.Convolver.Status.prototype = Object.create(snd.AudioUnit.Status.prototype);
    snd.Convolver.Status.prototype.constructor = snd.Convolver.Status;
    
    return snd;
}));
