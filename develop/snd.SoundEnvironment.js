/**
 * @class シミュレーションする音環境を表すクラスです。<br>
 * リスナーやユニットなどを管理します。<br>
 * さまざまなユニットは最終的にSoundEnvironment#connectAudioUnitメソッドを使って、実際の出力へ反映されるようになります。
 */
snd.SoundEnvironment = function() {
    this.id = 0;
    this.listener = snd.AUDIO_CONTEXT.listener;
    this.listenerList = {};
    this.unitList = {};
    
    this.createListener("DEFAULT");
};

/**
 * 新しいリスナを生成します。<br>
 * リスナーはこのクラスの内部でHashMapとして管理されるため、キー値を引数として渡す必要があります。<br>
 * 複数のリスナーを生成することもできますが、switchListenerメソッドでsnd.LISTENER定数を切り替えるまで実際の出力には影響を及ぼしません。
 * 
 * @param {String} key このリスナーを表すキー値
 * @returns {snd.Listener} 生成されたリスナー
 * @see snd.SoundEnvironment#switchListener
 */
snd.SoundEnvironment.prototype.createListener = function(key) {
    var listener = new snd.Listener();
    this.listenerList[key] = listener;
    return listener;
};

/**
 * リスナーを取得します。
 * @param {String} key
 * @returns {snd.Listener}
 * @see {snd.SoundEnvironment#switchListener}
 */
snd.SoundEnvironment.prototype.getListener = function(key) {
    return this.listenerList[key];
};

/**
 * keyで指定されたリスナーへsnd.LISTENER定数を切り替えます。<br>
 * このメソッドでリスナーを選択しない限り、snd.Listenerへ行った変更は実際の出力へ影響を与えません。<br>
 * snd.LISTENER定数の内容が選択されたリスナーへ変更されるため、(snd.LISTENER定数を使用する限り)多数のリスナーを次々と切り替えたとしても、
 * 常にユニークなリスナを使用することができます。<br>
 * @param {type} key 次の選択リスナーを表すキー値
 */
snd.SoundEnvironment.prototype.switchListener = function(key) {
    for (var k in this.listenerList) {
        this.listenerList[k].resetListener();
    }
    this.listenerList[key].setListener(this.listener);
    
    snd.LISTENER = this.listenerList[key];
};

/**
 * リスナーを削除します。
 * @param {String} key 削除するリスナー
 */
snd.SoundEnvironment.prototype.deleteListener = function(key) {
    if (snd.LISTENER == this.listenerList[key].listener) {
        this.listenerList.resetListener();
    }
    delete this.listenerList[key];
};

/**
 * 新しいユニットを接続します。<br>
 * 各種ユニットは、最終的にこのメソッドを使って実際の出力へ反映されます。
 * @param {type} key 接続するユニットを表すキー値
 * @param {snd.AudioUnit} audioUnit 接続するユニット
 */
snd.SoundEnvironment.prototype.connectAudioUnit = function(key, audioUnit) {
    this.unitList[key] = audioUnit;
    audioUnit.connect(snd.AUDIO_CONTEXT.destination);
};

/**
 * 接続済みのユニットを取得します。
 * @param {type} key
 */
snd.SoundEnvironment.prototype.getAudioUnit = function(key) {
    return this.unitList[key];
};

/**
 * 接続されたユニットを切断します。
 * @param {type} key 切断するユニット
 */
snd.SoundEnvironment.prototype.disconnectAudioUnit = function(key) {
    var audioUnit = this.unitList[key];
    audioUnit.getConnector().disconnect(snd.AUDIO_CONTEXT.destination);
    delete this.unitList[key];
};
