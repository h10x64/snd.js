/* snd.js - The Sound Library for JavaScript with WebAudioAPI - v.0.1.0 */
/**
 * snd.js
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
 * snd.jsの基幹ネームスペースです。
 * @namespase
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

/**
 * 音源のステータスを表す値を入れるネームスペースです。
 * @memberOf snd
 * @namespace
 */
snd.status = {};
/**
 * 音源が未設定などの理由で、ステータスがまだ定まっていないことを表す値です。
 * @type String
 */
snd.status.NONE = "none";
/**
 * 音源の読込が終了するなどして、音源の再生が可能な状態になっていることを表す値です。
 * @type String
 */
snd.status.READY = "ready";
/**
 * 音源の再生が開始され、再生中であることを表す値です。
 * @type String
 */
snd.status.STARTED = "started";
/**
 * 音源の再生が中断し、停止中であることを表す値です。
 * @type String
 */
snd.status.PAUSED = "paused";
/**
 * 音源の再生が終了し、停止したことを表す値です。
 * @type String
 */
snd.status.STOPPED= "ended";

/**
 * 音源の種類をあらわす値を入れるネームスペースです。
 * @memberOf snd
 * @namespace
 */
snd.srctype = {};
/**
 * 使用される音源の種類が未定であることを表す値です。
 * @type String
 */
snd.srctype.NONE = "none";
/**
 * 使用される音源の種類がAudioBufferNodeであることを表す値です。
 * @type String
 */
snd.srctype.AUDIO_BUFFER = "AudioBuffer";
/**
 * 使用される音源の種類がMediaStreamAudioSourceNodeであることを表す値です。
 * @type String
 */
snd.srctype.MEDIA_STREAM = "MediaStream";
/**
 * 使用される音源の種類がMediaElementAudioSourceNodeであることを表す値です。
 * @type String
 */
snd.srctype.MEDIA_ELEMENT = "MediaElement";
/**
 * 使用される音源の種類がOscillatorであることを表す値です。
 * @type String
 */
snd.srctype.OSCILLATOR = "Oscillator";


snd.audioparam = {};
/**
 * オーディオパラメータの補間方法を指定する際に使用する定数をまとめた名前空間です。
 * @memberof snd
 * @namespace
 */
snd.audioparam.type = {};

snd.audioparam.type.SET = "Set";
snd.audioparam.type.LINER = "Liner";
snd.audioparam.type.EXPONENTIALLY = "Exponentially";


/**
 * x, y, zで指定した値を持つ新しいインスタンスを生成します。
 * @param {Number} x ベクトルのX値
 * @param {Number} y ベクトルのY値
 * @param {Number} z ベクトルのZ値
 * @class 3次元ベクトルクラスです。<br/>
 * 球座標としても使われ、その場合、x, y, zの値はそれぞれ<br/>
 * x: 方位角<br/>
 * y: 仰角<br/>
 * z: 距離<br/>
 * として扱われます。
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
 * 位置(0, 0, 0), 向き(0, 0, -1), 上方向(0, 1, 0)となる新しいインスタンスを作ります。
 * @class 位置と向きをあらわすクラスです。<br/>
 * 位置を表すposベクトル、正面向きを表すdirベクトル、上方向を表すupベクトルの3つのベクトルで位置と向きを管理します。
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
 * 音源を生成します。<br/>
 * typeプロパティはsnd.srctype.NONEに<br/>
 * statusプロパティはsnd.status.NONEに<br/>
 * それぞれ設定されます。
 * @class 各種音源クラスの親クラスとなる抽象クラスです。<br/>
 * start, stopの抽象メソッドは継承する子クラスで実装してください。
 * @param {String} id この音源のID
 */
