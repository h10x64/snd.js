snd.mml = {version:0.1, BETA:true};

/**
 * デフォルトのオクターブです。
 * @type Number
 */
snd.mml.DEFAULT_OCTAVE = 4;

/**
 * デフォルトのテンポです。
 * @type Number
 */
snd.mml.DEFAULT_TEMPO = 120;

/**
 * テンポ調整を行うmml
 * @type String
 */
snd.mml.TEMPO = 'T';

/**
 * 休符を表すmml
 * @type String
 */
snd.mml.REST = 'R';

/**
 * オクターブ指定を表すmml
 * @type String
 */
snd.mml.OCTAVE = 'O';

/**
 * 音価指定を表すmml
 * @type String
 */
snd.mml.VALUE = 'L';

/**
 * オクターブインクリメント
 * @type String
 */
snd.mml.OCTAVE_INC = '>';

/**
 * オクターブデクリメント
 * @type String
 */
snd.mml.OCTAVE_DEC = '<';

/**
 * ループ始点を表すmml
 * @type String
 */
snd.mml.LOOP_START = '[';

/**
 * ループ終点を表すmml
 * @type String
 */
snd.mml.LOOP_END = ']';

/**
 * ループ途中
 * @type String
 */
snd.mml.LOOP_MID_END = '/';

snd.mml.MMLPlayer = function(id) {
    snd.OscillatorSource.apply(this, arguments);
    this.stack = [];
    this.mmlStatus = new snd.mml.MMLStatus();
    this.buffer = ""; // MMLデータ

    this.startEventListener = [];
    this.stopEventListener = [];
    this.noteOnEventListener = [];
    this.noteOffEventListener = [];
};
snd.mml.MMLPlayer.prototype = Object.create(snd.OscillatorSource.prototype);
snd.mml.MMLPlayer.prototype.constructor = snd.mml.MMLPlayer;

snd.mml.MMLPlayer.prototype.startMML = function() {
    this.mmlStatus.pos = 0;
    this.mmlStatus.play = true;
    for (var i = 0; i < this.startEventListener.length; i++) {
        this.startEventListener[i].onMMLStart(this);
    }
    this.next();
};

snd.mml.MMLPlayer.prototype.stopMML = function() {
    this.stop();
    this.reset();
    for (var i = 0; i < this.stopEventListener.length; i++) {
        this.stopEventListener[i].onMMLStop(this);
    }
};

snd.mml.MMLPlayer.prototype.reset = function() {
    this.mmlStatus = new snd.mml.MMLStatus();
};

snd.mml.MMLPlayer.prototype.noteOn = function(note) {
    var _this = this;
    var _pos = this.mmlStatus.pos;
    
    var sec = snd.util.noteToSec(this.mmlStatus.tempo, note.value);
    if (note.pitch != snd.mml.REST) {
        this.setFrequency(snd.util.noteToFrequency(this.mmlStatus.octave, note.pitch));
        this.start();
    }

    setTimeout(function() {
        _this.noteOff();
        if (_this.mmlStatus.pos == _pos) {
            _this.next();
        }
    }, sec * 1000);

    for (var i = 0; i < this.noteOnEventListener.length; i++) {
        this.noteOnEventListener[i].noteOn(this);
    }
};

snd.mml.MMLPlayer.prototype.noteOff = function() {
    if (this.status == snd.status.STARTED) {
        this.stop();

        for (var i = 0; i < this.noteOffEventListener.length; i++) {
            this.noteOffEventListener[i].noteOff(this);
        }
    }
};

snd.mml.MMLPlayer.prototype.next = function() {
    if (!this.mmlStatus.play) {
        return;
    }

    if (this.mmlStatus.pos < this.buffer.length) {
        var nextChar = this.buffer.charAt(this.mmlStatus.pos).toUpperCase();

        if (nextChar === 'A'
                || nextChar === 'B'
                || nextChar === 'C'
                || nextChar === 'D'
                || nextChar === 'E'
                || nextChar === 'F'
                || nextChar === 'G'
                || nextChar === snd.mml.REST) {
            // 音符指定
            var note = this.readNote();
            this.noteOn(note);
        } else {
            // 音符以外のコマンド
            if (nextChar === snd.mml.TEMPO) {
                // テンポ制御
                this.readTempo();
            } else if (nextChar === snd.mml.LOOP_START) {
                // ループ始点
                this.startLoop();
            } else if (nextChar === snd.mml.LOOP_MID_END) {
                // ループ途中抜け
                this.breakLoop();
            } else if (nextChar === snd.mml.LOOP_END) {
                // ループ終点
                this.endLoop();
            } else if (nextChar === snd.mml.VALUE) {
                // 音価設定
                this.readValue();
            } else if (nextChar === snd.mml.OCTAVE
                    || nextChar === snd.mml.OCTAVE_INC
                    || nextChar === snd.mml.OCTAVE_DEC) {
                // オクターブ調整
                this.readOctave();
            } else {
                this.mmlStatus.pos++;
            }
            this.next();
        }
    } else {
        this.mmlStatus.play = false;
    }
};

