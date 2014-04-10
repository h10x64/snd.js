snd.AudioMaster = function() {
    this.unitList = {};
    this.gain = snd.AUDIO_CONTEXT.createGain();
    
    this.gain.connect(snd.AUDIO_CONTEXT.destination);
};

/**
 * 新しいユニットを接続します。<br>
 * 各種ユニットは、最終的にこのメソッドを使って実際の出力へ反映されます。
 * @param {type} key 接続するユニットを表すキー値
 * @param {snd.AudioUnit} audioUnit 接続するユニット
 */
snd.AudioMaster.prototype.connectAudioUnit = function(key, audioUnit) {
    this.unitList[key] = audioUnit;
    audioUnit.connect(this.gain);
};

/**
 * 接続済みのユニットを取得します。
 * @param {type} key
 */
snd.AudioMaster.prototype.getAudioUnit = function(key) {
    return this.unitList[key];
};

/**
 * 接続されたユニットを切断します。
 * @param {type} key 切断するユニット
 */
snd.AudioMaster.prototype.disconnectAudioUnit = function(key) {
    var audioUnit = this.unitList[key];
    audioUnit.getConnector().disconnect(this.gain);
    delete this.unitList[key];
};
