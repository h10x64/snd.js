snd.util = {};

/**
 * 
 * @param {HashMap} dataSet 音源のIDを読込むURLの配列 {ID1: "URL1", ID2: "URL2", ... IDn: "URLn"}
 * @param {function} func 読込みが終了し、音源の準備が完了した時に呼ばれるコールバック関数
 */
snd.util.createBufferSources = function(dataSet, func) {
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

    snd.AUDIO_DATA_MANAGER.addAllDataLoadListener(function() {
        var ret = {};
        
        for (var url in sourceMap) {
            for (var i = 0; i < sourceMap[url].length; i++) {
                sourceMap[url][i].setAudioBuffer(snd.AUDIO_DATA_MANAGER.getAudioBuffer(url));
                ret[sourceMap[url][i].id] = sourceMap[url][i];
            }
        }
        
        func(ret);
    });
    
    snd.AUDIO_DATA_MANAGER.load();
};

