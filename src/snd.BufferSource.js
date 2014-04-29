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
