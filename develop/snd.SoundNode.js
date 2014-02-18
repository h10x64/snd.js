 /**
  * @class PannerNodeを使用するパンニングに対応したユニットです。
  * @param {String} id このユニットを表す固有のID
  */
snd.SoundNode = function(id) {
    snd.GainOnlyUnit.apply(this, arguments);
    snd.PosDir.apply(this, arguments);
    
    this.pannerNode = snd.AUDIO_CONTEXT.createPanner();
    this.gain.connect(this.pannerNode);
};
snd.SoundNode.prototype = Object.create(snd.GainOnlyUnit.prototype);
snd.SoundNode.prototype.constructor = snd.SoundNode;

/**
 * @see snd.AudioUnit#connect
 */
snd.SoundNode.prototype.connect = function(connectTo) {
    if (connectTo.isAudioUnit) {
        this.pannerNode.connect(connectTo.getConnector());
    } else {
        this.pannerNode.connect(connectTo);
    }
};

/**
 * この音源の位置を設定します。
 * @param {type} x 設定する位置のX値
 * @param {type} y 設定する位置のY値
 * @param {type} z 設定する位置のZ値
 */
 snd.SoundNode.prototype.setPosition = function(x, y, z) {
    snd.PosDir.prototype.setPosition.call(this, x, y, z);
    this.pannerNode.setPosition(x, y, z);
};

/**
 * この音源の向きを設定します
 * @param {type} x 正面方向ベクトルのX値
 * @param {type} y 正面方向ベクトルのY値
 * @param {type} z 正面方向ベクトルのZ値
 */
 snd.SoundNode.prototype.setOrientation = function(x, y, z) {
    snd.PosDir.prototype.setOrientation.call(this, x, y, z);
    this.pannerNode.setOrientation(x, y, z);
};

/**
 * この音源の速度を設定します。
 * @param {type} x 速度ベクトルのX値
 * @param {type} y 速度ベクトルのY値
 * @param {type} z 速度ベクトルのZ値
 */
 snd.SoundNode.prototype.setVelocity = function(x, y, z) {
    this.pannerNode.setVelocity(x, y, z);
};


