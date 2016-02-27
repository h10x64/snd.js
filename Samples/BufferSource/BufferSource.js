require(["snd.BufferSource", "snd.ScriptProcessor"], function(snd) {
    _snd_ = snd;
    
    /**
     * コードフェードイン時の音源オブジェクトのID
     * @type String
     */
    FADE_IN_SOUND_ID = "フェードイン_音源";

    /**
     * コードフェードアウト時の音源オブジェクトのID
     * @type String
     */
    FADE_OUT_SOUND_ID = "フェードアウト_音源";

    /**
     * ボタン1をクリックした時に出す音の音源オブジェクトのID
     * @type String
     */
    BUTTON1_SOUND_ID = "ボタン1_音源";


    /**
     * ボタン2をクリックした時に出す音の音源オブジェクトのID
     * @type String
     */
    BUTTON2_SOUND_ID = "ボタン2_音源";

    /**
     * コードフェードイン時に出す音のデータのURLです。
     * @type String
     */
    FADE_IN_SOUND_URL = "../sound/se_maoudamashii_system19.wav";

    /**
     * コードフェードアウト時に出す音のデータのURLです。
     * @type String
     */
    FADE_OUT_SOUND_URL = "../sound/se_maoudamashii_system23.wav";

    /**
     * ボタンが押されたとき出す音のデータのURLです。
     * @type String
     */
    BUTTON_SOUND_URL = "../sound/se_maoudamashii_onepoint26.wav";

// ブラウザがmp3形式のファイルに対応している場合はmp3にする。
    if (snd.DOES_MP3_SUPPORTED) {
        FADE_IN_SOUND_URL = "../sound/se_maoudamashii_system19.mp3";
        FADE_OUT_SOUND_URL = "../sound/se_maoudamashii_system23.mp3";
        BUTTON_SOUND_URL = "../sound/se_maoudamashii_onepoint26.mp3";
    }

    /**
     * 読込むデータをまとめた連想配列です。<br/>
     * 同じURLのデータは自動的に1つのAudioBufferにまとめられ、同じURLを持つBufferSourceで共有されます。
     * @type @exp;BUTTON_SOUND_URL 読込むデータをまとめた連想配列。 {データのID:データのURL}
     */
    SOUND_DATA_SETTINGS = {};
    SOUND_DATA_SETTINGS[FADE_IN_SOUND_ID] = FADE_IN_SOUND_URL; // フェードイン音
    SOUND_DATA_SETTINGS[FADE_OUT_SOUND_ID] = FADE_OUT_SOUND_URL; // フェードアウト音
    SOUND_DATA_SETTINGS[BUTTON1_SOUND_ID] = BUTTON_SOUND_URL; // ボタン1のクリック音
    SOUND_DATA_SETTINGS[BUTTON2_SOUND_ID] = BUTTON_SOUND_URL; // ボタン2のクリック音


    fadeIn = function() { /* ロード終了時にメイン関数内で書き換え */
    };
    fadeOut = function() { /* ロード終了時にメイン関数内で書き換え */
    };
    pushButton1 = function() { /* ロード終了時にメイン関数内で書き換え */
    };
    pushButton2 = function() { /* ロード終了時にメイン関数内で書き換え */
    };

    /**
     * ブラウザがページの読込みを終えたときに呼び出される関数
     */
    onLoad = function() {
        $("#code").toggle("fade");

        // カーソルを砂時計に変更
        window.document.body.style.cursor = "wait";

        /* 音源オブジェクトの作成 */
        // snd.utilの音源作成メソッドを呼び出します。
        // snd.util.createBufferSoundNode(連想配列{"音源データのID":"URL" ... }, ロード終了時に呼び出されるコールバック関数});
        snd.util.createBufferSources(SOUND_DATA_SETTINGS, true, function(_loadedData) {
            // _loadDataの内容: 連想配列{"音源データのID":音源オブジェクト}
            main(_loadedData); // メイン関数の呼出し
        });
    };

    /**
     * 音データのロード終了時に呼び出されるメイン関数
     */
    main = function(loadedData) {
        // 自動生成された音源オブジェクトを取得
        var buttonSound1 = loadedData[BUTTON1_SOUND_ID];
        var buttonSound2 = loadedData[BUTTON2_SOUND_ID];
        var fadeInSound = loadedData[FADE_IN_SOUND_ID];
        var fadeOutSound = loadedData[FADE_OUT_SOUND_ID];

        /* 取得した音データをマスタに接続 */
        buttonSound1.connect(snd.MASTER);
        buttonSound2.connect(snd.MASTER);
        fadeInSound.connect(snd.MASTER);
        fadeOutSound.connect([snd.MASTER]); // 配列も可

        /* 再生メソッドの書き換え */
        // コードフェードイン時に呼び出されるfadeinメソッドを書き換える
        fadein = function() {
            // フェードイン音の再生開始メソッドを実行
            fadeInSound.start();
        };

        // コードフェードアウト時に呼び出されるfedeoutメソッドを書き換える
        fadeout = function() {
            // フェードアウト音の再生開始メソッドを実行
            fadeOutSound.start();
        };

        // ボタン1クリック時に呼ばれるpushButton1メソッドを書き換える
        pushButton1 = function() {
            // ボタン1クリック音の音源オブジェクトを再生開始
            buttonSound1.start();
        };

        // ボタン2クリック時のメソッドも同じように書き換え
        pushButton2 = function() {
            // ボタン2クリック音の音源オブジェクトを再生開始
            buttonSound2.start();
        };

        // 最後にカーソルの形を元に戻します。おつかれさまでした。
        window.document.body.style.cursor = "default";
    };
    
    window.snd = snd;
    
    if (LOADED) {
        onLoad();
    } else {
        winow.onload = onLoad;
    }
});
