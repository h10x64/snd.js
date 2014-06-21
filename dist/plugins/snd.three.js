/* snd.js - The Sound Library for JavaScript with WebAudioAPI - v.0.1.0 */
/**
 * snd.js
 * three.js plugin
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
 
 

snd.three = {version: 0.1, beta: true};

snd.three.mode = {};
snd.three.mode.NONE = 0x0000;
snd.three.mode.POSTURE = 0x0001;
snd.three.mode.DOPPLER = 0x0002;
snd.three.mode.DELAY = 0x0004;
snd.three.mode.ALL = 0x0007;


/**
 * 新しいインスタンスを作ります。
 * @class リスナを表すクラスです。<br/>
 * AudioContext#Listenerをラップしています。<br/>
 * <a href="#setListener">setListener</a>メソッドを呼び出すまでは実際の出力へは反映されませんが、setPositionなどで設定された位置情報は保持されます。<br/>
 * （setListenerメソッドでListenerをセットした時点でListenerにこのオブジェクトの姿勢情報が反映されるようになります。）<br/>
 * @param {Listener} listener AudioContext.Listener (nullでもよい)
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
 * listenerを設定します。<br/>
 * このメソッドで設定されるまで、WebAudioAPIのlistenerには反映されません。
 * @param {Listener} AudioContext.Listener
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
 * @class
 */
