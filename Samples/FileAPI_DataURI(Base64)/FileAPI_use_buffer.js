require(["snd.AudioBuffer"], function(snd) {

    var fileOpenButton = null;
    var bufferSoundNode = null;

    onLoad = function() {
        // バッファ音源を生成
        bufferSoundNode = new snd.BufferSource("音源");

        // 音源をマスタに接続
        snd.MASTER.connectAudioUnit(bufferSoundNode.id, bufferSoundNode);

        // オーディオデータマネージャの全データロード終了イベントを設定
        snd.AUDIO_DATA_MANAGER.addAllDataLoadListener(function() {
            // ロード済みのオーディオバッファを設定
            bufferSoundNode.setAudioBuffer(snd.AUDIO_DATA_MANAGER.getAudioBuffer("音源_データ"));
            // 再生開始
            bufferSoundNode.start();
        });

        fileOpenButton = document.getElementById("selectFile");
        fileOpenButton.addEventListener("change", function(evt) {
            var files = evt.target.files;
            if (files.length > 0) {
                if (!files[0].type.match("audio.*")) {
                    aleart("オーディオファイルを選択してください。");
                } else {
                    var fileReader = new FileReader();
                    fileReader.onloadend = function(evt) {
                        // 読み込んだデータ（DataURI形式）
                        var data = fileReader.result;

                        // 再生を停止
                        bufferSoundNode.stop();

                        // 同じIDのデータがあったら消す
                        snd.AUDIO_DATA_MANAGER.removeData("音源_データ");
                        // 読み込んだデータをオーディオデータマネージャに追加
                        snd.AUDIO_DATA_MANAGER.addBase64("音源_データ", data);
                        // 読み込み開始
                        snd.AUDIO_DATA_MANAGER.load();
                    };
                    fileReader.readAsDataURL(files[0]);
                }
            }
        }, false);
    };

    if (LOADED) {
        onLoad();
    } else {
        window.onload = onLoad;
    }
});
