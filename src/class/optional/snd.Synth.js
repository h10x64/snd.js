(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD
        define(['snd.OscillatorSource'], factory);
    } else if (typeof exports === 'object') {
        // Node
    } else {
        // Browser globals (root is window)
        root.snd = factory(root.snd);
    }
}(this, function(snd) {
    /**
     * コンストラクタです。<br/>
     * @class シンセサイザクラスです。<br/>
     * ドキュメントはまだできていませんので、サンプルを参照してください。
     * @param {type} id
     * @param {type} polyphony
     * @param {snd.Synth.Settings} settings
     */
    snd.Synth = function(id, polyphony, settings) {
        snd.Source.apply(this, arguments);
        this.polyphony = polyphony;

        this._settings = settings;

        this.partes = [];
        for (var i = 0; i < this.polyphony; i++) {
            var part = new snd.Synth.Partes(this.id + i, this._settings);
            part.connect(this._gain);
            this.partes.push(part);
        }

        Object.defineProperty(this, "settings", {
            configurable: true,
            enumerable: true,
            get: function() {
                return this._settings;
            },
            set: function(val) {
                this.settings = val;
                for (var i = 0; i < this.polyphony; i++) {
                    this.partes[i].settings = this.settings;
                }
            }
        });
    };
    snd.Synth.prototype = Object.create(snd.Source.prototype);
    snd.Synth.prototype.constructor = snd.Synth;

    /**
     * 波形を設定します。<br/>
     * waveFormがsnd.oscillatortype名前空間にある定数（snd.ocillatortype.SINEなど）だった場合はその波形に設定されます。<br/>
     * それ以外の場合、waveFormがPriodicWaveのインスタンスとして扱われ、波形に設定されます。
     * @param {String | PeriodicWave} waveForm 波形
     */
    snd.Synth.setWaveForm = function(waveForm) {
        this.settings.waveform = waveForm;
        if (waveForm === snd.SINE
                || waveForm === snd.SQUARE
                || waveForm === snd.SAWTOOTH
                || waveForm === snd.TRIANGLE) {
            for (i = 0; i < this.partes.length; i++) {
                this.partes[i].setOscillatorType(waveForm);
            }
        } else {
            for (i = 0; i < this.partes.length; i++) {
                this.partes[i].setPeriodicWave(waveForm);
            }
        }
    };

    /**
     * 
     * @param {Array} partes 音を鳴らすパートの番号と周波数をまとめたハッシュマップの配列。[{no:noteOnするパートの番号, freq:鳴らす周波数}, {no:2, freq:440.0}...]
     */
    snd.Synth.prototype.noteOn = function(partes) {
        for (var i = 0; i < partes.length; i++) {
            var no = partes[i].no;
            var freq = partes[i].freq;
            this.partes[no].noteOn(freq);
        }
    };

    snd.Synth.prototype.noteOff = function(partes) {
        for (var i = 0; i < partes.length; i++) {
            var no = partes[i].no;
            this.partes[no].noteOff();
        }
    };

    /**
     * コンストラクタです。
     * @class モノフォニー（monophony）を表すクラスです<br/>
     * 一音のみを出力します。
     * @param {type} id ID
     * @param {type} parent 親のSynth
     */
    snd.Synth.Partes = function(id, settings) {
        snd.OscillatorSource.apply(this, arguments);

        var _this = this;

        this.setGain(0.0);
        this.settings = settings;

        this.settings.onchange = function() {
            _this.setWaveType(_this.settings.waveform);
        };

        this.ampEnvelope = new snd.Synth.Envelope(this.volumeParam, this.settings.amplitude.envelope);
        this.ampLFO = new snd.Synth.LFO(this.id + "_AmpLFO", this.volumeParam, this.settings.amplitude.lfo);
        this.freqEnvelope = new snd.Synth.Envelope(this.frequencyParam, this.settings.frequency.envelope);
        this.freqLFO = new snd.Synth.LFO(this.id + "_FreqLFO", this.frequencyParam, this.settings.frequency.lfo);
    };
    snd.Synth.Partes.prototype = Object.create(snd.OscillatorSource.prototype);
    snd.Synth.Partes.prototype.constructor = snd.Synth.Note;

    snd.Synth.Partes.prototype.noteOn = function(freq) {
        this.freqEnvelope.settings.max = freq;
        this.start(0);

        this.ampEnvelope.noteOn();
        this.ampLFO.noteOn();
        this.freqEnvelope.noteOn();
        this.freqLFO.noteOn();
    };

    snd.Synth.Partes.prototype.noteOff = function() {
        this.ampEnvelope.noteOff();
        this.ampLFO.noteOff();
        this.freqEnvelope.noteOff();
        this.freqLFO.noteOff();
    };

    /**
     * コンストラクタです。
     * @class シンセのLFOクラスです。<br/>
     * 音に揺らぎをつけるとき等に使用してください。
     * @param {type} id ID
     * @param {type} param 値を設定するAudioParam
     */
    snd.Synth.LFO = function(id, param, lfoSettings) {
        snd.OscillatorSource.apply(this, arguments);

        var _this = this;

        this.baseValue = 0;
        this.param = param;
        this._gain.connect(this.param);
        this._settings = lfoSettings;
        this.freqEnvelope = new snd.Synth.Envelope(this.frequencyParam, lfoSettings.frequency);
        this.ampEnvelope = new snd.Synth.Envelope(this.volumeParam, lfoSettings.amplitude);
        this._settings.onchange = function() {
            _this.source.setWaveForm(_this.settings.waveform);
        };

        Object.defineProperty(this, "settings", {
            configurable: true,
            enumerable: true,
            get: function() {
                return this._settings;
            },
            set: function(val) {
                this._settings = val;
                this.setWaveForm(val.waveform);
                this.freqEnvelope.settings = val.frequency;
                this.ampEnvelope.settings = val.amplitude;
            }
        });
    };
    snd.Synth.LFO.prototype = Object.create(snd.OscillatorSource.prototype);
    snd.Synth.LFO.prototype.constructor = snd.Synth.LFO;

    snd.Synth.LFO.prototype.noteOn = function() {
        this.start(0);
        this.ampEnvelope.noteOn();
        this.freqEnvelope.noteOn();
    };

    snd.Synth.LFO.prototype.noteOff = function() {
        this.ampEnvelope.noteOff();
        this.freqEnvelope.noteOff();
    };

    /**
     * 引数で渡された内容のエンベロープを作ります。<br/>
     * 
     * @class エンベロープの設定値を保持するクラスです。<br/>
     * コンストラクタのparamで設定されたAudioParamのADSR(Attack, Decay, Sustain, Release)を、時間と倍数と補間処理の種類の3つの値で制御します。<br/>
     * 各値の変化は以下のようになります。<br/>
     *   noteOn() -> 0 -(attackTime秒)-> attack * maxValue -(decayTime秒)-> sustain * maxValue<br/>
     *   noteOff() -> sustain -(releaseTime秒)-> 0<br/>
     * sustainTimeに0より大きな値が設定されている場合は、<br/>
     *   noteOn() -> 0 -(attackTime秒)-> attack * maxValue -(decayTime秒)-> sustain * maxValue -(sustainTime秒)-> release -(releaseTime秒)-> 0<br/>
     * <br/>
     * アタック、ディケイ、サスティーン、リリースの値は倍数で、出力に乗じる値を指定します(デシベルではありません)。<br/>
     * また、maxValueはアタック、ディケイ、サスティーン<br/>
     * 補間処理の種類は、「補間なし」「直線補間」「対数補間」の3種類があり、snd.audioparam.type名前空間にある定数を使って、いずれか一つを指定します。<br/>
     * <table>
     * <tr>定数値<td></td><td>補間方法</td></tr>
     * <tr><td>snd.audioparam.type.SET</td><td>補間なし</td></tr>
     * <tr><td>snd.audioparam.type.LINER</td><td>直線補間</td></tr>
     * <tr><td>snd.audioparam.type.EXPONENTIALLY</td><td>対数補間</td></tr>
     * </table><br/>
     * 時間の単位は全て秒単位です。<br/>
     * また、エンベロープについて詳しくは<a href="http://en.wikipedia.org/wiki/Synthesizer#ADSR_envelope">Wikipedia(英)</a>や<a href="http://ja.wikipedia.org/wiki/ADSR">Wikipedia(日)</a>を参照してください。<br/>
     * 
     * @param {Number} max 最大値[秒]
     * @param {Number} attackTime アタックタイム[秒]
     * @param {Number} attack アタック
     * @param {Number} attackType アタックの補間法
     * @param {Number} decayTime ディケイタイム[秒]
     * @param {Number} decayType ディケイの補間法
     * @param {Number} sustainTime サスティーンタイム[秒](0以下の値が指定された場合、NoteOffまで変化なし)
     * @param {Number} sustain サスティーン
     * @param {Number} sustainType サスティーンの補間法
     * @param {Number} releaseTime リリースタイム[秒]
     * @param {Number} release リリース
     * @param {Number} releaseType リリースの補間法
     */
    snd.Synth.Envelope = function(param, settings) {
        this.param = param;
        this.settings = settings;
    };

    snd.Synth.Envelope.prototype.noteOn = function() {
        var now = snd.AUDIO_CONTEXT.currentTime;
        this.param.cancelScheduledValues(now);
        this.param.value = 0;

        if (this.settings.attackTime >= 0) {
            switch (this.settings.attackType) {
                case snd.audioparam.type.LINER:
                    this.param.linearRampToValueAtTime(
                            this.settings.attack * this.settings.max,
                            now + this.settings.attackTime);
                    break;
                case snd.audioparam.type.EXPONENTIALLY:
                    this.param.exponentialRampToValueAtTime(
                            this.settings.attack * this.settings.max,
                            now + this.settings.attackTime);
                    break;
                default:
                    this.param.setValueAtTime(
                            this.settings.attack * this.settings.max,
                            now + this.settings.attackTime);
                    break;
            }
            ;
        }

        if (this.settings.decayTime > 0) {
            switch (this.settings.decayType) {
                case snd.audioparam.type.LINER:
                    this.param.linearRampToValueAtTime(
                            this.settings.sustain * this.settings.max,
                            now + this.settings.attackTime + this.settings.decayTime);
                    break;
                case snd.audioparam.type.EXPONENTIALLY:
                    this.param.exponentialRampToValueAtTime(
                            this.settings.sustain * this.settings.max,
                            now + this.settings.attackTime + this.settings.decayTime);
                    break;
                default:
                    this.param.setValueAtTime(
                            this.settings.sustain * this.settings.max,
                            now + this.settings.attackTime + this.settings.decayTime);
                    break;
            }
        }

        if (this.settings.sustainTime > 0) {
            switch (this.settings.sustainType) {
                case snd.audioparam.type.LINER:
                    this.param.linearRampToValueAtTime(
                            this.settings.release * this.settings.max,
                            now + this.settings.attackTime + this.settings.decayTime + this.settings.sustainTime);
                    break;
                case snd.audioparam.type.EXPONENTIALLY:
                    this.param.exponentialRampToValueAtTime(
                            this.settings.release * this.settings.max,
                            now + this.settings.attackTime + this.settings.decayTime + this.settings.sustainTime);
                    break;
                default:
                    this.param.setValueAtTime(
                            this.settings.release * this.settings.max,
                            now + this.settings.attackTime + this.settings.decayTime + this.settings.sustainTime);
                    break;
            }

            switch (this.settings.releaseType) {
                case snd.audioparam.type.LINER:
                    this.param.linearRampToValueAtTime(
                            0,
                            now + this.settings.attackTime + this.settings.decayTime + this.settings.sustainTime + this.settings.releaseTime);
                    break;
                case snd.audioparam.type.EXPONENTIALLY:
                    this.param.exponentialRampToValueAtTime(
                            0,
                            now + this.settings.attackTime + this.settings.decayTime + this.settings.sustainTime + this.settings.releaseTime);
                    break;
                default:
                    this.param.setValueAtTime(
                            0,
                            now + this.settings.attackTime + this.settings.decayTime + this.settings.sustainTime + this.settings.releaseTime);
                    break;
            }
        }
    };

    snd.Synth.Envelope.prototype.noteOff = function() {
        var now = snd.AUDIO_CONTEXT.currentTime;
        this.param.cancelScheduledValues(now);

        switch (this.settings.releaseType) {
            case snd.audioparam.type.LINER:
                this.param.linearRampToValueAtTime(
                        0,
                        now + this.settings.releaseTime);
                break;
            case snd.audioparam.type.EXPONENTIALLY:
                this.param.exponentialRampToValueAtTime(
                        0,
                        now + this.settings.releaseTime);
                break;
            default:
                this.param.setValueAtTime(
                        0,
                        now + this.settings.releaseTime);
                break;
        }
    };

    snd.Synth.Settings = function() {
        this._waveform = "sine";
        this.frequency = {
            envelope: new snd.Synth.Settings.EnvelopeSettings(
                    440.0,
                    0, 1.0, snd.audioparam.LINER,
                    0, snd.audioparam.LINER,
                    0, 0, snd.audioparam.LINER,
                    0, 0, snd.audioparam.LINER),
            lfo: new snd.Synth.Settings.LFOSettings(
                    "sine",
                    new snd.Synth.Settings.EnvelopeSettings(
                            0.0,
                            0, 0.0, snd.audioparam.LINER,
                            0, snd.audioparam.LINER,
                            0, 0, snd.audioparam.LINER,
                            0, 0, snd.audioparam.LINER),
                    new snd.Synth.Settings.EnvelopeSettings(
                            0.0,
                            0, 0.0, snd.audioparam.LINER,
                            0, snd.audioparam.LINER,
                            0, 0, snd.audioparam.LINER,
                            0, 0, snd.audioparam.LINER)
                    )
        };

        this.amplitude = {
            envelope: new snd.Synth.Settings.EnvelopeSettings(
                    0.2,
                    0, 1.0, snd.audioparam.LINER,
                    0, snd.audioparam.LINER,
                    0, 0, snd.audioparam.LINER,
                    0, 0, snd.audioparam.LINER),
            lfo: new snd.Synth.Settings.LFOSettings(
                    "sine",
                    new snd.Synth.Settings.EnvelopeSettings(
                            0.0,
                            0, 1.0, snd.audioparam.LINER,
                            0, snd.audioparam.LINER,
                            0, 0, snd.audioparam.LINER,
                            0, 0, snd.audioparam.LINER),
                    new snd.Synth.Settings.EnvelopeSettings(
                            0.0,
                            0, 1.0, snd.audioparam.LINER,
                            0, snd.audioparam.LINER,
                            0, 0, snd.audioparam.LINER,
                            0, 0, snd.audioparam.LINER)
                    )
        };

        Object.defineProperty(this, "waveform", {
            configurable: true,
            enumerable: true,
            gat: function() {
                return this._waveform;
            },
            set: function(val) {
                this._wavefrom = val;
                this.onchange();
            }
        });
    };
    snd.Synth.Settings.prototype.onchange = function() {
    };

    snd.Synth.Settings.LFOSettings = function(waveform, freqEnvelopeSettings, ampEnvelopeSettings) {
        this._waveform = waveform;
        this.frequency = freqEnvelopeSettings;
        this.amplitude = ampEnvelopeSettings;

        Object.defineProperty(this, "waveform", {
            configurable: true,
            enumerable: true,
            get: function() {
                return this._waveform;
            },
            set: function(val) {
                this._waveform = val;
                this.onchange();
            }
        });
    };
    snd.Synth.Settings.LFOSettings.prototype.onchange = function() {
    };

    snd.Synth.Settings.EnvelopeSettings = function(
            max,
            attackTime, attack, attackType,
            decayTime, decayType,
            sustainTime, sustain, sustainType,
            releaseTime, release, releaseType) {
        this._max = max;
        this._attackTime = attackTime;
        this._attack = attack;
        this._attackType = attackType;
        this._decayTime = decayTime;
        this._decayType = decayType;
        this._sustainTime = sustainTime;
        this._sustain = sustain;
        this._sustainType = sustainType;
        this._releaseTime = releaseTime;
        this._release = release;
        this._releaseType = releaseType;

        Object.defineProperties(this, {
            max: {
                configurable: true,
                enumerable: true,
                get: function() {
                    return this._max;
                },
                set: function(val) {
                    this._max = val;
                    this.onchange();
                }
            },
            attackTime: {
                configurable: true,
                enumerable: true,
                get: function() {
                    return this._attackTime;
                },
                set: function(val) {
                    this._attackTime = val;
                    this.onchange();
                }
            },
            attack: {
                configurable: true,
                enumerable: true,
                get: function() {
                    return this._attack;
                },
                set: function(val) {
                    this._attack = val;
                    this.onchange();
                }
            },
            attackType: {
                configurable: true,
                enumerable: true,
                get: function() {
                    return this._attackType;
                },
                set: function(val) {
                    this._attackType = val;
                    this.onchange();
                }
            },
            decayTime: {
                configurable: true,
                enumerable: true,
                get: function() {
                    return this._decayTime;
                },
                set: function(val) {
                    this._decayTime = val;
                    this.onchange();
                }
            },
            decayType: {
                configurable: true,
                enumerable: true,
                get: function() {
                    return this._decayType;
                },
                set: function(val) {
                    this._decayType = val;
                    this.onchange();
                }
            },
            sustainTime: {
                configurable: true,
                enumerable: true,
                get: function() {
                    return this._sustainTime;
                },
                set: function(val) {
                    this._sustainTime = val;
                    this.onchange();
                }
            },
            sustain: {
                configurable: true,
                enumerable: true,
                get: function() {
                    return this._sustain;
                },
                set: function(val) {
                    this._sustain = val;
                    this.onchange();
                }
            },
            sustainType: {
                configurable: true,
                enumerable: true,
                get: function() {
                    return this._sustainType;
                },
                set: function(val) {
                    this._sustainType = val;
                    this.onchange();
                }
            },
            releaseTime: {
                configurable: true,
                enumerable: true,
                get: function() {
                    return this._releaseTime;
                },
                set: function(val) {
                    this._releaseTime = val;
                    this.onchange();
                }
            },
            release: {
                configurable: true,
                enumerable: true,
                get: function() {
                    return this._release;
                },
                set: function(val) {
                    this._release = val;
                    this.onchange();
                }
            },
            releaseType: {
                configurable: true,
                enumerable: true,
                get: function() {
                    return this._releaseType;
                },
                set: function(val) {
                    this._releaseType = val;
                    this.onchange();
                }
            }
        });
    };
    snd.Synth.Settings.EnvelopeSettings.prototype.onchange = function() {
    };
    
    return snd;
}));
