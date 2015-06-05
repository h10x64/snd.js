define(["snd.AudioMaster","snd.util","snd.Source"], function(snd) {
    /**
     * 新しくメディアタグを使用する音源を生成します。
     * @class HTMLのメディア要素（Audioタグなど）を音源として使用する音源クラスです。<br/>
     * 使用するタグに id が設定されている場合は、JSON.stringify メソッドを使用した際にその id が出力されるようになります。
     * @param {String} id この音源のID
     * @param {HTMLMediaElement} htmlMediaElement HTMLのメディアタグ要素
     * @memberof snd
     */
    snd.MediaElementAudioSource = function(id, htmlMediaElement) {
        snd.Source.apply(this, arguments);

        this.id = id;

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

        Object.defineProperties(this, {
            element: {
                get: function() {
                    return this._element;
                },
                set: function(elem) {
                    var _this = this;

                    this._source = snd.AUDIO_CONTEXT.createMediaElementSource(elem);
                    this._source.connect(this._gain);
                    this._element = elem;

                    if (this._element.id != null) {
                        this._status.element = this._element.id;
                    }

                    this._element.onplay = function() {
                        _this._status.status = snd.status.STARTED;
                        for (var i = 0; i < _this.listeners['onplay'].length; i++) {
                            _this.listeners['onplay'][i](_this);
                        }
                    };
                    this._element.onpause = function() {
                        _this._status.status = snd.status.PAUSED;
                        for (var i = 0; i < _this.listeners['onpause'].length; i++) {
                            _this.listeners['onpause'][i](_this);
                        }
                    };
                    this._element.onended = function() {
                        _this._status.status = snd.status.PAUSED;
                        for (var i = 0; i < _this.listeners['onended'].length; i++) {
                            _this.listeners['onended'][i](_this);
                        }
                    };
                    this._element.onabort = function() {
                        for (var i = 0; i < _this.listeners['onabort'].length; i++) {
                            _this.listeners['onabort'][i](_this);
                        }
                    };
                    this._element.oncanplay = function() {
                        if (_this.status == snd.status.NONE) {
                            _this._status.status = snd.status.READY;
                        }
                        for (var i = 0; i < _this.listeners['oncanplay'].length; i++) {
                            _this.listeners['oncanplay'][i](_this);
                        }
                    };
                    this._element.oncanplaythrough = function() {
                        for (var i = 0; i < _this.listeners['oncanplaythrough'].length; i++) {
                            _this.listeners['oncanplaythrough'][i](_this);
                        }
                    };
                    this._element.ondurationchange = function() {
                        for (var i = 0; i < _this.listeners['ondurationchange'].length; i++) {
                            _this.listeners['ondurationchange'][i](_this);
                        }
                    };
                    this._element.onemptied = function() {
                        for (var i = 0; i < _this.listeners['onemptied'].length; i++) {
                            _this.listeners['onemptied'][i](_this);
                        }
                    };
                    this._element.onerror = function() {
                        for (var i = 0; i < _this.listeners['onerror'].length; i++) {
                            _this.listeners['onerror'][i](_this);
                        }
                    };
                    this._element.onloadeddata = function() {
                        for (var i = 0; i < _this.listeners['onloadeddata'].length; i++) {
                            _this.listeners['onloadeddata'][i](_this);
                        }
                    };
                    this._element.onloadedmetadata = function() {
                        for (var i = 0; i < _this.listeners['onloadedmetadata'].length; i++) {
                            _this.listeners['onloadedmetadata'][i](_this);
                        }
                    };
                    this._element.onloadedstart = function() {
                        for (var i = 0; i < _this.listeners['onloadstart'].length; i++) {
                            _this.listeners['onloadstart'][i](_this);
                        }
                    };
                    this._element.onplaying = function() {
                        for (var i = 0; i < _this.listeners['onplaying'].length; i++) {
                            _this.listeners['onplaying'][i](_this);
                        }
                    };
                    this._element.onprogress = function() {
                        for (var i = 0; i < _this.listeners['onprogress'].length; i++) {
                            _this.listeners['onprogress'][i](_this);
                        }
                    };
                    this._element.onratechange = function() {
                        for (var i = 0; i < _this.listeners['onratechange'].length; i++) {
                            _this.listeners['onratechange'][i](_this);
                        }
                    };
                    this._element.onseeked = function() {
                        for (var i = 0; i < _this.listeners['onseeked'].length; i++) {
                            _this.listeners['onseeked'][i](_this);
                        }
                    };
                    this._element.onseeking = function() {
                        for (var i = 0; i < _this.listeners['onseeking'].length; i++) {
                            _this.listeners['onseeking'][i](_this);
                        }
                    };
                    this._element.onstalled = function() {
                        for (var i = 0; i < _this.listeners['onstalled'].length; i++) {
                            _this.listeners['onstalled'][i](_this);
                        }
                    };
                    this._element.onsuspend = function() {
                        for (var i = 0; i < _this.listeners['onsuspend'].length; i++) {
                            _this.listeners['onsuspend'][i](_this);
                        }
                    };
                    this._element.ontimeupdate = function() {
                        for (var i = 0; i < _this.listeners['ontimeupdate'].length; i++) {
                            _this.listeners['ontimeupdate'][i](_this);
                        }
                    };
                    this._element.onvolumechange = function() {
                        for (var i = 0; i < _this.listeners['onvolumechange'].length; i++) {
                            _this.listeners['onvolumechange'][i](_this);
                        }
                    };
                    this._element.onwaiting = function() {
                        for (var i = 0; i < _this.listeners['onwaiting'].length; i++) {
                            _this.listeners['onwaiting'][i](_this);
                        }
                    };
                }
            },
            src: {
                get: function() {
                    return this._element.src;
                },
                set: function(uri) {
                    this._element.src = uri;
                }
            }
        });

        if (htmlMediaElement != null) {
            this.element = htmlMediaElement;
        }
    };
    snd.MediaElementAudioSource.prototype = Object.create(snd.Source.prototype);
    snd.MediaElementAudioSource.prototype.constructor = snd.MediaElementAudioSource;

    snd.MediaElementAudioSource.CLASS_NAME = "snd.MediaElementAudioSource";

    /**
     * この音源の読み込みを開始します。
     */
    snd.MediaElementAudioSource.prototype.load = function() {
        this._element.load();
    };

    /**
     * この音源の再生を開始します。
     */
    snd.MediaElementAudioSource.prototype.start = function() {
        this._element.play();
    };

    /**
     * この音源を一時停止します。
     */
    snd.MediaElementAudioSource.prototype.pause = function() {
        this._element.pause();
    };

    /**
     * この音源を停止し、時刻を0へ戻します。
     */
    snd.MediaElementAudioSource.prototype.stop = function() {
        this._element.pause();
        this._element.currentTime = 0;
    };

    /**
     * この音源をループ再生するかどうかを設定します。<br/>
     * Audioタグを使用するため、ループ終点からループ始点に戻る速度がBufferSoundSourceと比較して遅く、間にブレイクが入る可能性があります。<br/>
     * なめらかにループしたい場合はBufferSoundSourceの使用を検討してください。
     * @param {type} doesLoop ループ再生するか否か
     */
    snd.MediaElementAudioSource.prototype.setLoop = function(doesLoop) {
        this._element.loop = doesLoop;
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

    snd.MediaElementAudioSource.prototype.createStatus = function() {
        return new snd.MediaElementAudioSource.Status();
    }

    snd.MediaElementAudioSource.prototype.toJSON = function() {
        return this._status;
    };

    snd.MediaElementAudioSource.prototype.loadData = function(data) {
        snd.Source.prototype.loadData.apply(this, arguments);

        if (data.element != null) {
            var elem = document.getElementById(data.element);
            if (elem != null) {
                this.element = elem;
            }
        }
    };

    snd.MediaElementAudioSource.loadJSON = function(json) {
        var data = JSON.parse(json);
        if (data.className != snd.MediaElementAudioSource.CLASS_NAME) {
            throw new snd.Exception(data.id + " is not instance of 'snd.MediaElementAudioSource' class.");
        }

        var ret = new snd.MediaElementAudioSource("");
        ret.loadData(data);

        return ret;
    };

    snd.MediaElementAudioSource.Status = function() {
        snd.Source.Status.apply(this, arguments);

        this.className = snd.MediaElementAudioSource.CLASS_NAME;
        this.status = snd.status.NONE;
        this.element = "";
    }
    snd.MediaElementAudioSource.Status.prototype = Object.create(snd.Source.Status.prototype);
    snd.MediaElementAudioSource.Status.prototype.constructor = snd.MediaElementAudioSource.Status;
    
    /* snd.util Methods */

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
    };
    
    return snd;
});


