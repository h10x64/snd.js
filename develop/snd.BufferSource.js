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

