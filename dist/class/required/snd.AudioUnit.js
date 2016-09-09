
/**
 * snd.js
 * 
 * The MIT License (MIT)
 * copyright (c) 2014 - 2015 N_H <h.10x64@gmail.com>
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
 
 

(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD
        define(['snd.AudioMaster'], factory);
    } else if (typeof exports === 'object') {
        // Node
    } else {
        // Browser globals (root is window)
        root.snd = factory(root.snd);
    }
}(this, function(snd) {
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
            className: {
                get: function() {
                    return this._status.className;
                }
            },
            isAudioUnit: {
                get: function() {
                    return this._status.isAudioUnit;
                }
            },
            id: {
                get: function() {
                    return this._status.id;
                }
            },
            connection: {
                get: function() {
                    var ret = [];
                    for (var i in this._status.connection) {
                        ret.push(this._status.connection[i]);
                    }
                    return ret;
                }
            },
            channelCount: {
                get: function() {
                    return this._status.channelCount;
                },
                set: function(val) {
                    this._output.channelCount = val;
                    this._connector.channelCount = val;
                    this._convolver.channelCount = val;
                    this._status.channelCount = val;
                }
            },
            channelCountMode: {
                get: function() {
                    return this._status.channelCountMode;

                },
                set: function(val) {
                    this._output.channelCountMode = val;
                    this._conector.channelCountMode = val;
                    this._convolver.channelCountMode = val;
                    this._status.channelCountMode = val;
                }
            },
            channelInterpretation: {
                get: function() {
                    return this._status.channelInterpretation;
                },
                set: function(val) {
                    this._output.channelInterpretation = val;
                    this._connector.channelInterpretation = val;
                    this._convolver.channelInterpretation = val;
                    this._status.channelInterpretation = val;
                }
            },
        });
    };

    /**
     * デフォルトの設定値(_status変数の値)を作るメソッドです。<br/>
     * snd.AudioUnit を継承するクラスはこのメソッドをオーバーライドしてください。<br/>
     * 戻り値は、snd.AudioUnit.Status を継承したクラスである必要があります。<br/>
     * @returns {snd.AudioUnit.Status} このクラスのデフォルト設定値
     */
    snd.AudioUnit.prototype.createStatus = function() {
        var desc = this.getParamDescription();

        var ret = {};
        for (var key in desc) {
          if (desc[key].default != null) {
            ret[key] = desc[key].default;
          }
        }

        ret.className = "snd.AudioUnit";
        ret.connection = [];

        return ret;
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
        if (Array.isArray(connectTo)) {
            for (var i in connectTo) {
              this.connect(connectTo[i], indexOut, indexIn, id);
            }
        } else if (connectTo.id != null || id != null) {
            var str = null;
            var connector = this.getOutputConnector();

            if (connector != null) {
                if (connectTo.id != null) {
                    str = connectTo.id;
                } else if (id != null) {
                    str = id;
                }
                str += "[" + ((indexOut != null) ? indexOut : "0") + ":" + ((indexIn != null) ? indexIn : "0") + "]";

                this._status.connection.push(str);

                if (typeof(connectTo.getConnector) == 'function') {
                    var conn = connectTo.getConnector();

                    if (conn == null) {
                        console.log(connectTo.id + " have not output node.");
                    } else {
                        connector.connect(connectTo.getConnector(), indexOut, indexIn, id);
                    }
                } else {
                    connector.connect(connectTo, indexOut, indexIn, id);
                }
            }
        }
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
        if (Array.isArray(disconnectFrom)) {
            for (var i in disconnectFrom) {
                this.disconnect(disconnectFrom[i], indexOut, id);
            }
        } else if (disconnectFrom.id != null || id != null) {
            var idx = -1;
            var str = "";
            var connector = this.getOutputConnector();

            if (connector != null) {
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

                if (typeof(disconnectFrom.getConnector) == 'function') {
                    var conn = disconnectFrom.getConnector();

                    if (conn == null) {
                        console.log(disconnectFrom.id + " have not input node.");
                    } else {
                        connector.disconnect(disconnectFrom.getConnector, indexOut, id);
                    }
                } else {
                    connector.disconnect(disconnectFrom, indexOut, id);
                }
            }
        }
    };

    /**
     * このオーディオユニットの入り口となる、ノードを返します。<br/>
     * snd.jsの内部で使用する他、AudioUnitクラスを既存のWebAudioAPIで作られたチェーンに組み込む場合などに使用されます。<br/>
     * このクラスを継承するクラスを作る場合、オーバーライドが必要です。
     * @return {AudioNode} このオーディオユニットの入り口となるノード。入力を受け付けない場合はundefined。
     */
    snd.AudioUnit.prototype.getConnector = function() {
        // PLEASE OVERRIDE ME
    };

    /**
     * このオーディオユニットの出口となる、connect/disconnectメソッドを持つオブジェクトを返します。<br/>
     * 主にsnd.jsの内部で使用するためのメソッドです。<br/>
     * (AudioUnitを既存のWebAudioAPIで作られたチェーンに組み込む場合はconnectメソッドを使用してください)<br/>
     * このクラスを継承するクラスを作る場合、オーバーライドが必要です。
     * @return {AudioNode} このオーディオユニットの出口となるノード。出力を行わない場合はundefined。
     */
    snd.AudioUnit.prototype.getOutputConnector = function() {
        // PLEASE OVERRIDE ME
    };

    /**
     * このオーディオユニットのAudioParam
     * @returns {HashMap} このオーディオユニットのAudioParamをまとめたハッシュマップ(キー:パラメータ名, 値: 定義情報)
     */
    snd.AudioUnit.prototype.getParamDescription = function() {
        // PLEASE OVERRIDE ME LIKE
        // var ret = snd.AudioUnit.prototype.getParamDescription.apply(this, arguments);
        // ret.theParameterYouAdded = {/* definition */};
        // return ret;
        var ret = {};

        /*
         * type: snd.params.type.READ_ONLY(読込み専用), snd.params.type.AUDIO_PARAM(AudioParamオブジェクト), snd.params.type.VALUE(値), snd.params.type.ENUM(列挙), snd.params.type.FUNCTION(関数)
         * default: デフォルト値
         * value: (typeがsnd.params.type.ENUMの場合) 値の配列
         * max: 最大値
         * min: 最小値
         * loader: データの読込みで使用される関数(function(obj, val){...}, obj:=値を設定する対象となるオブジェクト, val:=objに設定する値)
         */

        ret.className = {
          type: snd.params.type.READ_ONLY,
        };
        ret.isAudioUnit = {
          type: snd.params.type.READ_ONLY,
          default: true
        };
        ret.id = {
          type: snd.params.type.READ_ONLY,
          loader: function(obj, val) {
            obj._status.id = id;
          }
        };
        ret.connection = {
          type: snd.params.type.READ_ONLY,
          loader: function(obj, val) {
            obj._status.connection = val;
          }
        };
        ret.channelCount = {
          type: snd.params.type.VALUE,
          default: 2,
          max: snd.MAX_CHANNEL_COUNT,
          min: 1,
          loader: function(obj, val) {
            obj.channelCount = val;
          },
        };
        ret.channelCountMode = {
          type: snd.params.type.ENUM,
          value: [
            "max",
            "clamped-max",
            "explicit"
          ],
          default: "explicit",
          loader: function(obj, val) {
            obj.channelCountMode = val;
          },
        };
        ret.channelInterpretation = {
          type: snd.params.type.ENUM,
          value: [
            "speakers",
            "discrete"
          ],
          default: "speakers",
          loader: function(obj, val) {
            obj.channelCountMode = val;
          }
        };

        return ret;
    };

    /**
     * 引数で渡されたAudioParamに接続されたGainノードを作り、返します。<br/>
     * 返されるGainノードには、渡されたAudioParamが持つ各メソッドを移譲したメソッドが定義されます。<br/>
     * AudioUnit内部のノードで再生成が必要となった際、外部からのAudioParamへの接続を維持するために使われます。<br/>
     * AudioUnitを継承するクラスで使用するメソッドなので、外部からは使用しないでください。
     * @param {AudioParam} audioParam
     * @returns {Gain}
     */
    snd.AudioUnit.prototype.createParamGain = function() {
        var ret = snd.AUDIO_CONTEXT.createGain();
        ret._audioParams = [];

        Object.defineProperties(ret, {
            value: {
                set: function(val) {
                    for (var i in this._audioParams) {
                        this._audioParams[i].value = val;
                    }
                },
                get: function() {
                    if (this._audioParams.length <= 0) {
                        return undefined;
                    }

                    return this._audioParams[0].value;
                }
            },
            defaultValue: {
                get: function() {
                    if (this._audioParams.length <= 0) {
                        return undefined;
                    }

                    return this._audioParams[0].defaultValue;
                }
            }
        });

        ret.setValueAtTime = function(value, startTime) {
            for (var i in ret._audioParams) {
                ret._audioParams[i].setValueAtTime(value, startTime);
            }
        };
        ret.linearRampToValueAtTime = function(value, endTime) {
            for (var i in ret._audioParams) {
                ret._audioParams[i].linearRampToValueAtTime(value, endTime);
            }
        };
        ret.exponentialRampToValueAtTime = function(value, endTime) {
            for (var i in ret._audioParams) {
                ret._audioParams[i].exponentialRampToValueAtTime(value, endTime);
            }
        };
        ret.setTargetAtTime = function(target, startTime, timeConstant) {
            for (var i in ret._audioParams) {
                ret._audioParams[i].setTargetAtTime(target, startTime, timeConstant);
            }
        };
        ret.setValueCurveAtTime  = function(values, startTime, duration) {
            for (var i in ret._audioParams) {
                ret._audioParams[i].setValueCurveAtTime(values, startTime, duration);
            }
        };
        ret.cancelScheduledValues = function(startTime) {
            for (var i in ret._audioParams) {
                ret._audioParams[i].cancelScheduledValues(startTime);
            }
        };
        ret.addAudioParam = function(audioParam) {
            ret.connect(audioParam);

            ret._audioParams.push(audioParam);
        };
        ret.removeAudioParam = function(audioParam) {
            ret.disconnect(audioParam);

            var i = ret._audioParams.indexOf(audioParam);
            if (i >= 0) {
                ret._audioParams.splice(i, 1);
            }
        };

        return ret;
    };

    /**
     * JSON.stringifyで使用されるメソッドです。<br/>
     * このメソッドの戻り値がJSON.stringifyの出力に使用されます。
     * @returns {snd.AudioUnit.Status}
     */
    snd.AudioUnit.prototype.toJSON = function() {
        var status = {};
        var desc = this.getParamDescription();

        for (var key in desc) {
          var val = this[key];
          if (val == null && desc[key].default != null) {
            val = desc[key].default;
          }
          status[key] = val;
        }

        return status;
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
        try {
            var data = JSON.parse(json);
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
     * <br/>
     * このメソッドでは、getParamDescriptionメソッドで取得されるパラメータ定義情報を元にデータをロードしています。<br/>
     * getParamDescriptionメソッドの戻り値で、loaderプロパティにfunctionが設定されている場合のみ、そのプロパティを持つ定義情報のキーと同じキーのデータ値をloaderを使用して設定します。<br/>
     * 具体的な処理はソースを参照してください。<br/>
     *
     * @param {Object} data JSON文字列をパースした結果。
     * @throws {snd.AudioUnit.Exception} データロード中に不足データなどの例外が発生した場合
     */
    snd.AudioUnit.prototype.loadData = function(data) {
      var desc = this.getparamDescription();

      for (var key in desc) {
        if (data[key] != null && typeof(desc[key].loader) == "function") {
          desc[key].loader(this, data[key]);
        }
      }
    };

    /**
     * paramに渡されたAudioParamに所定のパラメータ・メソッドを追加して返します。<br/>
     * AudioUnitを継承するクラス内で使用される前提のメソッドですので、通常は使用しないようにしてください。<br/>
     * 追加されるものは以下の通りです。<br/>
     * <ul>
     *  <li>id プロパティ<br/>何のAudioParamであるかを表すID<br/>"osc0.volume"のように、AudioUnit.id + "." + subIDの形で使用されます。</li>
     *  <li>setScheduledValues メソッド<br/>このAudioParamの時間変化を設定するメソッド。</li>
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
                var currentTime = snd.CURRENT_TIME;
                _param.cancelScheduledValues(currentTime);

                for (var i = 0; i < settings.length; i++) {
                    var setting = settings[i];

                    if (setting.type == snd.LINER) {
                        _param.linearRampToValueAtTime(setting.value, currentTime + setting.time);
                    } else if (setting.type == snd.EXPONENTIALLY) {
                        _param.exponentialRampToValueAtTime(setting.value, currentTime + setting.time);
                    } else {
                        // DEFAULT: snd.audioparam.type.SET
                        _param.setValueAtTime(setting.value, currentTime + setting.time);
                    }
                }
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

    return snd;
}));
