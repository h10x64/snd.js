
/**
 * snd.js
 * 
 * The MIT License (MIT)
 * copyright (c) 2014 N_H <h.10x64@gmail.com>
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 * 
 **/
 
 

/**
 * snd.jsで使用する外部jsファイルを読み込む関数です。<br/>
 * snd.initメソッド内で、定数値の初期化が終わったタイミングで呼び出されます。<br/>
 * htmlファイルにscriptタグをあらかじめ追加しておくのと内容的には同じです。
 * @param {type} callback
 * @returns {undefined}
 */
snd.using = function(callback){
    /**
     * クラス定義ファイルが格納されているディレクトリのパスを指定します。<br/>
     * 環境に合わせて書き換えてください。
     * @type String
     */
    var CLASS_DIR = "../../../dist/class/";
    
    /**
     * プラグインファイルが格納されているディレクトリのパスを指定します。<br/>
     * 環境に合わせて書き換えてください。
     * @type String
     */
    var PLUGIN_DIR = "../../../dist/plugins/";
    
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
        './optional/snd.WaveShaper.js'
    ];
    
    /**
     * snd.jsで使用するプラグインです。
     * 使いたいプラグインがある場合は、内容を書き換えてください。<br/>
     * "PLUGIN_DIR + PLUGIN[i]"にあるファイルを読み込みます。<br/>
     * @type Array
     */
    var PLUGIN = [
        './invalid/snd.invalid.js',
        './invalid/snd.invalid.Oscillator.js'
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
        document.head.appendChild(script);
        script.src = load[i];
        if (++i < len) {
            script.onload = appendScript;
        } else {
            script.onload = callback;
        }
    })();
};