/**
 * 楽譜バッファから次のコマンドを読込み、テンポ指定だった場合にそのコマンドを実行します。<br/>
 * ※MMLPlayerクラス内部で使用するためのメソッドです。
 * 特別な意図がないかぎり、MMLPlayerクラスの外部からは呼び出さないようにしてください。<br/>
 */
snd.mml.MMLPlayer.prototype.readTempo = function() {
    if (this.buffer.charAt(this.mmlStatus.pos).toUpperCase() === 'T') {
        this.mmlStatus.pos++;

        var t = this.readNumber();
        if (t != null) {
            this.mmlStatus.tempo = t;
        }
    }
    return;
};

snd.mml.MMLPlayer.prototype.readValue = function() {
    if (this.buffer.charAt(this.mmlStatus.pos).toUpperCase() === 'L') {
        this.mmlStatus.pos++;
        
        var n = this.readNumber();
        if (n != null) {
            this.mmlStatus.value = n;
        }
    }
};

/**
 * 楽譜バッファから次のコマンドを読込み、オクターブ指定・調整だった場合にそのコマンドを実行します。<br/>
 * ※MMLPlayerクラス内部で使用するためのメソッドです。
 * 特別な意図がないかぎり、MMLPlayerクラスの外部からは呼び出さないようにしてください。<br/>
 */
snd.mml.MMLPlayer.prototype.readOctave = function() {
    var c = this.buffer.charAt(this.mmlStatus.pos).toUpperCase();
    if (c === snd.mml.OCTAVE) {
        var n = this.readNumber();
        if (n != null) {
            this.mmlStatus.octave = n;
        }
    } else if (c === snd.mml.OCTAVE_INC) {
        this.mmlStatus.octave++;
    } else if (c === snd.mml.OCTAVE_DEC) {
        this.mmlStatus.octave--;
    }
    this.mmlStatus.pos++;
};

/**
 * 楽譜バッファから次のコマンドを読込み、ループ始点だった場合にそのコマンドを実行します。<br/>
 * ※MMLPlayerクラス内部で使用するためのメソッドです。
 * 特別な意図がないかぎり、MMLPlayerクラスの外部からは呼び出さないようにしてください。<br/>
 */
snd.mml.MMLPlayer.prototype.startLoop = function() {
    if (this.mmlStatus.loop == null) {
        this.mmlStatus.loop = 0;
    }
    
    this.stack.push(new snd.mml.MMLStatus(
            this.mmlStatus.tempo, this.mmlStatus.octave, this.mmlStatus.value,
            this.mmlStatus.pos, this.mmlStatus.play, this.mmlStatus.loop,
            this.mmlStatus.loopEnd, this.mmlStatus.loopMax));
    this.mmlStatus.pos++;
};

snd.mml.MMLPlayer.prototype.breakLoop = function() {
    if (this.buffer.charAt(this.mmlStatus.pos).toUpperCase() === snd.mml.LOOP_MID_END) {
        this.mmlStatus.pos++;
        var n = this.readNumber();
        
        if (n == null) {
            if (this.mmlStatus.loop != null && this.mmlStatus.loop + 1 == this.mmlStatus.loopMax) {
                this.mmlStatus.pos = this.mmlStatus.loopEnd;
            }
        } else if (n == this.mmlStatus.loop) {
            this.mmlStatus.pos = this.mmlStatus.loopEnd;
        }
    }
};

/**
 * 楽譜バッファから次のコマンドを読込み、ループ終点だった場合にそのコマンドを実行します。<br/>
 * ※MMLPlayerクラス内部で使用するためのメソッドです。
 * 特別な意図がないかぎり、MMLPlayerクラスの外部からは呼び出さないようにしてください。<br/>
 */
