/**
 * @namespace three.jsプラグインでよく使う処理をまとめたネームスペース
 */
snd.three.util = {};

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
 */
snd.three.util.createNodes = function(dataSet, connectToMaster, element, func) {
    var ret = {};
    if (dataSet['MediaElement'] != null) {
        ret['MediaElement'] = snd.three.util.createMediaElementAudioNode(dataSet['MediaElement'], connectToMaster, element);
    } else {
        ret['MediaElement'] = false;
    }
    if (dataSet['AudioBuffer'] != null) {
        snd.three.util.createBufferSoundNodes(dataSet['AudioBuffer'], connectToMaster, function(res) {
            ret['AudioBuffer'] = res;
            func(ret);
        });
    } else {
        ret['AudioBuffer'] = null;
        func(ret);
    }
};

/**
 * three.jsプラグインで使用するためのバッファ音源を作成します。<br/>
 * dataSetに設定されたID, URLからデータを読み込み、音源の作成および設定を行います。<br/>
 * connectToMasterがtrueの場合は、snd.MASTERへの接続を同時に行います。<br/>
 * 音源の作成、設定、読み込みが終わるとfuncで設定されたコールバックメソッドが呼び出されます。<br/>
 * <br/>
 * dataSetの具体例を以下に例示します。<br/>
 * <br/>
 * dataSet = {<br/>
 *   'BufferNodeID01': './hoge/fuga/sound.wav',<br/>
 *   'BufferNodeID02': './hoge/fuga/data.wav'<br/>
 * };<br/>
 * 
 * @param {HashMap} dataSet 音源のIDとURLをまとめたデータセット
 * @param {boolean} connectToMaster 読み込み完了時にsnd.MASTERへ接続するかどうか
 * @param {function} func 読込みが終了し、音源の準備が完了した時に呼ばれるコールバック関数
 */
snd.three.util.createBufferSoundNodes = function(dataSet, connectToMaster, func) {
    snd.util.createBufferSources(dataSet, false, function(sources) {
        var ret = {};
        for (var id in sources) {
            ret[id] = new snd.BufferSoundNode(id, sources[id]);
            if (connectToMaster) {
                snd.MASTER.connectAudioUnit(ret[id].id, ret[id]);
            }
        }
        func(ret);
    });
};

/**
 * オーディオタグを使用してthree.jsプラグインで使用するための音源を作成します。<br/>
 * dataSetに設定されたID, URLを使用して、音源の作成および設定を行います。<br/>
 * connectToMasterがtrueの場合は、snd.MASTERへの接続を同時に行います。<br/>
 * 作成された&lt;audio&gt;タグはelementで指定したDOMエレメントへ追加されます。
 * <br/>
 * dataSetの具体例を以下に例示します。<br/>
 * <br/>
 * dataSet = {<br/>
 *   'MediaNodeID01': './hoge/fuga/sound.wav',<br/>
 *   'MediaNodeID02': './hoge/fuga/data.wav'<br/>
 * };<br/>
 * <br/>
 * 
 * @param {HashMap} dataSet 音源のIDと、データURLのハッシュマップ {ID1: "URL1", ID2: "URL2", ... IDn: "URLn"}
 * @param {boolean} connectToMaster 読み込み完了時にsnd.MASTERへ接続するかどうか
 * @param {type} element Audioタグを追加するDOMエレメント
 * @returns {HashMap}
 */
snd.three.util.createMediaElementSourceNodes = function(dataSet, connectToMaster, element) {
    var ret = {};
    
    var sources = snd.util.createMediaElementAudioSources(dataSet, connectToMaster, element);
    
    for (var id in sources) {
        ret[id] = new snd.MediaElementAudioNode(id, sources[id]);
        if (connectToMaster) {
            snd.MASTER.connectAudioUnit(ret[id].id, ret[id]);
        }
    }
    
    return ret;
}
