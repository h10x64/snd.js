/**
 * @class 1つのオーディオユニットを定義するクラスです。
 *      インタフェースクラスなので、継承されることを前提としています。
 *      引数にAudioUnitを要求するメソッドに渡すオブジェクトは、ここで定義されている各メソッドを実装している必要があります。
 */
snd.AudioUnit = function(id) {
    this.isAudioUnit = true;
    this.id = id;
};

/**
 * このオーディオユニットをconnectToで指定されたオーディオユニットまたはノードに接続します。
 */
snd.AudioUnit.prototype.connect = function(connectTo) {
    // PLEASE OVERRIDE ME
};

/**
 * このオーディオユニットをdisconnectFromから切断します。
 */
snd.AudioUnit.prototype.disconnect = function(disconnectFrom) {
    // PLEASE OVERRIDE ME
};

/**
 * このオーディオユニットのconnect/disconnectメソッドを持つオブジェクトを返します。<br/>
 * AudioUnitクラス、SoundEnvironmentクラスなどのオブジェクトから呼び出されるメソッドですので、通常は
 * AudioUnit#connect/AudioUnit#disconnectメソッドを使用してください。
 */
snd.AudioUnit.prototype.getConnector = function() {
    // PLEASE OVERRIDE ME
};

/*** GAIN ONLY UNIT ***/

/**
 * @class 主ボリュームのみの単純なユニットです。
 * @extends snd.AudioUnit
 */
snd.GainOnlyUnit = function(id) {
    snd.AudioUnit.apply(this, arguments);
    this.gain = snd.AUDIO_CONTEXT.createGain();
};
snd.GainOnlyUnit.prototype = Object.create(snd.AudioUnit.prototype);
snd.GainOnlyUnit.prototype.constructor = snd.GainOnlyUnit;

/**
 * @see snd.AudioUnit#getConnector
 */
snd.GainOnlyUnit.prototype.connect = function(connectTo) {
    snd.AudioUnit.connect.apply(this, connectTo);
    this.gain.connect(connectTo);
};

snd.GainOnlyUnit.prototype.getConnector = function() {
    return this.gain;
};

/**
 * メインボリュームを取得します。
 *      ボリュームの使用法については<a href="http://g200kg.github.io/web-audio-api-ja/#GainNode">web audio api仕様のGainNode</a>を参照してください。
 * @returns {snd.GainNode} this.gain
 */
snd.GainOnlyUnit.prototype.getGain = function() {
    return this.gain;
};
