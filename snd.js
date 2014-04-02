/**
 * snd.js v62190 beta
 * 
 * The MIT License (MIT)
 * copyright (c) 2014 N_H <h.10x64@gmail.com>
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
 * @namespace snd.jsの基幹ネームスペースです。
 * @version 62190 beta
 */
snd = {VERSION: "62190", IS_BETA:true};

/**
 * ブラウザ名です
 * @type String
 */
snd.BLOWSER = window.navigator.userAgent.toLowerCase();

/**
 * 表示に使われているブラウザがmp3形式のAudioBufferに対応しているかどうかを表します
 * @type Boolean
 */
snd.DOES_MP3_SUPPORTED = false;
if (snd.BLOWSER.indexOf("chrome") != -1) {
    snd.DOES_MP3_SUPPORTED = true;
}

/*** CONSTANTS ***/

/**
 * @namespace 音源のステータスを表す値を入れるネームスペースです。
 */
snd.status = {};
/**
 * 音源が未設定などの理由で、ステータスがまだ定まっていないことを表す値です。
 */
snd.status.NONE = "none";
/**
 * 音源の読込が終了するなどして、音源の再生が可能な状態になっていることを表す値です。
 */
snd.status.READY = "ready";
/**
 * 音源の再生が開始され、再生中であることを表す値です。
 */
snd.status.STARTED = "started";
/**
 * 音源の再生が中断し、停止中であることを表す値です。
 */
snd.status.PAUSED = "paused";
/**
 * 音源の再生が終了し、停止したことを表す値です。
 */
snd.status.STOPPED= "ended";

/**
 * @namespace 音源の種類をあらわす値を入れるネームスペースです。
 */
snd.srctype = {};
/**
 * 使用される音源の種類が未定であることを表す値です。
 */
snd.srctype.NONE = "none";
/**
 * 使用される音源の種類がAudioBufferNodeであることを表す値です。
 */
snd.srctype.AUDIO_BUFFER = "AudioBuffer";
/**
 * 使用される音源の種類がMediaStreamAudioSourceNodeであることを表す値です。
 */
snd.srctype.MEDIA_STREAM = "MediaStream";
/**
 * 使用される音源の種類がMediaElementAudioSourceNodeであることを表す値です。
 */
snd.srctype.MEDIA_ELEMENT = "MediaElement";
/**
 * 使用される音源の種類がOscillatorであることを表す値です。
 */
snd.srctype.OSCILLATOR = "Oscillator";
/*** VECTOR CLASS ***/

/**
 * @class 3次元ベクトルクラスです。
 *      球座標としても使われ、その場合、x, y, zの値はそれぞれ
 *      x: 方位角
 *      y: 仰角
 *      z: 距離
 *      として扱われます。
 */
snd.vec3 = function(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
};

snd.vec3.prototype.add = function(pos) {
    return new snd.vec3(this.x + pos.x, this.y + pos.y, this.z + pos.z);
};

snd.vec3.prototype.mult = function(a) {
    return new snd.vec3(a * this.x, a * this.y, a * this.z);
};

snd.vec3.prototype.sub = function(pos) {
    return this.add(pos.mult(-1));
};

snd.vec3.prototype.length = function() {
    return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
};

snd.vec3.prototype.normalize = function() {
    return this.mult(1.0 / this.length());
};

snd.vec3.prototype.toSphericalCoordinate = function() {
    var azimuth = Math.atan2(this.z, this.x);
    var elevation = Math.atan2(this.y, Math.sqrt(this.z * this.z + this.x * this.x));
    var length = this.length();
    return new snd.vec3(azimuth, elevation, length);
};

snd.vec3.prototype.toOrthogonalCoordinate = function() {
    var retY = this.z * Math.sin(this.y);
    var retX = this.z * Math.cos(this.y) * Math.cos(this.x);
    var retZ = this.z * Math.cos(this.y) * Math.sin(this.x);
    return new snd.vec3(retX, retY, retZ);
};

/**
 * @class 位置と向きをあらわすクラスです。
 *      位置を表すposベクトル、正面向きを表すdirベクトル、上方向を表すupベクトルの3つのベクトルで位置と向きを管理します。
 */
snd.PosDir = function() {
    this.pos = new snd.vec3(0, 0, 0);
    this.dir = new snd.vec3(0, 0, -1);
    this.up = new snd.vec3(0, 1, 0);
};

snd.PosDir.prototype.setPosition = function(x, y, z) {
    this.pos.x = x;
    this.pos.y = y;
    this.pos.z = z;
};

snd.PosDir.prototype.setDir = function(x, y, z) {
    this.dir.x = x;
    this.dir.y = y;
    this.dir.z = z;
    this.dir.normalize();
};

snd.PosDir.prototype.setUp = function(x, y, z) {
    this.up.x = x;
    this.up.y = y;
    this.up.z = z;
    this.up.normalize();
};

snd.PosDir.prototype.setOrientation = function(x, y, z, ux, uy, uz) {
    this.setDir(x, y, z);
    this.setUp(ux, uy, uz);
};

