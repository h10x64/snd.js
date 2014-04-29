
/**
 * ブラウザから取得したオーディオコンテキストが入ります。<br/>
 * snd#initメソッドが呼ばれるまで初期化されず、nullとなっている点に注意してください。
 * @type AudioContext
 * @memberOf snd
 */
snd.AUDIO_CONTEXT = null;

/**
 * snd.jsのPAミキサーです。<br/>
 * 各種エフェクトや音源は、snd.Master.connectAudioUnitメソッドを使ってここに接続することで音が出力されるようになります。
 * @type snd.AudioMaster
 * @memberOf snd
 */
snd.MASTER = null;

/**
 * 音データの読み込みなどの管理を行うクラスです。
 * @type type
 * @memberOf snd
 */
snd.AUDIO_DATA_MANAGER = null;

/**
 * snd.jsを初期化します。
 * @memberOf snd
 */
snd.init = function() {
    snd.resetAudioContext();
    if (snd.SoundEnvironment != null) {
        snd.SOUND_ENVIRONMENT = new snd.SoundEnvironment();
    }
    snd.MASTER = new snd.AudioMaster();
    snd.AUDIO_DATA_MANAGER = new snd.AudioDataManager();
};

/**
 * オーディオコンテキストを初期化します。
 * snd#initメソッドから呼び出すためのメソッドですので、特別な理由が無い限り使用しないでください。
 * @private
 */
snd.resetAudioContext = function() {
    if (snd.AUDIO_CONTEXT == null) {
        // Create AudioContext
        if ('AudioContext' in window) {
            // firefox
            snd.AUDIO_CONTEXT = new AudioContext();
        } else if ('webkitAudioContext' in window) {
            // crome etc
            snd.AUDIO_CONTEXT = new webkitAudioContext();
        }
    }
};
