/**
 * @class
 */
snd.SoundEnvironment = function() {
    this.now = 0;
    this.listener = snd.AUDIO_CONTEXT.listener;
    this.listeners = {};
    this.soundNodes = {};
};

/**
 * バッファに姿勢情報を記録する最大数のデフォルト値。<br/>
 * 30フレーム/秒として60秒分
 * @type Integer
 */
snd.SoundEnvironment.DEFAULT_BUFFER_MAX = 1800;

snd.SoundEnvironment.prototype.addListener = function(id, listener) {
    this.listeners[id] = new PosDirTime(listener, 1);
};

snd.SoundEnvironment.prototype.removeListener = function(id) {
    if (this.soundNodes[id] != null) {
        delete this.soundNodes[id];
    }
};

snd.SoundEnvironment.prototype.addSoundNode = function(id, soundNode) {
    this.soundNodes[id] = new PosDirTime(soundNode);
};

snd.SoundEnvironment.prototype.removeSoundNode = function(id) {
    if (this.soundNodes[id] != null) {
        delete this.soundNodes[id];
    }
};

snd.SoundEnvironment.prototype.update = function(time) {
    if (this.now > time) {
        throw new snd.SoundEnvironment.UpdateError(this, "time < this.now (time: " + time  + ", this.now: " + this.now);
    }
    
    for (var key in this.listeners) {
        this.listeners[key].update(time);
    }
    for (var key in this.soundNodes) {
        this.soundNodes[key].update(time);
    }
};

/**
 * @class フレーム更新時にエラーが発生した時にthrowするオブジェクト
 */
snd.SoundEnvironment.UpdateError = function(_this, message) {
    this._this = _this;
    this.message = message;
};

/**
 * @class snd.PosDirに時系列情報を付加したクラスです。<br/>
 * updateが呼ばれるたびにバッファに姿勢情報を追記します。<br/>
 * バッファに記録する個数はbufferMaxで指定された数が最大で、それ以上になると過去の情報から順に消されます。<br/>
 * bufferMaxのデフォルト値はsnd.SoundEnvironment.DEFAULT_BUFFER_MAXで定義されています。
 */
snd.PosDirTime = function(data, bufferMax) {
    this.data = data;
    this.history = []; // [{time: milli second, posture: posture}]
    this.bufferMax = bufferMax;
};

snd.PosDirTime.prototype.update = function(time) {
    if (this.history.length == 0) {
        this.history.push({time: 0, posture: Object.create(this.data)});
    }
    if (this.history.length > this.bufferMax) {
        this.history.splice(0, 1);
    }
    this.history.push({time:time, posture:Object.create(this.data)});
};

snd.PosDirTime.prototype.getPosture = function(time) {
    var res = this.search(time);
    if (res == null) {
        return null;
    } else if (res.left == res.right) {
        return this.history[res.left];
    }
    
    var left = this.history[left];
    var right = this.history[right];
    var ratio = (time - left.time) / (right.time - left.time);
    
    return snd.PosDir.interpolation(left, right, ratio);
};

snd.PosDirTime.prototype.search = function(time) {
    if (this.history.length <= 0) {
        return null;
    } else if (this.history.length == 1) {
        return {left: 0, right: 0};
    } else if (this.history[this.history.length - 1].time < time) {
        return {left: this.history.length - 1, right: this.history.legnth - 1};
    } else if (this.history[0].time > time) {
        return {left: 0, right: 0};
    }
    
    var left = 0, right = this.history.length - 1;
    var mid = Math.floor(right / 2);
    
    while (true) {
        mid = Math.floor((time - this.history[left].time) * (right - left) / (this.history[right].time - this.history[left].time)) + left;
        if (this.history[mid].time < time) {
            if (this.history[mid + 1] > time) {
                return {left: mid, right: mid + 1};
            }
            left = mid + 1;
        } else if (this.history[mid].time > time) {
            if (this.history[mid - 1].time < time) {
                return {left: mid - 1, right: mid};
            }
            right = mid - 1;
        } else {
            return {left: mid, right: mid};
        }
    }
};


