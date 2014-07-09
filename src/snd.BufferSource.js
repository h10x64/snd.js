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
    
    this._source = null;
    this._audioBuffer = null;
    
    Object.defineProperties(this, {
        loop: {
            enumerable: true,
            get: function() {
                return this._status.loop;
            },
            set: function(loop) {
                this._source.loop = loop;
                this._status.loop = loop;
            }
        },
        loopStart: {
            enumerable: true,
            get: function() {
                return this._status.loopStart;
            },
            set: function(start) {
                if (this._source != null && start != null) {
                    this._source.loopStart = start;
                    this._status.loopStart = start;
                }
            }
        },
        loopEnd: {
            enumerable: true,
            get: function() {
                return this._status.loopEnd;
            },
            set: function(end) {
                if (this._source != null && end != null) {
                    this._source.loopEnd = end;
                    this._status.loopEnd = end;
                }
            }
        }
    });
    
    this._eventListeners = {
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
    if (this._source != null && this.status == snd.status.READY) {
        if (when == null) {
            this._source.start(0);
        } else if (offset == null) {
            this._source.start(when);
        } else if (duration == null) {
            this._source.start(when, offset);
        } else {
            this._source.start(when, offset, duration);
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
    if (this._source != null) {
        if (when == null) {
            this._source.stop(0);
        } else {
            this._source.stop(when);
        }
    }
};

/**
 * この音源がループするかどうかを設定します。
 * @param {boolean} status ループするか否か
 */
snd.BufferSource.prototype.setLoop = function(status) {
    if (this._source != null) {
        this._source.loop = status;
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
 * @deprecated loopStart プロパティを使用してください。
 */
snd.BufferSource.prototype.setLoopStart = function(when) {
    if (this._source != null && when != null) {
        this._source.loopStart = when;
    }
    this.loopStart = when;
};

/**
 * @deprecated loopStart プロパティを使用してください。
 */
snd.BufferSource.prototype.getLoopStart = function() {
    return this.loopStart;
};

/**
 * @deprecated loopEnd プロパティを使用してください。
 */
snd.BufferSource.prototype.setLoopEnd = function(when) {
    if (this._source != null && when != null) {
        this._source.loopEnd = when;
    }
    this.loopEnd = when;
};

/**
 * @deprecated loopEnd プロパティを使用してください。
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
    this._eventListeners['onended'].push(listener);
};

/**
 * 渡されたイベントリスナーをこの音源の再生終了イベントのリスナーリストから削除します。<br/>
 * 与えられたlistenerが見つかった場合、削除を行いtrueを返します。<br/>
 * 見つからなかった場合は、何もせずにfalseを返します。
 * @param {function} listener イベントのリスナー
 * @return {boolean} listenerが見つかり、実際に削除が行われたらtrue, そうでなければfalse
 */
snd.BufferSource.prototype.removeOnEndedEventListener = function(listener) {
    var a = this._eventListeners['onended'];
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
    if (this._source != null) {
        this._source.disconnect(this._gain);
    }
    delete this._source;
    this._source = src;
    this._source.buffer = this.audioBuffer;
    this._source.connect(this._gain);
    this.resetEventMethods(this._source);

    this._source.loop = this.loop;
    if (this.loopStart != null) {
        this._source.loopStart = this.loopStart;
    }
    if (this.loopEnd != null) {
        this._source.loopEnd = this.loopEnd;
    }
    this._status.status = snd.status.READY;
};

snd.BufferSource.prototype.resetEventMethods = function() {
    var _this = this;
    
    this._source.onended = function() {
        var a = _this._eventListeners['onended'];
        for (var i = 0; i < a.length; i++) {
            a[i](_this);
        }
    };
};

snd.BufferSource.prototype.createStatus = function() {
    return new snd.BufferSource.Status();
};

snd.BufferSource.prototype.toJSON = function() {
    return this._status;
};

snd.BufferSource.prototype.loadData = function(data) {
    snd.Source.prototype.loadData.apply(this, arguments);
    
    if (data.loop == true) {
        this.loop = true;
    }
    this.loopStart = data.loopStart;
    this.loopEnd = data.loopEnd;
};

snd.BufferSource.Status = function() {
    snd.Source.Status.apply(this, arguments);
    
    this.loop = false;
    this.loopStart = null;
    this.loopEnd = null;
};
