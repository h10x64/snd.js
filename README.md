# snd.js -The Sound Library for JavaScript with WebAudioAPI - #

## About

snd.js is the HTML5 WebAudioAPI Sounds Library.  
You can make Soundful-HTML5 with Fun, Easy, Rapidry.  
Ofcause, it's MIT licensed. Free!  
  
（日本語の説明は下部にあります）  
  
## Sample

You can make the ButtonClickSoundEffect like this ↓  

### Path

```
  ./
  ├ lib
  │  ├ sndjs
  │  │  ├ dist
  │  │  
  │  └ require.js
  ├ index.html
  ├ require.config.js
  └ SoundEffect.js
```

### index.html

```
  <html>
  <head>
    <script src="./require.config.js"></script>
    <script src="./lib/require.js" data-main="./SoundEffect.js"></script>
  </head>
  <body>
    <button id="snd1">sound1</button>
    <button id="snd2">sound2</button>
  </body>
```

### SoundEffect.js

```
require(["snd.BufferSource"], function(snd) {
  var SOUND_DATA_URL = {
      "Sound1": "./sound/Sound1.mp3",
      "Sound2": "./sound/Sound2.wav"
  }
 
  // Decode Sounds and create snd.BufferSource.
  snd.util.createBufferSources(
    SOUND_DATA_URL,           // Data URL
    true,                     // Connect to snd.MASTER automatically
    function(loadedSound) {   // Success callback

      /* Setup button click events. */

      // Play "Sound1"(./sound/Sound1.mp3) when #snd1 clicked.
      document.getElementById("snd1").onclick = function() {
          loadedSound["Sound1"].start();
      };

      // Play "Sound2"(./sound/Sound2.wav) when #snd2 clicked.
      document.getElementById("button_with_sound").onclick = function() {
          loadedSound["Sound2"].start();
      };

    }
  );
}
```

You can load snd.js with <script> tag, if you can't use require.js.   

## Can I use Web Audio API ? 

Please refer to <http://caniuse.com/audio-api>.  

## Install

### Requirement

* Bower

### How to

Simply, you can install snd.js with this command.  

```
  bower install sndjs --save
```

Bower installs snd.js to your "bower_components" directory.  
(Without pre-build sources)  

## Build

### Requirement

* Node.js
* Grunt

### How to

Please move current directory to the snd.js path.  

```
cd ./path/to/snd.js
```

And run "npm install".

```
npm install
```

Then you already to build with grunt.

```
grunt
```

## require.config.js

You can get require.config.js in "../snd.js/src/require.config.js"  
Please replace "%SND_BASE_URL%" to your "sndjs/dist" path.  

## License

The MIT License (MIT)  
copyright (c) 2014 - 2015 N_H <h.10x64@sndjs.org>  


## snd.jsについて

snd.jsは HTML5 の WebAudioAPI を使用したサウンドライブラリです。  
音声を使用したサイトやWebアプリなどを「楽しく・簡単に・素早く」作ることができます。  
MITライセンスの下で頒布していますので、商用を含めて自由にご利用いただけます。  
  
2種類のクリック音付きボタンは以下のような感じで作ることができます。  

### Path

```
  ./
  ├ lib
  │  ├ sndjs
  │  │  ├ dist
  │  │  
  │  └ require.js
  ├ index.html
  ├ require.config.js
  └ SoundEffect.js
```

### index.html

```
  <html>
  <head>
    <script src="./require.config.js"></script>
    <script src="./lib/require.js" data-main="./SoundEffect.js"></script>
  </head>
  <body>
    <button id="snd1">sound1</button>
    <button id="snd2">sound2</button>
  </body>
```

### SoundEffect.js

```
require(["snd.BufferSource"], function(snd) {
  var SOUND_DATA_URL = {
      "Sound1": "./sound/Sound1.mp3",
      "Sound2": "./sound/Sound2.wav"
  }
 
  // Decode Sounds and create snd.BufferSource.
  snd.util.createBufferSources(
    SOUND_DATA_URL,           // 読み込むURLをまとめたオブジェクト
    true,                     // snd.MASTER(AudioDestinationをラップしたノード)へ自動的に接続するか否か
    function(loadedSound) {   // コールバック

      /* ボタンクリックイベントを設定する */

      // #snd1がクリックされたら"Sound1"(./sound/Sound1.mp3)を再生する
      document.getElementById("snd1").onclick = function() {
          loadedSound["Sound1"].start();
      };

      // #snd1がクリックされたら"Sound2"(./sound/Sound2.wav)を再生する
      document.getElementById("button_with_sound").onclick = function() {
          loadedSound["Sound2"].start();
      };

    }
  );
}
```

もちろん、require.js が使えない場合は、シンプルに<script>タグを使ってライブラリを読み込む事も可能です。  

## ブラウザの対応状況について 

HTML5 の WebAudioAPI は一部のブラウザで未対応のものもあります。  
過去のバージョンも含め、対応状況については <http://caniuse.com/audio-api> を参照してください。  

## インストール

### 必要なもの

* Bower

### 方法

以下のコマンドを実行してください。  

```
  bower install sndjs --save
```

bower_components に snd.js を使用するのに必要なファイルがインストールされます。   
(ビルド前ソースなど、不要なものはインストールされません)  

## ビルド

### 必要なもの

* Node.js
* Grunt

### 方法

カレントディレクトリを snd.js へ移動します。  

```
cd ./path/to/snd.js
```

"npm install"を実行します。  

```
npm install
```

grunt を使う準備ができていますので、"grunt"でビルドします。  

```
grunt
```

## require.config.js について

require.js でパスの指定などに使う require.config.js が "../snd.js/src/require.config.js" にあります。  
"%SND_BASE_URL%" となっている箇所を、環境の "sndjs/dist" のパスに置換してお使いください。  

## 課題・目標など

課題や、今後扱う目標などはGithubのIssuesを参照してください。  
<https://github.com/h10x64/snd.js/issues>  

## ライセンス

The MIT License (MIT)  
copyright (c) 2014 - 2015 N_H <h.10x64@sndjs.org>
