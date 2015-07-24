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
     * nullの場合、自動で音声ストリームを取得します。
     * @param {function} callback オブジェクトの生成に成功した時に呼び出されるコールバックメソッドです。(未設定可)<br/>
     * 呼び出される際は、引数として生成されたオブジェクトが渡されます。<br/>
     * mediaStreamがnullの場合のみ使用される引数で、mediaStreamに値が設定されている場合は使用されません。
     * @param {function} オブジェクトの生成に失敗した時に呼び出されるエラーコールバックです。(未設定可)<br/>
     * 呼び出される際は、getUserMediaメソッドから返されるエラーオブジェクトが渡されます。<br/>
     * mediaStreamがnullの場合のみ使用される引数で、mediaStreamに値が設定されている場合は使用されません。<br/>
     * 未設定の場合、コンソールへのログ出力のみ行います。
     * @memberOf snd
     */
    snd.MediaStreamAudioSource = function(id, mediaStream, callback, errorCallback) {
        snd.Source.apply(this, arguments);

        this._status.type = snd.srctype.MEDIA_STREAM;
        this._status.className = "snd.MediaStreamAudioSource";
        this._status.status = snd.status.NONE;
        
        if (!mediaStream) {
            var _this = this;
            var cb, ecb;
            cb = function(localMediaStream) {
                _this._source = new snd.MediaStreamAudioSource(id, localMediaStream);
                _this._source.connect(_this._gain);
                _this._status.status = snd.status.READY;
                
                if (callback) {
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
                navigator.getUserMedia({audio:true}, cb, ecb);
            } else if (navigator.mozGetUserMedia) {
                navigator.mozGetUserMedia({audio:true}, cb, ecb);
            } else if (navigator.webkitGetUserMedia) {
                navigator.webkitGetUserMedia({audio:true}, cb, ecb);
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
    
    return snd;
}));