snd.Source = function(id) {
    this.isSource = true;
    this.gain = snd.AUDIO_CONTEXT.createGain();
    this.id = id;
    this.type = snd.srctype.NONE;
    this.status = snd.status.NONE;
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

snd.Source.prototype.setGain = function(value) {
    this.gain.gain.value = value;
};

snd.Source.prototype.getGain = function(value) {
    return this.gain.gain.value;
};

/**
 * 詳細はAudioUnitクラスのconnectを参照してください。
 * @param {AudioUnit} connectTo 接続先
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
 * @param {AudioUnit} disconnectFrom 切断する接続先
 */
snd.Source.prototype.disconnect = function(disconnectFrom) {
    if (disconnectFrom.isAudioUnit) {
        this.gain.disconnect(disconnectFrom.getConnector());
    } else {
        this.gain.disconnect(disconnectFrom);
    }
};

/**
 * AudioBufferを使用する音源を新しく生成します。
 * @class AudioBufferを使用してバイナリデータを再生する音源です。<br/>
 * 詳細はWebAudioAPIの仕様を参照してください。<br/>
 * wav, mp3などが再生可能ですが、ブラウザにより対応状況が異なります。
 * @param {String} id この音源のID
 */
snd.BufferSource = function(id) {
    snd.Source.apply(this, arguments);
    this.type = snd.srctype.AUDIO_BUFFER;
    this.status = snd.status.NONE;
    this.loop = false;
    this.loopStart = null;
    this.loopEnd = null;

    this.listeners = {
        onended: []
    };
};
snd.BufferSource.prototype = Object.create(snd.Source.prototype);
snd.BufferSource.prototype.constructor = snd.BufferSource;

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
            if (this.status == snd.status.STARTED) {
                this.stop(0);
                this.status = snd.status.STOPPED;
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
    if (this.source != null) {
        if (when == null) {
            this.source.stop(0);
        } else {
            this.source.stop(when);
        }
    }
};

/**
 * この音源をsnd.AudioUnitを継承するオブジェクトやWebAudioAPIのエフェクトに接続します。
 * @param {snd.AudioUnit} connectTo 接続先
 */
snd.BufferSource.prototype.connect = function(connectTo) {
    if (connectTo.isAudioUnit) {
        this.gain.connect(connectTo.getConnector());
    } else {
        this.gain.connect(connectTo);
    }
};

/**
 * この音源をdisconnectFromで指定されたオブジェクトから切断します。
 * @param {snd.AudioUnit} disconnectFrom 切断元
 */
snd.BufferSource.prototype.disconnect = function(disconnectFrom) {
    this.gain.disconnect(disconnectFrom);
};

/**
 * この音源がループするかどうかを設定します。
 * @param {boolean} status ループするか否か
 */
snd.BufferSource.prototype.setLoop = function(status) {
    if (this.source != null) {
        this.source.loop = status;
    }
    this.loop = status;
};

/**
 * この音源がループするかどうかを取得します。
 * @returns {Boolean} この音源がループするか否か
 */
snd.BufferSource.prototype.getLoop = function() {
    return this.loop;
};

/**
 * ループの開始位置を設定します。
 * @param {double} when ループの開始位置[秒]
 */
snd.BufferSource.prototype.setLoopStart = function(when) {
    if (this.source != null && when != null) {
        this.source.loopStart = when;
    }
    this.loopStart = when;
};

/**
 * ループの開始位置を取得します。
 * @returns {double} ループの開始位置[秒]
 */
snd.BufferSource.prototype.getLoopStart = function() {
    return this.loopStart;
};

/**
 * ループの終端を設定します。
 * @param {double} when
 */
snd.BufferSource.prototype.setLoopEnd = function(when) {
    if (this.source != null && when != null) {
        this.source.loopEnd = when;
    }
    this.loopEnd = when;
};

/**
 * ループの終端を取得します。
 * @returns {double} ループの終了位置[秒]
 */
snd.BufferSource.prototype.getLoopEnd = function() {
    return this.loopEnd;
};

/* Add/Remove Event Listener Methods */

/**
 * 渡されたイベントリスナーをこの音源の再生終了イベントのリスナーリストへ追加します。<br/>
 * 追加されたlistenerは、この音源の再生が終了したとき(onendedイベント発生時)にコールバックメソッドとして呼び出されます<br/>
 * @param {function} listener 音源の再生終了イベント発生時に呼び出されるコールバックメソッド
 */
snd.BufferSource.prototype.addOnEndedEventListener = function(listener) {
    this.listeners['onended'].push(listener);
};

/**
 * 渡されたイベントリスナーをこの音源の再生終了イベントのリスナーリストから削除します。<br/>
 * 与えられたlistenerが見つかった場合、削除を行いtrueを返します。<br/>
 * 見つからなかった場合は、何もせずにfalseを返します。
 * @param {function} listener イベントのリスナー
 * @return {boolean} listenerが見つかり、実際に削除が行われたらtrue, そうでなければfalse
 */
snd.BufferSource.prototype.removeOnEndedEventListener = function(listener) {
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
 * オーディオバッファを設定するメソッドです。
 * @param {AudioBuffer} audioBuffer
 */
snd.BufferSource.prototype.setAudioBuffer = function(audioBuffer) {
    this.audioBuffer = audioBuffer;

    var src = snd.AUDIO_CONTEXT.createBufferSource();
    if (this.source != null) {
        this.source.disconnect(this.gain);
    }
    delete this.source;
    this.source = src;
    this.source.buffer = this.audioBuffer;
    this.source.connect(this.gain);
    this.resetEventMethods(this.source);

    this.source.loop = this.loop;
    if (this.loopStart != null) {
        this.source.loopStart = this.loopStart;
    }
    if (this.loopEnd != null) {
        this.source.loopEnd = this.loopEnd;
    }
    this.status = snd.status.READY;
};

/**
 * @private
 */
snd.BufferSource.prototype.resetEventMethods = function() {
    var _this = this;
    
    this.source.onended = function() {
        var a = _this.listeners['onended'];
        for (var i = 0; i < a.length; i++) {
            a[i](_this);
        }
    };
};


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
        this.status = snd.status.STARTED;
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
        this.status = snd.status.STOPPED;
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

/**
 * 新しくメディアタグを使用する音源を生成します。
 * @param {String} id この音源のID
 * @param {HTMLMediaElement} htmlMediaElement HTMLのメディアタグ要素
 * @class HTMLのメディア要素を音源として使用する音源クラスです。<br/>
 * 詳細は<a href="http://g200kg.github.io/web-audio-api-ja/#MediaElementAudioSourceNode">WebAudioAPI仕様を参照してください。
 * @memberof snd
 */
snd.MediaElementAudioSource = function(id, htmlMediaElement) {
    snd.Source.apply(this, arguments);
    this.source = snd.AUDIO_CONTEXT.createMediaElementSource(htmlMediaElement);
    this.source.connect(this.gain);
    this.type = snd.srctype.MEDIA_ELEMENT;
    this.element = htmlMediaElement;
    this.status = snd.status.NONE;
    
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
    
    var _this = this;
    
    this.element.onplay = function() {
        _this.status = snd.status.STARTED;
        for (var i = 0; i < _this.listeners['onplay'].length; i++) {
            _this.listeners['onplay'][i](_this);
        }
    };
    this.element.onpause = function() {
        _this.status = snd.status.PAUSED;
        for (var i = 0; i < _this.listeners['onpause'].length; i++) {
            _this.listeners['onpause'][i](_this);
        }
    };
    this.element.onended = function() {
        _this.status = snd.status.PAUSED;
        for (var i = 0; i < _this.listeners['onended'].length; i++) {
            _this.listeners['onended'][i](_this);
        }
    };
    this.element.onabort = function() {
        for (var i = 0; i < _this.listeners['onabort'].length; i++) {
            _this.listeners['onabort'][i](_this);
        }
    };
    this.element.oncanplay = function() {
        if (_this.status == snd.status.NONE) {
            _this.status = snd.status.READY;
        }
        for (var i = 0; i < _this.listeners['oncanplay'].length; i++) {
            _this.listeners['oncanplay'][i](_this);
        }
    };
    this.element.oncanplaythrough = function() {
        for (var i = 0; i < _this.listeners['oncanplaythrough'].length; i++) {
            _this.listeners['oncanplaythrough'][i](_this);
        }
    };
    this.element.ondurationchange = function() {
        for (var i = 0; i < _this.listeners['ondurationchange'].length; i++) {
            _this.listeners['ondurationchange'][i](_this);
        }
    };
    this.element.onemptied = function() {
        for (var i = 0; i < _this.listeners['onemptied'].length; i++) {
            _this.listeners['onemptied'][i](_this);
        }
    };
    this.element.onerror = function() {
        for (var i = 0; i < _this.listeners['onerror'].length; i++) {
            _this.listeners['onerror'][i](_this);
        }
    };
    this.element.onloadeddata = function() {
        for (var i = 0; i < _this.listeners['onloadeddata'].length; i++) {
            _this.listeners['onloadeddata'][i](_this);
        }
    };
    this.element.onloadedmetadata = function() {
        for (var i = 0; i < _this.listeners['onloadedmetadata'].length; i++) {
            _this.listeners['onloadedmetadata'][i](_this);
        }
    };
    this.element.onloadedstart = function() {
        for (var i = 0; i < _this.listeners['onloadstart'].length; i++) {
            _this.listeners['onloadstart'][i](_this);
        }
    };
    this.element.onplaying = function() {
        for (var i = 0; i < _this.listeners['onplaying'].length; i++) {
            _this.listeners['onplaying'][i](_this);
        }
    };
    this.element.onprogress = function() {
        for (var i = 0; i < _this.listeners['onprogress'].length; i++) {
            _this.listeners['onprogress'][i](_this);
        }
    };
    this.element.onratechange = function() {
        for (var i = 0; i < _this.listeners['onratechange'].length; i++) {
            _this.listeners['onratechange'][i](_this);
        }
    };
    this.element.onseeked = function() {
        for (var i = 0; i < _this.listeners['onseeked'].length; i++) {
            _this.listeners['onseeked'][i](_this);
        }
    };
    this.element.onseeking = function() {
        for (var i = 0; i < _this.listeners['onseeking'].length; i++) {
            _this.listeners['onseeking'][i](_this);
        }
    };
    this.element.onstalled = function() {
        for (var i = 0; i < _this.listeners['onstalled'].length; i++) {
            _this.listeners['onstalled'][i](_this);
        }
    };
    this.element.onsuspend = function() {
        for (var i = 0; i < _this.listeners['onsuspend'].length; i++) {
            _this.listeners['onsuspend'][i](_this);
        }
    };
    this.element.ontimeupdate = function() {
        for (var i = 0; i < _this.listeners['ontimeupdate'].length; i++) {
            _this.listeners['ontimeupdate'][i](_this);
        }
    };
    this.element.onvolumechange = function() {
        for (var i = 0; i < _this.listeners['onvolumechange'].length; i++) {
            _this.listeners['onvolumechange'][i](_this);
        }
    };
    this.element.onwaiting = function() {
        for (var i = 0; i < _this.listeners['onwaiting'].length; i++) {
            _this.listeners['onwaiting'][i](_this);
        }
    };
};
snd.MediaElementAudioSource.prototype = Object.create(snd.Source.prototype);
snd.MediaElementAudioSource.prototype.constructor = snd.MediaElementAudioSource;

/**
 * この音源の読み込みを開始します。
 */
snd.MediaElementAudioSource.prototype.load = function() {
    this.element.load();
};

/**
 * この音源の再生を開始します。
 */
snd.MediaElementAudioSource.prototype.start = function() {
    this.element.play();
};

/**
 * この音源を一時停止します。
 */
snd.MediaElementAudioSource.prototype.pause = function() {
    this.element.pause();
};

/**
 * この音源を停止し、時刻を0へ戻します。
 */
snd.MediaElementAudioSource.prototype.stop = function() {
    this.element.pause();
    this.element.currentTime = 0;
};

/**
 * この音源をループ再生するかどうかを設定します。<br/>
 * Audioタグを使用するため、ループ終点からループ始点に戻る速度がBufferSoundSourceと比較して遅く、間にブレイクが入る可能性があります。<br/>
 * なめらかにループしたい場合はBufferSoundSourceの使用を検討してください。
 * @param {type} doesLoop ループ再生するか否か
 */
snd.MediaElementAudioSource.prototype.setLoop = function(doesLoop) {
    this.element.loop = doesLoop;
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

/**
 * 新しくストリーム音源を作ります。
 * @param {String} id この音源のID
 * @param {MediaStream} mediaStream 再生するデータストリーム
 * @class ストリームを音源として使用する音源クラスです。<br/>
 * 詳細は<a href="http://g200kg.github.io/web-audio-api-ja/#MediaStreamAudioSourceNode">WebAudioAPI仕様</a>を参照してください。
 * @memberOf snd
 */
snd.MediaStreamAudioSource = function(id, mediaStream) {
    snd.Source.apply(this, arguments);
    this.source = snd.AUDIO_CONTEXT.createMediaStreamAudioSource(mediaStream);
    this.source.connect(this.gain);
    this.type = snd.srctype.MEDIA_STREAM;
};
snd.MediaStreamAudioSource.prototype = Object.create(snd.Source.prototype);
snd.MediaStreamAudioSource.prototype.constructor = snd.MediaStreamAudioSource;



snd.Synth = function(id, polyphony, waveForm, envelope) {
    snd.Source.apply(this, arguments);
    this.polyphony = polyphony;
    
    if (envelope == null) {
        this.envelope = new snd.Envelope();
    } else {
        this.envelope = envelope;
    }
    
    if (waveForm == null) {
        var realArray = new Float32Array(2);
        var imagArray = new Float32Array(2);
        realArray[0] = 0;
        realArray[1] = 1.0;
        imagArray[0] = 0;
        imagArray[1] = 0;
        this.waveForm = {
            real: realArray,
            imag: imagArray
        };
    } else {
        this.waveForm = waveForm;
    }
    this.periodicWave = snd.AUDIO_CONTEXT.createPeriodicWave(
            this.waveForm.real,
            this.waveForm.imag);
           
    this.partes = [];
    for (var i = 0; i < this.polyphony; i++) {
        var part = new snd.Synth.Partes(this.id + i, this);
        part.connect(this.gain);
        this.partes.push(part);
    }
};
snd.Synth.prototype = Object.create(snd.Source.prototype);
snd.Synth.prototype.constructor = snd.Synth;

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

snd.Synth.Partes = function(id, parent) {
    snd.OscillatorSource.apply(this, arguments);
    this.parent = parent;
    this.source.setPeriodicWave(parent.periodicWave);
    this.setGain(0.0);
};
snd.Synth.Partes.prototype = Object.create(snd.OscillatorSource.prototype);
snd.Synth.Partes.prototype.constructor = snd.Synth.Note;

snd.Synth.Partes.prototype.noteOn = function(freq) {
    this.setFrequency(freq);
    this.start(0);
    
    var now = snd.AUDIO_CONTEXT.currentTime;
    this.gain.gain.cancelScheduledValues(now);
    this.gain.gain.value = 0;
    
    if (this.parent.envelope.attackTime >= 0) {
        switch (this.parent.envelope.attackType) {
           case snd.audioparam.type.LINER:
                this.gain.gain.linearRampToValueAtTime(
                        this.parent.envelope.attack,
                        now + this.parent.envelope.attackTime);
                break;
            case snd.audioparam.type.EXPONENTIALLY:
                this.gain.gain.exponentialRampToValueAtTime(
                        this.parent.envelope.attack,
                        now + this.parent.envelope.attackTime);
                break;
            default:
                this.gain.gain.setValueAtTime(
                        this.parent.envelope.attack,
                        now + this.parent.envelope.attackTime);
                break;
        };
    }
    
    if (this.parent.envelope.decayTime >= 0) {
        switch (this.parent.envelope.decayType) {
            case snd.audioparam.type.LINER:
                this.gain.gain.linearRampToValueAtTime(
                        this.parent.envelope.sustain,
                        now + this.parent.envelope.attackTime + this.parent.envelope.decayTime);
                break;
            case snd.audioparam.type.EXPONENTIALLY:
                this.gain.gain.exponentialRampToValueAtTime(
                        this.parent.envelope.sustain,
                        now + this.parent.envelope.attackTime + this.parent.envelope.decayTime);
                break;
            default:
                this.gain.gain.setValueAtTime(
                        this.parent.envelope.sustain,
                        now + this.parent.envelope.attackTime + this.parent.envelope.decayTime);
                break;
        }
    }
    
    if (this.parent.envelope.sustainTime > 0) {
        switch (this.parent.envelope.sustainType) {
            case snd.audioparam.type.LINER:
                this.gain.gain.linearRampToValueAtTime(
                        this.parent.envelope.release,
                        now + this.parent.envelope.attackTime + this.parent.envelope.decayTime + this.parent.envelope.sustainTime);
                break;
            case snd.audioparam.type.EXPONENTIALLY:
                this.gain.gain.exponentialRampToValueAtTime(
                        this.parent.envelope.release,
                        now + this.parent.envelope.attackTime + this.parent.envelope.decayTime + this.parent.envelope.sustainTime);
                break;
            default:
                this.gain.gain.setValueAtTime(
                        this.parent.envelope.release,
                        now + this.parent.envelope.attackTime + this.parent.envelope.decayTime + this.parent.envelope.sustainTime);
                break;
        }
        
        switch (this.parent.envelope.releaseType) {
            case snd.audioparam.type.LINER:
                this.gain.gain.linearRampToValueAtTime(
                        0,
                        now + this.parent.envelope.attackTime + this.parent.envelope.decayTime + this.parent.envelope.sustainTime + this.parent.envelope.releaseTime);
                break;
            case snd.audioparam.type.EXPONENTIALLY:
                this.gain.gain.exponentialRampToValueAtTime(
                        0,
                        now + this.parent.envelope.attackTime + this.parent.envelope.decayTime + this.parent.envelope.sustainTime + this.parent.envelope.releaseTime);
                break;
            default:
                this.gain.gain.setValueAtTime(
                        0,
                        now + this.parent.envelope.attackTime + this.parent.envelope.decayTime + this.parent.envelope.sustainTime + this.parent.envelope.releaseTime);
                break;
        }
    }
};

snd.Synth.Partes.prototype.noteOff = function() {
        var now = snd.AUDIO_CONTEXT.currentTime;
        this.gain.gain.cancelScheduledValues(now);
        
        switch (this.parent.envelope.releaseType) {
           case snd.audioparam.type.LINER:
                this.gain.gain.linearRampToValueAtTime(
                        0,
                        now + this.parent.envelope.releaseTime);
                break;
            case snd.audioparam.type.EXPONENTIALLY:
                this.gain.gain.exponentialRampToValueAtTime(
                        0,
                        now + this.parent.envelope.releaseTime);
                break;
            default:
                this.gain.gain.setValueAtTime(
                        0,
                        now + this.parent.envelope.releaseTime);
                break;
        }
    
};

/**
 * エンベロープの設定値を保持するクラスです。<br/>
 * ADSR(Attack, Decay, Sustain, Release)を、時間と音量と補間処理の種類の3つの値で制御します。<br/>
 * 時間の単位は全て秒単位です。<br/>
 * アタック、ディケイ、サスティーン、リリースの値はゲインの値で、出力に乗じる値を指定します(デシベルではありません)。<br/>
 * 補間処理の種類は、「補間なし」「直線補間」「対数補間」の3種類があり、snd.audioparam.type名前空間にある定数を使って、いずれか一つを指定します。<br/>
 * <table>
 * <tr>定数値<td></td><td>補間方法</td></tr>
 * <tr><td>snd.audioparam.type.SET</td><td>補間なし</td></tr>
 * <tr><td>snd.audioparam.type.LINER</td><td>直線補間</td></tr>
 * <tr><td>snd.audioparam.type.EXPONENTIALLY</td><td>対数補間</td></tr>
 * </table><br/>
 * また、エンベロープについて詳しくは<a href="http://en.wikipedia.org/wiki/Synthesizer#ADSR_envelope">Wikipedia(英)</a>や<a href="http://ja.wikipedia.org/wiki/ADSR">Wikipedia(日)</a>を参照してください。<br/>
 * 
 * @param {type} attackTime アタックタイム[秒]
 * @param {type} attack アタック
 * @param {type} attackType アタックの補間法
 * @param {type} decayTime ディケイタイム[秒]
 * @param {type} decayType ディケイの補間法
 * @param {type} sustainTime サスティーンタイム[秒](0以下の値が指定された場合、NoteOffまで変化なし)
 * @param {type} sutain サスティーン
 * @param {type} sustainType サスティーンの補間法
 * @param {type} releaseTime リリースタイム[秒]
 * @param {type} release リリース
 * @param {type} releaseType リリースの補間法
 * @class
 */
snd.Envelope = function(
        attackTime, attack, attackType,
        decayTime, decayType,
        sustainTime, sustain, sustainType,
        releaseTime, release, releaseType) {
    this.attackTime = (attackTime == null) ? 0.1 : attackTime;
    this.attack = (attack == null) ? 0.25 : attack;
    this.attackType = (attackType == null) ? snd.audioparam.type.LINER : attackType;
    this.decayTime = (decayTime == null) ? 0.1 : decayTime;
    this.decayType = (decayType == null) ? snd.audioparam.type.LINER : decayType;
    this.sustainTime = (sustainTime == null) ? -1 : sustainTime;
    this.sustain = (sustain == null) ? 0.125 : sustain;
    this.sustainType = (sustainType == null) ? snd.audioparam.type.LINER : sustainType;
    this.releaseTime = (releaseTime == null) ? 0.5 : releaseTime;
    this.release = (release == null) ? 0.125 : release;
    this.releaseType = (releaseType == null) ? snd.audioparam.type.LINER : releaseType;
};

/**
 * 新しいオーディオユニットを生成します。
 * @class 1つのオーディオユニットを定義する抽象クラスです。<br/>
 * 引数にAudioUnitを要求するメソッドに渡すオブジェクトは、ここで定義されている各メソッドを実装している必要があります。
 * @param id このオーディオユニットのID
 */
snd.AudioUnit = function(id) {
    this.isAudioUnit = true;
    this.id = id;
};

/**
 * このオーディオユニットをconnectToで指定されたオーディオユニットまたはノードに接続します。<br/>
 * @param {snd.AudioUnit} connectTo 接続するAudioUnit
 */
snd.AudioUnit.prototype.connect = function(connectTo) {
    // PLEASE OVERRIDE ME
};

/**
 * このオーディオユニットをdisconnectFromから切断します。
 * @param {snd.AudioUnit} disconnectFrom 切断するAudioUnit
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
 * 新しくボリュームユニットを生成します。
 * @param {String} id このユニットのID
 * @class 主ボリュームのみのもっとも単純なユニットです。<br/>
 * ボリュームの使用法については<a href="http://g200kg.github.io/web-audio-api-ja/#GainNode">web audio api仕様のGainNode</a>を参照してください。
 */
snd.GainOnlyUnit = function(id) {
    snd.AudioUnit.apply(this, arguments);
    this.gain = snd.AUDIO_CONTEXT.createGain();
};
snd.GainOnlyUnit.prototype = Object.create(snd.AudioUnit.prototype);
snd.GainOnlyUnit.prototype.constructor = snd.GainOnlyUnit;

/**
 * このユニットをconnectToに接続します。
 * @param {type} connectTo
 */
snd.GainOnlyUnit.prototype.connect = function(connectTo) {
    if (connectTo.isAudioUnit) {
        this.gain.connect(connectTo.getConnector());
    } else {
        this.gain.connect(connectTo);
    }
};

/**
 * このユニットをdisconnectFromから切断します。
 * @param {type} disconnectFrom
 */
snd.GainOnlyUnit.prototype.disconnect = function(disconnectFrom) {
    if (disconnectFrom.isAudioUnit) {
        this.gain.disconnect(disconnectFrom.getConnector());
    } else {
        this.gain.disconnet(disconnectFrom);
    }
}

/**
 * @see snd.AudioUnit#getConnector
 */
snd.GainOnlyUnit.prototype.getConnector = function() {
    return this.gain;
};

/**
 * メインボリュームを取得します。<br/>
 * @returns {snd.GainNode} this.gain
 */
snd.GainOnlyUnit.prototype.getGain = function() {
    return this.gain;
};


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
 * 全データの読み込みが完了したときに呼ばれるメソッドです。<br/>
 * イベントをリスナに送る際にこのオブジェクトの内部で使用されるメソッドなので、書き換えないようにしてください。<br/>
 * 全データの読み込みが完了したときに呼ばれるコールバック関数を設定したい場合、addAllDataLoadListenerメソッドを使用してください。
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



/**
 * コンストラクタは使用せず、snd.MASTERを使用してください。
 * @class ミキサークラスです。<br/>
 * snd.initメソッドでsnd.MASTERにインスタンスが生成されます。
 */
snd.AudioMaster = function() {
    this.unitList = {};
    this.gain = snd.AUDIO_CONTEXT.createGain();
    
    this.gain.connect(snd.AUDIO_CONTEXT.destination);
};

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
            audioUnit.connect(this.gain);
        }
    } else {
        this.unitList[key] = audioUnit;
        audioUnit.connect(this.gain);
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
    audioUnit.getConnector().disconnect(this.gain);
    delete this.unitList[key];
};

/**
 * よく使う処理をまとめたネームスペースです。
 * @namespace
 */
snd.util = {};

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
        createBufferSources(dataSet['AudioBuffer'], connectToMaster, function(res) {
            ret['AudioBuffer'] = res;
            func(ret);
        });
    } else {
        ret['AudioBuffer'] = null;
        func(ret);
    }
}

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
            
            if (connectToMaster) {
                snd.MASTER.connectAudioUnit(sourceMap[url][i].id, sourceMap[url][i]);
            }
        }
        
        func(ret);
    });
    
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
 * @param {type} element Audioタグを追加するDOMエレメント
 * @returns {HashMap}
 * @memberOf snd.util
 */
