/* snd.js - The Sound Library for JavaScript with WebAudioAPI - v.0 */
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

snd.oscillatortype = {};
snd.oscillatortype.SINE = "sine";
snd.oscillatortype.SQUARE = "SQUARE";
snd.oscillatortype.SAWTOOTH = "SAWTOOTH";
snd.oscillatortype.TRIANGLE = "TRIANGLE";

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
 * 新しいオーディオユニットを生成します。
 * @class 1つのオーディオユニットを定義する抽象クラスです。<br/>
 * 引数にAudioUnitを要求するメソッドに渡すオブジェクトは、ここで定義されている各メソッドを実装している必要があります。<br/>
 * パラメータ "_status" はオーディオユニットのパラメータをまとめたオブジェクトで、JSONを使って保存・読み込みする際に使用されます。<br/>
 * _status内の値はプロパティから取得できるようになっているので、直接_statusを使用しないようにしてください。
 * @param id このオーディオユニットのID
 */
snd.AudioUnit = function(id) {
    this._status = this.createStatus();
    
    this._status.id = id;
    this._status.className = "snd.AudioUnit";
    this._status.connection = [];
    
    Object.defineProperties(this, {
        isAudioUnit: {
            enumerable: true,
            get: function() {
                return this._status.isAudioUnit;
            }
        },
        id : {
            enumerable: true,
            get: function() {
                return this._status.id;
            }
        },
        connection : {
            enumerable: true,
            get: function() {
                var ret = Object.create(this._status.connection);
                return ret;
            }
        }
    });
};

/**
 * デフォルトの設定値(_status変数の値)を作るメソッドです。<br/>
 * snd.AudioUnit を継承するクラスはこのメソッドをオーバーライドしてください。<br/>
 * 戻り値は、snd.AudioUnit.Status を継承したクラスである必要があります。<br/>
 * @returns {snd.AudioUnit.Status} このクラスのデフォルト設定値
 */
snd.AudioUnit.prototype.createStatus = function() {
    // PLEASE OVERRIDE ME
    return new snd.AudioUnit.Status();
};

snd.AudioUnit.prototype.connect = function(connectTo) {
    this.connect(connectTo, connectTo.id);
};

/**
 * このオーディオユニットをconnectToで指定されたオーディオユニットまたはノードに接続します。<br/>
 * このメソッドを使って connectTo に接続した時に connection プロパティに connectTo.id が追加されます。<br/>
 * 引数 connectTo が id を持たない場合（connectTo.id == nullの場合）、connection プロパティには引数 id の値が追加されますので、 gain や frequency など、id を持たないパラメータへ接続する時は、引数 id に値を設定するようにしてください。<br/>
 * connectTo.id, id が両方とも null の場合は connection プロパティには何も追加されません。<br/>
 * このクラスを継承するクラスを作る場合、オーバーライドが必要です。(オーバーライドの際、apply必須)
 * @param {snd.AudioUnit} connectTo 接続するAudioUnit
 * @param {String} id connectTo.idがnullの場合に使用されるID
 */
snd.AudioUnit.prototype.connect = function(connectTo, id) {
    if (connectTo.id != null) {
        this._status.connection.push(connectTo.id);
    } else if (id != null) {
        this._status.connection.push(id);
    }
    
    // PLEASE OVERRIDE ME LIKE THIS
    // SubClass.prototype.connect = function(connectTo, bra, bra) {
    //     AudioUnit.prototype.connect.apply(this, arguments);
    // };
};

snd.AudioUnit.prototype.disconnect = function(disconnectFrom) {
    this.disconnect(disconnectFrom, disconnectForm.id);
};

/**
 * このオーディオユニットをdisconnectFromから切断します。<br/>
 * このメソッドを使って disconnectFrom との接続を切断した時、connection プロパティから disconnectFrom.id が削除されます。<br/>
 * 引数 disconnectFrom が id を持たない場合（disconnectFrom.id == nullの場合）、引数 id に設定された値が connection プロパティから削除されます。<br/>
 * connectTo.id, id が両方とも null の場合は connection プロパティからは何も削除されません。<br/>
 * このクラスを継承するクラスを作る場合、オーバーライドが必要です。(オーバーライドの際、apply必須)
 * @param {snd.AudioUnit} disconnectFrom 切断するAudioUnit
 * @param {String} id disconnectFrom.id が null の場合に使用されるID
 */
