snd.util = {};

/**
 * 複数ある音源からデータを読み込む場合に使用するためのクラスです。<br>
 * wait関数の代わりに使用してください。<br>
 * コンストラクタに渡されるオブジェクトのonloadメソッドが書き換えられるので注意してください。<br>
 * 
 * @param {snd.Sound} callerList ロードを待機したい音データのリスト
 */
snd.util.DataLoader = function(callerList) {
    var _this = this;
    
    this.callerList = callerList;
    this.loadLogger = [];
    for (var i in this.callerList) {
        var caller = callerList[i];
        caller.onload = function() {
            for (var i in _this.loadLogger) {
                if (_this.loadLogger[i].caller == this) {
                    _this.loadLogger[i].doesLoaded = true;
                    break;
                }
            }
            if (_this.doesAllDataLoaded()) {
                _this.onload();
            }
        };
        this.loadLogger.push({caller:caller, doesLoaded:false});
    }
};

/**
 * このDataLoaderに設定されている全ての音データのロードが完了したかどうかを返します。
 * 全データのロードが終了している場合はtrue、1つでも読込が終了していないデータがある場合はfalseを返します。
 * @returns {Boolean} 全てのデータの読込が終了しているかどうか
 */
snd.util.DataLoader.prototype.doesAllDataLoaded = function() {
    for (var i in this.loadLogger) {
        if (!this.loadLogger[i].doesLoaded) {
            return false;
        }
    }
    return true;
};

/**
 * このDataLoaderに設定されている全ての音データの読込が終了したときに呼び出されるメソッドです。
 * 
 * @returns {undefined}
 */
snd.util.DataLoader.prototype.onload = function() {
    // PLEASE OVERRIDE ME
};