snd.PosDir.prototype.setOrientationBySpherical = function(dir, up) {
    var orthDir;
    if (up != null) {
        var orthUp = up.toOrthogonalCoordinate();
        this.setTop(orthUp.x, orthUp.y, orthUp.z);
        
        var rotDir = dir.sub(up);
        rotDir.normalize();
        
        orthDir = rotDir.toOrthogonalCoordinate();
    } else {
        orthDir = dir.toOrthogonalCoordinate();
    }
    
    this.setDir(orthDir.x, orthDir.y, orthDir.z);
};

snd.PosDir.interpolation = function(left, right, ratio) {
    var calc = {};
    var values = {
        px : {left: left.pos.x, right: right.pos.x},
        py : {left: left.pos.y, right: right.pos.y},
        pz : {left: left.pos.z, right: right.pos.z},
        ux : {left: left.up.x, right: right.up.x},
        uy : {left: left.up.y, right: right.up.y},
        uz : {left: left.up.z, right: right.up.z},
        dx : {left: left.dir.x, right: right.dir.x},
        dy : {left: left.dir.y, right: right.dir.y},
        dz : {left: left.dir.z, right: right.dir.z}
    };
    
    for (var key in values) {
        calc[key] = values[key].left + (values[key].right - values[key].left) * ratio;
    }
    
    var ret = new snd.PosDir();
    ret.setPos(calc.px, calc.py, calc.pz);
    ret.setUp(calc.ux, calc.uy, calc.uz);
    ret.setDir(calc.dx, calc.dy, calc.dz);
    
    return ret;
};
/**
 * @class 各種音源クラスの親クラスとなる抽象クラスです。
 * @param {String} id この音源のID
 */
snd.Source = function(id) {
    this.isSource = true;
    this.gain = snd.AUDIO_CONTEXT.createGain();
    this.id = id;
    this.type = snd.srctype.NONE;
    this.status = snd.status.NONE;
    
    this.listeners = {};
    this.sourceEventNames = [];
};

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
 * 詳細はAudioUnitクラスのconnectを参照してください。
 * @param {type} connectTo 接続先
 */
snd.Source.prototype.connect = function(connectTo) {
    if (connectTo.isAudioUnit) {
        this.gain.connect(connectTo.getConnector());
    } else {
        this.gain.connect(connectTo);
    }
};

/**
 * 詳細はAudioUnitクラスのdisconnectFromを参照してください。
 * @param {type} disconnectFrom 切断する接続先
 */
snd.Source.prototype.disconnect = function(disconnectFrom) {
    if (disconnectFrom.isAudioUnit) {
        this.gain.disconnect(disconnectFrom);
    } else {
        this.gain.disconnect(disconnectFrom);
    }
};

snd.Source.prototype.addEvent = function(sourceEventName, eventName, additionalMethod) {
    var _this = this;
    this[sourceEventName] = function() {
        if (additionalMethod != null) {
            additionalMethod(_this);
        }
        if (_this.listeners[eventName] != null) {
            for (var i = 0; _this.listeners[eventName].length; i++) {
                _this.listeners[eventName][i]["on" + eventName](_this);
            }
        }
    };
    if (this.sourceEventNames.indexOf(sourceEventName)) {
        this.sourceEventNames.push(sourceEventName);
    }
    this.listeners[eventName] = [];
    this["add" + eventName + "EventListener"] = function(listener) {
        _this.listeners[eventName].push(listener);
    };
    this["remove" + eventName + "EventListener"] = function(listener) {
        var i = _this.listeners[eventName].indexOf(listener);
        if (i < 0) {
            return false;
        } else {
            _this.listeners[eventName].splice(i, 1);
        }
    };
};

snd.Source.prototype.setEventMethod = function(src) {
    for (var i = 0; i < this.sourceEventNames.length; i++) {
        src[this.sourceEventNames[i]] = this[this.sourceEventNames[i]];
    }
};

snd.Source.prototype.resetEventMethod = function(src) {
    for (var i = 0; i < this.sourceEventNames.length; i++) {
        src[this.sourceEventNames[i]] = function(){};
    }
};
/**
 * @class バイナリデータを再生する音源です。<br/>
 * 詳細はWebAudioAPIの仕様を参照してください。<br/>
 * どのブラウザも、基本的にwav形式のファイルには対応していますが、mp3については対応状況がまばらです。<br/>
 * @param {type} id この音源のID
 */
snd.BufferSource = function(id) {
    snd.Source.apply(this, arguments);
    this.type = snd.srctype.AUDIO_BUFFER;
    this.status = snd.status.NONE;
    
    this.addEvent("onended", "Stop", function(_this){_this.status = snd.status.STOPPED;});
};
snd.BufferSource.prototype = Object.create(snd.Source.prototype);
snd.BufferSource.prototype.constructor = snd.BufferSource;

snd.BufferSource.prototype.start = function(when, offset, duration) {
    if (this.source != null && this.status == snd.status.READY) {
        if (when == null) {
            this.source.start(0);
        } else if (offset == null) {
            this.source.start(when);
        } else if (duration == null) {
            this.source.start(when, offset);
        } else {
            this.source.start(when, offset, duration);
        }
        this.status = snd.status.STARTED;
    } else {
        if (this.audioBuffer != null) {
            this.setAudioBuffer(this.audioBuffer);
            this.start(when, offset, duration);
        }
    }
};

snd.BufferSource.prototype.stop = function(when) {
    if (this.source != null) {
        if (when == null) {
            this.source.stop(0);
        } else {
            this.source.stop(when);
        }
    }
};

