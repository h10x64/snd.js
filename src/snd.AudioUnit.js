/**
 * 新しいオーディオユニットを生成します。
 * @class 1つのオーディオユニットを定義する抽象クラスです。<br/>
 * 引数にAudioUnitを要求するメソッドに渡すオブジェクトは、ここで定義されている各メソッドを実装している必要があります。
 * @param id このオーディオユニットのID
 */
snd.AudioUnit = function(id) {
    this.isAudioUnit = true;
    this.id = id;
};

/**
 * このオーディオユニットをconnectToで指定されたオーディオユニットまたはノードに接続します。<br/>
 * @param {snd.AudioUnit} connectTo 接続するAudioUnit
 */
snd.AudioUnit.prototype.connect = function(connectTo) {
    // PLEASE OVERRIDE ME
};

/**
 * このオーディオユニットをdisconnectFromから切断します。
 * @param {snd.AudioUnit} disconnectFrom 切断するAudioUnit
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
 * 新しくボリュームユニットを生成します。
 * @param {String} id このユニットのID
 * @class 主ボリュームのみのもっとも単純なユニットです。<br/>
 * ボリュームの使用法については<a href="http://g200kg.github.io/web-audio-api-ja/#GainNode">web audio api仕様のGainNode</a>を参照してください。
 */
snd.GainOnlyUnit = function(id) {
    snd.AudioUnit.apply(this, arguments);
    this.gain = snd.AUDIO_CONTEXT.createGain();
};
snd.GainOnlyUnit.prototype = Object.create(snd.AudioUnit.prototype);
snd.GainOnlyUnit.prototype.constructor = snd.GainOnlyUnit;

/**
 * このユニットをconnectToに接続します。
 * @param {type} connectTo
 */
snd.GainOnlyUnit.prototype.connect = function(connectTo) {
    if (connectTo.isAudioUnit) {
        this.gain.connect(connectTo.getConnector());
    } else {
        this.gain.connect(connectTo);
    }
};

/**
 * このユニットをdisconnectFromから切断します。
 * @param {type} disconnectFrom
 */
snd.GainOnlyUnit.prototype.disconnect = function(disconnectFrom) {
    if (disconnectFrom.isAudioUnit) {
        this.gain.disconnect(disconnectFrom.getConnector());
    } else {
        this.gain.disconnet(disconnectFrom);
    }
}

/**
 * @see snd.AudioUnit#getConnector
 */
snd.GainOnlyUnit.prototype.getConnector = function() {
    return this.gain;
};

/**
 * メインボリュームを取得します。<br/>
 * @returns {snd.GainNode} this.gain
 */
snd.GainOnlyUnit.prototype.getGain = function() {
    return this.gain;
};

