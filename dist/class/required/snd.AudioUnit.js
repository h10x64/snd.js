
/**
 * snd.js
 * 
 * The MIT License (MIT)
 * copyright (c) 2014 N_H <h.10x64@gmail.com>
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 * 
 **/
 
 

snd.CLASS_DEF.push(function() {
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

        Object.defineProperties(this, {
            isAudioUnit: {
                enumerable: true,
                get: function() {
                    return this._status.isAudioUnit;
                }
            },
            id: {
                enumerable: true,
                get: function() {
                    return this._status.id;
                }
            },
            connection: {
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

    /**
     * このオーディオユニットをconnectToで指定されたオーディオユニットまたはノードに接続します。<br/>
     * <div>
     * このオーディオユニットが出力側となり、connectToで渡される接続先は入力側になります。<br/>
     * 出入力が複数ある場合、任意の出力を任意の入力に接続したい場合は、indexOut, indexIn で出入力の番号を指定します。<br/>
     * indexOut, indexInが両方とも指定されなかった場合は、メソッドを呼び出したオブジェクトの0番の出力を connectTo で渡されたオブジェクトの0番の入力に接続します。<br/>
     * ※indexOut, indexIn の番号の意味はオーディオユニットにより異なります。<br/>
     * </div>
     * <div>
     * このメソッドを使って connectTo に接続した時に connection プロパティに connectTo.id が追加されます。<br/>
     * 引数 connectTo が id を持たない場合（connectTo.id == nullの場合）、connection プロパティには引数 id の値が追加されますので、 gain や frequency など、id を持たないパラメータへ接続する時は、引数 id に値を設定するようにしてください。<br/>
     * connectTo.id, id が両方とも null の場合は connection プロパティには何も追加されません。<br/>
     * connection プロパティに追加される文字列は以下の書式にしたがいます。<br/>
     * <strong>"ID_String[INDEX_OUT:INDEX_IN]"</strong>
     * </div>
     * <div>
     * このクラスを継承するクラスを作る場合、オーバーライドが必要です。(オーバーライドの際、apply必須)
     * </div>
     * @param {snd.AudioUnit} connectTo 接続するAudioUnit
     * @param {Number} indexOut 接続する出力側のアウトプットのインデックス
     * @param {Number} indexIn 接続する入力側のインプットのインデックス
     * @param {String} id connectTo.idがnullの場合に使用されるID
     */
    snd.AudioUnit.prototype.connect = function(connectTo, indexOut, indexIn, id) {
        if (connectTo.id != null || id != null) {
            var str = null;
            if (connectTo.id != null) {
                str = connectTo.id;
            } else if (id != null) {
                str = id;
            }

            str += "[" + ((indexOut != null) ? indexOut : "0") + ":" + ((indexIn != null) ? indexIn : "0") + "]";

            this._status.connection.push(str);
        }

        // PLEASE OVERRIDE ME LIKE THIS
        // SubClass.prototype.connect = function(connectTo, bra, bra) {
        //     AudioUnit.prototype.connect.apply(this, arguments);
        // };
    };

    /**
     * このオーディオユニットをdisconnectFromから切断します。<br/>
     * このメソッドを使って disconnectFrom との接続を切断した時、connection プロパティから disconnectFrom.id が削除されます。<br/>
     * 引数 disconnectFrom が id を持たない場合（disconnectFrom.id == nullの場合）、引数 id に設定された値が connection プロパティから削除されます。<br/>
     * connectTo.id, id が両方とも null の場合は connection プロパティからは何も削除されません。<br/>
     * このクラスを継承するクラスを作る場合、オーバーライドが必要です。(オーバーライドの際、apply必須)
     * @param {snd.AudioUnit} disconnectFrom 切断するAudioUnit
     * @param {Number} indexOut 切断するAudioUnitの出力
     * @param {String} id disconnectFrom.id が null の場合に使用されるID
     */
    snd.AudioUnit.prototype.disconnect = function(disconnectFrom, indexOut, id) {
        if (disconnectFrom.id != null || id != null) {
            var idx = -1;
            var str = "";

            if (disconnectFrom.id != null) {
                str = disconnectFrom.id;
            } else if (id != null) {
                str = id;
            }

            str += "[" + ((indexOut != null) ? indexOut : "0");
            for (var i = 0; i < this._status.connection.length; i++) {
                if (this._status.connection[i].substring(0, str.length) === str) {
                    idx = i;
                    break;
                }
            }

            if (idx >= 0) {
                this._status.connection.splice(idx, 1);
            }
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
     * 引数で渡されたAudioParamに接続されたGainノードを作り、返します。<br/>
     * 返されるGainノードには、渡されたAudioParamが持つ各メソッドを移譲したメソッドが定義されます。<br/>
     * AudioUnit内部のノードで再生成が必要となった際、外部からのAudioParamへの接続を維持するために使われます。<br/>
     * AudioUnitを継承するクラスで使用するメソッドなので、外部からは使用しないでください。
     * @param {AudioParam} audioParam 
     * @returns {Gain} 
     */
    snd.AudioUnit.prototype.createParamGain = function(audioParam) {
        var ret = snd.AUDIO_CONTEXT.createGain();
        ret._audioParam = audioParam;
        ret.connect(ret._audioParam);
        
        Object.defineProperties(ret, {
            value: {
                set: function(val) {
                    ret._audioParam.value = val;
                },
                get: function() {
                    return ret._audioParam.value;
                }
            },
            defaultValue: {
                get: function() {
                    return ret._audioParam.defaultValue;
                }
            }
        });
        ret.setValueAtTime = function(value, startTime) {
            ret._audioParam.setValueAtTime(value, startTime);
        };
        ret.linearRampToValueAtTime = function(value, endTime) {
            ret._audioParam.linearRampToValueAtTime(value, endTime);
        };
        ret.exponentialRampToValueAtTime = function(value, endTime) {
            ret._audioParam.exponentialRampToValueAtTime(value, endTime);
        };
        ret.setTargetAtTime = function(target, startTime, timeConstant) {
            ret._audioParam.setTargetAtTime(target, startTime, timeConstant);
        };
        ret.setValueCurveAtTime  = function(values, startTime, duration) {
            ret._audioParam.setValueCurveAtTime(values, startTime, duration);
        };
        ret.cancelScheduledValues = function(startTime) {
            ret._audioParam.cancelScheduledValues(startTime);
        };
        
        ret.setAudioParam = function(audioParam) {
            ret.disconnect(ret._audioParam);
            ret._audioParam = audioParam;
            ret.connect(ret._audioParam);
        }
        
        return ret;
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
     * 接続先のリストは読み込みますが、このメソッドでは<strong>接続やイベントリスナの設定は行いません</strong>。<br/>
     * オーディオユニット同士のチェーンの再構築やイベントリスナの登録は別途で実装が必要です。<br/>
     * JSONの内容に不備があるなど、ロード中にエラーが発生した場合、snd.Exception 例外が throw されます。
     * 
     * @param {String} json 読み込むJSON文字列
     * @throws {snd.Exception} データ読込みでエラーが発生した場合
     */
    snd.AudioUnit.prototype.fromJSON = function(json) {
        var data = JSON.parse(json);

        try {
            this.loadData(data);
            this._status = data;
        } catch (e) {
            this._status = createStatus();
            throw e;
        }
    };

    /**
     * JSON文字列をパースしたデータオブジェクトを使って、このオブジェクトの各種設定値のロードを行います。<br/>
     * また、このメソッドはfromJSONメソッド内で呼び出されます。<br/>
     * このクラスを継承するクラスを作る場合、オーバーライドが必要です。(オーバーライドの際、apply必須)<br/>
     * オーバーライドする時は、toJSON メソッドで出力した内容を含むデータが渡される前提で作成し、不足などのエラーが発生した場合は snd.Exception クラスのオブジェクトを throw してください。
     * 
     * @param {Object} data JSON文字列をパースした結果。
     * @throws {snd.AudioUnit.Exception} データロード中に不足データなどの例外が発生した場合
     */
    snd.AudioUnit.prototype.loadData = function(data) {

        this._status.id = (data["id"] != null) ? data["id"] : "";
        this._status.connection = (data["connection"] != null) ? data["connection"] : [];
        this._status.channelCount = (data["channelCount"] != null) ? data["channelCount"] : 2;
        this._status.channelCountMode = (data["channelCountMode"] != null) ? data["channelCountMode"] : "max";
        this._status.channelInterpretation = (data["channelInterpretation"] != null) ? data["channelInterpretation"] : "discrete";


        // PLEASE OVERRIDE ME LIKE THIS
        // SubClass.prototype.connect = function(connectTo, bra, bra) {
        //     AudioUnit.prototype.loadData.apply(this, arguments);
        // };
    };
    
    /**
     * paramに渡されたAudioParamに所定のパラメータ・メソッドを追加して返します。<br/>
     * AudioUnitを継承するクラス内で使用される前提のメソッドですので、通常は使用しないようにしてください。<br/>
     * 追加されるものは以下の通りです。<br/>
     * <ul>
     *  <li>id プロパティ<br/>何のAudioParamであるかを表すID<br/>"osc0.volume"のように、AudioUnit.id + "." + subIDの形で使用されます。</li>
     *  <li>setScheduledValues メソッド<br/>このAudioParamの時間変化を設定するメソッド。<br/>詳細はsnd.util.setScheduledValuesメソッドの説明を参照してください。</li>
     * </ul>
     * @param {String} subID 何のAudioParamであるかを表すID
     * @param {AudioParam} param パラメータ等を追加するAudioParam 
     * @returns {AudioParam} 所定のパラメータ・メソッドを追加したparam
     */
    snd.AudioUnit.prototype.modAudioParam = function(subID, param) {
        if (!param.id) {
            var _param = param;

            param._id = this.id + "." + subID;

            Object.defineProperties(param, {
                id: {
                    get: function() {
                        return this._id;
                    }
                }
            });

            param.setScheduledValues = function(settings) {
                snd.util.setScheduledValues(_param, settings);
            };
        }
        return param;
    };

    /**
     * JSON.stringifyを使って出力した、AudioUnitオブジェクトのJSON文字列を読み込みます。
     * @param {String} json JSON文字列
     * @returns {snd.AudioUnit|snd.AudioUnit} jsonの内容を読み込んだsnd.AudioUnitオブジェクト 
     */
    snd.AudioUnit.loadJSON = function(json) {
        var ret = new snd.AudioUnit("");
        var data = JSON.parse(json);

        ret.loadData(data);

        return ret;
    };

    /**
     * オーディオユニットの各種設定情報を保持するクラスです。
     * @property {String} className このステータスを持つオブジェクトのクラス名
     * @property {Boolean} isAudioUnit このステータスを持つオブジェクトがsnd.AudioUnitクラスのメソッドを実装していることを表すブール値
     * @property {String} id このステータスを持つオブジェクトのID
     * @property {Array} connection このステータスを持つオブジェクトが接続しているオブジェクトのIDを格納する配列
     */
    snd.AudioUnit.Status = function() {
        this.className = "snd.AudioUnit";
        this.isAudioUnit = true;
        this.id = "";
        this.connection = [];

        this.channelCount = 2;
        this.channelCountMode = "max";
        this.channelInterpretation = "discrete";
    };
});

