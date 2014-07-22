/**
 * 音源を生成します。<br/>
 * typeプロパティはsnd.srctype.NONEに<br/>
 * statusプロパティはsnd.status.NONEに<br/>
 * それぞれ設定されます。
 * @class 各種音源クラスの親クラスとなる抽象クラスです。<br/>
 * start, stopなどの抽象メソッドは継承する子クラスで実装してください。
 * @param {String} id この音源のID
 */
snd.Source = function(id) {
    snd.AudioUnit.apply(this, arguments);
    
    this.isSource = true;
    
    this._gain = snd.AUDIO_CONTEXT.createGain();
    
    Object.defineProperties(this, {
        /**
         * @propertie {Boolean} このオブジェクトがsnd.Sourceクラスであることを表すブール値
         */
        isSource: {
            get: function() {
                return this._status.isSource;
            }
        },
        /**
         * @property {Float} このオブジェクトのメインボリュームの値
         */
        volume: {
            get: function() {
                return this._gain.gain.value;
            },
            set: function(val) {
                this._gain.gain.value = val;
                this._status.volume = val;
            }
        },
        /**
         * @property {snd.status} このオブジェクトの種類
         */
        type: {
            get: function() {
                return this._status.type;
            }
        },
        /**
         * @property {snd.status} このオブジェクトの状態
         */
        status: {
            get: function() {
                return this._status.status;
            }
        }
    });
};
snd.Source.prototype = Object.create(snd.AudioUnit.prototype);
snd.Source.prototype.constructor = snd.Source;

/**
 * 音源の再生を開始します。
 */
snd.Source.prototype.start = function() {
    // PLEASE OVERRIDE ME
};

/**
 * 音源の再生を停止します。
 */
snd.Source.prototype.stop = function() {
    // PLEASE OVERRIDE ME
};

/**
 * @deprecated このメソッドは削除予定です。<br/> volumeプロパティを使用するようにしてください。
 */
snd.Source.prototype.setGain = function(value) {
    this._gain.gain.value = value;
};

/**
 * @deprecated このメソッドは削除予定です。 volumeプロパティを使用するようにしてください。
 */
snd.Source.prototype.getGain = function(value) {
    return this._gain.gain.value;
};

/**
 * 詳細はAudioUnitクラスのconnectを参照してください。
 * @param {AudioUnit} connectTo 接続先
 */
snd.Source.prototype.connect = function(connectTo, id) {
    snd.AudioUnit.prototype.connect.apply(this, arguments);
    
    if (connectTo.isAudioUnit) {
        this._gain.connect(connectTo.getConnector());
    } else {
        this._gain.connect(connectTo);
    }
};

/**
 * 詳細はAudioUnitクラスのdisconnectFromを参照してください。
 * @param {AudioUnit} disconnectFrom 切断する接続先
 */
snd.Source.prototype.disconnect = function(disconnectFrom, id) {
    snd.AudioUnit.prototype.disconnect.apply(this, arguments);
    
    if (disconnectFrom.isAudioUnit) {
        this._gain.disconnect(disconnectFrom.getConnector());
    } else {
        this._gain.disconnect(disconnectFrom);
    }
};

/**
 * 詳細はAudioUnitクラスの createStatus を参照してください。
 * @return {snd.AudioUnit.Status} このオブジェクトのデフォルト設定値
 */
snd.Source.prototype.createStatus = function() {
    return new snd.Source.Status();
};

snd.Source.prototype.toJSON = function() {
    var ret = snd.AudioUnit.prototype.toJSON.apply(this, arguments);
    // volume プロパティを経由せずに _gain.gain.value に値が設定された場合
    // _status の volume には値が反映されないため、ここで改めて volume に値を設定
    ret.volume = this.volume;
    
    return ret;
};

snd.Source.prototype.loadData = function(data) {
    snd.AudioUnit.prototype.loadData.apply(this, arguments);
    
    this.volume = (data.volume != null) ? data.volume : 1.0;
};

/**
 * @class snd.Sourceクラスの設定値を保持するステータスクラスです。<br/>
 * 音源の種類、状態、ボリュームなどの情報を持ちます。
 * @property {Boolean} isSource このオブジェクトが snd.Source を継承する音源であることを表す値
 * @property {snd.srctype} type 音源の種類
 * @property {snd.status} status 状態
 * @property {Float} volume ボリューム
 */
snd.Source.Status = function() {
    snd.AudioUnit.Status.apply(this, arguments);
    
    this.isSource = true;
    this.type = snd.srctype.NONE;
    this.status = snd.status.NONE;
    this.volume = 1;
};