snd.BufferSource.prototype.connect = function(connectTo) {
    if (connectTo.isAudioUnit) {
        this.gain.connect(connectTo.getConnector());
    } else {
        this.gain.connect(connectTo);
    }
};

snd.BufferSource.prototype.disconnect = function(disconnectFrom) {
    this.gain.disconnect(disconnectFrom);
};

/**
 * オーディオバッファを設定するメソッドです。<br>
 * 
 * @param {type} audioBuffer
 */
snd.BufferSource.prototype.setAudioBuffer = function(audioBuffer) {
    this.audioBuffer = audioBuffer;

    var src = snd.AUDIO_CONTEXT.createBufferSource();
    if (this.source != null) {
        this.resetEventMethod(this.source);
    }
    delete this.source;
    this.source = src;
    this.source.buffer = this.audioBuffer;
    this.source.connect(this.gain);
    this.setEventMethod(this.source);

    this.status = snd.status.READY;
};

/**
 * この音源がループするかどうかを設定します。
 * @param {boolean} status ループするか否か
 */
snd.BufferSource.prototype.setLoop = function(status) {
    if (this.source != null) {
        this.source.loop = status;
    }
};

/**
 * ループの開始位置を設定します。
 * @param {double} when
 */
snd.BufferSource.prototype.setLoopStart = function(when) {
    if (this.source != null && when != null) {
        this.source.loopStart = when;
    }
};

/**
 * ループの終端を設定します。
 * @param {double} when
 */
snd.BufferSource.prototype.setLoopEnd = function(when) {
    if (this.source != null && when != null) {
        this.source.loopEnd = when;
    }
};


/**
 * @class 任意の波形を再生するオシレータ音源を生成します。<br/>
 * 詳細は、<a href="http://g200kg.github.io/web-audio-api-ja/#dfn-OscillatorNode">WebAudioAPIの仕様<a/>を参照してください。
 * 
 * @param {type} id この音源をあらわすID
 */
snd.OscillatorSource = function(id) {
    snd.Source.apply(this, arguments);

    this.type = snd.srctype.OSCILLATOR;
    this.status = snd.status.NONE;
    
    this.addEvent("onended", "Stop", function(){this.status = snd.status.STOPPED; this.resetOscillator();});

    this.resetOscillator();
};
snd.OscillatorSource.prototype = Object.create(snd.Source.prototype);
snd.OscillatorSource.prototype.constructor = snd.OscillatorSource;

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
 * 
 * @param {type} hz 周波数[hz]
 */
snd.OscillatorSource.prototype.setFrequency = function(hz) {
    if (this.source != null) {
        this.source.frequency.value = hz;
    }
};

/**
 * 現在の周波数を取得します。
 * 
 * @returns {Number} 周波数[hz]
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
/**
 * @class HTMLのメディアタグを音源として使用する音源クラスです。<br/>
 * 詳細は<a href="http://g200kg.github.io/web-audio-api-ja/#MediaElementAudioSourceNode">WebAudioAPI仕様を参照してください。
 * @param {String} id この音源のID
 * @param {HTMLMediaElement} htmlMediaElement HTMLのメディアタグ要素
 */
snd.MediaElementAudioSource = function(id, htmlMediaElement) {
    snd.Source.apply(this, arguments);
    this.source = snd.AUDIO_CONTEXT.createMediaElementSource(htmlMediaElement);
    this.source.connect(this.gain);
    this.type = snd.srctype.MEDIA_ELEMENT;
    this.element = htmlMediaElement;
    this.status = snd.status.NONE;
    
    this.addEvent("onplay", "Start", function(_this) {_this.status = snd.status.STARTED;});
    this.addEvent("pause", "Pause", function(_this) {_this.status = snd.status.PAUSED;});
    this.addEvent("onended", "Stop", function(_this) {_this.status = snd.status.STOPPED;});
    this.addEvent("onabort", "Abort");
    this.addEvent("oncanplay", "CanPlay", function(_this){_this.status = snd.status.READY;});
    this.addEvent("oncanplaythrough", "CanPlayThrough");
    this.addEvent("ondurationchange", "DurationChange");
    this.addEvent("onemptied", "Emptied");
    this.addEvent("onerror", "Error");
    this.addEvent("onloadeddata", "LoadedData");
    this.addEvent("onloadedmetadata", "LoadedMetaData");
    this.addEvent("onloadstart", "LoadStart");
    this.addEvent("onplaying", "Playing");
    this.addEvent("onprogress", "Progress");
    this.addEvent("onratechange", "RateChange");
    this.addEvent("onseeked", "Seeked");
    this.addEvent("onseeking", "Seeking");
    this.addEvent("onstalled", "Stalled");
    this.addEvent("onsuspend", "Suspend");
    this.addEvent("ontimeupdate", "TimeUpdate");
    this.addEvent("onvalumechange", "VolumeChange");
    this.addEvent("onwaiting", "Wating");
    
    this.setEventMethod(this.source);
};
snd.MediaElementAudioSource.prototype = Object.create(snd.Source.prototype);
snd.MediaElementAudioSource.prototype.constructor = snd.MediaElementAudioSource;

snd.MediaElementAudioSource.prototype.load = function() {
    this.source.load();
};

snd.MediaElementAudioSource.prototype.start = function() {
    this.source.play();
};

