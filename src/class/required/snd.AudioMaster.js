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
     * コンストラクタは使用せず、snd.MASTERを使用してください。
     * @class ミキサークラスです。<br/>
     * snd.initメソッドでsnd.MASTERにインスタンスが生成されます。
     */
    snd.AudioMaster = function() {
        this.unitList = {};
        this._gain = snd.AUDIO_CONTEXT.createGain();
        this._gain.channelCount = snd.MAX_CHANNEL_COUNT;
        this._gain.connect(snd.AUDIO_CONTEXT.destination);
        this.id = snd.AudioMaster.ID;
    };

    snd.AudioMaster.ID = "snd.MASTER";

    /**
     * 新しくaudioUnitで指定されたユニットを接続します。
     * @param {type} key 接続するユニットを表すキー値
     * @param {snd.AudioUnit} audioUnit 接続するユニット
     */
    snd.AudioMaster.prototype.connectAudioUnit = function(key, audioUnit) {
        if (key == null && audioUnit.id == null) {
            throw "key == null && audioUnit.id == null";
        }

        if (key == null) {
            if (this.unitList[audioUnit.id] == null) {
                this.unitList[audioUnit.id] = audioUnit;
                audioUnit.connect(this._gain, snd.AudioMaster.ID);
            }
        } else {
            this.unitList[key] = audioUnit;
            audioUnit.connect(this._gain, snd.AudioMaster.ID);
        }
    };

    /**
     * 接続済みのユニットを取得します。
     * @param {String} key キー値
     */
    snd.AudioMaster.prototype.getAudioUnit = function(key) {
        return this.unitList[key];
    };

    /**
     * 接続されたユニットを切断します。
     * @param {String} key 切断するユニット
     */
    snd.AudioMaster.prototype.disconnectAudioUnit = function(key) {
        var audioUnit = this.unitList[key];
        audioUnit.getConnector().disconnect(this._gain);
        delete this.unitList[key];
    };

    snd.AudioMaster.prototype.getConnector = function() {
        return this._gain;
    };
    
    snd._MASTER = new snd.AudioMaster();

    return snd;
}));
