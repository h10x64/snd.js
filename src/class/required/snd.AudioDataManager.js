(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD
        define(['snd'], factory);
    } else if (typeof exports === 'object') {
        // Node
    } else {
        // Browser globals (root is window)
        root.snd = factory(root.snd);
    }
}(this, function(snd) {
    /**
     * コンストラクタは使用せず、snd.AUDIO_DATA_MANAGERを使用してください。<br/>
     * @class AudioBufferの管理を行うクラスです。<br/>
     * データの読み込みだけでなく、複数のAudioBufferのローディングを待機するときなどに使用してください。
     */
    snd.AudioDataManager = function() {
        /**
         * リクエストを格納するマップ<br>
         * {キー:XMLHttpRequest}
         */
        this._requests = {};
        /**
         * データを格納するマップ<br>
         * {キー:{data:AudioBuffer, doesLoaded:boolean}}
         */
        this._dataMap = {};
        /**
         * イベントの送り先を格納するマップ<br>
         * {キー:{onload:[function]}}
         */
        this._eventListeners = {};
        this._allLoadEventListeners = [];

        Object.defineProperties(this, {
            data: {
                get: function() {
                    var ret = {};
                    var keys = Object.keys(this._dataMap);
                    for (var i = 0; i < keys.length; i++) {
                        (function(obj, key, thisarg) {
                            var prop = {};
                            prop[key] = {
                                get: function() {
                                    return thisarg._dataMap[key].data;
                                }};
                            Object.defineProperties(obj, prop);
                        })(ret, keys[i], this);
                    }
                    return ret;
                }
            }
        });

    };

    /**
     * 全データの読み込みが完了したときに呼ばれるメソッドです。<br/>
     * イベントをリスナに送る際にこのオブジェクトの内部で使用されるメソッドなので、書き換えないようにしてください。<br/>
     * 全データの読み込みが完了したときに呼ばれるコールバック関数を設定したい場合、addAllDataLoadListenerメソッドを使用してください。
     */
    snd.AudioDataManager.prototype.onload = function() {
        for (var i = 0; i < this._allLoadEventListeners.length; i++) {
            this._allLoadEventListeners[i]();
        }
    };

    /**
     * 全データ読込み終了イベントのリスナへfuncで指定されたメソッドを追加します。
     * @param {type} func 全データの読込みが終了した際に呼び出されるメソッド。呼び出す時は引数なしでfunc()を実行します。
     */
    snd.AudioDataManager.prototype.addAllDataLoadListener = function(func) {
        this._allLoadEventListeners.push(func);
    };

    /**
     * 全データ読込み終了イベントのリスナからfuncで指定されたメソッドを削除します。
     * @param {type} func リストから外すメソッド
     * @returns {Boolean} 削除した場合はtrue, 削除しなかった場合はfalse
     */
    snd.AudioDataManager.prototype.removeAllDataLoadListener = function(func) {
        for (var i = 0; i < this._allLoadEventListeners.length; i++) {
            var f = this._allLoadEventListeners[i];
            if (f === func) {
                this._allLoadEventListeners.splice(i, 1);
                return true;
            }
        }
        return false;
    };

    /**
     * keyで指定されたAudioBufferの読込が終了した際に呼ばれるコールバック関数を設定します。<br/>
     * 全てのAudioBufferの読込が終了した時に呼ばれるコールバック関数を設定したい場合、snd.AudioDataManager.onloadをオーバーライドしてください。
     * @param {type} key AudioBufferをあらわすキー値
     * @param {function} func keyで指定されたAudioBufferの読込が終了した時点で呼び出されるコールバック関数
     * @see {snd.AudioDataManager.onload}
     */
    snd.AudioDataManager.prototype.addOnLoadListener = function(key, func) {
        if (this._eventListeners[key] == null) {
            this._eventListeners[key] = {
                onload: []
            };
        }
        this._eventListeners[key].onload.push(func);
    };

    /**
     * keyで指定されたAudioBufferの読込が終了した際に呼び出されるコールバック関数を削除します。<br/>
     * 指定されたkeyで追加されたコールバック関数がない場合、削除は行いません。
     * @param {type} key
     * @returns {undefined}
     */
    snd.AudioDataManager.prototype.removeOnLoadListener = function(key) {
        if (this._eventListeners[key] != null) {
            delete this._eventListeners[key];
            return true;
        }

        return false;
    };

    /**
     * keyで指定されたAudioBufferを取得します。
     * @param {type} key
     * @returns {AudioBuffer} 音データオブジェクト
     */
    snd.AudioDataManager.prototype.getAudioBuffer = function(key) {
        if (this._dataMap[key] != null) {
            return this._dataMap[key].data;
        } else {
            null;
        }
    };

    /**
     * keyがキー値となるAudioBufferを追加します。
     * @param {type} key 追加されるAudioBufferのキー値
     * @param {type} url 追加されるAudioBufferが読込むURL
     */
    snd.AudioDataManager.prototype.add = function(key, url) {
        var _this = this;
        this._dataMap[key] = {doesLoaded: false};

        var request = new XMLHttpRequest();
        request.open("GET", url, true);
        request.responseType = "arraybuffer";

        request.onload = function() {
            snd.AUDIO_CONTEXT.decodeAudioData(
                    request.response,
                    function(buf) {
                        _this._dataMap[key].data = buf;
                        _this._dataMap[key].doesLoaded = true;
                        _this.loaded(key, buf);
                    });
        };

        this._requests[key] = request;
    };

    /**
     * keyがキー値となるAudioBufferを追加します。<br/>
     * このメソッドはBase64形式のデータ文字列をAudioBufferにデコードして使用します。
     * @param {String} key キー値
     * @param {String} base64String Base64形式のデータ文字列
     **/
    snd.AudioDataManager.prototype.addBase64 = function(key, base64String) {
        var _this = this;
        this._dataMap[key] = {doesLoaded: false};

        var base64DataString = "";
        var matches = base64String.toLowerCase().match(/^data:audio.*base64,(.*)$/);
        if (matches) {
            base64DataString = matches[1];
        } else {
            base64DataString = base64String;
        }

        var data = atob(base64DataString);
        var dataArray = new ArrayBuffer(data.length);
        var dataBytes = new Uint8Array(dataArray);
        for (var i = 0; i < dataArray.byteLength; i++) {
            dataBytes[i] = data.charCodeAt(i) & 0xFF;
        }

        this._requests[key] = {};
        this._requests[key].send = function() {
            snd.AUDIO_CONTEXT.decodeAudioData(
                    dataArray,
                    function(buf) {
                        _this.loaded(key, buf);
                    });
        }
    };

    /**
     * 設定された全データのロードが完了しているかどうかを返します。
     * @returns {Boolean} 全データのロードが完了しているか否か
     */
    snd.AudioDataManager.prototype.doesAllDataLoaded = function() {
        for (var key in this._dataMap) {
            if (!this._dataMap[key].doesLoaded) {
                return false;
            }
        }
        return true;
    };

    /**
     * dataSetsで渡された全てのurlを追加します。<br/>
     * dataSetsには{キー:URL}となっているハッシュマップを渡してください。<br/>
     * キーが追加されるAudioBufferのキー値として使用され、URLがAudioBufferが読込むURLとして設定されます。<br/>
     * 渡されたURLが正規表現「/^data:audio.*base64,.*$/」とマッチする場合はDataURI文字列とし、base64の文字列部分をデータとして使用します。
     * <br/>
     * addAllを使用した時点ではまだ読込は開始されません。<br/>
     * データの読込を開始するには、load関数を使用する必要があります。
     * @param {HashMap} キー値と読み込むURLを指定したハッシュマップ
     * @see {snd.AudioDataManager.load}
     */
    snd.AudioDataManager.prototype.addAll = function(dataSets) {
        var keys = Object.keys(dataSets);
        for (var i = 0; i < keys.length; i++) {
            var key = keys[i];
            var uri = dataSets[key];
            if (uri != null) {
                var uriMatches = uri.match(/^data:audio.*base64,(.*)$/);
                if (uriMatches) {
                    var base64Data = uriMatches[1];
                    this.addBase64(key, base64Data);
                } else {
                    this.add(key, uri);
                }
            }
        }
    };

    /**
     * キーで指定されたデータをこのオブジェクトから削除します。
     * @param {type} key
     */
    snd.AudioDataManager.prototype.removeData = function(key) {
        if (this._requests[key] != null) {
            delete this._requests[key];
        }
        if (this._dataMap[key] != null) {
            delete this._dataMap[key];
        }
        if (this._eventListeners[key] != null) {
            delete this.eventLiteners[key];
        }
    }
    /**
     * keySetで指定された全てのデータをこのオブジェクトから削除します
     * @param {Array} keySet key文字列の配列
     */
    snd.AudioDataManager.prototype.removeAll = function(keySet) {
        for (var i = 0; i < keySet.length; i++) {
            removeData(keySet[i]);
        }
    }

    /**
     * keyで指定されたAudioBufferの読込を開始します。<br/>
     * 引数なし(またはkey==null)で、追加済みの全てのAudioBufferの読込を開始します。<br/>
     * 全てのデータの読込が終了した時点でonloadメソッドが呼ばれます。<br/>
     * (一つでも読込が終了していないAudioBufferがあるとonloadメソッドは呼ばれない点に注意してください。)<br/>
     * ある特定のAudioBufferに対して、読込終了時のコールバック関数を指定したい場合、setOnloadListenerメソッドを使用してください。
     * @param {String} key nullの場合全データロード
     * @see {snd.AudioDataManager.onload}
     * @see {snd.AudioDataManager.setOnloadListener}
     */
    snd.AudioDataManager.prototype.load = function(key) {
        if (!key) {
            var reqKeys = Object.keys(this._requests);
            for (var i = 0; i < reqKeys.length; i++) {
                var reqKey = reqKeys[i];
                if (this._dataMap[reqKey].doesLoaded == false) {
                    if (this._requests[reqKey].readyState == null || this._requests[reqKey].readyState < 2) {
                        this._requests[reqKey].send();
                    }
                }
            }
        } else {
            if (this._requests[key].readyState == null || this._requests[key].readyState < 2) {
                this._requests[key].send();
            }
        }
    };

    /**
     * keyで取得されるAudioBufferの読込が終了した際にsnd.AUDIO_CONTEXTから呼ばれるコールバック関数です。<br/>
     * AudioDataManagerが内部で使用するための関数なので、オーバーライドはしないでください。
     * @param {type} key 読み込みの終了したキー
     * @param {buffer} buf 読込んだバッファ
     */
    snd.AudioDataManager.prototype.loaded = function(key, buffer) {
        this._dataMap[key].data = buffer;
        this._dataMap[key].doesLoaded = true;
        if (this._eventListeners[key]) {
            for (var i = 0; i < this._eventListeners[key].onload.length; i++) {
                this._eventListeners[key].onload[i](buffer);
            }
        }

        for (var k in this._dataMap) {
            if (!this._dataMap[k].doesLoaded) {
                return;
            }
        }
        this.onload();
    };

    snd._AUDIO_DATA_MANAGER = new snd.AudioDataManager();

    return snd;
}));
