/**
 * 新しいオーディオユニットを生成します。
 * @class 1つのオーディオユニットを定義する抽象クラスです。<br/>
 * 引数にAudioUnitを要求するメソッドに渡すオブジェクトは、ここで定義されている各メソッドを実装している必要があります。<br/>
 * パラメータ "_status" はオーディオユニットのパラメータをまとめたオブジェクトで、JSONを使って保存・読み込みする際に使用されます。<br/>
 * _status内の値はプロパティから取得できるようになっているので、直接_statusを使用しないようにしてください。
 * @param id このオーディオユニットのID
 */
snd.AudioUnit = function(id) {
    this._status = this.createStatus();
    
    this._status.id = id;
    this._status.className = "snd.AudioUnit";
    this._status.connection = [];
    
    Object.defineProperties(this, {
        isAudioUnit: {
            enumerable: true,
            get: function() {
                return this._status.isAudioUnit;
            }
        },
        id : {
            enumerable: true,
            get: function() {
                return this._status.id;
            }
        },
        connection : {
            enumerable: true,
            get: function() {
                var ret = Object.create(this._status.connection);
                return ret;
            }
        }
    });
};

/**
 * デフォルトの設定値(_status変数の値)を作るメソッドです。<br/>
 * snd.AudioUnit を継承するクラスはこのメソッドをオーバーライドしてください。<br/>
 * 戻り値は、snd.AudioUnit.Status を継承したクラスである必要があります。<br/>
 * @returns {snd.AudioUnit.Status} このクラスのデフォルト設定値
 */
snd.AudioUnit.prototype.createStatus = function() {
    // PLEASE OVERRIDE ME
    return new snd.AudioUnit.Status();
};

snd.AudioUnit.prototype.connect = function(connectTo) {
    this.connect(connectTo, connectTo.id);
};

/**
 * このオーディオユニットをconnectToで指定されたオーディオユニットまたはノードに接続します。<br/>
 * このメソッドを使って connectTo に接続した時に connection プロパティに connectTo.id が追加されます。<br/>
 * 引数 connectTo が id を持たない場合（connectTo.id == nullの場合）、connection プロパティには引数 id の値が追加されますので、 gain や frequency など、id を持たないパラメータへ接続する時は、引数 id に値を設定するようにしてください。<br/>
 * connectTo.id, id が両方とも null の場合は connection プロパティには何も追加されません。<br/>
 * このクラスを継承するクラスを作る場合、オーバーライドが必要です。(オーバーライドの際、apply必須)
 * @param {snd.AudioUnit} connectTo 接続するAudioUnit
 * @param {String} id connectTo.idがnullの場合に使用されるID
 */
snd.AudioUnit.prototype.connect = function(connectTo, id) {
    if (connectTo.id != null) {
        this._status.connection.push(connectTo.id);
    } else if (id != null) {
        this._status.connection.push(id);
    }
    
    // PLEASE OVERRIDE ME LIKE THIS
    // SubClass.prototype.connect = function(connectTo, bra, bra) {
    //     AudioUnit.prototype.connect.apply(this, arguments);
    // };
};

snd.AudioUnit.prototype.disconnect = function(disconnectFrom) {
    this.disconnect(disconnectFrom, disconnectForm.id);
};

/**
 * このオーディオユニットをdisconnectFromから切断します。<br/>
 * このメソッドを使って disconnectFrom との接続を切断した時、connection プロパティから disconnectFrom.id が削除されます。<br/>
 * 引数 disconnectFrom が id を持たない場合（disconnectFrom.id == nullの場合）、引数 id に設定された値が connection プロパティから削除されます。<br/>
 * connectTo.id, id が両方とも null の場合は connection プロパティからは何も削除されません。<br/>
 * このクラスを継承するクラスを作る場合、オーバーライドが必要です。(オーバーライドの際、apply必須)
 * @param {snd.AudioUnit} disconnectFrom 切断するAudioUnit
 * @param {String} id disconnectFrom.id が null の場合に使用されるID
 */
snd.AudioUnit.prototype.disconnect = function(disconnectFrom, id) {
    var i = -1;
    if (disconnectFrom.id != null) {
        i = this._status.connection.indexOf(disconnectFrom.id);
    } else if (id != null) {
        i = this._status.connection.indexOf(id);
    }
    
    if (i >= 0) {
        this._connection.splice(i, 1);
    }
    
    // PLEASE OVERRIDE ME LIKE THIS
    // SubClass.prototype.connect = function(connectTo, bra, bra) {
    //     AudioUnit.prototype.disconnect.apply(this, arguments);
    // };
};

/**
 * このオーディオユニットの入り口となる、connect/disconnectメソッドを持つオブジェクトを返します。<br/>
 * AudioUnitクラス、SoundEnvironmentクラスなどのオブジェクトが使用する他、
 * AudioUnitクラスを既存のWebAudioAPIで作られたチェーンに組み込む場合などに使用されます。<br/>
 * このクラスを継承するクラスを作る場合、オーバーライドが必要です。
 */
snd.AudioUnit.prototype.getConnector = function() {
    // PLEASE OVERRIDE ME
};

/**
 * JSON.stringifyで使用されるメソッドです。<br/>
 * このメソッドの戻り値がJSON.stringifyの出力に使用されます。
 * @returns {snd.AudioUnit.Status}
 */
snd.AudioUnit.prototype.toJSON = function() {
    return this._status;
};

/**
 * 引数jsonで渡された値をパースし、各種パラメータを設定します。<br/>
 * 接続先のリストは読み込みますが、このメソッドでは<strong>接続は行いません</strong>。<br/>
 * オーディオユニット同士のチェーンの再構築は別途実装が必要です。<br/>
 * このクラスを継承するクラスを作る場合、オーバーライドが必要です。(オーバーライドの際、apply必須)
 * 
 * @param {String} json 読み込むJSON文字列
 * @returns {snd.AudioUnit} jsonを内容を読み込んだAudioUnit
 */
snd.AudioUnit.prototype.fromJSON = function(json) {
    var data = JSON.parse(json);
    this._status.id = data["id"];
    this._status.connection = data["connection"];
    
    // PLEASE OVERRIDE ME LIKE THIS
    // SubClass.prototype.connect = function(connectTo, bra, bra) {
    //     AudioUnit.prototype.disconnect.apply(this, arguments);
    // };
};

/**
 * オーディオユニットの各種設定情報を保持するクラスです。
 */
snd.AudioUnit.Status = function() {
    this.isAudioUnit = true;
    this.id = "";
    this.className = "";
    this.connection = [];
};


