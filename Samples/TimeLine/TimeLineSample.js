require(["Player", "snd.OscillatorSource", "snd.BufferSource", "snd.TimeLine"], function(Player, snd) {
    window.snd = snd;
    
    window.timeLine = new snd.TimeLine("timeLine");
    window.player = new Player(document.getElementById("player"), timeLine, 10);
    
    var bufBase = new snd.BufferSource("buf");
    var oscBase = new snd.OscillatorSource("osc");
    
    var dataURL = "../sound/01 Liftoff (Get High).wav";
    
    var loadData = function(callback) {
        snd.AUDIO_DATA_MANAGER.add("WAV_DATA", dataURL);
        snd.AUDIO_DATA_MANAGER.addAllDataLoadListener(callback);
        snd.AUDIO_DATA_MANAGER.load();
    };
    
    var onDataLoaded = function() {
        setupTimeLine();
    };
    
    var setupTimeLine = function() {
        var sources = [new snd.OscillatorSource("osc"), new snd.BufferSource("buf")];

        sources[1].loadAudioBuffer("WAV_DATA");

        for (var i in sources) {
            sources[i].connect(snd.MASTER);
        }

        for (var t = 0; t < 10; t += 1) {
            var source = sources[t % 2];
            
            var evt = new snd.TimeLineEvent(t + source.id, source, t, t + 0.5);
            
            // 通常snd.TimeLineEventはcolorプロパティを持たないが、表示の色を設定するために、ここで追加する
            evt.color = (t%2 == 0) ? "rgba(0, 255, 128, 0.3)" : "rgba(0, 128, 255, 0.3)";
            
            timeLine.push(evt);
        }
    };
    
    
    /**
     * ブラウザがページの読込みを終えたときに呼び出される関数
     */
    onLoad = function() {
        loadData(onDataLoaded);
    };
    if (LOADED) {
        onLoad();
    } else {
        winow.onload = onLoad;
    }
});
