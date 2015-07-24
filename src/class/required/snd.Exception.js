(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD
        define(['snd'], factory);
    } else if (typeof exports === 'object') {
        // Node
    } else {
        // Browser globals (root is window)
        root.snd = factory(root.snd);
    }
}(this, function(snd) {
    /**
     * コンストラクタです。<br/>
     * 引数 message にエラー内容を表す文字列を設定してください。
     * @class snd.jsで使用される例外クラスです。<br/>
     * JSON文字列からのデータロードなどで例外が発生した場合に使用されます。<br/>
     * @param {String} message エラー内容を表す文字列
     */
    snd.Exception = function(message) {
        this._message = message;

        Object.defineProperties(this, {
            message: {
                enumerable: true,
                get: function() {
                    return this._message;
                }
            }
        });
    };
    
    return snd;
}));
