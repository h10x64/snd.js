(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD
        define(['snd.Source'], factory);
    } else if (typeof exports === 'object') {
        // Node
    } else {
        // Browser globals (root is window)
        root.snd = factory(root.snd);
    }
}(this, function(snd) {
    /**
     * 新しくストリーム音源を作ります。
     * @class 音声ストリームを音源として使用する音源クラスです。<br/>
     * WebRTCのGetUserMediaで取得したストリームを使用することができます。
     * @param {String} id この音源のID
     * @param {MediaStream} mediaStream 再生するデータストリーム<br/>
     * nullの場合、自動で(マイク入力やWebカメラなどの)ローカルのストリームを取得します。
     * @param {boolean} useAudio 自動でストリームを取得する場合に、そのストリームで音声入力を使うかどうかを設定します。<br/>
     * mediaStreamがnullの場合のみ使用される引数で、mediaStreamに値が設定されている場合は使用されません。
     * @param {boolean} useVideo 自動でストリームを取得する場合に、そのストリームでビデオ入力を使うかどうかを設定します。<br/>
     * mediaStreamがnullの場合のみ使用される引数で、mediaStreamに値が設定されている場合は使用されません。
     * @param {function} callback オブジェクトの生成に成功した時に呼び出されるコールバックメソッドです。(未設定可)<br/>
     * 呼び出される際は、引数として生成されたオブジェクトが渡されます。<br/>
     * mediaStreamがnullの場合のみ使用される引数で、mediaStreamに値が設定されている場合は使用されません。
     * @param {function} オブジェクトの生成に失敗した時に呼び出されるエラーコールバックです。(未設定可)<br/>
     * 呼び出される際は、getUserMediaメソッドから返されるエラーオブジェクトが渡されます。<br/>
     * mediaStreamがnullの場合のみ使用される引数で、mediaStreamに値が設定されている場合は使用されません。<br/>
     * 未設定の場合、コンソールへのログ出力のみ行います。
     * @memberOf snd
     */
    snd.MediaStreamAudioSource = function(id, mediaStream, useAudio, useVideo, callback, errorCallback) {
        snd.Source.apply(this, arguments);

        this._status.type = snd.srctype.MEDIA_STREAM;
        this._status.className = "snd.MediaStreamAudioSource";
        this._status.status = snd.status.NONE;
        
        if (!mediaStream) {
            var _this = this;
            var cb, ecb;
            cb = function(localMediaStream) {
                _this._stream = localMediaStream;
                _this._source = snd.AUDIO_CONTEXT.createMediaStreamSource(localMediaStream);
                _this._source.connect(_this._gain);
                _this._status.status = snd.status.READY;
                
                if (typeof(callback) == 'function') {
                    callback(_this);
                }
            };
            if (!errorCallback) {
                ecb = function(err) {
                    console.log("getUserMedia failed: " + err);
                };
            } else {
                ecb = errorCallback;
            }
            
            if (navigator.getUserMedia) {
                navigator.getUserMedia({audio:useAudio, video:useVideo}, cb, ecb);
            } else if (navigator.mozGetUserMedia) {
                navigator.mozGetUserMedia({audio:useAudio, video:useVideo}, cb, ecb);
            } else if (navigator.webkitGetUserMedia) {
                navigator.webkitGetUserMedia({audio:useAudio, video:useVideo}, cb, ecb);
            }
        } else {
            this._stream = mediaStream;
            this._source = snd.AUDIO_CONTEXT.createMediaStreamSource(mediaStream);
            this._source.connect(this._gain);
            this._status.status = snd.status.READY;
        }
        
        Object.defineProperties(this, {
            stream: {
                get: function() {
                    return this._stream;
                }
            }
        })
    };
    snd.MediaStreamAudioSource.prototype = Object.create(snd.Source.prototype);
    snd.MediaStreamAudioSource.prototype.constructor = snd.MediaStreamAudioSource;

    snd.MediaStreamAudioSource.prototype.createStatus = function() {
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
    
    return snd;
}));
