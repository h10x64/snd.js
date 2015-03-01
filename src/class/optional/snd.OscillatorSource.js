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
                        if (!this._frequencyGain.id) {
                            this._frequencyGain.id = this.id + ".frequency";
                        }
                        return this._frequencyGain;
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
                        if (!this._detuneGain.id) {
                            this._detuneGain.id = this.id + ".detune";
                        }
                        return this._detuneGain;
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
     * 引数には、snd.oscillatortype.SINE, snd.oscillatortype.SQUARE, snd.oscillatortype.SAWTOOTH, snd.oscillatortype.TRIANGLEのいずれかを設定してください。
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
