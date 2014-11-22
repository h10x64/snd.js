/**
 * AudioBufferを使用する音源を新しく生成します。
 * @class AudioBufferを使用してバイナリデータを再生する音源です。<br/>
 * 詳細はWebAudioAPIの仕様を参照してください。<br/>
 * wav, mp3などが再生可能ですが、ブラウザにより対応状況が異なります。
 * @param {String} id この音源のID
 */
snd.BufferSource = function(id) {
    snd.Source.apply(this, arguments);
    
    this._source = null;
    this.audioBuffer = null;
    this._key = "";
    
    Object.defineProperties(this, {
        loop: {
            get: function() {
                return this._status.loop;
            },
            set: function(loop) {
                this._source.loop = loop;
                this._status.loop = loop;
            }
        },
        loopStart: {
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
        onended: [],
        onload: []
    };
};
snd.BufferSource.prototype = Object.create(snd.Source.prototype);
snd.BufferSource.prototype.constructor = snd.BufferSource;

snd.BufferSource.CLASS_NAME = "snd.BufferSource";

/**
 * srcプロパティに設定された文字列がsnd.AUDIO_DATA_MANAGERのキー値かどうかを判定する際に使われる正規表現です。
 * @type RegExp
 */
snd.BufferSource.REGEX_KEY = /^key:(.*)$/;

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
    if (this._source != null && this.status == snd.status.STARTED) {
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

/**
 * 与えられたURLのデータを読込みます。<br/>
 * 
 * @param {String} url
 */
snd.BufferSource.prototype.loadURL = function(url) {
    var _this = this;
    
    this._status.src = url;
    
    this._key = snd.util.getNewKey(this.id);
    snd.AUDIO_DATA_MANAGER.add(this._key, url);
    snd.AUDIO_DATA_MANAGER.addOnLoadListener(this._key, function() {
        var audioBuffer = snd.AUDIO_DATA_MANAGER.getAudioBuffer(_this._key);
        _this.setAudioBuffer(audioBuffer);
        _this.fireOnLoadEvent();
    });
    snd.AUDIO_DATA_MANAGER.load(this._key);
};

/**
 * Base64文字列（DataURISchemeを含みます）を読み込みます。<br/>
 * 与えられた文字列がDataURISchemeの場合、srcプロパティに その文字列がそのまま設定されます。<br/>
 * そうでない場合は、与えられた文字列の頭に "data:audio/unknown;base64," を追加した文字列が src プロパティに設定されます。<br/>
 * DataURISchemeでない場合に文字列が追加されるのは、JSON.stringify でJSON文字列にした BufferSource オブジェクトを JSON.parse したオブジェクトを loadData メソッドで読み込む際に、srcがBase64文字列であることを認識させるためです。
 * @param {String} base64 Base64文字列（DataURISchemeを含む）
 */
snd.BufferSource.prototype.loadBase64 = function(base64) {
    var _this = this;
    
    if (snd.util.REGEX_DATA_URI_SCHEME.exec(base64) != null) {
        this._status.src = base64;
    } else {
        //@TODO Detect audio encodings automatically.
        this._status.src = "data:audio/unknown;base64," + base64;
    }
    
    this._key = snd.util.getNewKey(this.id);
    snd.AUDIO_DATA_MANAGER.addBase64(this._key, base64);
    snd.AUDIO_DATA_MANAGER.addOnLoadListener(this._key, function() {
        var audioBuffer = snd.AUDIO_DATA_MANAGER.getAudioBuffer(_this._key);
        _this.setAudioBuffer(audioBuffer);
        _this.fireOnLoadEvent();
    });
    snd.AUDIO_DATA_MANAGER.load(this._key);
};

/**
 * keyで指定されたキー値を使用して、snd.AUDIO_DATA_MANAGERからAudioBufferを読み込みます。
 * @param {type} key snd.AUDIO_DATA_MANAGERから読み込むデータのキー値
 */
snd.BufferSource.prototype.loadAudioBuffer = function(key) {
    this._status.src = "key:" + key;
    
    var buffer = snd.AUDIO_DATA_MANAGER.getAudioBuffer(key);
    this.setAudioBuffer(buffer);
    this.fireOnLoadEvent();
}

/**
 * AudioBufferを設定します。<br/>
 * このメソッドは、クラス内部で使用するためのものです。<br/>
 * 通常はloadAudioBufferメソッドを使用するようにし、このメソッドは使用しないでください。<br/>
 * src プロパティへの値の設定が行われないため、JSONを使用してオブジェクトを保存・読込みする際に正しく動作しなくなる可能性があります。
 * @param {AudioBuffer} audioBuffer 設定するAudioBuffer
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
    var res = this._eventListeners['onended'].indexOf(listener);
    if (res > 0) {
        this._eventListeners['onended'].splice(res);
        return true;
    }
    return false;
};

snd.BufferSource.prototype.fireOnEndedEvent = function() {
    var _this = this;
    
    var listeners = this._eventListeners['onended'];
    for (i = 0; i < listeners.length; i++) {
        listeners[i].onended(_this);
    }
};

/**
 * 渡されたイベントリスナーをこの音源のロード終了イベントのリスナーリストへ追加します。<br/>
 * 注意: ロード終了イベントを受け取るには、<b>loadURL メソッドや loadBase64 メソッドを実行する前にこのメソッドでイベントリスナーを設定する必要があります。<b>
 * @param {type} listener ロード終了イベント発生時に呼び出されるコールバックメソッド
 */
snd.BufferSource.prototype.addOnLoadEventListener = function(listener) {
    this._eventListeners['onload'].push(listener);
};

/**
 * 渡されたイベントリスナーをこの音源のロード終了イベントのリスナーリストから削除します。<br/>
 * 与えられたlistenerが見つかった場合、削除を行いtrueを返します。<br/>
 * 見つからなかった場合は、何もせずにfalseを返します。
 * @param {type} listener
 * @returns {Boolean} 削除が行われた場合True, 行われなかった場合 False
 */
snd.BufferSource.prototype.removeOnLoadEventListener = function(listener) {
    var res = this._eventListeners['onload'].indexOf(listener);
    if (res > 0) {
        this._eventListeners['onload'].splice(i, 1);
        return true;
    }
    return false;
};

snd.BufferSource.prototype.fireOnLoadEvent = function() {
    var _this = this;
    
    var listeners = this._eventListeners['onload'];
    for (i = 0; i < listeners.length; i++) {
        listeners[i].onload(_this);
    }
};

snd.BufferSource.prototype.resetEventMethods = function() {
    var _this = this;
    
    this._source.onended = function() {
        _this._status.status = snd.status.STOPPED;
        _this.fireOnEndedEvent();
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
    
    var isDataURI = snd.util.REGEX_DATA_URI_SCHEME.exec(data.src);
    var isAudioManagerKey = snd.BufferSource.REGEX_KEY.exec(data.src);
    if (isDataURI != null) {
        this.loadBase64(data.src);
    } else if (isAudioManagerKey != null) {
        this.loadAudioBuffer(isAudioManagerKey[1]);
    } else if (data.src) {  // data.src == URL
        this.loadURL(data.src);
    }
    
    if (data.loop == true) {
        this.loop = true;
    }
    this.loopStart = data.loopStart;
    this.loopEnd = data.loopEnd;
};

snd.BufferSource.loadJSON = function(json) {
    var data = JSON.parse(json);
    if (data.className != snd.BufferSource.CLASS_NAME) {
        throw new snd.Exception(data.id + " is not instance of 'snd.BufferSource' class.");
    }
    
    var ret = new snd.BufferSource("");
    ret.loadData(data);
    
    return ret;
};

/**
 * @class BufferSourceの設定値を保持するクラスです。<br/>
 * ループ関連の設定値や、音データのパスなどを保持します。
 * @property {Boolean} loop ループするか否か
 * @property {Float} loopStart ループ開始地点[秒]
 * @property {Float} loopEnd ループ終了地点[秒]
 * @property {String} src 音データのパス<br/>
 * 下記の表に基づいて、「URL」,「DataURIScheme」,「snd.AUDIO_DATA_MANAGERのキー値」のいずれかが設定されます。<br/>
 * <table>
 * <tr><th>種類</th><th>判定</th><th>例</th></tr>
 * <tr><td>DataURI</td><td>/^data:audio.*base64,.*$/</td><td>data:audio/mpeg:base64,…（BASE64文字列）…</td></tr>
 * <tr><td>snd.AUDIO_DATA_MANAGERのキー値</td><td>/^key:.*$/</td><td>key:…（snd.AUDIO_DATA_MANAGERのキー値）…</td></tr>
 * <tr><td>URL</td><td>上記に当てはまらない文字列</td><td>./sound/data.mp3</td></tr>
 * </table>
 */
snd.BufferSource.Status = function() {
    snd.Source.Status.apply(this, arguments);
    
    this.className = "snd.BufferSource";
    this.type = snd.srctype.AUDIO_BUFFER;
    this.loop = false;
    this.loopStart = null;
    this.loopEnd = null;
    this.src = "";
};