snd.AudioUnit.prototype.disconnect = function(disconnectFrom, id) {
    var i = -1;
    if (disconnectFrom.id != null) {
        i = this._status.connection.indexOf(disconnectFrom.id);
    } else if (id != null) {
        i = this._status.connection.indexOf(id);
    }
    
    if (i >= 0) {
        this._connection.splice(i, 1);
    }
    
    // PLEASE OVERRIDE ME LIKE THIS
    // SubClass.prototype.connect = function(connectTo, bra, bra) {
    //     AudioUnit.prototype.disconnect.apply(this, arguments);
    // };
};

/**
 * このオーディオユニットの入り口となる、connect/disconnectメソッドを持つオブジェクトを返します。<br/>
 * AudioUnitクラス、SoundEnvironmentクラスなどのオブジェクトが使用する他、
 * AudioUnitクラスを既存のWebAudioAPIで作られたチェーンに組み込む場合などに使用されます。<br/>
 * このクラスを継承するクラスを作る場合、オーバーライドが必要です。
 */
snd.AudioUnit.prototype.getConnector = function() {
    // PLEASE OVERRIDE ME
};

/**
 * JSON.stringifyで使用されるメソッドです。<br/>
 * このメソッドの戻り値がJSON.stringifyの出力に使用されます。
 * @returns {snd.AudioUnit.Status}
 */
snd.AudioUnit.prototype.toJSON = function() {
    return this._status;
};

/**
 * 引数jsonで渡された値をパースし、各種パラメータを設定します。<br/>
 * 接続先のリストは読み込みますが、このメソッドでは<strong>接続は行いません</strong>。<br/>
 * オーディオユニット同士のチェーンの再構築は別途実装が必要です。<br/>
 * このクラスを継承するクラスを作る場合、オーバーライドが必要です。(オーバーライドの際、apply必須)
 * 
 * @param {String} json 読み込むJSON文字列
 * @returns {snd.AudioUnit} jsonを内容を読み込んだAudioUnit
 */
snd.AudioUnit.prototype.fromJSON = function(json) {
    var data = JSON.parse(json);
    this._status.id = data["id"];
    this._status.connection = data["connection"];
    
    // PLEASE OVERRIDE ME LIKE THIS
    // SubClass.prototype.connect = function(connectTo, bra, bra) {
    //     AudioUnit.prototype.disconnect.apply(this, arguments);
    // };
};

/**
 * オーディオユニットの各種設定情報を保持するクラスです。
 */
snd.AudioUnit.Status = function() {
    this.isAudioUnit = true;
    this.id = "";
    this.className = "";
    this.connection = [];
};



/**
 * 音源を生成します。<br/>
 * typeプロパティはsnd.srctype.NONEに<br/>
 * statusプロパティはsnd.status.NONEに<br/>
 * それぞれ設定されます。
 * @class 各種音源クラスの親クラスとなる抽象クラスです。<br/>
 * start, stopなどの抽象メソッドは継承する子クラスで実装してください。
 * @param {String} id この音源のID
 */
snd.Source = function(id) {
    snd.AudioUnit.apply(this, arguments);
    
    this.isSource = true;
    
    this._gain = snd.AUDIO_CONTEXT.createGain();
    
    Object.defineProperties(this, {
        /**
         * @propertie {Boolean} このオブジェクトがsnd.Sourceクラスであることを表すブール値
         */
        isSource: {
            get: function() {
                return this._status.isSource;
            }
        },
        /**
         * @property {Float} このオブジェクトのメインボリュームの値
         */
        volume: {
            get: function() {
                return this._gain.gain.value;
            },
            set: function(val) {
                this._gain.gain.value = val;
                this._status.volume = val;
            }
        },
        /**
         * @property {snd.status} このオブジェクトの種類
         */
        type: {
            get: function() {
                return this._status.type;
            }
        },
        /**
         * @property {snd.status} このオブジェクトの状態
         */
        status: {
            get: function() {
                return this._status.status;
            }
        }
    });
};
snd.Source.prototype = Object.create(snd.AudioUnit.prototype);
snd.Source.prototype.constructor = snd.Source;

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
 * @deprecated このメソッドは削除予定です。<br/> volumeプロパティを使用するようにしてください。
 */
snd.Source.prototype.setGain = function(value) {
    this._gain.gain.value = value;
};

/**
 * @deprecated このメソッドは削除予定です。 volumeプロパティを使用するようにしてください。
 */
snd.Source.prototype.getGain = function(value) {
    return this._gain.gain.value;
};