snd.MediaElementAudioSource.prototype.pause = function() {
    this.source.pause();
};

snd.MediaElementAudioSource.prototype.stop = function() {
    this.source.stop();
};


/**
 * @class ストリームを音源として使用する音源クラスです。<br/>
 * 詳細は<a href="http://g200kg.github.io/web-audio-api-ja/#MediaStreamAudioSourceNode">WebAudioAPI仕様</a>を参照してください。
 * @param {String} id この音源のID
 * @param {MediaStream} mediaStream 再生するデータストリーム
 */
snd.MediaStreamAudioSource = function(id, mediaStream) {
    snd.Source.apply(this, arguments);
    this.source = snd.AUDIO_CONTEXT.createMediaStreamAudioSource(mediaStream);
    this.source.connect(this.gain);
    this.type = snd.srctype.MEDIA_STREAM;
};
snd.MediaStreamAudioSource.prototype = Object.create(snd.Source.prototype);
snd.MediaStreamAudioSource.prototype.constructor = snd.MediaStreamAudioSource;


/**
 * @class 1つのオーディオユニットを定義するクラスです。
 *      インタフェースクラスなので、継承されることを前提としています。
 *      引数にAudioUnitを要求するメソッドに渡すオブジェクトは、ここで定義されている各メソッドを実装している必要があります。
 */
snd.AudioUnit = function(id) {
    this.isAudioUnit = true;
    this.id = id;
};

/**
 * このオーディオユニットをconnectToで指定されたオーディオユニットまたはノードに接続します。
 */
snd.AudioUnit.prototype.connect = function(connectTo) {
    // PLEASE OVERRIDE ME
};

/**
 * このオーディオユニットをdisconnectFromから切断します。
 */
snd.AudioUnit.prototype.disconnect = function(disconnectFrom) {
    // PLEASE OVERRIDE ME
};

/**
 * このオーディオユニットのconnect/disconnectメソッドを持つオブジェクトを返します。<br/>
 * AudioUnitクラス、SoundEnvironmentクラスなどのオブジェクトから呼び出されるメソッドですので、通常は
 * AudioUnit#connect/AudioUnit#disconnectメソッドを使用してください。
 */
snd.AudioUnit.prototype.getConnector = function() {
    // PLEASE OVERRIDE ME
};

/*** GAIN ONLY UNIT ***/

/**
 * @class 主ボリュームのみの単純なユニットです。
 * @extends snd.AudioUnit
 */
snd.GainOnlyUnit = function(id) {
    snd.AudioUnit.apply(this, arguments);
    this.gain = snd.AUDIO_CONTEXT.createGain();
};
snd.GainOnlyUnit.prototype = Object.create(snd.AudioUnit.prototype);
snd.GainOnlyUnit.prototype.constructor = snd.GainOnlyUnit;

/**
 * @see snd.AudioUnit#getConnector
 */
snd.GainOnlyUnit.prototype.connect = function(connectTo) {
    snd.AudioUnit.connect.apply(this, connectTo);
    this.gain.connect(connectTo);
};

snd.GainOnlyUnit.prototype.getConnector = function() {
    return this.gain;
};

/**
 * メインボリュームを取得します。
 *      ボリュームの使用法については<a href="http://g200kg.github.io/web-audio-api-ja/#GainNode">web audio api仕様のGainNode</a>を参照してください。
 * @returns {snd.GainNode} this.gain
 */
snd.GainOnlyUnit.prototype.getGain = function() {
    return this.gain;
};

/**
 * @class リスナを表すクラスです。
 *      AudioContext#Listenerをラップしています。
 *      <a href="#setListener">setListener</a>メソッドを呼び出すまではthis.listenerはnullで、実際の出力へは反映されません。
 *      this.listenerがnullである間も位置は記録されるので、<a href="#setListener">setListener</a>メソッドが呼び出された時点で
 *      WebAudioAPIのListenerに、そのオブジェクトで設定された姿勢が反映されます。
 * @param {Listener} listener AudioContext.listener
 */
snd.Listener = function(listener) {
    snd.PosDir.apply(this, arguments);
    this.listener = listener;

    if (listener != null) {
        this.listener.setOrientation(this.dir.x, this.dir.y, this.dir.z, this.up.x, this.up.y, this.up.z);
    }
};
snd.Listener.prototype = Object.create(snd.PosDir.prototype);
snd.Listener.prototype.constructor = snd.Listener;

/**
 * listenerを設定します。
 *      このメソッドで設定されるまで、WebAudioAPIのlistenerには反映されません。
 * @param {Listener} listener
 */
snd.Listener.prototype.setListener = function(listener) {
    this.listener = listener;
    this.setPosition(this.pos.x, this.pos.y, this.pos.z);
    this.setOrientation(this.dir.x, this.dir.y, this.dir.z, this.up.x, this.up.y, this.up.z);
};

/**
 * このオブジェクトに設定されているlistenerをnullへリセットします。
 */
snd.Listener.prototype.resetListener = function() {
    this.setListener(null);
};

/**
 * リスナの位置を設定します。
 * @param {float} x X軸の値
 * @param {float} y Y軸の値
 * @param {float} z Z軸の値
 */
