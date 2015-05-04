/**
 * snd.jsで使用する外部jsファイルを読み込む関数です。<br/>
 * snd.initメソッド内で、定数値の初期化が終わったタイミングで呼び出されます。<br/>
 * htmlファイルにscriptタグをあらかじめ追加しておくのと内容的には同じです。
 * @param {type} callback
 */
snd.using = function(callback){
    /**
     * クラス定義ファイルが格納されているディレクトリのパスを指定します。<br/>
     * 環境に合わせて書き換えてください。
     * @type String
     */
    var CLASS_DIR = "http://lib.sndjs.org/class/";
    
    /**
     * プラグインファイルが格納されているディレクトリのパスを指定します。<br/>
     * 環境に合わせて書き換えてください。
     * @type String
     */
    var PLUGIN_DIR = "http://lib.sndjs.org/plugin/";
    
    /**
     * snd.jsの必須クラスです。<br/>
     * "CLASS_DIR + REQUIRED[i]"にあるファイルを読み込みます。<br/>
     * ファイル名やディレクトリ構成など、環境に合わせて書き換えてください。
     * @type Array
     */
    var REQUIRED = [
        './required/snd.Exception.js',
        './required/snd.AudioUnit.js',
        './required/snd.Source.js',
        './required/snd.AudioDataManager.js',
        './required/snd.AudioMaster.js'];
    
    /**
     * snd.jsで使用するクラスです。
     * この配列内のクラスは必須ではないので、要・不要に応じて内容を書き換えてください。<br/>
     * "CLASS_DIR + OPTIONAL[i]"にあるファイルを読み込みます。<br/>
     * @type Array
     */
    var OPTIONAL = [
        './optional/snd.Analyser.js',
        './optional/snd.BiquadFilter.js',
        './optional/snd.BufferSource.js',
        './optional/snd.Convolver.js',
        './optional/snd.Delay.js',
        './optional/snd.DynamicsCompressor.js',
        './optional/snd.Gain.js',
        './optional/snd.MediaElementAudioSource.js',
        './optional/snd.OscillatorSource.js',
        './optional/snd.ScriptProcessor.js',
        './optional/snd.Synth.js',
        './optional/snd.WaveShaper.js',
        './optional/snd.Noise.js',
        './optional/snd.VinylNoise.js'
    ];
    
    /**
     * snd.jsで使用するプラグインです。
     * 使いたいプラグインがある場合は、内容を書き換えてください。<br/>
     * "PLUGIN_DIR + PLUGIN[i]"にあるファイルを読み込みます。<br/>
     * @type Array
     */
    var PLUGIN = [
    ];
    
    var load = [];
    for (var i = 0; i < REQUIRED.length; i++) {
        load.push(CLASS_DIR + REQUIRED[i]);
    }
    for (var i = 0; i < OPTIONAL.length; i++) {
        load.push(CLASS_DIR + OPTIONAL[i]);
    }
    for (var i = 0; i < PLUGIN.length; i++) {
        load.push(PLUGIN_DIR + PLUGIN[i]);
    }
    var len = load.length;
    var i = 0;

    (function appendScript() {
        var script = document.createElement('script');
        document.body.appendChild(script);
        script.src = load[i];

        if (++i < len) {
            script.onload = appendScript;
        } else {
            script.onload = callback;
        }
    })();
};
