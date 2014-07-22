#snd.js -The Sound Library for JavaScript with WebAudioAPI -#

### snd.jsについて

snd.jsはHTML5のWebAudioAPIを使用したJavaScriptを「楽に・簡単に・素早く」実装するためのライブラリです。
MITライセンスですので、商用・非商用問わず、誰でも自由にご利用いただけます。

↓のような簡易な記述で、あなたのサイト・Webアプリに音を追加することができます。

<script src="https://gist.github.com/h10x64/b85658bb7e773c46a1dd.js"></script>

単純な効果音再生の他、プラグインを利用すればthree.jsと連動したリアルタイムの立体音響化エフェクトなどの付加機能が使用可能です。

distフォルダにビルド済みのjsファイルが入っています。
*.min.jsはuglifyした軽量版のjsファイルです。
*.js, *.min.js共に内容は同じものですので、用途により使い分けてください。

### サンプル

Samplesフォルダに各種サンプルが含まれています。
また、<a href="http://sndjs.org/">サイト（sndjs.org）</a>にもサンプルがありますので、併せてご覧ください。

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
copyright (c) 2014 N_H <h.10x64@sndjs.org>

