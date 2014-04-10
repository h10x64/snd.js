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

snd.SoundNode.start = function(when, offset, duration) {
    // PLEASE OVERIDE ME
};

snd.SoundNode.stop = function(when) {
    // PLEASE OVERRIDE ME
};

snd.SoundNode.pause = function() {
    // PLEASE OVERRIDE ME
};

/**
 * この音源の位置を設定します。
 * @param {type} x 設定する位置のX値
 * @param {type} y 設定する位置のY値
 * @param {type} z 設定する位置のZ値
 */
 snd.SoundNode.prototype.setPosition = function(x, y, z) {
    snd.PosDir.prototype.setPosition.call(this, x, y, z);
    this.pannerNode.setPosition(
            snd.SOUND_ENVIRONMENT.unit * this.pos.x,
            snd.SOUND_ENVIRONMENT.unit * this.pos.y,
            snd.SOUND_ENVIRONMENT.unit * this.pos.z);
};

/**
 * この音源の向きを設定します
 * @param {Number} x 正面方向ベクトルのX値
 * @param {Number} y 正面方向ベクトルのY値
 * @param {Number} z 正面方向ベクトルのZ値
 */
 snd.SoundNode.prototype.setDir = function(x, y, z) {
    snd.PosDir.prototype.setDir.call(this, x, y, z);
    this.pannerNode.setOrientation(this.dir.x, this.dir.y, this.dir.z);
};

/**
 * この音源の上向きベクトルを設定します。
 * @param {Number} x 上向きベクトルのX値
 * @param {Number} y 上向きベクトルのY値
 * @param {Number} z 上向きベクトルのZ値
 */
 snd.SoundNode.prototype.setUp = function(x, y, z) {
    snd.PosDir.prototype.setUp.call(this, x, y, z);
};

/**
 * この音源の向きを設定します
 * @param {Number} dx 正面方向ベクトルのX値
 * @param {Number} dy 正面方向ベクトルのY値
 * @param {Number} dz 正面方向ベクトルのZ値
 * @param {Number} ux 上方向ベクトルのX値
 * @param {Number} uy 上方向ベクトルのY値
 * @param {Number} uz 上方向ベクトルのZ値
 */
snd.SoundNode.prototype.setOrientation = function(dx, dy, dz, ux, uy, uz) {
    snd.PosDir.prototype.setOrientation.call(this, dx, dy, dz, ux, uy, uz);
    this.pannerNode.setOrientation(this.dir.x, this.dir.y, this.dir.z);
};

/**
 * この音源の速度を設定します。
 * @param {type} x 速度ベクトルのX値
 * @param {type} y 速度ベクトルのY値
 * @param {type} z 速度ベクトルのZ値
 */
 snd.SoundNode.prototype.setVelocity = function(x, y, z) {
    this.pannerNode.setVelocity(
            snd.SOUND_ENVIRONMENT.unit * x,
            snd.SOUND_ENVIRONMENT.unit * y,
            snd.SOUND_ENVIRONMENT.unit * z);
};


