/**
 * @class バイナリデータを再生する音源です。<br/>
 * 詳細はWebAudioAPIの仕様を参照してください。<br/>
 * どのブラウザも、基本的にwav形式のファイルには対応していますが、mp3については対応状況がまばらです。<br/>
 * @param {String} id この音源のID
 */
snd.BufferSource = function(id) {
    snd.Source.apply(this, arguments);
    this.type = snd.srctype.AUDIO_BUFFER;
    this.status = snd.status.NONE;
    this.loop = false;
    this.loopStart = null;
    this.loopEnd = null;
    
    this.addEvent("onended", "Stop", function(_this){if (_this.status != snd.status.STOPPED) _this.status = snd.status.STOPPED;});
};
snd.BufferSource.prototype = Object.create(snd.Source.prototype);
snd.BufferSource.prototype.constructor = snd.BufferSource;

/**
 * この音源の再生を開始します。<br/>
 * v0.1時点では、途中で止める(AudioタグのPauseに相当)事はできません。<br/>
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
 * WebAudioAPIのBufferSourceと異なり、停止後も再度startメソッドを呼ぶことで何度でも再生が可能です。
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
 * オーディオバッファを設定するメソッドです。
 * @param {AudioBuffer} audioBuffer
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
 * ループの開始位置を設定します。
 * @param {double} when
 */
snd.BufferSource.prototype.setLoopStart = function(when) {
    if (this.source != null && when != null) {
        this.source.loopStart = when;
    }
    this.loopStart = when;
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

