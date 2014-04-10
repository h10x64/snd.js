/**
 * @class 各種音源クラスの親クラスとなる抽象クラスです。
 * @param {String} id この音源のID
 */
snd.Source = function(id) {
    this.isSource = true;
    this.gain = snd.AUDIO_CONTEXT.createGain();
    this.id = id;
    this.type = snd.srctype.NONE;
    this.status = snd.status.NONE;
    
    this.listeners = {};
    this.sourceEventNames = [];
};

/**
 * 音源の再生を開始します。
 */
snd.Source.prototype.start = function() {
    // PLEASE OVERRIDE ME
};

/**
 * 音源の再生を停止します。
 */
snd.Source.prototype.stop = function() {
    // PLEASE OVERRIDE ME
};

/**
 * 詳細はAudioUnitクラスのconnectを参照してください。
 * @param {type} connectTo 接続先
 */
snd.Source.prototype.connect = function(connectTo) {
    if (connectTo.isAudioUnit) {
        this.gain.connect(connectTo.getConnector());
    } else {
        this.gain.connect(connectTo);
    }
};

/**
 * 詳細はAudioUnitクラスのdisconnectFromを参照してください。
 * @param {type} disconnectFrom 切断する接続先
 */
snd.Source.prototype.disconnect = function(disconnectFrom) {
    if (disconnectFrom.isAudioUnit) {
        this.gain.disconnect(disconnectFrom);
    } else {
        this.gain.disconnect(disconnectFrom);
    }
};

snd.Source.prototype.addEvent = function(sourceEventName, eventName, additionalMethod) {
    var _this = this;
    this[sourceEventName] = function() {
        if (additionalMethod != null) {
            additionalMethod(_this);
        }
        if (_this.listeners[eventName] != null) {
            for (var i = 0; _this.listeners[eventName].length; i++) {
                _this.listeners[eventName][i]["on" + eventName](_this);
            }
        }
    };
    if (this.sourceEventNames.indexOf(sourceEventName)) {
        this.sourceEventNames.push(sourceEventName);
    }
    this.listeners[eventName] = [];
    this["add" + eventName + "EventListener"] = function(listener) {
        _this.listeners[eventName].push(listener);
    };
    this["remove" + eventName + "EventListener"] = function(listener) {
        var i = _this.listeners[eventName].indexOf(listener);
        if (i < 0) {
            return false;
        } else {
            _this.listeners[eventName].splice(i, 1);
        }
    };
};

snd.Source.prototype.setEventMethod = function(src) {
    for (var i = 0; i < this.sourceEventNames.length; i++) {
        src[this.sourceEventNames[i]] = this[this.sourceEventNames[i]];
    }
};

snd.Source.prototype.resetEventMethod = function(src) {
    for (var i = 0; i < this.sourceEventNames.length; i++) {
        src[this.sourceEventNames[i]] = function(){};
    }
};
