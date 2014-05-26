#snd.js -The Sound Library for JavaScript with WebAudioAPI -#

WebAudioAPIを使用したJavaScriptのサウンドライブラリです。  
distフォルダに入っている*.jsファイルを使用してください。  
(srcフォルダにはビルド前のソースコードが入っています。)  

### 使い方

ドキュメントが未整備です。
当面の間はサンプルフォルダ以下にある各種サンプルを参考にしてください。

### 自分でビルドする時は

ビルドに以下のソフトを使用しています。  

* Node.js
* Grunt

上記ソフトをインストールした後、package.jsonなどのあるフォルダをカレントディレクトリにし、コンソールで

    npm install

を実行してください。
その後、

    grunt

を実行することでdistフォルダにjsファイルがビルドされます。

### 各ブラウザのWebAudioAPI対応状況

スマホを含めた各ブラウザのWebAudioAPI対応状況はCan I use Web Audio API?を参照してください。
<http://caniuse.com/audio-api>

### 課題・目標など

課題や、今後扱う目標などはGithubのIssuesを参照してください。  
<https://github.com/h10x64/snd.js/issues>

### ライセンス

The MIT License (MIT)
copyright (c) 2014 N_H <h.10x64@gmail.com>

