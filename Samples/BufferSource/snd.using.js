
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
 
 

snd.using = function(callback){
    /**
     * クラスが定義されたjsファイルが配置されているベースディレクトリのURLを指定します。<br/>
     * snd.jsを使用する環境にあわせて書き換えてください。
     * @type String
     */
    var CLASS_PATH = "../../dist/class/";
    /**
     * snd.jsの必須クラスです。<br/>
     * 各ファイルが配置されているURLを指定します。<br/>
     * ("CLASS_PATH + REQUIRED[i]" にあるファイルを読みこみます。)
     * @type String
     */
    var REQUIRED = [
        './required/snd.Exception.js',
        './required/snd.AudioUnit.js',
        './required/snd.Source.js',
        './required/snd.AudioDataManager.js',
        './required/snd.AudioMaster.js'];
    /**
     * snd.jsで使用するクラスです。<br/>
     * 必須では無いので、要・不要に応じて編集してください。<br/>
     * 各ファイルが配置されているURLを指定します。<br/>
     * ("CLASS_PATH + OPTIONAL[i]" にあるファイルを読みこみます。)
     * @type String
     */
    var OPTIONAL = [
        './optional/snd.BufferSource.js'
    ];
    
    var load = REQUIRED.concat(OPTIONAL);
    var len = load.length;
    var i = 0;

    (function appendScript() {
        var script = document.createElement('script');
        script.src = CLASS_PATH + load[i];
        document.head.appendChild(script);
        if (++i < len) {
            script.onload = appendScript;
        } else {
            script.onload = callback;
        }
    })();
};