snd.util.createMediaElementAudioSources = function(dataSet, connectToMaster, element) {
    var ret = {};
    
    for (var id in dataSet) {
        var audioElem = new Audio(id);
        audioElem.src = dataSet[id];
        audioElem.autoBuffer = false;
        
        element.appendChild(audioElem);
        
        var source = new snd.MediaElementAudioSource(id, audioElem);
        
        ret[id] = source;
        
        if (connectToMaster) {
            snd.MASTER.connectAudioUnit(id, source);
        }
    }
    
    return ret;
}

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


/**
 * ブラウザから取得したオーディオコンテキストが入ります。<br/>
 * snd#initメソッドが呼ばれるまで初期化されず、nullとなっている点に注意してください。
 * @type AudioContext
 * @memberOf snd
 */
snd.AUDIO_CONTEXT = null;

/**
 * snd.jsのPAミキサーです。<br/>
 * 各種エフェクトや音源は、snd.Master.connectAudioUnitメソッドを使ってここに接続することで音が出力されるようになります。
 * @type snd.AudioMaster
 * @memberOf snd
 */
snd.MASTER = null;

/**
 * 音データの読み込みなどの管理を行うクラスです。
 * @type type
 * @memberOf snd
 */
snd.AUDIO_DATA_MANAGER = null;

/**
 * snd.jsを初期化します。
 * @memberOf snd
 */
snd.init = function() {
    snd.resetAudioContext();
    if (snd.SoundEnvironment != null) {
        snd.SOUND_ENVIRONMENT = new snd.SoundEnvironment();
    }
    snd.MASTER = new snd.AudioMaster();
    snd.AUDIO_DATA_MANAGER = new snd.AudioDataManager();
};

/**
 * オーディオコンテキストを初期化します。
 * snd#initメソッドから呼び出すためのメソッドですので、特別な理由が無い限り使用しないでください。
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
