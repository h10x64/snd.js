/**
 * よく使う処理をまとめたネームスペースです。
 * @namespace
 */
snd.util = {};

/**
 * 文字列がDataURIか否かを判定する際に使用される正規表現です。
 * @type RegExp
 */
snd.util.REGEX_DATA_URI_SCHEME = /^data:audio.*;base64,(.*)$/;

/**
 * 文字列がsnd.AUDIO_DATA_MANAGERのキー値か否かを判定する際に使用される正規表現です。
 * @type RegExp
 */
snd.util.REGEX_KEY = /^key:(.*)$/;

/**
 * dataSetで指定されたURLの音源をまとめて作成します。<br/>
 * connectToMasterがtrueに設定されていた場合、snd.MASTERへの接続が同時に行われます。<br/>
 * elementには&lt;Audio&gt;タグを追加するDOMエレメントを指定してください。<br/>
 * 全ての設定とAudioBufferの読み込みが終了すると、funcに設定されたコールバックメソッドが呼び出されます。<br/>
 * <br/>
 * 以下にdataSetの具体例を例示します。<br/>
 * <br/>
 * dataSet = {<br/>
 *   MediaElement: {'MediaSourceID01': './hoge/fuga/bgm1.wav', 'MediaSourceID02': './hoge/fuga/bgm2.mp3'},<br/>
 *   AudioBuffer: {'BufferSourceID01': './hoge/fuga/sound1.wav', 'BufferSourceID02': './hoge/fuga/sound2.mp3'}<br/>
 * };
 * 
 * @param {HashMap} dataSet 音源のIDとURLをまとめたデータセット
 * @param {boolean} connectToMaster snd.MASTERに接続するかどうか
 * @param {HTMLElement} element Audioタグを追加するDOMエレメント
 * @param {function} func コールバックメソッド
 * @memberOf snd.util
 */
snd.util.createSources = function(dataSet, connectToMaster, element, func) {
    var ret = {};
    
    if (dataSet['MediaElement'] != null) {
        ret['MediaElement'] = snd.util.createMediaElementAudioSources(dataSet['MediaElement'], connectToMaster, element);
    } else {
        ret['MediaElement'] = null;
    }
    
    if (dataSet['AudioBuffer'] != null) {
        snd.util.createBufferSources(dataSet['AudioBuffer'], connectToMaster, function(res) {
            ret['AudioBuffer'] = res;
            func(ret);
        });
    } else {
        ret['AudioBuffer'] = null;
        func(ret);
    }
};

/**
 * AudioBufferを使用した音源を複数作成するメソッドです。<br/>
 * 音源のIDとデータのURLをまとめたハッシュマップdataSetを渡すと、読み込み終了時に
 *コールバック関数funcが呼び出されます。<br/>
 * コールバック関数funcの引数には、BufferSourceクラスのオブジェクトをまとめたハッシュマップが渡されます。<br/>
 * このマップのキー値にはデータセットで設定したIDが使用され、データURLの内容を出力する音源がその値として入っています。<br/>
 * <br/>
 * また、connectToMasterをtrueに設定した場合、自動でsnd.MASTER.connectAudioUnitを実行します。<br/>
 * この場合、funcの中でBufferSourceオブジェクトのstartメソッドを使うだけで音が再生されるようになります。<br/>
 * 音源と出力の間にエフェクトを追加する必要が無い場合、connectToMasterをtrueに設定すると便利です。
 * 
 * @param {HashMap} dataSet 音源のIDと、データURLのハッシュマップ {ID1: "URL1", ID2: "URL2", ... IDn: "URLn"}
 * @param {boolean} connectToMaster 読み込み完了時にsnd.MASTERへ接続するかどうか
 * @param {function} func 読込みが終了し、音源の準備が完了した時に呼ばれるコールバック関数
 * @memberOf snd.util
 */
snd.util.createBufferSources = function(dataSet, connectToMaster, func) {
    if (!snd.BufferSource) {
        throw new snd.Exception("Please load snd.BufferSource.js");
    }
    
    var sourceMap = {};
    var urlMap = {};
    
    for (var id in dataSet) {
        var url = dataSet[id];
        if (sourceMap[url] == null) {
            sourceMap[url] = [];
        }
        
        var source = new snd.BufferSource(id);
        sourceMap[url].push(source);
    }
    
    for (var url in sourceMap) {
        urlMap[url] = url;
    }
    snd.AUDIO_DATA_MANAGER.addAll(urlMap);

    var callback = function() {
        var ret = {};
        
        for (var url in sourceMap) {
            for (var i = 0; i < sourceMap[url].length; i++) {
                sourceMap[url][i].loadAudioBuffer(url);
                ret[sourceMap[url][i].id] = sourceMap[url][i];
                
                if (connectToMaster) {
                    snd.MASTER.connectAudioUnit(sourceMap[url][i].id, sourceMap[url][i]);
                }
            }
        }
        
        snd.AUDIO_DATA_MANAGER.removeAllDataLoadListener(callback);
        func(ret);
    };
    
    snd.AUDIO_DATA_MANAGER.addAllDataLoadListener(callback);
    
    snd.AUDIO_DATA_MANAGER.load();
};

