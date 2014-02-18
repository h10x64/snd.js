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

snd.BLOWSER = window.navigator.userAgent.toLowerCase();
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
 * 音源の再生が中断・終了し、停止したことを表す値です。
 */
snd.status.ENDED = "ended";

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

snd.PosDir.prototype.setTop = function(x, y, z) {
    this.up.x = x;
    this.up.y = y;
    this.up.z = z;
    this.up.normalize();
};

snd.PosDir.prototype.setOrientation = function(x, y, z, ux, uy, uz) {
    this.setDir(x, y, z);
    this.setTop(ux, uy, uz);
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

/**
 * 各種音源クラスの親クラスとなる抽象クラスです。
 * @param {String} id この音源のID
 */
snd.Source = function(id) {
    this.isSource = true;
    this.gain = snd.AUDIO_CONTEXT.createGain();
    this.id = id;
    this.type = snd.srctype.NONE;
    this.status = snd.status.NONE;
};

snd.Source.prototype.start = function() {
    // PLEASE OVERRIDE ME
};

snd.Source.prototype.stop = function() {
    // PLEASE OVERRIDE ME
};

snd.Source.prototype.connect = function(connectTo) {
    if (connectTo.isAudioUnit) {
        this.gain.connect(connectTo.getConnector());
    } else {
        this.gain.connect(connectTo);
    }
};

snd.Source.prototype.disconnect = function(disconnectFrom) {
    if (disconnectFrom.isAudioUnit) {
        this.gain.disconnect(disconnectFrom);
    } else {
        this.gain.disconnect(disconnectFrom);
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
};
snd.BufferSource.prototype = Object.create(snd.Source.prototype);
snd.BufferSource.prototype.constructor = snd.BufferSource;

snd.BufferSource.prototype.start = function(when, offset, duration) {
    if (this.source != null && this.status == snd.status.READY) {
        if (when == null) {
            this.source.start();
        } else if (offset == null) {
            this.source.start(when);
        } else if (duration == null) {
            this.source.start(when, offset);
        } else {
            this.source.start(when, offset, duration);
        }
        this.status = snd.status.STARTED;
    } else {
        if (this.audioBuffer != null && this.type == snd.srctype.AUDIO_BUFFER) {
            this.setAudioBuffer(this.audioBuffer);
            this.start(when, offset, duration);
        }
    }
};

snd.BufferSource.prototype.stop = function(when) {
    if (this.source != null) {
        if (when == null) {
            this.source.stop();
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
    this.source = src;
    this.source.buffer = this.audioBuffer;
    this.source.connect(this.gain);
    this.source.onended = this.onended;

    this.type = snd.srctype.AUDIO_BUFFER;
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
    
    this.source = snd.AUDIO_CONTEXT.createOscillator();
    this.source.connect(this.gain);
};
snd.OscillatorSource.prototype = Object.create(snd.Source.prototype);
snd.OscillatorSource.prototype.constructor = snd.OscillatorSource;

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
    if (this.source != null) {
        if (when == null) {
            this.source.start();
        } else {
            this.source.start(when);
        }
    }
};


/**
 * 波形の再生を終了します。
 * @param {float} when 終了するタイミング
 */
snd.OscillatorSource.prototype.end = function(when) {
    if (this.source != null) {
        this.source.end(when);
    }
};
/**
 * @class HTMLのメディアタグを音源として使用する音源クラスです。<br/>
 * 詳細は<a href="http://g200kg.github.io/web-audio-api-ja/#MediaElementAudioSourceNode">WebAudioAPI仕様を参照してください。
 * @param {String} id この音源のID
 * @param {HTMLMediaElement} htmlMediaElement HTMLのメディアタグ要素
 */
snd.MediaElementAudioSource = function(id, htmlMediaElement) {
    snd.Source.apply(this, arguments);
    this.source = snd.AUDIO_CONTEXT.createMediaElementAudioSource(htmlMediaElement);
    this.source.connect(this.gain);
    this.type = snd.srctype.MEDIA_ELEMENT;
};
snd.MediaElementAudioSource.prototype = Object.create(snd.Source.prototype);
snd.MediaElementAudioSource.prototype.constructor = snd.MediaElementAudioSource;


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
snd.AudioUnit = function() {
    this.isAudioUnit = true;
};

/**
 * このオーディオユニットをconnectToで指定されたオーディオユニットまたはノードに接続します。
 */
snd.AudioUnit.prototype.connect = function(connectTo) {
    // PLEASE OVERRIDE ME
};

snd.AudioUnit.prototype.disconnect = function(connectTo) {
    // PLEASE OVERRIDE ME
};

snd.AudioUnit.prototype.getConnector = function() {
    // PLEASE OVERRIDE ME
};

/*** GAIN ONLY UNIT ***/

/**
 * @class 主ボリュームのみの単純なユニットです。
 * @extends snd.AudioUnit
 */
snd.GainOnlyUnit = function() {
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
        this.listener.setPosition(x, y, z);
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
        this.listener.setVelocity(x, y, z);
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

/**
 * この音源の位置を設定します。
 * @param {type} x 設定する位置のX値
 * @param {type} y 設定する位置のY値
 * @param {type} z 設定する位置のZ値
 */
 snd.SoundNode.prototype.setPosition = function(x, y, z) {
    snd.PosDir.prototype.setPosition.call(this, x, y, z);
    this.pannerNode.setPosition(x, y, z);
};

/**
 * この音源の向きを設定します
 * @param {type} x 正面方向ベクトルのX値
 * @param {type} y 正面方向ベクトルのY値
 * @param {type} z 正面方向ベクトルのZ値
 */
 snd.SoundNode.prototype.setOrientation = function(x, y, z) {
    snd.PosDir.prototype.setOrientation.call(this, x, y, z);
    this.pannerNode.setOrientation(x, y, z);
};

/**
 * この音源の速度を設定します。
 * @param {type} x 速度ベクトルのX値
 * @param {type} y 速度ベクトルのY値
 * @param {type} z 速度ベクトルのZ値
 */
 snd.SoundNode.prototype.setVelocity = function(x, y, z) {
    this.pannerNode.setVelocity(x, y, z);
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
};

snd.AudioDataManager.prototype.onload = function() {
    // PLEASE OVERRIDE ME
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


snd.AudioDataManager.prototype.getAudioBuffer = function(key) {
    if (this.dataMap[key] != null) {
        return this.dataMap[key].data;
    } else {
        null;
    }
};

/**
 * keyがキー値となるAudioBufferを追加します。<br/>
 * 
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
 * @class シミュレーションする音環境を表すクラスです。<br>
 * リスナーやユニットなどを管理します。<br>
 * さまざまなユニットは最終的にSoundEnvironment#connectAudioUnitメソッドを使って、実際の出力へ反映されるようになります。
 */
snd.SoundEnvironment = function() {
    this.id = 0;
    this.listener = snd.AUDIO_CONTEXT.listener;
    this.listenerList = {};
    this.unitList = {};
    
    this.createListener("DEFAULT");
};

/**
 * 新しいリスナを生成します。<br>
 * リスナーはこのクラスの内部でHashMapとして管理されるため、キー値を引数として渡す必要があります。<br>
 * 複数のリスナーを生成することもできますが、switchListenerメソッドでsnd.LISTENER定数を切り替えるまで実際の出力には影響を及ぼしません。
 * 
 * @param {String} key このリスナーを表すキー値
 * @returns {snd.Listener} 生成されたリスナー
 * @see snd.SoundEnvironment#switchListener
 */
snd.SoundEnvironment.prototype.createListener = function(key) {
    var listener = new snd.Listener();
    this.listenerList[key] = listener;
    return listener;
};

/**
 * リスナーを取得します。
 * @param {String} key
 * @returns {snd.Listener}
 * @see {snd.SoundEnvironment#switchListener}
 */
snd.SoundEnvironment.prototype.getListener = function(key) {
    return this.listenerList[key];
};

/**
 * keyで指定されたリスナーへsnd.LISTENER定数を切り替えます。<br>
 * このメソッドでリスナーを選択しない限り、snd.Listenerへ行った変更は実際の出力へ影響を与えません。<br>
 * snd.LISTENER定数の内容が選択されたリスナーへ変更されるため、(snd.LISTENER定数を使用する限り)多数のリスナーを次々と切り替えたとしても、
 * 常にユニークなリスナを使用することができます。<br>
 * @param {type} key 次の選択リスナーを表すキー値
 */
snd.SoundEnvironment.prototype.switchListener = function(key) {
    for (var k in this.listenerList) {
        this.listenerList[k].resetListener();
    }
    this.listenerList[key].setListener(this.listener);
    
    snd.LISTENER = this.listenerList[key];
};

/**
 * リスナーを削除します。
 * @param {String} key 削除するリスナー
 */
snd.SoundEnvironment.prototype.deleteListener = function(key) {
    if (snd.LISTENER == this.listenerList[key].listener) {
        this.listenerList.resetListener();
    }
    delete this.listenerList[key];
};

/**
 * 新しいユニットを接続します。<br>
 * 各種ユニットは、最終的にこのメソッドを使って実際の出力へ反映されます。
 * @param {type} key 接続するユニットを表すキー値
 * @param {snd.AudioUnit} audioUnit 接続するユニット
 */
snd.SoundEnvironment.prototype.connectAudioUnit = function(key, audioUnit) {
    this.unitList[key] = audioUnit;
    audioUnit.connect(snd.AUDIO_CONTEXT.destination);
};

/**
 * 接続済みのユニットを取得します。
 * @param {type} key
 */
snd.SoundEnvironment.prototype.getAudioUnit = function(key) {
    return this.unitList[key];
};

/**
 * 接続されたユニットを切断します。
 * @param {type} key 切断するユニット
 */
snd.SoundEnvironment.prototype.disconnectAudioUnit = function(key) {
    var audioUnit = this.unitList[key];
    audioUnit.getConnector().disconnect(snd.AUDIO_CONTEXT.destination);
    delete this.unitList[key];
};
snd.util = {};

/**
 * 複数ある音源からデータを読み込む場合に使用するためのクラスです。<br>
 * wait関数の代わりに使用してください。<br>
 * コンストラクタに渡されるオブジェクトのonloadメソッドが書き換えられるので注意してください。<br>
 * 
 * @param {snd.Sound} callerList ロードを待機したい音データのリスト
 */
snd.util.DataLoader = function(callerList) {
    var _this = this;
    
    this.callerList = callerList;
    this.loadLogger = [];
    for (var i in this.callerList) {
        var caller = callerList[i];
        caller.onload = function() {
            for (var i in _this.loadLogger) {
                if (_this.loadLogger[i].caller == this) {
                    _this.loadLogger[i].doesLoaded = true;
                    break;
                }
            }
            if (_this.doesAllDataLoaded()) {
                _this.onload();
            }
        };
        this.loadLogger.push({caller:caller, doesLoaded:false});
    }
};

/**
 * このDataLoaderに設定されている全ての音データのロードが完了したかどうかを返します。
 * 全データのロードが終了している場合はtrue、1つでも読込が終了していないデータがある場合はfalseを返します。
 * @returns {Boolean} 全てのデータの読込が終了しているかどうか
 */
snd.util.DataLoader.prototype.doesAllDataLoaded = function() {
    for (var i in this.loadLogger) {
        if (!this.loadLogger[i].doesLoaded) {
            return false;
        }
    }
    return true;
};

/**
 * このDataLoaderに設定されている全ての音データの読込が終了したときに呼び出されるメソッドです。
 * 
 * @returns {undefined}
 */
snd.util.DataLoader.prototype.onload = function() {
    // PLEASE OVERRIDE ME
};

/***  PROPERTIES ***/

/**
 * ブラウザから取得したオーディオコンテキストが入ります。
 *      snd#initメソッドが呼ばれるまで初期化されず、nullとなっている点に注意してください。
 * @type AudioContext
 */
snd.AUDIO_CONTEXT = null;
/**
 * シミュレーション上の聴取環境を管理するクラスのインスタンスが入ります。
 *      リスナーや音源の操作などはこのインスタンスを介して行います。
 * @type snd.SoundEnvironment 
 */
snd.SOUND_ENVIRONMENT = null;
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
    snd.SOUND_ENVIRONMENT.switchListener("DEFAULT");
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
        if (window.AudioContext) {
            // firefox
            snd.AUDIO_CONTEXT = new AudioContext();
        } else if (window.webkitAudioContext) {
            // crome etc
            snd.AUDIO_CONTEXT = new webkitAudioContext();
        }
    }
};
