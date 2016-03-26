require(["Player", "EnvelopeViewer", "snd.Gain", "snd.OscillatorSource", "snd.BufferSource", "snd.TimeLine", "snd.Envelope"], function(Player, EnvelopeViewer, snd) {
    window.snd = snd;

    window.gain = new snd.Gain("gain");
    window.timeLine = new snd.TimeLine("timeLine");
    window.envelope = new snd.Envelope("volume", gain.gainParam);

    window.player = new Player(document.getElementById("player"), timeLine, 10);
    window.viewer = new EnvelopeViewer(document.getElementById("viewer"), envelope, 1, 0, 10, "#000", "#FFF", "#FFF");

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
        var sources = [new snd.OscillatorSource("osc"), new snd.OscillatorSource("osc")];
        timeLine.push(envelope);

        sources[0].frequency = 440;
        sources[1].frequency = 880;

        gain.connect(snd.MASTER);

        for (var i in sources) {
            sources[i].connect(gain);
        }

        for (var t = 0; t < 10; t += 1) {
            var source = sources[t % 2];

            var evt = new snd.TimeLineEvent(t + source.id, source, t, t + 0.5);
            evt.color = (t%2 == 0) ? "rgba(0, 255, 128, 0.3)" : "rgba(0, 128, 255, 0.3)";   // 通常snd.TimeLineEventはcolorプロパティを持たないが、表示の色を設定するために、ここで追加する
            timeLine.push(evt);

            envelope.push(new snd.TimeValue(t, (t / 2 % 2 <= 1) ? 0.1 : 1.0));
        }
    };


    /**
     * ブラウザがページの読込みを終えたときに呼び出される関数
     */
    onLoad = function() {
        // loadData(onDataLoaded);
        setupTimeLine();
    };
    if (LOADED) {
        onLoad();
    } else {
        winow.onload = onLoad;
    }
});