snd.Listener.prototype.setPosition = function(x, y, z) {
    snd.PosDir.prototype.setPosition.call(this, x, y, z);
    if (this.listener != null) {
        this.listener.setPosition(
                snd.SOUND_ENVIRONMENT.unit * this.pos.x,
                snd.SOUND_ENVIRONMENT.unit * this.pos.y,
                snd.SOUND_ENVIRONMENT.unit * this.pos.z);
    }
};

/**
 * リスナの向きを設定します。
 * @param {flaot} x 正面方向ベクトルのX値
 * @param {flaot} y 正面方向ベクトルのY値
 * @param {flaot} z 正面方向ベクトルのZ値
 * @param {flaot} ux 上方向ベクトルのX値
 * @param {flaot} uy 上方向ベクトルのY値
 * @param {flaot} uz 上方向ベクトルのZ値
 */
snd.Listener.prototype.setOrientation = function(x, y, z, ux, uy, uz) {
    snd.PosDir.prototype.setOrientation.call(this, x, y, z, ux, uy, uz);
    if (this.listener != null) {
        this.listener.setOrientation(this.dir.x, this.dir.y, this.dir.z, this.up.x, this.up.y, this.up.z);
    }
};

/**
 * 球座標でリスナーの向きを設定します。
 * @param {snd.vec3} dir dir.x:方位角 dir.y:仰角 dir.z:距離
 * @param {snd.vec3} up up.x:方位角 up.y:仰角 up.z:距離
 */
snd.Listener.prototype.setOrientationBySpherical = function(dir, up) {
    snd.PosDir.prototype.setOrientationBySpherical.call(this, dir, up);
    if (this.listener != null) {
        this.listener.setOrientation(this.dir.x, this.dir.y, this.dir.z, this.up.x, this.up.y, this.up.z);
    }
};

/**
 * 速度を設定します。
 * @param {type} x X軸方向の速度
 * @param {type} y Y軸方向の速度
 * @param {type} z Z軸方向の速度
 */
snd.Listener.prototype.setVelocity = function(x, y, z) {
    if (this.listener != null) {
        this.listener.setVelocity(
                snd.SOUND_ENVIRONMENT.unit * x,
                snd.SOUND_ENVIRONMENT.unit * y,
                snd.SOUND_ENVIRONMENT.unit * z);
    }
};

 /**
  * @class PannerNodeを使用するパンニングに対応したユニットです。
  * @param {String} id このユニットを表す固有のID
  */
snd.SoundNode = function(id) {
    snd.GainOnlyUnit.apply(this, arguments);
    snd.PosDir.apply(this, arguments);
    
    this.pannerNode = snd.AUDIO_CONTEXT.createPanner();
    this.gain.connect(this.pannerNode);
};
snd.SoundNode.prototype = Object.create(snd.GainOnlyUnit.prototype);
snd.SoundNode.prototype.constructor = snd.SoundNode;

/**
 * @see snd.AudioUnit#connect
 */
snd.SoundNode.prototype.connect = function(connectTo) {
    if (connectTo.isAudioUnit) {
        this.pannerNode.connect(connectTo.getConnector());
    } else {
        this.pannerNode.connect(connectTo);
    }
};

snd.SoundNode.start = function(when, offset, duration) {
    // PLEASE OVERIDE ME
};

snd.SoundNode.stop = function(when) {
    // PLEASE OVERRIDE ME
};

snd.SoundNode.pause = function() {
    // PLEASE OVERRIDE ME
};

/**
 * この音源の位置を設定します。
 * @param {type} x 設定する位置のX値
 * @param {type} y 設定する位置のY値
 * @param {type} z 設定する位置のZ値
 */
 snd.SoundNode.prototype.setPosition = function(x, y, z) {
    snd.PosDir.prototype.setPosition.call(this, x, y, z);
    this.pannerNode.setPosition(
            snd.SOUND_ENVIRONMENT.unit * this.pos.x,
            snd.SOUND_ENVIRONMENT.unit * this.pos.y,
            snd.SOUND_ENVIRONMENT.unit * this.pos.z);
};

/**
 * この音源の向きを設定します
 * @param {Number} x 正面方向ベクトルのX値
 * @param {Number} y 正面方向ベクトルのY値
 * @param {Number} z 正面方向ベクトルのZ値
 */
 snd.SoundNode.prototype.setDir = function(x, y, z) {
    snd.PosDir.prototype.setDir.call(this, x, y, z);
    this.pannerNode.setOrientation(this.dir.x, this.dir.y, this.dir.z);
};

/**
 * この音源の上向きベクトルを設定します。
 * @param {Number} x 上向きベクトルのX値
 * @param {Number} y 上向きベクトルのY値
 * @param {Number} z 上向きベクトルのZ値
 */
 snd.SoundNode.prototype.setUp = function(x, y, z) {
    snd.PosDir.prototype.setUp.call(this, x, y, z);
};

/**
 * この音源の向きを設定します
 * @param {Number} dx 正面方向ベクトルのX値
 * @param {Number} dy 正面方向ベクトルのY値
 * @param {Number} dz 正面方向ベクトルのZ値
 * @param {Number} ux 上方向ベクトルのX値
 * @param {Number} uy 上方向ベクトルのY値
 * @param {Number} uz 上方向ベクトルのZ値
 */
