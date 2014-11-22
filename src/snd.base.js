/**
 * snd.jsの基幹ネームスペースです。
 * @property {String} VERSION バージョン番号です。
 * @property {Boolean} IS_BETA ベータ版かどうかを表すブール値です。
 * @property {String} BLOWSER ブラウザ文字列です。
 * @property {Boolean} DOES_MP3_SUPPORTED ブラウザがmp3形式に対応しているかどうかを示すブール値です。
 * @property {Boolean} DOES_WAV_SUPPORTED ブラウザがpcm形式に対応しているかどうかを示すブール値です。
 * @property {Boolean} DOES_OGG_SUPPORTED ブラウザがogg形式に対応しているかどうかを示すブール値です。
 * @property {Boolean} DOES_AAC_SUPPORTED ブラウザがaac形式に対応しているかどうかを示すブール値です。
 * @property {Boolean} DOES_M4A_SUPPORTED ブラウザがm4a形式に対応しているかどうかを示すブール値です。
 * @property {String} srctype.NONE 使用される音源の種類が未定であることを表す値です。
 * @property {String} srctype.AUDIO_BUFFER 使用される音源の種類がAudioBufferNodeであることを表す値です。
 * @property {String} srctype.MEDIA_STREAM 使用される音源の種類がMediaStreamAudioSourceNodeであることを表す値です。
 * @property {String} srctype.MEDIA_ELEMENT 使用される音源の種類がMediaElementAudioSourceNodeであることを表す値です。
 * @property {String} srctype.OSCILLATOR 使用される音源の種類がOscillatorであることを表す値です。
 * @property {String} status.NONE 音源が未設定などの理由で、ステータスがまだ定まっていないことを表す値です。
 * @property {String} status.READY 音源の読込が終了するなどして、音源の再生が可能な状態になっていることを表す値です。
 * @property {String} status.STARTED 音源の再生が開始され、再生中であることを表す値です。
 * @property {String} status.PAUSED 音源の再生が中断し、停止中であることを表す値です。
 * @property {String} status.STOPPED 音源の再生が終了し、停止したことを表す値です。
 * @property {AudioContext} AUDIO_CONTEXT ブラウザから取得したオーディオコンテキストが入ります。<br/>
 * ※snd.initメソッドが呼ばれるまで初期化されず、nullとなっている点に注意してください。
 * @property {snd.AudioMaster} AUDIO_MASTER  snd.jsのPAミキサーです。<br/>
 * ※snd.initメソッドが呼ばれるまで初期化されず、nullとなっている点に注意してください。
 * @property {snd.AudioDataManager} AUDIO_DATA_MANAGER 音データの読み込みなどの管理を行うクラスです。<br/>
 * ※snd.initメソッドが呼ばれるまで初期化されず、nullとなっている点に注意してください。
 */
snd = {VERSION: "0.9_20141123", IS_BETA:true, ALIAS: "WIP_MinorSnow"};
