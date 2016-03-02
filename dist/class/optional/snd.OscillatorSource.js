
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
        define(['snd.Source'], factory);
    } else if (typeof exports === 'object') {
        // Node
    } else {
        // Browser globals (root is window)
        root.snd = factory(root.snd);
    }
}(this, function(snd) {
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
        this._sources = [];
        
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
                    if (this._sources.length > 0) {
                        for (var i in this._sources) {
                            this._sources[i].type = val;
                        }
                    }

                    this._status.oscillatorType = val;
                    this._periodicWave = null;
                    this._status.periodicWave = null;
                }
            },
            frequency: {
                get: function() {
                    if (this._sources.length > 0) {
                        return this._sources[0].frequency.value;
                    } else {
                        return undefined;
                    }
                },
                set: function(val) {
                    if (this._sources.length > 0) {
                        var v = (val) ? parseFloat(val) : 0.0;
                        for (var i in this._sources) {
                            this._sources[i].frequency.value = v;
                        }
                        this._status.frequency = this._sources.frequency.value;
                    }
                }
            },
            frequencyParam: {
                get: function() {
                    if (this._sources != null) {
                        return this.modAudioParam("frequency", this._frequencyGain);
                    } else {
                        return undefined;
                    }
                }
            },
            detune: {
                get: function() {
                    if (this._sources != null) {
                        return this._sources.detune.value;
                    } else {
                        return undefined;
                    }
                },
                set: function(val) {
                    if (this._sources != null) {
                        this._sources.detune.value = (val) ? parseFloat(val) : 0.0;
                        this._status.detune = val;
                    }
                }
            },
            detuneParam: {
                get: function() {
                    if (this._sources != null) {
                        return this.modAudioParam("detune", this._detuneGain);
                    } else {
                        return undefined;
                    }
                }
            }
        });
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

    snd.OscillatorSource.prototype.setWaveForm = function(osc) {
        if (this._status.periodicWave != null) {
            this._periodicWave = snd.AUDIO_CONTEXT.createPeriodicWave(this._status.periodicWave.realArray, this._status.periodicWave.imagArray);
            osc.setPeriodicWave(this._periodicWave);
        } else if (this._status.oscillatorType != null && this._status.oscillatorType != snd.OscillatorSource.CUSTOM) {
            osc.type = this._status.oscillatorType;
        } else {
            osc.type = snd.OscillatorSource.SINE;
            this._status.oscillatorType = snd.OscillatorSource.SINE;
            this._status.periodicWave = null;
            this._periodicWave = null;
        }
    };

    /**
     * 波形の再生をスタートします。
     * 
     * @param {float} when 開始時刻 [秒]
     * @param {type} offset 使用しません
     * @param {type} duration 使用しません
     */
    snd.OscillatorSource.prototype.start = function(when, offset, duration) {
        var osc = this.addOscillator();
        
        var w = (!when) ? 0 : when;
        
        osc.start(w);
        
        this._status.status = snd.status.STARTED;
        if (duration != null) {
            this.stop(when + duration);
        }
    };

    snd.OscillatorSource.prototype.stop = function(when) {
        if (this._status.status == snd.status.STARTED) {
            var w = (!when) ? 0 : when;
            
            for (var i in this._sources) {
                this._sources[i].stop(w);
            }

            this._status.status = snd.status.STOPPED;
        }
    };

    snd.OscillatorSource.prototype.addOscillator = function() {
        var _this = this;
        var osc = snd.AUDIO_CONTEXT.createOscillator();
        
        this.initializeOscillator(osc);
        
        this._sources.push(osc)
        
        var _i = _this._sources.length - 1;
        _this._sources[_i].onended = function() {
            _this._sources.splice(_i, 1);
            _this.fireOnEndedEvent(this);
        }
        
        return osc;
    };
    
    snd.OscillatorSource.prototype.removeOscillator = function(osc) {
        osc.disconnect(this._gain);
        
        if (this._frequencyGain) {
            this._frequencyGain.removeAudioParam(osc.frequency);
        }
        if (this._detuneGain) {
            this._detuneGain.removeAudioParam(osc.detune);
        }
        
        var i = this._sources.indexOf(osc);
        this._sources.splice(i, 1);
    };
    
    snd.OscillatorSource.prototype.initializeOscillator = function(osc) {
        var _this = this;

        this.setWaveForm(osc);
        osc.detune.value = this._status.detune;
        osc.frequency.value = this._status.frequency;
        
        // Setup param gains
        if (!this._frequencyGain) {
            this._frequencyGain = this.createParamGain();
            this._frequencyGain.addAudioParam(osc.frequency);
        } else {
            this._frequencyGain.addAudioParam(osc.frequency);
        }
        if (!this._detuneGain) {
            this._detuneGain = this.createParamGain();
            this._detuneGain.addAudioParam(osc.detune);
        } else {
            this._detuneGain.addAudioParam(osc.detune);
        }
        
        osc.connect(this._gain);
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
    
    snd.OscillatorSource.prototype.onended = function(oscSource) {
    };

    snd.OscillatorSource.prototype.fireOnEndedEvent = function(osc) {
        if (typeof(this.onended) == "function") {
            this.onended(this);
        }
        
        var listeners = this.listeners['onended'];
        for (var i = 0; i < listeners; i++) {
            if (typeof(listeners[i]) == "function") {
                listeners[i](this);
            }
        }
        
        this.removeOscillator(osc);
    };
    
    snd.OscillatorSource.prototype.getParamDescription = function() {
        var ret = snd.Source.prototype.getParamDescription.apply(this, arguments);
        
        ret.periodicWave = {
            type: snd.params.type.VALUE,
            default: undefined,
            max: undefined,
            min: undefined
        };
        ret.oscillatorType = {
            type: snd.params.type.ENUM,
            value: [
                snd.OscillatorSource.SINE,
                snd.OscillatorSource.SQUARE,
                snd.OscillatorSource.SAWTOOTH,
                snd.OscillatorSource.TRIANGLE,
                snd.OscillatorSource.CUSTOM
            ],
            default: snd.OscillatorSource.SINE
        };
        ret.frequency = {
            type: snd.params.type.VALUE,
            default: snd.OscillatorSource.DEFAULT_FREQUENCY,
            max: Infinity,
            min: -Infinity
        };
        ret.detune = {
            type: snd.params.type.VALUE,
            default: 0,
            max: Infinity,
            min: -Infinity
        };
        ret.frequencyParam = {
            type: snd.params.type.AUDIO_PARAM,
            audioParam: this.frequencyParam,
            default: ret.frequency.default,
            max: ret.frequency.max,
            min: ret.frequency.min
        };
        ret.detuneParam = {
            type: snd.params.type.AUDIO_PARAM,
            audioParam: this.detuneParam,
            default: ret.detune.default,
            max: ret.detune.max,
            min: ret.detune.min
        };
        
        return ret;
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
    
    return snd;
}));
