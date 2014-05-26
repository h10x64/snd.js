/**
 * snd.jsの基幹ネームスペースです。
 * @namespase
 */
snd = {VERSION: "62190", IS_BETA:true};

/**
 * ブラウザ名です
 * @type String
 */
snd.BLOWSER = window.navigator.userAgent.toLowerCase();

/**
 * 表示に使われているブラウザがmp3形式のAudioBufferに対応しているかどうかを表します
 * @type Boolean
 */
snd.DOES_MP3_SUPPORTED = false;
if (snd.BLOWSER.indexOf("chrome") != -1) {
    snd.DOES_MP3_SUPPORTED = true;
}

/**
 * 音源のステータスを表す値を入れるネームスペースです。
 * @memberOf snd
 * @namespace
 */
snd.status = {};
/**
 * 音源が未設定などの理由で、ステータスがまだ定まっていないことを表す値です。
 * @type String
 */
snd.status.NONE = "none";
/**
 * 音源の読込が終了するなどして、音源の再生が可能な状態になっていることを表す値です。
 * @type String
 */
snd.status.READY = "ready";
/**
 * 音源の再生が開始され、再生中であることを表す値です。
 * @type String
 */
snd.status.STARTED = "started";
/**
 * 音源の再生が中断し、停止中であることを表す値です。
 * @type String
 */
snd.status.PAUSED = "paused";
/**
 * 音源の再生が終了し、停止したことを表す値です。
 * @type String
 */
snd.status.STOPPED= "ended";

/**
 * 音源の種類をあらわす値を入れるネームスペースです。
 * @memberOf snd
 * @namespace
 */
snd.srctype = {};
/**
 * 使用される音源の種類が未定であることを表す値です。
 * @type String
 */
snd.srctype.NONE = "none";
/**
 * 使用される音源の種類がAudioBufferNodeであることを表す値です。
 * @type String
 */
snd.srctype.AUDIO_BUFFER = "AudioBuffer";
/**
 * 使用される音源の種類がMediaStreamAudioSourceNodeであることを表す値です。
 * @type String
 */
snd.srctype.MEDIA_STREAM = "MediaStream";
/**
 * 使用される音源の種類がMediaElementAudioSourceNodeであることを表す値です。
 * @type String
 */
snd.srctype.MEDIA_ELEMENT = "MediaElement";
/**
 * 使用される音源の種類がOscillatorであることを表す値です。
 * @type String
 */
snd.srctype.OSCILLATOR = "Oscillator";

snd.oscillatortype = {};
snd.oscillatortype.SINE = "sine";
snd.oscillatortype.SQUARE = "SQUARE";
snd.oscillatortype.SAWTOOTH = "SAWTOOTH";
snd.oscillatortype.TRIANGLE = "TRIANGLE";

snd.audioparam = {};
/**
 * オーディオパラメータの補間方法を指定する際に使用する定数をまとめた名前空間です。
 * @memberof snd
 * @namespace
 */
snd.audioparam.type = {};

snd.audioparam.type.SET = "Set";
snd.audioparam.type.LINER = "Liner";
snd.audioparam.type.EXPONENTIALLY = "Exponentially";