/**
 * Audioタグを使用した音源を複数作成するメソッドです。<br/>
 * 音源のIDとデータのURLをまとめたハッシュマップdataSetを渡すと、指定されたelementにAudioタグを追加し、
 *MediaElementAudioSourceクラスのオブジェクトを生成し、ハッシュマップにまとめて返します。<br/>
 * 戻値のキー値にはデータセットで設定したIDが使用され、src属性がdataSetで指定されたURLとなったAudioタグのエレメントが値として入ります。<br/>
 * <br/>
 * また、connectToMasterをtrueに設定した場合、自動でsnd.MASTER.connectAudioUnitを実行します。<br/>
 * この場合、funcの中でBufferSourceオブジェクトのstartメソッドを使うだけで音が再生されるようになります。<br/>
 * 音源と出力の間にエフェクトを追加する必要が無い場合、connectToMasterをtrueに設定すると便利です。
 * 
 * @param {HashMap} dataSet 音源のIDと、データURLのハッシュマップ {ID1: "URL1", ID2: "URL2", ... IDn: "URLn"}
 * @param {boolean} connectToMaster 読み込み完了時にsnd.MASTERへ接続するかどうか
 * @param {type} parentElem Audioタグを追加するDOMエレメント
 * @returns {HashMap}
 * @memberOf snd.util
 */
snd.util.createMediaElementAudioSources = function(dataSet, connectToMaster, parentElem) {
    if (!snd.MediaElementAudioSource) {
        throw new snd.Exception("Please load snd.MediaElementAudioSource.js");
    }
    
    var ret = {};
    
    for (var id in dataSet) {
        var audioElem;
        var docElem = document.getElementById(id);
        if (docElem == null) {
            audioElem = new Audio(id);
            parentElem.appendChild(audioElem);
        } else {
            audioElem = docElem;
        }
        
        if (dataSet[id] != null && dataSet[id] != "") {
            audioElem.src = dataSet[id];
        }
        
        var source = new snd.MediaElementAudioSource(id, audioElem);
        
        ret[id] = source;
        
        if (connectToMaster) {
            snd.MASTER.connectAudioUnit(id, source);
        }
    }
    
    return ret;
}

/**
 * 引数 prefix を使用したユニークなキー文字列を生成します。<br/>
 * 生成されるキー文字列のフォーマットは以下のとおりです。<br/>
 * prefix + (Date.getTime) + (Math.random 1000桁)
 * @param {String} prefix 生成する文字列の先頭に追加する文字列
 * @returns {String} 生成されたキー文字列
 */
snd.util.getNewKey = function(prefix) {
    return prefix + new Date().getTime().toString() + Math.floor(Math.random() * 1000);
}

/**
 * 与えられた文字列がDataURISchemeの文字列か否かを判定します。
 * @param {String} str 判定する文字列
 * @returns {Boolean} strがDataURIならTrue, そうでなければFalse
 */
snd.util.isDataURI = function(str) {
    return (snd.util.REGEX_DATA_URI_SCHEME.exec(str) != null);
};

/**
 * 与えられた文字列がDataURI文字列だった場合、そのデータ部を抽出して戻します。(バイト列へのパースは行いません)<br/>
 * 文字列がDataURIでは無かった場合は、undefinedを返します。
 * @param {type} str データ部を抽出するDataURI文字列
 * @returns {undefined}
 */
snd.util.stripDataURI = function(str) {
    var uriMatches = str.match(snd.util.REGEX_DATA_URI_SCHEME);
    if (uriMatches) {
        return uriMatches[1];
    } else {
        return undefiend;
    }
};

/**
 * 
 * @param {type} str
 * @returns {Boolean} strがsnd.AUDIO_DATA_MANAGERのキー値を表す文字列ならTrue, そうでなければFalse
 */
snd.util.isAudioManagerKey = function(str) {
    return (snd.util.REGEX_KEY.exec(str) != null);
};

/**
 * 与えられた文字列がsnd.AUDIO_DATA_MANAGERのキー値を表す文字列ならそのキー値を返します。(snd.AUDIO_DATA_MANAGER上にデータがあるかどうかは関係ありません。)<br/>
 * キー値を表す文字列でなければ、undefinedを返します。<br/>
 * 
 * @param {String} str キー値を取得する文字列
 * @returns {String} キー値
 */
snd.util.stripAudioManagerKey = function(str) {
    var keyMatches = uri.match(snd.util.REGEX_DATA_URI_SCHEME);
    if (keyMatches) {
        return keyMatches[1];
    } else {
        return undefiend;
    }
};

/**
 * オクターブと音高から周波数を計算します。<br/>
 * 周波数の基準はA4(440[Hz])です。<br/>
 * 音高の指定は0～12の値(実数)で行い、整数部が1増えるごとに半音上昇します。
 * @param {Number} octave オクターブ
 * @param {Number} pitch 音高(C=0, C#=1, ... B = )
 * @returns {Number} 周波数[hz]
 * @memberOf snd.util
 */
snd.util.noteToFrequency = function(octave, pitch) {
    return 440.0 * Math.pow(2.0, (12 * (octave - 4) + pitch - 9) / 12);
};

/**
 * テンポと音長から秒数を計算します。
 * @param {type} tempo テンポ(1分間に演奏する4分音符の個数)
 * @param {type} noteValue 音長 (全音符=1, 半音符=2, 四分音符=4, 八分音符=8, ... )
 * @returns {Number}
 * @memberOf snd.util
 */
snd.util.noteToSec = function(tempo, noteValue) {
    return 60.0 / (tempo * noteValue / 4);
};