/**
 * 詳細はAudioUnitクラスの createStatus を参照してください。
 * @return {snd.AudioUnit.Status} このオブジェクトのデフォルト設定値
 */
snd.Source.prototype.createStatus = function() {
    return new snd.Source.Status();
};

/**
 * 詳細はAudioUnitクラスのconnectを参照してください。
 * @param {AudioUnit} connectTo 接続先
 */
snd.Source.prototype.connect = function(connectTo, id) {
    snd.AudioUnit.prototype.connect.apply(this, arguments);
    
    if (connectTo.isAudioUnit) {
        this._gain.connect(connectTo.getConnector());
    } else {
        this._gain.connect(connectTo);
    }
};

/**
 * 詳細はAudioUnitクラスのdisconnectFromを参照してください。
 * @param {AudioUnit} disconnectFrom 切断する接続先
 */
snd.Source.prototype.disconnect = function(disconnectFrom, id) {
    snd.AudioUnit.prototype.disconnect.apply(this, arguments);
    
    if (disconnectFrom.isAudioUnit) {
        this._gain.disconnect(disconnectFrom.getConnector());
    } else {
        this._gain.disconnect(disconnectFrom);
    }
};

snd.Source.prototype.toJSON = function() {
    var ret = snd.AudioUnit.prototype.toJSON.apply(this, arguments);
    // volume プロパティを経由せずに _gain.gain.value に値が設定された場合
    // _status の volume には値が反映されないため、ここで改めて volume に値を設定
    ret.volume = this.volume;
    
    return ret;
};

