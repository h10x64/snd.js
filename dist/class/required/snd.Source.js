
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
    snd.Source.prototype.start = function(when, offset, duration) {
        // PLEASE OVERRIDE ME
    };

    /**
     * 音源の再生を停止します。
     */
    snd.Source.prototype.stop = function(when) {
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
    
    return snd;
}));