snd.mml.MMLPlayer.prototype.endLoop = function() {
    if (this.buffer.charAt(this.mmlStatus.pos).toUpperCase() === snd.mml.LOOP_END) {
        var status = this.stack.pop();
        status.loopEnd = this.mmlStatus.pos;
        
        this.mmlStatus.pos++;
        
        var n = this.readNumber();
        status.loopMax = n;
        
        status.loop++;
        
        if (n == null || status.loop < n) {
            this.mmlStatus = status;
        } else {
            this.mmlStatus.loop = null;
        }
    }
};

/**
 * バッファから音符データを読み込みます。<br/>
 * ※MMLPlayerクラス内部で使用するためのメソッドです。
 * 特別な意図がないかぎり、MMLPlayerクラスの外部からは呼び出さないようにしてください。<br/>
 * @return {Object} 音符オブジェクト {pitch: 音高, value: 音長}。音符指定ではない場合はnull
 */
snd.mml.MMLPlayer.prototype.readNote = function() {
    if (this.mmlStatus.pos >= this.buffer.length) {
        return;
    }

    var pitch = 0;
    var value = this.mmlStatus.value;

    if (this.buffer.charAt(this.mmlStatus.pos).toUpperCase() === 'R') {
        this.mmlStatus.pos++;
        this.readAccidental();
        var value = this.readNumber();

        return {pitch: snd.mml.REST, value: (value == null) ? this.mmlStatus.value : value};
    } else {
        switch (this.buffer.charAt(this.mmlStatus.pos).toUpperCase()) {
            case 'A':
                pitch = 0;
                break;
            case 'B':
                pitch = 2;
                break;
            case 'C':
                pitch = 3;
                break;
            case 'D':
                pitch = 5;
                break;
            case 'E':
                pitch = 7;
                break;
            case 'F':
                pitch = 8;
                break;
            case 'G':
                pitch = 10;
                break;
            default:
                pitch = 0;
                break;
        }
    }
    this.mmlStatus.pos++;

    pitch += this.readAccidental();
    value = this.readNumber();
    if (value == null) {
        value = this.mmlStatus.value;
    }

    return {pitch: pitch, value: value};
};

/**
 * 楽譜バッファから次のコマンドを読込み、臨時記号(シャープ・フラット)だった場合にそのコマンドを実行します。<br/>
 * ※MMLPlayerクラス内部で使用するためのメソッドです。
 * 特別な意図がないかぎり、MMLPlayerクラスの外部からは呼び出さないようにしてください。<br/>
 */
snd.mml.MMLPlayer.prototype.readAccidental = function() {
    var ret = 0;

    while (this.mmlStatus.pos < this.buffer.length) {
        var c = this.buffer.charAt(this.mmlStatus.pos);
        if (c === '#' || c === '+') {
            ret++;
        } else if (c === '-') {
            ret--;
        } else {
            break;
        }
        this.mmlStatus.pos++;
    }

    return ret;
};

/**
 * 楽譜バッファから数値を読み込みます。<br/>
 * ※MMLPlayerクラス内部で使用するためのメソッドです。
 * 特別な意図がないかぎり、MMLPlayerクラスの外部からは呼び出さないようにしてください。<br/>
 */
snd.mml.MMLPlayer.prototype.readNumber = function() {
    var from = this.mmlStatus.pos;

    while (this.mmlStatus.pos < this.buffer.length && this.buffer.charAt(this.mmlStatus.pos).match(/\d/)) {
        this.mmlStatus.pos++;
    }

    if (from == this.mmlStatus.pos) {
        return null;
    } else {
        var numstr = this.buffer.substring(from, this.mmlStatus.pos);
        return parseInt(numstr);
    }
};

snd.mml.MMLStatus = function(tempo, octave, value, pos, play, loop, loopEnd, loopMax) {
    this.tempo = (tempo == null) ? snd.mml.DEFAULT_TEMPO : tempo;
    this.octave = (octave == null) ? snd.mml.DEFAULT_OCTAVE : octave;
    this.value = (value == null) ? 4 : value;
    this.pos = (value == null) ? 0 : pos;
    this.play = (play == null) ? false : play;
    this.loop = loop;
    this.loopEnd = loopEnd;
    this.loopMax = loopMax;
};