snd.SoundEnvironment = function() {
    this.now = 0;
    this.listener = snd.AUDIO_CONTEXT.listener;
    this.listeners = {};
    this.soundNodes = {};
    this.unit = 1.0;
    
    this.cameras = {}; // {id: {camera: three.js.Camera, listener: snd.js.listener}}
    this.attaches = {}; // {id: {object: three.js.Object3D, sources: snd.js.SoundNode[]}}
    this.linkMap = {};
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

snd.SoundNode.prototype.disconnect = function(disconnectFrom) {
    if (disconnectFrom.isAudioUnit) {
        this.pannerNode.disconnect(disconnectFrom.getConnector());
    } else {
        this.pannerNode.disconnect(disconnectFrom);
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
 * 新しいインスタンスを作成します。<br/>
 * sourceで渡すオブジェクトは、snd.BufferSoundSourceクラスである必要があります。
 * @param {String} id この音源オブジェクトのID
 * @param {snd.BufferSoundSource} source 使用する音源
 * @class BufferSourceクラスを使用するSoundNodeクラスです。<br/>
 * startやstopなどの各種メソッドを移譲しているため、音源とエフェクトの区別をつけないまま操作が可能です。<br/>
 * MediaElementAudioSource/Nodeと比較して、一時停止ができないなどの不便さがありますが、
 * なめらかにループがつながるなどの利点があります。<br/>
 * 用途によって使い分けてください。
 */
snd.BufferSoundNode = function(id, source) {
    snd.SoundNode.apply(this, arguments);
    
    this.src = source;
    this.src.connect(this);
};
snd.BufferSoundNode.prototype = Object.create(snd.SoundNode.prototype);
snd.BufferSoundNode.prototype.constructor = snd.BufferSoundNode;


/**
 * この音源の再生を開始します。<br/>
 * 一時停止はできません。<br/>
 * start()とすると、すぐにデータの頭から終わりまでの再生が開始されます。
 * 
 * @param {Number} when 何秒後に再生を開始するか
 * @param {Number} offset 音源の再生開始位置（単位:秒）
 * @param {Number} duration 音源の再生終了位置（単位:秒）
 */
snd.BufferSoundNode.prototype.start = function(when, offset, duration) {
    this.src.start(when, offset, duration);
};

/**
 * この音源を停止します。<br/>
 * 停止後も再度startメソッドを呼ぶことで何度でも再生が可能です。
 * @param {Number} when 何秒後に再生を停止するか 
 */
snd.BufferSoundNode.prototype.stop = function(when) {
    this.src.stop(when);
};


/**
 * この音源がループするかどうかを設定します。
 * @param {boolean} status ループするか否か
 */
snd.BufferSoundNode.prototype.setLoop = function(status) {
    this.src.setLoop(status);
};

/**
 * この音源がループするかどうかを取得します。
 * @returns {Boolean} この音源がループするか否か
 */
snd.BufferSoundNode.prototype.getLoop = function() {
    return this.src.getLoop();
};

/**
 * ループの開始位置を設定します。
 * @param {double} when ループの開始位置[秒]
 */
snd.BufferSoundNode.prototype.setLoopStart = function(when) {
    this.src.setLoopStart(when);
};

/**
 * ループの開始位置を取得します。
 * @returns {double} ループの開始位置[秒]
 */
snd.BufferSoundNode.prototype.getLoopStart = function() {
    return this.src.getLoopStart();
};

/**
 * ループの終端を設定します。
 * @param {double} when
 */
snd.BufferSoundNode.prototype.setLoopEnd = function(when) {
    this.src.setLoopEnd(when);
};

/**
 * ループの終端を取得します。
 * @returns {double} ループの終了位置[秒]
 */
snd.BufferSoundNode.prototype.getLoopEnd = function() {
    return this.src.getLoopEnd()
};

/* Add/Remove Event Listener Methods */

/**
 * 渡されたイベントリスナーをこの音源の再生終了イベントのリスナーリストへ追加します。<br/>
 * 追加されたlistenerは、この音源の再生が終了したとき(onendedイベント発生時)にコールバックメソッドとして呼び出されます<br/>
 * @param {function} listener 音源の再生終了イベント発生時に呼び出されるコールバックメソッド
 */
snd.BufferSoundNode.prototype.addOnEndedEventListener = function(listener) {
    this.src.addOnEndedEventListener(listener);
};

/**
 * 渡されたイベントリスナーをこの音源の再生終了イベントのリスナーリストから削除します。<br/>
 * 与えられたlistenerが見つかった場合、削除を行いtrueを返します。<br/>
 * 見つからなかった場合は、何もせずにfalseを返します。
 * @param {function} listener イベントのリスナー
 * @return {boolean} listenerが見つかり、実際に削除が行われたらtrue, そうでなければfalse
 */
snd.BufferSoundNode.prototype.removeOnEndedEventListener = function(listener) {
    return this.src.removeOnEndedEventListener(listener);
};


/**
 * sourceで指定された音源を使用して新しいインスタンスを生成します。<br/>
 * sourceで渡すオブジェクトは、snd.MediaElementAudioSourceクラスである必要があります。
 * @param {id} id ID
 * @param {snd.MediaELementAudioSource} source MediaElementAudioSourceクラスの音源
 * @class MediaElementAudioSourceクラスを使用するSoundNodeクラスです。<br/>
 * startやstopなどの各種メソッドを移譲しているため、音源とエフェクトの区別をつけないまま操作が可能です。<br/>
 * 豊富なイベントや一時停止などの機能があるため、BufferSoundNodeと比べて扱いやすいですが、
 * ループ終点から始点に戻る際にブレイクが入ってしまうなどの欠点もあります。<br/>
 * 用途により使い分けてください。
 */
snd.MediaElementAudioNode = function(id, source) {
    snd.SoundNode.apply(this, arguments);
    this.source = source;
    this.source.connect(this);
    
    Object.defineProperties(this, {
        src: {
            enumerable: true,
            get: function() {
                return this.source.src;
            },
            set: function(uri) {
                this.source.src = uri;
            }
        }
    });
};
snd.MediaElementAudioNode.prototype = Object.create(snd.SoundNode.prototype);
snd.MediaElementAudioNode.prototype.constructor = snd.MediaElementAudioNode;

/**
 * この音源の読み込みを開始します。
 */
snd.MediaElementAudioNode.prototype.load = function() {
    this.source.load();
};

/**
 * この音源の再生を開始します。
 */
snd.MediaElementAudioNode.prototype.start = function() {
    this.source.start();
};

/**
 * この音源を一時停止します。
 */
snd.MediaElementAudioNode.prototype.pause = function() {
    this.source.pause();
};

/**
 * この音源を停止し、時刻を0へ戻します。
 */
snd.MediaElementAudioNode.prototype.stop = function() {
    this.source.pause();
};

/**
 * この音源をループ再生するかどうかを設定します。<br/>
 * Audioタグを使用するため、ループ終点からループ始点に戻る速度がBufferSoundSourceと比較して遅く、間にブレイクが入る可能性があります。<br/>
 * なめらかにループしたい場合はBufferSoundSourceの使用を検討してください。
 * @param {type} doesLoop ループ再生するか否か
 */
snd.MediaElementAudioNode.prototype.setLoop = function(doesLoop) {
    this.source.setLoop(doesLoop);
};

/* Add/Remove Listener Methods */

/**
 * この音源のonplayイベント発生時に呼び出すコールバックメソッドを追加します。
 * @param {function} listener 追加するコールバックメソッド
 */
snd.MediaElementAudioNode.prototype.addOnPlayEventListener = function(listener) {
    this.source.addOnPlayEventListener(listener);
};

/**
 * listenerで指定されたコールバックメソッドをonplayイベント発生時に呼び出されるリストから削除します。
 * @param {function} listener 削除するコールバックメソッド
 * @returns 削除されたらtrue, 削除されなかったらfalse
 */
snd.MediaElementAudioNode.prototype.removeOnPlayEventListener = function(listener) {
    return this.source.removeOnPlayEventListener(listener);
};

/**
 * この音源のイベント発生時に呼び出すコールバックメソッドを追加します。
 * @param {function} listener 追加するコールバックメソッド
 */
snd.MediaElementAudioNode.prototype.addOnPauseEventListener = function(listener) {
    this.source.addOnPauseEventListener(listener);
};

/**
 * listenerで指定されたコールバックメソッドをイベント発生時に呼び出されるリストから削除します。
 * @param {function} listener 削除するコールバックメソッド
 * @returns 削除されたらtrue, 削除されなかったらfalse
 */
snd.MediaElementAudioNode.prototype.removeOnPauseEventListener = function(listener) {
    return this.source.removeOnPauseEventListener(listener);
};

/**
 * この音源のonendedイベント発生時に呼び出すコールバックメソッドを追加します。
 * @param {function} listener 追加するコールバックメソッド
 */
snd.MediaElementAudioNode.prototype.addOnEndedEventListener = function(listener) {
    this.source.addOnEndedEventListener(listener);
};

/**
 * listenerで指定されたコールバックメソッドをonendedイベント発生時に呼び出されるリストから削除します。
 * @param {function} listener 削除するコールバックメソッド
 * @returns 削除されたらtrue, 削除されなかったらfalse
 */
snd.MediaElementAudioNode.prototype.removeOnEndedEventListener = function(listener) {
    return this.source.removeOnEndedEventListener(listener);
};

/**
 * この音源のonabortイベント発生時に呼び出すコールバックメソッドを追加します。
 * @param {function} listener 追加するコールバックメソッド
 */
snd.MediaElementAudioNode.prototype.addOnAbortEventListener = function(listener) {
    this.source.addOnAbortEventListener(listener);
};

/**
 * listenerで指定されたコールバックメソッドをonabortイベント発生時に呼び出されるリストから削除します。
 * @param {function} listener 削除するコールバックメソッド
 * @returns 削除されたらtrue, 削除されなかったらfalse
 */
snd.MediaElementAudioNode.prototype.removeOnAbortEventListener = function(listener) {
    return this.source.removeOnAbortEventListener(listener);
};

/**
 * この音源のoncanplayイベント発生時に呼び出すコールバックメソッドを追加します。
 * @param {function} listener 追加するコールバックメソッド
 */
snd.MediaElementAudioNode.prototype.addOnCanPlayEventListener = function(listener) {
    this.source.addOnCanPlayEventListener(listener);
};

/**
 * listenerで指定されたコールバックメソッドをoncanplayイベント発生時に呼び出されるリストから削除します。
 * @param {function} listener 削除するコールバックメソッド
 * @returns 削除されたらtrue, 削除されなかったらfalse
 */
snd.MediaElementAudioNode.prototype.removeOnCanPlayEventListener = function(listener) {
    return this.source.removeOnCanPlayEventListener(listener);
};

/**
 * この音源のoncanplaythroughイベント発生時に呼び出すコールバックメソッドを追加します。
 * @param {function} listener 追加するコールバックメソッド
 */
snd.MediaElementAudioNode.prototype.addOnCanPlayThroughEventListener = function(listener) {
    this.source.addOnCanPlayThroughEventListener(listener);
};

/**
 * listenerで指定されたコールバックメソッドをoncanplaythroughイベント発生時に呼び出されるリストから削除します。
 * @param {function} listener 削除するコールバックメソッド
 * @returns 削除されたらtrue, 削除されなかったらfalse
 */
snd.MediaElementAudioNode.prototype.removeOnCanPlayThroughEventListener = function(listener) {
    return this.source.removeOnCanPlayThroughEventListener(listener);
};

/**
 * この音源のondurationchangeイベント発生時に呼び出すコールバックメソッドを追加します。
 * @param {function} listener 追加するコールバックメソッド
 */
snd.MediaElementAudioNode.prototype.addOnDurationChangeEventListener = function(listener) {
    this.source.addOnDurationChangeEventListener(listener);
};

/**
 * listenerで指定されたコールバックメソッドをoncanplaythroughイベント発生時に呼び出されるリストから削除します。
 * @param {function} listener 削除するコールバックメソッド
 * @returns 削除されたらtrue, 削除されなかったらfalse
 */
snd.MediaElementAudioNode.prototype.removeOnCanPlayThroughEventListener = function(listener) {
    return this.source.removeOnCanPlayEventListener(listener);
};

/**
 * この音源のonemptiedイベント発生時に呼び出すコールバックメソッドを追加します。
 * @param {function} listener 追加するコールバックメソッド
 */
snd.MediaElementAudioNode.prototype.addOnEmptiedEventListener = function(listener) {
    this.source.addOnEmptiedEventListener(listener);
};

/**
 * listenerで指定されたコールバックメソッドをonemptiedイベント発生時に呼び出されるリストから削除します。
 * @param {function} listener 削除するコールバックメソッド
 * @returns 削除されたらtrue, 削除されなかったらfalse
 */
snd.MediaElementAudioNode.prototype.removeOnEmptiedEventListener = function(listener) {
    return this.source.removeOnEmptiedEventListener(listener);
};

/**
 * この音源のonerrorイベント発生時に呼び出すコールバックメソッドを追加します。
 * @param {function} listener 追加するコールバックメソッド
 */
snd.MediaElementAudioNode.prototype.addOnErrorEventListener = function(listener) {
    this.source.addOnErrorEventListener(listener);
};

/**
 * listenerで指定されたコールバックメソッドをonerrorイベント発生時に呼び出されるリストから削除します。
 * @param {function} listener 削除するコールバックメソッド
 * @returns 削除されたらtrue, 削除されなかったらfalse
 */
snd.MediaElementAudioNode.prototype.removeOnErrorEventListener = function(listener) {
    return this.source.removeOnErrorEventListener(listener);
};

/**
 * この音源のonloadeddataイベント発生時に呼び出すコールバックメソッドを追加します。
 * @param {function} listener 追加するコールバックメソッド
 */
snd.MediaElementAudioNode.prototype.addOnLoadedDataEventListener = function(listener) {
    this.source.addOnLoadedDataEventListener(listener);
};

/**
 * listenerで指定されたコールバックメソッドをonloadeddataイベント発生時に呼び出されるリストから削除します。
 * @param {function} listener 削除するコールバックメソッド
 * @returns 削除されたらtrue, 削除されなかったらfalse
 */
snd.MediaElementAudioNode.prototype.removeOnLoadedDataEventListener = function(listener) {
    return this.source.removeOnLoadedDataEventListener(listener);
};

/**
 * この音源のonloadedmetadataイベント発生時に呼び出すコールバックメソッドを追加します。
 * @param {function} listener 追加するコールバックメソッド
 */
snd.MediaElementAudioNode.prototype.addOnLoadedMetadataEventListener = function(listener) {
    this.source.addOnLoadedMetadataEventListener(listener);
};

/**
 * listenerで指定されたコールバックメソッドをonloadedmetadataイベント発生時に呼び出されるリストから削除します。
 * @param {function} listener 削除するコールバックメソッド
 * @returns 削除されたらtrue, 削除されなかったらfalse
 */
snd.MediaElementAudioNode.prototype.removeOnLoadedMetaDataEventListener = function(listener) {
    return this.source.removeOnLoadedMetaDataEventListener(listener);
};

/**
 * この音源のonloadstartイベント発生時に呼び出すコールバックメソッドを追加します。
 * @param {function} listener 追加するコールバックメソッド
 */
snd.MediaElementAudioNode.prototype.addOnLoadStartEventListener = function(listener) {
    this.source.addOnLoadStartEventListener(listener);
};

/**
 * listenerで指定されたコールバックメソッドをonloadstartイベント発生時に呼び出されるリストから削除します。
 * @param {function} listener 削除するコールバックメソッド
 * @returns 削除されたらtrue, 削除されなかったらfalse
 */
snd.MediaElementAudioNode.prototype.removeOnLoadStartEventListener = function(listener) {
    return this.source.removeOnLoadStartEventListener(listener);
};

/**
 * この音源のonplayingイベント発生時に呼び出すコールバックメソッドを追加します。
 * @param {function} listener 追加するコールバックメソッド
 */
snd.MediaElementAudioNode.prototype.addOnPlayingEventListener = function(listener) {
    this.source.addOnPlayingEventListener(listener);
};

/**
 * listenerで指定されたコールバックメソッドをonplayingイベント発生時に呼び出されるリストから削除します。
 * @param {function} listener 削除するコールバックメソッド
 * @returns 削除されたらtrue, 削除されなかったらfalse
 */
snd.MediaElementAudioNode.prototype.removeOnPlayingEventListener = function(listener) {
    return this.source.removeOnPlayingEventListener(listener);
};

/**
 * この音源のonprogressイベント発生時に呼び出すコールバックメソッドを追加します。
 * @param {function} listener 追加するコールバックメソッド
 */
snd.MediaElementAudioNode.prototype.addOnProgressEventListener = function(listener) {
    this.source.addOnProgressEventListener(listener);
};

/**
 * listenerで指定されたコールバックメソッドをonprogressイベント発生時に呼び出されるリストから削除します。
 * @param {function} listener 削除するコールバックメソッド
 * @returns 削除されたらtrue, 削除されなかったらfalse
 */
snd.MediaElementAudioNode.prototype.removeOnProgressEventListener = function(listener) {
    return this.source.removeOnProgressEventListener(listener);
};

/**
 * この音源のonratecahngeイベント発生時に呼び出すコールバックメソッドを追加します。
 * @param {function} listener 追加するコールバックメソッド
 */
snd.MediaElementAudioNode.prototype.addOnRateChangeEventListener = function(listener) {
    this.source.addOnRateChangeEventListener(listener);
};

/**
 * listenerで指定されたコールバックメソッドをonratechangeイベント発生時に呼び出されるリストから削除します。
 * @param {function} listener 削除するコールバックメソッド
 * @returns 削除されたらtrue, 削除されなかったらfalse
 */
snd.MediaElementAudioNode.prototype.removeOnRateChangeEventListener = function(listener) {
    return this.source.removeOnRateChangeEventListener(listener);
};

/**
 * この音源のonseekedイベント発生時に呼び出すコールバックメソッドを追加します。
 * @param {function} listener 追加するコールバックメソッド
 */
snd.MediaElementAudioNode.prototype.addOnSeekedEventListener = function(listener) {
    this.source.addOnSeekedEventListener(listener);
};

/**
 * listenerで指定されたコールバックメソッドをonseekedイベント発生時に呼び出されるリストから削除します。
 * @param {function} listener 削除するコールバックメソッド
 * @returns 削除されたらtrue, 削除されなかったらfalse
 */
snd.MediaElementAudioNode.prototype.removeOnSeekedEventListener = function(listener) {
    return this.source.removeOnSeekedEventListener(listener);
};

/**
 * この音源のonseekingイベント発生時に呼び出すコールバックメソッドを追加します。
 * @param {function} listener 追加するコールバックメソッド
 */
snd.MediaElementAudioNode.prototype.addOnSeekingEventListener = function(listener) {
    this.source.addOnSeekingEventListener(listener);
};

/**
 * listenerで指定されたコールバックメソッドをonseekingイベント発生時に呼び出されるリストから削除します。
 * @param {function} listener 削除するコールバックメソッド
 * @returns 削除されたらtrue, 削除されなかったらfalse
 */
snd.MediaElementAudioNode.prototype.removeOnSeekingEventListener = function(listener) {
    return this.source.removeOnSeekingEventListener(listener);
};

/**
 * この音源のonstalledイベント発生時に呼び出すコールバックメソッドを追加します。
 * @param {function} listener 追加するコールバックメソッド
 */
snd.MediaElementAudioNode.prototype.addOnStalledEventListener = function(listener) {
    this.source.addOnStalledEventListener(listener);
};

/**
 * listenerで指定されたコールバックメソッドをonstalledイベント発生時に呼び出されるリストから削除します。
 * @param {function} listener 削除するコールバックメソッド
 * @returns 削除されたらtrue, 削除されなかったらfalse
 */
snd.MediaElementAudioNode.prototype.removeOnStalledEventListener = function(listener) {
    return this.source.removeOnStalledEventListener(listener);
};

/**
 * この音源のonsuspendイベント発生時に呼び出すコールバックメソッドを追加します。
 * @param {function} listener 追加するコールバックメソッド
 */
snd.MediaElementAudioNode.prototype.addOnSuspendEventListener = function(listener) {
    this.source.addOnSuspendEventListener(listener);
};

/**
 * listenerで指定されたコールバックメソッドをonsupendイベント発生時に呼び出されるリストから削除します。
 * @param {function} listener 削除するコールバックメソッド
 * @returns 削除されたらtrue, 削除されなかったらfalse
 */
snd.MediaElementAudioNode.prototype.removeOnSuspendEventListener = function(listener) {
    return this.source.removeOnSuspendEventListener(listener);
};

/**
 * この音源のnotimeupdateイベント発生時に呼び出すコールバックメソッドを追加します。
 * @param {function} listener 追加するコールバックメソッド
 */
snd.MediaElementAudioNode.prototype.addOnTimeUpdateEventListener = function(listener) {
    this.source.addOnTimeUpdateEventListener(listener);
};

/**
 * listenerで指定されたコールバックメソッドをontimeupdateイベント発生時に呼び出されるリストから削除します。
 * @param {function} listener 削除するコールバックメソッド
 * @returns 削除されたらtrue, 削除されなかったらfalse
 */
snd.MediaElementAudioNode.prototype.removeOnTimeUpdateEventListener = function(listener) {
    return this.source.removeOnTimeUpdateEventListener(listener);
};

/**
 * この音源のonvolumechangeイベント発生時に呼び出すコールバックメソッドを追加します。
 * @param {function} listener 追加するコールバックメソッド
 */
snd.MediaElementAudioNode.prototype.addOnVolumeChangeEventListener = function(listener) {
    this.source.addOnVolumeChangeEventListener(listener);
};

/**
 * listenerで指定されたコールバックメソッドをonvolumechangeイベント発生時に呼び出されるリストから削除します。
 * @param {function} listener 削除するコールバックメソッド
 * @returns 削除されたらtrue, 削除されなかったらfalse
 */
snd.MediaElementAudioNode.prototype.removeOnVolumeChangeEventListener = function(listener) {
    return this.source.removeOnVolumeChangeEventListener(listener);
};

/**
 * この音源のonwaitingeイベント発生時に呼び出すコールバックメソッドを追加します。
 * @param {function} listener 追加するコールバックメソッド
 */
snd.MediaElementAudioNode.prototype.addOnWaitingEventListener = function(listener) {
    this.source.addOnWaitingEventListener(listener);
};

/**
 * listenerで指定されたコールバックメソッドをonwaitingイベント発生時に呼び出されるリストから削除します。
 * @param {function} listener 削除するコールバックメソッド
 * @returns 削除されたらtrue, 削除されなかったらfalse
 */
snd.MediaElementAudioNode.prototype.removeOnWaitingEventListener = function(listener) {
    return this.source.removeOnWaitingEventListener(listener);
};




snd.three.update = function(mainCamera, time) {
    if (snd.SOUND_ENVIRONMENT.cameras[mainCamera.id] == null) {
        console.log("mainCamera(" + mainCamera.toString() + ") is not added.");
        return;
    }
    if (snd.SOUND_ENVIRONMENT.cameras[mainCamera.id].listener.listener == null) {
        for (var id in snd.SOUND_ENVIRONMENT.cameras) {
            snd.SOUND_ENVIRONMENT.cameras[id].listener.resetListener();
        }
        snd.SOUND_ENVIRONMENT.cameras[mainCamera.id].listener.setListener(snd.AUDIO_CONTEXT.listener);
    }
    
    // update listener posture
    for (var id in snd.SOUND_ENVIRONMENT.cameras) {
        var cam = snd.SOUND_ENVIRONMENT.cameras[id].camera;
        var listener = snd.SOUND_ENVIRONMENT.cameras[id].listener;
        snd.three.link(cam, listener);
    }

    // update source posture
    for (var id in snd.SOUND_ENVIRONMENT.attaches) {
        var obj = snd.SOUND_ENVIRONMENT.attaches[id].object;
        for (var i = 0; i < snd.SOUND_ENVIRONMENT.attaches[id].sources.length; i++) {
            var src = snd.SOUND_ENVIRONMENT.attaches[id].sources[i];
            snd.three.link(obj, src);
        }
    }
};

snd.three.addCamera = function(camera) {
    var id = camera.id;
    if (snd.SOUND_ENVIRONMENT.cameras[id] != null) {
        console.warn("snd.SOUND_ENVIRONMENT already has camera(" + camera.toString() + ").");
        return;
    }

    var listener = new snd.Listener(null);

    snd.SOUND_ENVIRONMENT.cameras[id] = {camera: camera, listener: listener};
    snd.SOUND_ENVIRONMENT.addListener(listener);
};

snd.three.removeCamera = function(camera) {
    if (snd.SOUND_ENVIRONMENT.cameras[camera.id] != null) {
        snd.SOUND_ENVIRONMENT.removeListener(snd.SOUND_ENVIRONMENT.cameras[camera.id].listener);
        delete snd.SOUND_ENVIRONMENT.cameras[camera.id];
    }
};

snd.three.attach = function(object, source) {
    var id = object.id;
    if (snd.SOUND_ENVIRONMENT.attaches[id] == null) {
        snd.SOUND_ENVIRONMENT.attaches[id] = {object: object, sources: []};
    }
    snd.SOUND_ENVIRONMENT.attaches[id].sources.push(source);
    snd.SOUND_ENVIRONMENT.linkMap[source.id] = id;
};

snd.three.detach = function(source) {
    var srcID = source.id;
    if (snd.SOUND_ENVIRONMENT.linkMap[srcID] != null) {
        var objID = snd.SOUND_ENVIRONMENT.linkMap[srcID];
        var i = snd.SOUND_ENVIRONMENT.attaches[objID].sources.indexOf(source);
        if (i >= 0) {
            snd.SOUND_ENVIRONMENT.attaches[objID].sources.splice(i, 1);
        }
        delete snd.SOUND_ENVIRONMENT.linkMap[srcID];
    }
};

snd.three.getSoundNodes = function(object) {
    return snd.SOUND_ENVIRONMENT.attaches[object.id].sources;
};

snd.three.link = function(object3D, posdir) {
    if (!isNaN(object3D.position.x) && !isNaN(object3D.position.y) && !isNaN(object3D.position.z)
            && !isNaN(object3D.quaternion.x) && !isNaN(object3D.quaternion.y) && !isNaN(object3D.quaternion.z) && !isNaN(object3D.quaternion.w)) {
        var objMatrix = new THREE.Matrix4();
        objMatrix.copy(object3D.matrixWorld);
        
        var rotMatrix = new THREE.Matrix4();
        rotMatrix.copy(objMatrix);
        rotMatrix.elements[12] = 0; rotMatrix.elements[13] = 0; rotMatrix.elements[14] = 0;
        
        var objPos = new THREE.Vector3(
                objMatrix.elements[12],
                objMatrix.elements[13],
                objMatrix.elements[14]);
        var objDir = new THREE.Vector3(
                -objMatrix.elements[8],
                -objMatrix.elements[9],
                -objMatrix.elements[10]);
        
        var objUp = new THREE.Vector3();
        objUp.copy(object3D.up);
        objUp.applyMatrix4(rotMatrix);
        //objUp.negate();
    
        posdir.setPosition(objPos.x, objPos.y, objPos.z);
        posdir.setOrientation(objDir.x, objDir.y, objDir.z, objUp.x, objUp.y, objUp.z);
    }
};

/**
 * @namespace three.jsプラグインでよく使う処理をまとめたネームスペース
 */
snd.three.util = {};

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
 */
snd.three.util.createNodes = function(dataSet, connectToMaster, element, func) {
    var ret = {};
    if (dataSet['MediaElement'] != null) {
        ret['MediaElement'] = snd.three.util.createMediaElementAudioNode(dataSet['MediaElement'], connectToMaster, element);
    } else {
        ret['MediaElement'] = false;
    }
    if (dataSet['AudioBuffer'] != null) {
        snd.three.util.createBufferSoundNodes(dataSet['AudioBuffer'], connectToMaster, function(res) {
            ret['AudioBuffer'] = res;
            func(ret);
        });
    } else {
        ret['AudioBuffer'] = null;
        func(ret);
    }
};

/**
 * three.jsプラグインで使用するためのバッファ音源を作成します。<br/>
 * dataSetに設定されたID, URLからデータを読み込み、音源の作成および設定を行います。<br/>
 * connectToMasterがtrueの場合は、snd.MASTERへの接続を同時に行います。<br/>
 * 音源の作成、設定、読み込みが終わるとfuncで設定されたコールバックメソッドが呼び出されます。<br/>
 * <br/>
 * dataSetの具体例を以下に例示します。<br/>
 * <br/>
 * dataSet = {<br/>
 *   'BufferNodeID01': './hoge/fuga/sound.wav',<br/>
 *   'BufferNodeID02': './hoge/fuga/data.wav'<br/>
 * };<br/>
 * 
 * @param {HashMap} dataSet 音源のIDとURLをまとめたデータセット
 * @param {boolean} connectToMaster 読み込み完了時にsnd.MASTERへ接続するかどうか
 * @param {function} func 読込みが終了し、音源の準備が完了した時に呼ばれるコールバック関数
 */
snd.three.util.createBufferSoundNodes = function(dataSet, connectToMaster, func) {
    snd.util.createBufferSources(dataSet, false, function(sources) {
        var ret = {};
        for (var id in sources) {
            ret[id] = new snd.BufferSoundNode(id, sources[id]);
            if (connectToMaster) {
                snd.MASTER.connectAudioUnit(ret[id].id, ret[id]);
            }
        }
        func(ret);
    });
};

/**
 * オーディオタグを使用してthree.jsプラグインで使用するための音源を作成します。<br/>
 * dataSetに設定されたID, URLを使用して、音源の作成および設定を行います。<br/>
 * connectToMasterがtrueの場合は、snd.MASTERへの接続を同時に行います。<br/>
 * 作成された&lt;audio&gt;タグはelementで指定したDOMエレメントへ追加されます。
 * <br/>
 * dataSetの具体例を以下に例示します。<br/>
 * <br/>
 * dataSet = {<br/>
 *   'MediaNodeID01': './hoge/fuga/sound.wav',<br/>
 *   'MediaNodeID02': './hoge/fuga/data.wav'<br/>
 * };<br/>
 * <br/>
 * 
 * @param {HashMap} dataSet 音源のIDと、データURLのハッシュマップ {ID1: "URL1", ID2: "URL2", ... IDn: "URLn"}
 * @param {boolean} connectToMaster 読み込み完了時にsnd.MASTERへ接続するかどうか
 * @param {type} element Audioタグを追加するDOMエレメント
 * @returns {HashMap}
 */
snd.three.util.createMediaElementSourceNodes = function(dataSet, connectToMaster, element) {
    var ret = {};
    
    var sourceSet = {};
    for (var id in dataSet) {
        sourceSet[id + "_src"] = dataSet[id];
    }
    var sources = snd.util.createMediaElementAudioSources(sourceSet, false, element);
    
    for (var id in dataSet) {
        ret[id] = new snd.MediaElementAudioNode(id, sources[id + "_src"]);
        if (connectToMaster) {
            snd.MASTER.connectAudioUnit(ret[id].id, ret[id]);
        }
    }
    
    return ret;
}
