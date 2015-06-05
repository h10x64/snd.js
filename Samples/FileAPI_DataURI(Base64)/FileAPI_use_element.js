required(["snd.MediaElementAudioSource"], function(snd) {
    var fileOpenButton = null;
    var audioTagDiv = null;
    var mediaElementAudioNode = null;

    onLoad = function() {
        // オーディオタグを追加する親エレメント
        audioTagDiv = document.getElementById("audioTagDiv");

        // 生成する音源のデータセット（URLに空文字列を指定）
        var dataSet = {
            '音源ID': ""
        };
        // 音源を生成
        var createdSources = snd.util.createMediaElementAudioSources(dataSet, true, audioTagDiv);

        // 生成した音源を取得しておく
        mediaElementAudioNode = createdSources['音源ID'];

        // 音源のoncanplayイベントにリスナを追加
        mediaElementAudioNode.addOnCanPlayEventListener(function() {
            // 再生可能になったら再生開始
            mediaElementAudioNode.start();
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

                        // MediaElementAudioNodeのsrcにDataURI形式の文字列を設定
                        mediaElementAudioNode.src = data;

                        // ロード開始
                        mediaElementAudioNode.load();
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

