require(["snd.OscillatorSource", "snd.BufferSource", "snd.TimeLine"], function(snd) {
    var bufBase = new snd.BufferSource("buf");
    var oscBase = new snd.OscillatorSource("osc");
    
    var dataURL = "../sound/01 Liftoff (Get High).wav";
    
    /**
     * ブラウザがページの読込みを終えたときに呼び出される関数
     */
    onLoad = function() {
        snd.AUDIO_DATA_MANAGER.add(dataURL, dataURL);
        snd.AUDIO_DATA_MANAGER.addAllDataLoadListener(function() {
            var timeLine = new snd.TimeLine("timeLine");
            var sources = [];
            
            for (var t = 0; t < 10; t += 1) {
                var source;
                
                if (t % 2 == 0) {
                    source = new snd.OscillatorSource(t + ":osc");
                } else {
                    source = new snd.BufferSource(t + ":src");
                    source.setAudioBuffer(snd.AUDIO_DATA_MANAGER.getAudioBuffer(dataURL));
                }
                
                source.connect(snd.MASTER);
                
                timeLine.addEvent(source, t, t + 0.5);
                sources.push(source);
            }
            
            window.timeLine = timeLine;
        });
        snd.AUDIO_DATA_MANAGER.load();
    };
    
    if (LOADED) {
        onLoad();
    } else {
        winow.onload = onLoad;
    }
});
