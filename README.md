#snd.js -The Sound Library for JavaScript with WebAudioAPI -#

WebAudioAPIを使用したJavaScriptのサウンドライブラリです。  
distフォルダに入っている*.jsファイルを使用してください。  
(srcフォルダにはビルド前のソースコードが入っています。)  

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

### 変更点

バージョンを0.1に変更しました。  
ビルドツールにGruntを使用するようにし、ディレクトリの構成を変更しました。

### 課題・目標など

課題や、今後扱う目標などはGithubのIssuesを参照してください。  
<https://github.com/h10x64/snd.js/issues>

