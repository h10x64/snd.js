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

    snd.Source.prototype.getConnector = function() {
        return undefined;
    };

    snd.Source.prototype.getOutputConnector = function(indexOut) {
        return this._gain;
    };

    snd.Source.prototype.getParamDescription = function() {
        var ret = snd.AudioUnit.prototype.getParamDescription.apply(this, arguments);

        ret.volume = {
            type: snd.params.type.AUDIO_PARAM,
            value: this.volumeParam
        };
        ret.type = {
            type: snd.params.type.READ_ONLY
        };
        ret.status =  {
            type: snd.params.type.READ_ONLY
        };
        ret.isSource = {
            type: snd.params.type.READ_ONLY
        };

        return ret;
    };

    /**
     * 詳細はAudioUnitクラスの createStatus を参照してください。
     * @return {snd.AudioUnit.Status} このオブジェクトのデフォルト設定値
     */
    snd.Source.prototype.createStatus = function() {
        var ret = snd.AudioUnit.prototype.createStatus.call(this);
        
        ret.className = "snd.Source";
        
        return ret;
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

    return snd;
}));