snd.Source.Status = function() {
    snd.AudioUnit.Status.apply(this, arguments);
    
    this.isSource = true;
    this.type = snd.srctype.NONE;
    this.status = snd.status.NONE;
    this.volume = 1;
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
    this._status.type = snd.srctype.AUDIO_BUFFER;
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
        this._status.status = snd.status.STARTED;
    } else {
        if (this.audioBuffer != null) {
            if (this.status == snd.status.STARTED) {
                this.stop(0);
                this._status.status = snd.status.STOPPED;
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
        this.source.disconnect(this._gain);
    }
    delete this.source;
    this.source = src;
    this.source.buffer = this.audioBuffer;
    this.source.connect(this._gain);
    this.resetEventMethods(this.source);

    this.source.loop = this.loop;
    if (this.loopStart != null) {
        this.source.loopStart = this.loopStart;
    }
    if (this.loopEnd != null) {
        this.source.loopEnd = this.loopEnd;
    }
    this._status.status = snd.status.READY;
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
    this.source.connect(this._gain);
    this._status.type = snd.srctype.MEDIA_ELEMENT;
    this.element = htmlMediaElement;
    this._status.status = snd.status.NONE;
    
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
        _this._status.status = snd.status.STARTED;
        for (var i = 0; i < _this.listeners['onplay'].length; i++) {
            _this.listeners['onplay'][i](_this);
        }
    };
    this.element.onpause = function() {
        _this._status.status = snd.status.PAUSED;
        for (var i = 0; i < _this.listeners['onpause'].length; i++) {
            _this.listeners['onpause'][i](_this);
        }
    };
    this.element.onended = function() {
        _this._status.status = snd.status.PAUSED;
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
            _this._status.status = snd.status.READY;
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
    
    Object.defineProperties(this, {
        src: {
            enumerable: true,
            get: function() {
                return this.element.src;
            },
            set: function(uri) {
                this.element.src = uri;
            }
        }
    });
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
    this.source.connect(this._gain);
    this._status.type = snd.srctype.MEDIA_STREAM;
};
snd.MediaStreamAudioSource.prototype = Object.create(snd.Source.prototype);
snd.MediaStreamAudioSource.prototype.constructor = snd.MediaStreamAudioSource;



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
    if (waveForm === snd.oscillatortype.SINE
            || waveForm === snd.oscillatortype.SQUARE
            || waveForm === snd.oscillatortype.SAWTOOTH
            || waveForm === snd.oscillatortype.TRIANGLE) {
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
    
    this.ampEnvelope = new snd.Envelope(this._gain.gain, this.settings.amplitude.envelope);
    this.ampLFO = new snd.Synth.LFO(this.id + "_AmpLFO", this._gain.gain, this.settings.amplitude.lfo);
    this.freqEnvelope = new snd.Envelope(this.source.frequency, this.settings.frequency.envelope);
    this.freqLFO = new snd.Synth.LFO(this.id + "_FreqLFO", this.source.frequency, this.settings.frequency.lfo);
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
    this.freqEnvelope = new snd.Envelope(this.source.frequency, lfoSettings.frequency);
    this.ampEnvelope = new snd.Envelope(this._gain.gain, lfoSettings.amplitude);
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
snd.Envelope = function(param, settings) {
    this.param = param;
    this.settings = settings;
};

snd.Envelope.prototype.noteOn = function() {
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

snd.Envelope.prototype.noteOff = function() {
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
 * keyがキー値となるAudioBufferを追加します。<br/>
 * このメソッドはBase64形式のデータ文字列をAudioBufferにデコードして使用します。
 * @param {String} key キー値
 * @param {String} base64String Base64形式のデータ文字列
 **/
snd.AudioDataManager.prototype.addBase64 = function(key, base64String) {
    var _this = this;
    this.dataMap[key] = {doesLoaded:false};
    
    var base64DataString = "";
    var matches = base64String.match(/^data:audio.*base64,(.*)$/);
    if (matches) {
        base64DataString = matches[1];
    } else {
        base64DataString = base64String;
    }
    
    var data = atob(base64DataString);
    var dataArray = new ArrayBuffer(data.length);
    var dataBytes = new Uint8Array(dataArray);
    for (var i = 0; i < dataArray.byteLength; i++) {
        dataBytes[i] = data.charCodeAt(i) & 0xFF;
    }
    
    this.requests[key] = {};
    this.requests[key].send = function() {
        snd.AUDIO_CONTEXT.decodeAudioData(
            dataArray,
            function(buf) {
                _this.dataMap[key].data = buf;
                _this.dataMap[key].doesLoaded = true;
                _this.loaded(key, buf);
            });
    }
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
 * 渡されたURLが正規表現「/^data:audio.*base64,.*$/」とマッチする場合はDataURI文字列とし、base64の文字列部分をデータとして使用します。
 * <br/>
 * addAllを使用した時点ではまだ読込は開始されません。<br/>
 * データの読込を開始するには、load関数を使用する必要があります。
 * @param {HashMap} キー値と読み込むURLを指定したハッシュマップ
 * @see {snd.AudioDataManager.load}
 */
snd.AudioDataManager.prototype.addAll = function(dataSets) {
    for (var key in dataSets) {
        var uri = dataSets[key];
        if (uri != null) {
            var uriMatches = uri.toLowerCase().match(/^data:audio.*base64,(.*)$/);
            if (uriMatches) {
                var base64Data = uriMatches[1];
                this.addBase64(key, base64Data);
            } else {
                this.add(key, uri);
            }
        }
    }
};

/**
 * キーで指定されたデータをこのオブジェクトから削除します。
 * @param {type} key
 */
snd.AudioDataManager.prototype.removeData = function(key) {
    if (this.requests[key] != null) {
        delete this.requests[key];
    }
    if (this.dataMap[key] != null) {
        delete this.dataMap[key];
    }
    if (this.eventListeners[key] != null) {
        delete this.eventLiteners[key];
    }
}

/**
 * keySetで指定された全てのデータをこのオブジェクトから削除します
 * @param {Array} keySet key文字列の配列
 */
snd.AudioDataManager.prototype.removeAll = function(keySet) {
    for (var i = 0; i < keySet.length; i++) {
        removeData(keySet[i]);
    }
}

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
            if (this.dataMap[key].doesLoaded == false) {
                if (this.requests[key].readyState == null || this.requests[key].readyState < 2) {
                    this.requests[key].send();
                }
            }
        }
    } else {
        if (this.requests[key].readyState == null || this.requests[key].readyState < 2) {
            this.requests[key].send();
        }
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
};

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
                
                if (connectToMaster) {
                    snd.MASTER.connectAudioUnit(sourceMap[url][i].id, sourceMap[url][i]);
                }
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
 * @param {type} parentElem Audioタグを追加するDOMエレメント
 * @returns {HashMap}
 * @memberOf snd.util
 */
snd.util.createMediaElementAudioSources = function(dataSet, connectToMaster, parentElem) {
    var ret = {};
    
    for (var id in dataSet) {
        var audioElem;
        var docElem = document.getElementById(id);
        if (docElem == null) {
            audioElem = new Audio(id);
            parentElem.appendChild(audioElem);
        } else {
            audioElem = docElem;
        }
        
        if (dataSet[id] != null && dataSet[id] != "") {
            audioElem.src = dataSet[id];
        }
        
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
