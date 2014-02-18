
/***  PROPERTIES ***/

/**
 * ブラウザから取得したオーディオコンテキストが入ります。
 *      snd#initメソッドが呼ばれるまで初期化されず、nullとなっている点に注意してください。
 * @type AudioContext
 */
snd.AUDIO_CONTEXT = null;
/**
 * シミュレーション上の聴取環境を管理するクラスのインスタンスが入ります。
 *      リスナーや音源の操作などはこのインスタンスを介して行います。
 * @type snd.SoundEnvironment 
 */
snd.SOUND_ENVIRONMENT = null;
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
    snd.SOUND_ENVIRONMENT.switchListener("DEFAULT");
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
        if (window.AudioContext) {
            // firefox
            snd.AUDIO_CONTEXT = new AudioContext();
        } else if (window.webkitAudioContext) {
            // crome etc
            snd.AUDIO_CONTEXT = new webkitAudioContext();
        }
    }
};