snd.SoundNode.prototype.setOrientation = function(dx, dy, dz, ux, uy, uz) {
    snd.PosDir.prototype.setOrientation.call(this, dx, dy, dz, ux, uy, uz);
    this.pannerNode.setOrientation(this.dir.x, this.dir.y, this.dir.z);
};

/**
 * この音源の速度を設定します。
 * @param {type} x 速度ベクトルのX値
 * @param {type} y 速度ベクトルのY値
 * @param {type} z 速度ベクトルのZ値
 */
 snd.SoundNode.prototype.setVelocity = function(x, y, z) {
    this.pannerNode.setVelocity(
            snd.SOUND_ENVIRONMENT.unit * x,
            snd.SOUND_ENVIRONMENT.unit * y,
            snd.SOUND_ENVIRONMENT.unit * z);
};


/**
 * @class AudioBufferの管理を行うクラスです。<br/>
 * データの読み込みだけでなく、複数のAudioBufferのローディングを待機するときなどに使用してください。
 */
snd.AudioDataManager = function() {
    /**
     * リクエストを格納するマップ<br>
     * {キー:XMLHttpRequest}
     */
    this.requests = {};
    /**
     * データを格納するマップ<br>
     * {キー:{data:AudioBuffer, doesLoaded:boolean}}
     */
    this.dataMap = {};
    /**
     * イベントの送り先を格納するマップ<br>
     * {キー:{onload:[function]}}
     */
    this.eventListeners = {};
    
    this.allLoadEventListeners = [];
};

/**
 * 
 */
snd.AudioDataManager.prototype.onload = function() {
    for (var i = 0; i < this.allLoadEventListeners.length; i++) {
        this.allLoadEventListeners[i]();
    }
};

/**
 * 全データ読込み終了イベントのリスナへfuncで指定されたメソッドを追加します。
 * @param {type} func 全データの読込みが終了した際に呼び出されるメソッド。呼び出す時は引数なしでfunc()を実行します。
 */
snd.AudioDataManager.prototype.addAllDataLoadListener = function(func) {
    this.allLoadEventListeners.push(func);
};

/**
 * 全データ読込み終了イベントのリスナからfuncで指定されたメソッドを削除します。
 * @param {type} func リストから外すメソッド
 * @returns {Boolean} 削除した場合はtrue, 削除しなかった場合はfalse
 */
