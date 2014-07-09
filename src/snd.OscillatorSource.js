
/**
 * 新しくオシレータ音源を生成します。
 * @class 任意の波形を再生するオシレータ音源を扱うクラスです。<br/>
 * snd.OscillatorSource.SINEなどの定数値でサイン波・矩形波・のこぎり波・三角波を設定できる他、波形はPeriodicWaveクラスでも定義が可能です。
 * @param {type} id この音源をあらわすID
 */
snd.OscillatorSource = function(id) {
    snd.Source.apply(this, arguments);

    this._status.type = snd.srctype.OSCILLATOR;
    this._status.status = snd.status.NONE;
    this.periodicWave = null;
    
    this.listeners = {
        onended: []
    };

    this.resetOscillator();
};
snd.OscillatorSource.prototype = Object.create(snd.Source.prototype);
snd.OscillatorSource.prototype.constructor = snd.OscillatorSource;

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
 * 波形を設定します。<br/>
 * waveformにはsnd.oscillatortype名前空間に定義されているSINEなどの定数か、またはPeriodicWaveオブジェクトを入れてください。<br/>
 * 定数が使用された場合はsetWaveTypeメソッドを、そうでない場合はsetPeriodicWaveメソッドを使用して、このオシレータの波形を設定します。
 * @param {String | PeriodicWave} waveform 波形データ。
 */
snd.OscillatorSource.prototype.setWaveForm = function(waveform) {
    if (waveform === snd.oscillatortype.SINE
            || waveform === snd.oscillatortype.SQUARE
            || waveform === snd.oscillatortype.SAWTOOTH
            || waveform === snd.oscillatortype.TRIANGLE) {
        this.setOscillatorType(waveform);
    } else {
        this.setPeriodicWave(waveform);
    }
};

/**
 * 波形の種類を設定します。<br/>
 * 引数には、snd.oscillatortype.SINE, snd.oscillatortype.SQUARE, snd.oscillatortype.SAWTOOTH, snd.oscillatortype.TRIANGLEのいずれかを設定してください。
 * 
 * @param {OscillatorType} oscillatorType
 */
snd.OscillatorSource.prototype.setOscillatorType = function(oscillatorType) {
    if (this.source != null) {
        this.source.type = oscillatorType;
    }
};

/**
 * このオシレータの波形の種類を返します。<br/>
 * 戻り値にはOscillatorTypeが使われます。<br/>
 * OscillatorTypeの詳細は、WebAudioAPIの仕様を参照してください。
 * 
 * @returns {OscillatorType} 波形の種類
 */
snd.OscillatorSource.prototype.getOscillatorType = function() {
    if (this.source != null) {
        return this.source.type;
    } else {
        return null;
    }
};

/**
 * 周波数を設定します。
 * @param {type} hz 周波数[Hz]
 */
snd.OscillatorSource.prototype.setFrequency = function(hz) {
    if (this.source != null) {
        this.source.frequency.value = hz;
    }
};

/**
 * 現在の周波数を取得します。
 * @returns {Number} 周波数[Hz]
 */
snd.OscillatorSource.prototype.getFrequency = function() {
    if (this.source != null) {
        return this.source.frequency.value;
    } else {
        return null;
    }
};

/**
 * ピッチシフトの量を設定します。<br/>
 * 単位はセントです。
 * @param {Number} ピッチシフトの量 [cent]
 */
snd.OscillatorSource.prototype.setDetune = function(cent) {
    if (this.source != null) {
        this.source.detune.value = cent;
    }
};

/**
 * ピッチシフトの量を取得します<br/>
 * 単位はセントです。
 * @returns {Number} ピッチシフトの量 [cent]
 */
snd.OscillatorSource.prototype.getDetune = function() {
    if (this.source != null) {
        return this.source.detune.value;
    } else {
        return null;
    }
};

/**
 * フーリエ級数で表された波形を、このオシレータの波形として設定します。<br/>
 * 引数に使用するPeriodicWaveオブジェクトは、AudioContextのcreatePeriodicWaveメソッドを使って生成してください。<br/>
 * PriodicWaveオブジェクトの詳細は<a href="http://g200kg.github.io/web-audio-api-ja/#dfn-createPeriodicWave">WebAudioAPIの仕様</a>を参照してください。<br/>
 * @param {PeriodicWave} periodicWave フーリエ級数で表された波形(1周期分)
 */
snd.OscillatorSource.prototype.setPeriodicWave = function(periodicWave) {
    this.periodicWave = periodicWave;
    if (this.source != null) {
        this.source.setPeriodicWave(periodicWave);
    }
};

/**
 * この音源の波形データを返します。
 * @returns {PeriodicWave}
 */
snd.OscillatorSource.prototype.getPeriodicWave = function() {
    return this.periodicWave;
}

/**
 * 波形の再生をスタートします。
 * 
 * @param {float} when 開始時刻 [秒]
 * @param {type} offset 使用しません
 * @param {type} duration 使用しません
 */
snd.OscillatorSource.prototype.start = function(when, offset, duration) {
    if (this.source != null && this.status != snd.status.STARTED && this.status != snd.status.STOPPED) {
        if (when == null) {
            this.source.start(0);
        } else {
            this.source.start(when);
        }
        this._status.status = snd.status.STARTED;
    }
};


/**
 * 波形の再生を終了します。
 * @param {float} when 終了するタイミング
 */
snd.OscillatorSource.prototype.stop = function(when) {
    if (this.status != snd.status.STOPPED) {
        if (when == null) {
            this.source.stop(0);
        } else {
            this.source.stop(when);
        }
        this._status.status = snd.status.STOPPED;
    }
};

snd.OscillatorSource.prototype.resetOscillator = function() {
    var freq = null;
    var cent = null;
    var oscillatorType = null;

    if (this.source != null) {
        freq = this.getFrequency();
        cent = this.getDetune();
        if (this.status != snd.status.STOPPED) {
            this.source.stop(0);
        }
        oscillatorType = this.getOscillatorType();
    }

    this.source = snd.AUDIO_CONTEXT.createOscillator();
    
    this.resetEventMethods();
    
    this.source.connect(this._gain);
    if (freq != null) {
        this.setFrequency(freq);
    } else {
        this.setFrequency(snd.OscillatorSource.DEFAULT_FREQUENCY);
    }
    if (cent != null) {
        this.setDetune(cent);
    } else {
        this.setFrequency(0);
    }
    if (oscillatorType != null && oscillatorType != "custom") {
        this.setOscillatorType(oscillatorType);
    }
    if (this.getPeriodicWave() != null) {
        this.setPeriodicWave(this.getPeriodicWave());
    }

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

snd.OscillatorSource.prototype.resetEventMethods = function() {
    var _this = this;
    
    this.source.onended = function() {
        var a = _this.listeners['onended'];
        for (var i = 0; i < a.length; i++) {
            a[i](_this);
        }
    };
};

snd.OscillatorSource.prototype.createStatus = function() {
    return new snd.OscillatorSource.Status();
};

snd.OscillatorSource.prototype.toJSON = function() {
    return this._status;
};

snd.OscillatorSource.prototype.loadData = function() {
    snd.Source.prototype.loadData.apply(this, arguments);
    
    //@TODO
};

snd.OscillatorSource.Status = function() {
    snd.Source.Status.apply(this, arguments);
    //@ TODO
};
