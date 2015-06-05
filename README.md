#snd.js -The Sound Library for JavaScript with WebAudioAPI -#

## snd.jsについて

snd.jsはHTML5のWebAudioAPIを使用したJavaScriptを「楽に・簡単に・素早く」実装するためのライブラリです。  
MITライセンスですので、商用・非商用問わず、誰でも自由にご利用いただけます。  
  
↓のような簡易な記述で、あなたのサイト・Webアプリに音を追加することができます。  

```
<script src="./lib/snd.js"></script>
<script src="./lib/snd.using.js"></script>

<script>
    var SOUND_DATA_URL = {
        "Sound1": "./sound/Sound1.mp3",
        "Sound2": "./sound/Sound2.wav"
    }
 
    snd.onload = function() {
        // BufferSourceを生成して、再生の準備が整ったらコールバック関数を呼ぶ
        snd.util.createBufferSources(SOUND_DATA_URL, true, function(loadedSound) {
            // "Sound1" (./sound/Sound1.mp3)を再生
            loadedSound["Sound1"].start();
            // ボタンクリック音として"Sound2"(./sound/Sound2.wav)を設定する
            document.getElementById("button_with_sound").onclick = function() {
                // "Sound2" (./sound/Sound2.wav)を再生
                loadedSound["Sound2"].start();
            };
        });
    };

    window.onload = function() {
        // snd.js初期化
        snd.init();
    }
</script>
```

単純な効果音再生の他、プラグインを利用すればthree.jsと連動したリアルタイムの立体音響化エフェクトなどの付加機能が使用可能です。  
  
distフォルダにビルド済みのjsファイルが入っています。  
*.min.jsはuglifyした軽量版のjsファイルです。  
*.js, *.min.js共に内容は同じものですので、用途により使い分けてください。  

### 使い方・サンプル

Samplesフォルダに各種サンプルが含まれています。
また、<a href="http://sndjs.org/">サイト（sndjs.org）</a>にもサンプルがありますので、併せてご覧ください。

### 付属プラグイン

* snd.invalid.js  
HTMLにタグを追加します。  
jQueryから直接WebAudioAPIが叩けるようになる他、自作のクラスをHTMLのタグとして追加することも可能です。  
このプラグインで追加されたタグを使用すると、W3CのバリデータがInvalidを出力するようになるので注意してください。  

* snd.three.js  
three.jsへ対応するためのプラグインです。

* snd.encrypt.js  
サーバから送信するデータにユーザー情報で復号する暗号をかける事で、所定のアドレスへアクセスすれば音源データをダウンロードできる状態を避けます。

## 各ブラウザのWebAudioAPI対応状況

スマホを含めた各ブラウザのWebAudioAPI対応状況はCan I use Web Audio API?を参照してください。
<http://caniuse.com/audio-api>

## 自分でビルドする時は

ビルドに以下のソフトを使用しています。  

* Node.js
* Grunt

上記ソフトをインストールした後、package.jsonなどのあるフォルダをカレントディレクトリにし、コンソールで

    npm install

を実行してください。
その後、

    grunt

を実行することでdistフォルダにjsファイルがビルドされます。

## 課題・目標など

課題や、今後扱う目標などはGithubのIssuesを参照してください。  
<https://github.com/h10x64/snd.js/issues>

## ライセンス

The MIT License (MIT)
copyright (c) 2014 - 2015 N_H <h.10x64@sndjs.org>