snd.AudioDataManager.prototype.removeAllDataLoadListener = function(func) {
    for (var i = 0; i < this.allLoadEventListeners.length; i++) {
        var f = this.allLoadEventListeners[i];
        if (f === func) {
            delete this.allLoadEventListeners[i];
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
snd.AudioDataManager.prototype.addOnloadListener = function(key, func) {
    if (this.eventListeners.onload[key] == null) {
        this.eventListeners[key] = [];
    }
    this.eventListeners.onload[key].push(func);
};

/**
 * keyで指定されたAudioBufferの読込が終了した際に呼び出されるコールバック関数を削除します。<br/>
 * 指定されたkeyで追加されたコールバック関数がない場合、削除は行いません。
 * @param {type} key
 * @returns {undefined}
 */
snd.AudioDataManager.prototype.removeOnloadListener = function(key) {
    if (this.eventListeners.onload[key] != null) {
        delete this.eventListeners.onload[key];
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
    if (this.dataMap[key] != null) {
        return this.dataMap[key].data;
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
    this.dataMap[key] = {doesLoaded:false};
    
    var request = new XMLHttpRequest();
    request.open("GET", url, true);
    request.responseType = "arraybuffer";
    
    request.onload = function() {
        snd.AUDIO_CONTEXT.decodeAudioData(
                    request.response,
                    function(buf) {
                        _this.dataMap[key].data = buf;
                        _this.dataMap[key].doesLoaded = true;
                        _this.loaded(key, buf);
                    });
    };
    
    this.requests[key] = request;
};

/**
 * 設定された全データのロードが完了しているかどうかを返します。
 * @returns {Boolean} 全データのロードが完了しているか否か
 */
snd.AudioDataManager.prototype.doesAllDataLoaded = function() {
    for (var key in this.dataMap) {
        if (!this.dataMap[key].doesLoaded) {
            return false;
        }
    }
    return true;
};

/**
 * dataSetsで渡された全てのurlを追加します。<br/>
 * dataSetsには{キー:URL}となっているハッシュマップを渡してください。<br/>
 * キーが追加されるAudioBufferのキー値として使用され、URLがAudioBufferが読込むURLとして設定されます。<br/>
 * <br/>
 * addAllを使用した時点ではまだ読込は開始されません。<br/>
 * データの読込を開始するには、load関数を使用する必要があります。
 * @param {HashMap} キー値と読み込むURLを指定したハッシュマップ
 * @see {snd.AudioDataManager.load}
 */
snd.AudioDataManager.prototype.addAll = function(dataSets) {
    for (var key in dataSets) {
        this.add(key, dataSets[key]);
    }
};

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
    if (key == null) {
        for (var key in this.requests) {
            this.requests[key].send();
        }
    } else {
        this.requests[key].send();
    }
};

/**
 * keyで取得されるAudioBufferの読込が終了した際にsnd.AUDIO_CONTEXTから呼ばれるコールバック関数です。<br/>
 * AudioDataManagerが内部で使用するための関数なので、オーバーライドはしないでください。
 * @param {type} key 読み込みの終了したキー
 * @param {buffer} buf 読込んだバッファ
 */
snd.AudioDataManager.prototype.loaded = function(key, buffer) {
    this.dataMap[key].doesLoaded = true;
    if (this.eventListeners[key] != null) {
        for (var i = 0; i < this.eventListeners[key].onload.length; i++) {
            this.eventListeners[key].onload[i](buffer);
        }
    }
    
    for (var k in this.dataMap) {
        if (!this.dataMap[k].doesLoaded) {
            return;
        }
    }
    this.onload();
};

snd.AudioMaster = function() {
    this.unitList = {};
    this.gain = snd.AUDIO_CONTEXT.createGain();
    
    this.gain.connect(snd.AUDIO_CONTEXT.destination);
};

/**
 * 新しいユニットを接続します。<br>
 * 各種ユニットは、最終的にこのメソッドを使って実際の出力へ反映されます。
 * @param {type} key 接続するユニットを表すキー値
 * @param {snd.AudioUnit} audioUnit 接続するユニット
 */
snd.AudioMaster.prototype.connectAudioUnit = function(key, audioUnit) {
    this.unitList[key] = audioUnit;
    audioUnit.connect(this.gain);
};

/**
 * 接続済みのユニットを取得します。
 * @param {type} key
 */
snd.AudioMaster.prototype.getAudioUnit = function(key) {
    return this.unitList[key];
};

/**
 * 接続されたユニットを切断します。
 * @param {type} key 切断するユニット
 */
snd.AudioMaster.prototype.disconnectAudioUnit = function(key) {
    var audioUnit = this.unitList[key];
    audioUnit.getConnector().disconnect(this.gain);
    delete this.unitList[key];
};
/**
 * @class
 */
snd.SoundEnvironment = function() {
    this.now = 0;
    this.listener = snd.AUDIO_CONTEXT.listener;
    this.listeners = {};
    this.soundNodes = {};
    this.unit = 1.0;
};

/**
 * SI単位系の接頭辞です。<br/>
 * snd.SOUND_ENVIRONMENT.setUnitPrefix(prefix)メソッドで距離の単位を指定する際に使用してください。<br/>
 * k: 1000[m]<br/>
 * h: 100[m]<br/>
 * da: 10[m]<br/>
 * d: 0.1[m]<br/>
 * c: 0.01[m]<br/>
 * m: 0.001[m]<br/>
 * 
 */
snd.SoundEnvironment.prefix = {
    kilo: 1000,
    hecto: 100,
    deca: 10,
    metre: 1.0,
    deci: 0.1,
    centi: 0.01,
    milli: 0.001
};

/**
 * バッファに姿勢情報を記録する最大数のデフォルト値。<br/>
 * 30フレーム/秒として60秒分
 * @type Integer
 */
snd.SoundEnvironment.DEFAULT_BUFFER_MAX = 1800;

snd.SoundEnvironment.prototype.setUnitPrefix = function(prefix) {
    this.unit = prefix;
};

snd.SoundEnvironment.prototype.addListener = function(id, listener) {
    this.listeners[id] = new snd.PosDirTime(listener, 1);
};

snd.SoundEnvironment.prototype.removeListener = function(id) {
    if (this.soundNodes[id] != null) {
        delete this.soundNodes[id];
    }
};

snd.SoundEnvironment.prototype.addSoundNode = function(id, soundNode) {
    this.soundNodes[id] = new snd.PosDirTime(soundNode);
};

snd.SoundEnvironment.prototype.removeSoundNode = function(id) {
    if (this.soundNodes[id] != null) {
        delete this.soundNodes[id];
    }
};

snd.SoundEnvironment.prototype.update = function(time) {
    if (this.now > time) {
        throw new snd.SoundEnvironment.UpdateError(this, "time < this.now (time: " + time  + ", this.now: " + this.now);
    }
    
    for (var key in this.listeners) {
        this.listeners[key].update(time);
    }
    for (var key in this.soundNodes) {
        this.soundNodes[key].update(time);
    }
};

/**
 * @class フレーム更新時にエラーが発生した時にthrowするオブジェクト
 */
snd.SoundEnvironment.UpdateError = function(_this, message) {
    this._this = _this;
    this.message = message;
};

/**
 * @class snd.PosDirに時系列情報を付加したクラスです。<br/>
 * updateが呼ばれるたびにバッファに姿勢情報を追記します。<br/>
 * バッファに記録する個数はbufferMaxで指定された数が最大で、それ以上になると過去の情報から順に消されます。<br/>
 * bufferMaxのデフォルト値はsnd.SoundEnvironment.DEFAULT_BUFFER_MAXで定義されています。
 */
snd.PosDirTime = function(data, bufferMax) {
    this.data = data;
    this.history = []; // [{time: milli second, posture: posture}]
    this.bufferMax = bufferMax;
};

snd.PosDirTime.prototype.update = function(time) {
    if (this.history.length == 0) {
        this.history.push({time: 0, posture: Object.create(this.data)});
    }
    if (this.history.length > this.bufferMax) {
        this.history.splice(0, 1);
    }
    this.history.push({time:time, posture:Object.create(this.data)});
};

snd.PosDirTime.prototype.getPosture = function(time) {
    var res = this.search(time);
    if (res == null) {
        return null;
    } else if (res.left == res.right) {
        return this.history[res.left];
    }
    
    var left = this.history[left];
    var right = this.history[right];
    var ratio = (time - left.time) / (right.time - left.time);
    
    return snd.PosDir.interpolation(left, right, ratio);
};

snd.PosDirTime.prototype.search = function(time) {
    if (this.history.length <= 0) {
        return null;
    } else if (this.history.length == 1) {
        return {left: 0, right: 0};
    } else if (this.history[this.history.length - 1].time < time) {
        return {left: this.history.length - 1, right: this.history.legnth - 1};
    } else if (this.history[0].time > time) {
        return {left: 0, right: 0};
    }
    
    var left = 0, right = this.history.length - 1;
    var mid = Math.floor(right / 2);
    
    while (true) {
        mid = Math.floor((time - this.history[left].time) * (right - left) / (this.history[right].time - this.history[left].time)) + left;
        if (this.history[mid].time < time) {
            if (this.history[mid + 1] > time) {
                return {left: mid, right: mid + 1};
            }
            left = mid + 1;
        } else if (this.history[mid].time > time) {
            if (this.history[mid - 1].time < time) {
                return {left: mid - 1, right: mid};
            }
            right = mid - 1;
        } else {
            return {left: mid, right: mid};
        }
    }
};


snd.util = {};

/**
 * 
 * @param {HashMap} dataSet 音源のIDを読込むURLの配列 {ID1: "URL1", ID2: "URL2", ... IDn: "URLn"}
 * @param {function} func 読込みが終了し、音源の準備が完了した時に呼ばれるコールバック関数
 */
snd.util.createBufferSources = function(dataSet, func) {
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

    snd.AUDIO_DATA_MANAGER.addAllDataLoadListener(function() {
        var ret = {};
        
        for (var url in sourceMap) {
            for (var i = 0; i < sourceMap[url].length; i++) {
                sourceMap[url][i].setAudioBuffer(snd.AUDIO_DATA_MANAGER.getAudioBuffer(url));
                ret[sourceMap[url][i].id] = sourceMap[url][i];
            }
        }
        
        func(ret);
    });
    
    snd.AUDIO_DATA_MANAGER.load();
};

/**
 * オクターブと音高から周波数を計算します。<br/>
 * 周波数の基準はA4(440[Hz])です。<br/>
 * 音高の指定は0～12の値(実数)で行い、整数部が1増えるごとに半音上昇します。
 * @param {Number} octave オクターブ
 * @param {Number} pitch 音高(A=0, A#=1, B=2, ... G=10, G#=11)
 * @returns {Number} 周波数[hz]
 */
snd.util.noteToFrequency = function(octave, pitch) {
    return 440.0 * Math.pow(2.0, (12 * (octave - 4) + pitch) / 12);
};

/**
 * テンポと音長から秒数を計算します。
 * @param {type} tempo テンポ(1分間に演奏する4分音符の個数)
 * @param {type} noteValue 音長 (全音符=1, 半音符=2, 四分音符=4, 八分音符=8, ... )
 * @returns {Number}
 */
snd.util.noteToSec = function(tempo, noteValue) {
    return 60.0 / (tempo * noteValue / 4);
};

/***  PROPERTIES ***/

/**
 * ブラウザから取得したオーディオコンテキストが入ります。
 *      snd#initメソッドが呼ばれるまで初期化されず、nullとなっている点に注意してください。
 * @type AudioContext
 */
snd.AUDIO_CONTEXT = null;

/**
 * シミュレーション上の聴取環境を管理するクラスのインスタンスが入ります。<br/>
 * @type snd.SoundEnvironment 
 */
snd.SOUND_ENVIRONMENT = null;
/**
 * snd.jsのPAミキサーです。<br/>
 * 各種エフェクトや音源は、snd.Master.connectAudioUnitメソッドを使ってここに接続することで音が出力されるようになります。
 * @type snd.AudioMaster
 */
snd.MASTER = null;
/**
 * 
 * @type type
 */
snd.AUDIO_DATA_MANAGER = null;

/**
 * 現在選択中のリスナーが入ります。
 *      リスナーは複数用意することが可能ですが、出力へ反映されるリスナは常に選択中の1つのみになっています。
 *      リスナーの追加や選択については、snd.SoundEnvironmentクラスを参照してください。
 * @type type
 * @see snd.SoundEnvironment
 */
snd.LISTENER = null;

/*** METHODS ***/

/**
 * snd.jsを初期化します。
 */
snd.init = function() {
    snd.resetAudioContext();
    snd.SOUND_ENVIRONMENT = new snd.SoundEnvironment();
    snd.MASTER = new snd.AudioMaster();
    snd.AUDIO_DATA_MANAGER = new snd.AudioDataManager();
};

/**
 * オーディオコンテキストを初期化します。
 *      snd#initメソッドから呼び出すためのメソッドですので、特別な理由が無い限り使用しないでください。
 * @private
 */
snd.resetAudioContext = function() {
    if (snd.AUDIO_CONTEXT == null) {
        // Create AudioContext
        if ('AudioContext' in window) {
            // firefox
            snd.AUDIO_CONTEXT = new AudioContext();
        } else if ('webkitAudioContext' in window) {
            // crome etc
            snd.AUDIO_CONTEXT = new webkitAudioContext();
        }
    }
};
