
/**
 * 新しくオシレータ音源を生成します。
 * @param {type} id この音源をあらわすID
 * @class 任意の波形を再生するオシレータ音源を扱うクラスです。<br/>
 * 詳細は、<a href="http://g200kg.github.io/web-audio-api-ja/#dfn-OscillatorNode">WebAudioAPIの仕様</a>を参照してください。
 * @memberOf snd
 */
snd.OscillatorSource = function(id) {
    snd.Source.apply(this, arguments);

    this.type = snd.srctype.OSCILLATOR;
    this.status = snd.status.NONE;
    
    this.listeners = {
        onended: []
    };

    this.resetOscillator();
};
snd.OscillatorSource.prototype = Object.create(snd.Source.prototype);
snd.OscillatorSource.prototype.constructor = snd.OscillatorSource;

/**
 * 基準となる周波数(440Hz)です。<br/>
 * @type Number
 * @memberOf snd.OscillatorSource
 */
snd.OscillatorSource.DEFAULT_FREQUENCY = 440;

/**
 * 波形の種類を設定します。<br/>
 * 引数のoscillatorTypeはWebAudioAPIで定義されたOscillatorType列挙型を使用してください。<br/>
 * OscillatorTypeの詳細は、<a href="http://g200kg.github.io/web-audio-api-ja/#dfn-OscillatorNode">WebAudioAPIの仕様<a/>を参照してください。
 * 
 * @param {OscillatorType} oscillatorType
 */
snd.OscillatorSource.prototype.setType = function(oscillatorType) {
    if (this.source != null) {
        this.source.type = oscillatorType;
    }
};

/**
 * このオシレータの波形の種類を返します。<br/>
 * 戻り値にはOscillatorTypeが使われます。<br/>
 * OscillatorTypeの詳細は、<a href="http://g200kg.github.io/web-audio-api-ja/#dfn-OscillatorNode">WebAudioAPIの仕様<a/>を参照してください。
 * 
 * @returns {OscillatorType} 波形の種類
 */
snd.OscillatorSource.prototype.getType = function() {
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
    if (this.source != null) {
        this.source.setPeriodicWave(periodicWave);
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
    if (this.source != null && this.status != snd.status.STARTED && this.status != snd.status.STOPPED) {
        if (when == null) {
            this.source.start(0);
        } else {
            this.source.start(when);
        }
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
    }
};

snd.OscillatorSource.prototype.resetOscillator = function() {
    var freq = null;
    var cent = null;

    if (this.source != null) {
        freq = this.getFrequency();
        cent = this.getDetune();
        if (this.status != snd.status.STOPPED) {
            this.source.stop(0);
        }
    }

    this.source = snd.AUDIO_CONTEXT.createOscillator();
    
    this.resetEventMethods();
    
    this.source.connect(this.gain);
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

    this.status = snd.status.READY;
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
