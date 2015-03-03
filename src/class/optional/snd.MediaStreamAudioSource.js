snd.CLASS_DEF.push(function() {
    /**
     * 新しくストリーム音源を作ります。
     * @class 音声ストリームを音源として使用する音源クラスです。<br/>
     * WebRTCのGetUserMediaで取得したストリームを使用することができます。
     * @param {String} id この音源のID
     * @param {MediaStream} mediaStream 再生するデータストリーム<br/>
     * nullの場合、自動で音声ストリームを取得します。
     * @param {function} errorCallback mediaStreamがnullの場合に、getUserMediaで使用されるエラーコールバックです。<br/>
     * nullの場合、コンソールへのログ出力のみ行います。
     * @memberOf snd
     */
    snd.MediaStreamAudioSource = function(id, mediaStream, errorCallback) {
        snd.Source.apply(this, arguments);

        this._status.type = snd.srctype.MEDIA_STREAM;
        this._status.className = "snd.MediaStreamAudioSource";
        this._status.status = snd.status.NONE;
        
        if (!mediaStream) {
            var _this = this;
            var callback = function(localMediaStream) {
                _this._source = snd.AUDIO_CONTEXT.createMediaStreamSource(localMediaStream);
                _this._source.connect(_this._gain);
                _this._status.status = snd.status.READY;
            };
            var eCallback;
            if (!errorCallback) {
                eCallback = function(err) {
                    console.log("getUserMedia failed: " + err);
                };
            } else {
                eCallback = errorCallback;
            }
            
            if (navigator.getUserMedia) {
                navigator.getUserMedia({audio:true}, callback, eCallback);
            } else if (navigator.mozGetUserMedia) {
                navigator.mozGetUserMedia({audio:true}, callback, eCallback);
            } else if (navigator.webkitGetUserMedia) {
                navigator.webkitGetUserMedia({audio:true}, callback, eCallback);
            }
        } else {
            this._source = snd.AUDIO_CONTEXT.createMediaStreamSource(mediaStream);
            this._source.connect(this._gain);
            this._status.status = snd.status.READY;
        }
    };
    snd.MediaStreamAudioSource.prototype = Object.create(snd.Source.prototype);
    snd.MediaStreamAudioSource.prototype.constructor = snd.MediaStreamAudioSource;

    snd.MediaStreamAudioSource.prototype.createSource = function() {
        return new snd.MediaStreamAudioSource.Status();
    };

    snd.MediaStreamAudioSource.prototype.toJSON = function() {
        return this._status;
    };

    snd.MediaStreamAudioSource.prototype.loadData = function() {
        snd.Source.prototype.loadData.apply(this, arguments);
    };

    snd.MediaStreamAudioSource.Status = function() {
        snd.Source.Status.apply(this, arguments);

    };
    snd.MediaStreamAudioSource.prototype = Object.create(snd.Source.prototype);
    snd.MediaStreamAudioSource.prototype.constructor = snd.MediaStreamAudioSource;
});
