
/***  PROPERTIES ***/

/**
 * ブラウザから取得したオーディオコンテキストが入ります。
 *      snd#initメソッドが呼ばれるまで初期化されず、nullとなっている点に注意してください。
 * @type AudioContext
 */
snd.AUDIO_CONTEXT = null;

/**
 * シミュレーション上の聴取環境を管理するクラスのインスタンスが入ります。<br/>
 * @type snd.SoundEnvironment 
 */
snd.SOUND_ENVIRONMENT = null;
/**
 * snd.jsのPAミキサーです。<br/>
 * 各種エフェクトや音源は、snd.Master.connectAudioUnitメソッドを使ってここに接続することで音が出力されるようになります。
 * @type snd.AudioMaster
 */
snd.MASTER = null;
/**
 * 
 * @type type
 */
snd.AUDIO_DATA_MANAGER = null;

/**
 * 現在選択中のリスナーが入ります。
 *      リスナーは複数用意することが可能ですが、出力へ反映されるリスナは常に選択中の1つのみになっています。
 *      リスナーの追加や選択については、snd.SoundEnvironmentクラスを参照してください。
 * @type type
 * @see snd.SoundEnvironment
 */
snd.LISTENER = null;

/*** METHODS ***/

/**
 * snd.jsを初期化します。
 */
snd.init = function() {
    snd.resetAudioContext();
    snd.SOUND_ENVIRONMENT = new snd.SoundEnvironment();
    snd.MASTER = new snd.AudioMaster();
    snd.AUDIO_DATA_MANAGER = new snd.AudioDataManager();
};

/**
 * オーディオコンテキストを初期化します。
 *      snd#initメソッドから呼び出すためのメソッドですので、特別な理由が無い限り使用しないでください。
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
