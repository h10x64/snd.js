/* snd.js - The Sound Library for JavaScript with WebAudioAPI - v.0.1.0 */snd.mml = {version: 0.1, BETA: true};

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
 * ループ途中
 * @type String
 */
snd.mml.LOOP_MID_END = '/';

/**
 * ループ終点を表すmml
 * @type String
 */
snd.mml.LOOP_END = ']';

/**
 * 和音の始点を表すmml
 * @type String
 */
snd.mml.CHORD_START = '(';

/**
 * 和音の終点を表すmml
 * @type String
 */
snd.mml.CHORD_END = ')';

snd.mml.FAILED = -1;

/**
 * @class 
 * @param {type} id
 */
snd.mml.MMLPlayer = function(id) {
    this.stack = [];
    this.mmlStatus = new snd.mml.MMLStatus();
    this.buffer = ""; // MMLデータ

    this.startEventListeners = [];
    this.stopEventListeners = [];
    
    this.noteOnEventListeners = [];
    this.noteOffEventListeners = [];
};

snd.mml.MMLPlayer.prototype.startMML = function() {
    this.mmlStatus = new snd.mml.MMLStatus();
    this.mmlStatus.play = true;
    for (var i = 0; i < this.startEventListeners.length; i++) {
        this.startEventListeners[i].onMMLStart(this);
    }
    this.next();
};

snd.mml.MMLPlayer.prototype.stopMML = function() {
    this.reset();
    for (var i = 0; i < this.stopEventListeners.length; i++) {
        this.stopEventListeners[i].onMMLStop(this);
    }
};

snd.mml.MMLPlayer.prototype.addStartEventListener = function(listener) {
    this.startEventListeners.put(listener);
};

snd.mml.MMLPlayer.prototype.removeStartEventListener = function(listener) {
    for (var i = 0; i < this.startEventListeners.length; i++) {
        if (this.startEventListeners[i] === listener) {
            this.startEventListeners.splice(i, 1);
            return true;
        }
    }
    return false;
};

snd.mml.MMLPlayer.prototype.addStopEventListener = function(listener) {
    this.stopEventListeners.push(listener);
};

snd.mml.MMLPlayer.prototype.removeStopEventListener = function(listener) {
    for (var i = 0; i < this.stopEventListeners.length; i++) {
        if (this.stopEventListeners[i] === listener) {
            this.stopEventListeners.splice(i, 1);
            return true;
        }
    }
    return false;
};

snd.mml.MMLPlayer.prototype.addNoteOnEventListener = function(listener) {
    this.noteOnEventListeners.push(listener);
};

snd.mml.MMLPlayer.prototype.removeNoteOnEventListener = function(listener) {
    for (var i = 0; i < this.noteOnEventListeners.length; i++) {
        if (listener === this.noteOnEventListeners[i]) {
            this.noteOnEventListeners.splice(i, 1);
            return true;
        }
    }
    return false;
};

snd.mml.MMLPlayer.prototype.addNoteOffEventListener = function(listener) {
    this.noteOffEventListener.push(listener);
};

snd.mml.MMLPlayer.prototype.removeNoteOffEventListener = function(listener) {
    for (var i = 0; i < this.noteOffEventListeners.length; i++) {
        if (listener === this.noteOffEventListeners[i]) {
            this.noteOffEventListeners.splice(i, 1);
            return true;
        }
    }
    return false;
};

snd.mml.MMLPlayer.prototype.onNoteOn = function(note) {
    for (var i = 0; i < this.noteOnEventListeners.length; i++) {
        this.noteOnEventListeners[i].onNoteOn(note);
    }
};

snd.mml.MMLPlayer.prototype.onNoteOff = function(note) {
    for (var i = 0; i < this.noteOffEventListeners.length; i++) {
        this.noteOffEventListeners[i].onNoteOff(note);
    }
};

snd.mml.MMLPlayer.prototype.reset = function() {
    this.mmlStatus = new snd.mml.MMLStatus();
};

snd.mml.MMLPlayer.prototype.next = function() {
    if (!this.mmlStatus.play) {
        return;
    } else if (this.mmlStatus.pos >= this.buffer.length) {
        this.mmlStatus.play = false;
        return;
    }

    var ret;
    var c = this.buffer.charAt(this.mmlStatus.pos).toUpperCase();
    
    console.log("MML : Command -> " + c);

    // ループ制御コマンド読込み
    ret = this.readLoop(this.mmlStatus.pos);
    if (ret.status != snd.mml.FAILED) {
        //成功
        this.mmlStatus.pos = ret.status;
        this.next();
        return;
    }

    // オプション指定コマンド読込み
    ret = this.readOption(this.mmlStatus.pos);
    if (ret.status != snd.mml.FAILED) {
        // 成功
        this.mmlStatus.pos = ret.status;
        this.next();
        return;
    }

    // 音符読込み(単音は音符一つの和音として処理)
    ret = this.readChord(this.mmlStatus.pos);
    if (ret.status != snd.mml.FAILED) {
        // 成功
        this.mmlStatus.pos = ret.status;
        ret.result.on();
        // MMLPlayer#nextはNoteのstopで実行
        return;
    }

    // コマンド該当なし
    if (c != ' ') { // 半角SPはwarn出力なし
        console.warn("MML : Unknown command -> " + c);
    }
    this.mmlStatus.pos++;
    this.next();
};

/**
 * 
 * @param {type} pos
 * @return {Object} {status:(コマンド終了位置) || snd.mml.FAILED, result: null}
 */
snd.mml.MMLPlayer.prototype.readOption = function(pos) {
    if (pos >= this.buffer.length) {
        return snd.mml.FAILED;
    }

    var p = pos;
    var nextChar = this.buffer.charAt(p).toUpperCase();
    var res;

    if (nextChar === snd.mml.TEMPO) {
        // テンポ指定
        p++;
        res = this.readNumber(p);
        if (res.status != snd.mml.FAILED) {
            this.mmlStatus.tempo = res.result;
        }
        return {status: res.status, result: null};
    } else if (nextChar === snd.mml.OCTAVE) {
        // オクターブ指定
        p++;
        res = this.readNumber(p);
        if (res.status != snd.mml.FAILED) {
            this.mmlStatus.octave = res.result;
        }
        return {status: res.status, result: null};
    } else if (nextChar === snd.mml.OCTAVE_INC) {
        // オクターブ+1
        p++;
        this.mmlStatus.octave++;
        return {status: p, result: null};
    } else if (nextChar === snd.mml.OCTAVE_DEC) {
        // オクターブ-1
        p++;
        this.mmlStatus.octave--;
        return {status: p, result: null};
    } else if (nextChar === snd.mml.VALUE) {
        // 音価指定
        p++;
        res = this.readNumber(p);
        if (res.status != snd.mml.FAILED) {
            this.mmlStatus.value = res.result;
        }
        return {status: res.status, result: null};
    } else {
        // 該当コマンドなし
        return {status: snd.mml.FAILED, result: null};
    }
};

snd.mml.MMLPlayer.prototype.readLoop = function(pos) {
    if (pos >= this.buffer.length) {
        return {status: snd.mml.FAILED, result: null};
    }

    var c = this.buffer.charAt(pos).toUpperCase();

    if (c === snd.mml.LOOP_START) {
        return this.startLoop(pos);
    } else if (c === snd.mml.LOOP_END) {
        return this.endLoop(pos);
    } else if (c === snd.mml.LOOP_MID_END) {
        return this.breakLoop(pos);
    } else {
        return {status: snd.mml.FAILED, result: null};
    }
};

/**
 * 楽譜バッファから次のコマンドを読込み、ループ始点だった場合にそのコマンドを実行します。<br/>
 * ※MMLPlayerクラス内部で使用するためのメソッドです。
 * 特別な意図がないかぎり、MMLPlayerクラスの外部からは呼び出さないようにしてください。<br/>
 */
snd.mml.MMLPlayer.prototype.startLoop = function(pos) {
    if (this.mmlStatus.loop == null) {
        this.mmlStatus.loop = 0;
    }

    this.stack.push(new snd.mml.MMLStatus(
            this.mmlStatus.tempo, this.mmlStatus.octave, this.mmlStatus.value,
            this.mmlStatus.pos, this.mmlStatus.play, this.mmlStatus.loop,
            this.mmlStatus.loopEnd, this.mmlStatus.loopMax));
    this.mmlStatus.loop = null;
    
    pos++;

    return {status: pos, result: null};
};

snd.mml.MMLPlayer.prototype.breakLoop = function(pos) {
    pos++;
    
    var n = this.readNumber(pos);
    var stat = this.stack[this.stack.length - 1];
    
    if (n.status == snd.mml.FAILED) {
        if (stat.loop != null && stat.loop + 1 == stat.loopMax) {
            pos = stat.loopEnd;
        }
    } else if (n.result == stat.loop) {
        pos = stat.loopEnd;
    }

    return {status: pos, result: null};
};

/**
 * 楽譜バッファから次のコマンドを読込み、ループ終点だった場合にそのコマンドを実行します。<br/>
 * ※MMLPlayerクラス内部で使用するためのメソッドです。
 * 特別な意図がないかぎり、MMLPlayerクラスの外部からは呼び出さないようにしてください。<br/>
 */
snd.mml.MMLPlayer.prototype.endLoop = function(pos) {
    var status = this.stack.pop();
    status.loopEnd = pos;

    pos++;

    var n = this.readNumber(pos);
    if (n.status == snd.mml.FAILED) {
        // ループ回数指定なし
        this.mmlStatus = status;
    } else {
        status.loopMax = n.result;

        status.loop++;

        if (status.loop < n.result) {
            this.mmlStatus = status;
        } else {
            this.mmlStatus.loop = null;
            this.mmlStatus.pos = n.status;
        }
    }

    return {status: this.mmlStatus.pos, result: null};
};

snd.mml.MMLPlayer.prototype.readChord = function(pos) {
    if (pos >= this.buffer.length) {
        return {status: snd.mml.FAILED, result: null};
    }
    
    var p = pos;
    var c = this.buffer.charAt(p).toUpperCase();
    var chord;
    var res;
    
    if (c === snd.mml.CHORD_START) {
        var nextChar;
        
        chord = new snd.mml.Chord(this);
        this.addStopEventListener(chord);
        
        p++;
        
        while (p < this.buffer.length && (nextChar = this.buffer.charAt(p).toUpperCase()) != snd.mml.CHORD_END) {
            console.log(nextChar);
            res = this.readOption(p);
            if (res.status != snd.mml.FAILED) {
                p = res.status;
            }
            
            res = this.readNote(p);
            if (res.status != snd.mml.FAILED) {
                chord.addNote(res.result.pitch, res.result.value);
                p = res.status;
            } else {
                p++;
            }
        }
        
        return {status: p, result: chord};
    } else {
        res = this.readNote(p);
        if (res.status != snd.mml.FAILED) {
            chord = new snd.mml.Chord(this);
            this.addStopEventListener(chord);
            
            chord.addNote(res.result.pitch, res.result.value);
            p = res.status;
            
            return {status: p, result: chord};
        }
    }
    
    return {status: snd.mml.FAILED, result: null};
};

/**
 * バッファから音符データを読み込みます。<br/>
 * ※MMLPlayerクラス内部で使用するためのメソッドです。
 * 特別な意図がないかぎり、MMLPlayerクラスの外部からは呼び出さないようにしてください。<br/>
 * @return {Object} 音符オブジェクト {pitch: 音高, value: 音長}。音符指定ではない場合はnull
 */
snd.mml.MMLPlayer.prototype.readNote = function(pos) {
    if (pos >= this.buffer.length) {
        return {status: snd.mml.FAILED, result: null};
    }

    var p = pos;
    var pitch;
    var value;
    var res;

    switch (this.buffer.charAt(p).toUpperCase()) {
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
            pitch = -1;
            break;
    }
    p++;

    if (pitch < 0) {
        // A～Gではなかった
        return {status: snd.mml.FAILED, result: null};
    }
    // 臨時符号の読込み
    res = this.readAccidental(p);
    if (res.status != snd.mml.FAILED) {
        // 臨時符号があった場合は音高を調整
        pitch += res.result;
        p = res.status;
    }

    // 音価の読込み
    res = this.readNumber(p);
    if (res.status != snd.mml.FAILED) {
        // 音価が指定されていた場合はその音価を設定
        value = res.result;
        p = res.status;
    } else {
        // 指定されていなければ現在のデフォルト値を設定
        value = this.mmlStatus.value;
    }

    return {status: p, result: {pitch: pitch, value: value}};
};

/**
 * 楽譜バッファから次のコマンドを読込み、臨時記号(シャープ・フラット)だった場合にそのコマンドを実行します。<br/>
 * ※MMLPlayerクラス内部で使用するためのメソッドです。
 * 特別な意図がないかぎり、MMLPlayerクラスの外部からは呼び出さないようにしてください。<br/>
 */
snd.mml.MMLPlayer.prototype.readAccidental = function(pos) {
    if (pos >= this.buffer.length) {
        return {status: snd.mml.FAILED, result: null};
    }

    var ret = 0;
    var p = pos;

    while (p < this.buffer.length) {
        var c = this.buffer.charAt(p).toUpperCase();
        if (c === '#' || c === '+') {
            ret++;
        } else if (c === '-') {
            ret--;
        } else {
            break;
        }
        p++;
    }

    if (p == pos) {
        return {status: snd.mml.FAILED, result: null};
    }

    return {status: p, result: ret};
};

/**
 * 楽譜バッファから数値を読み込みます。<br/>
 * ※MMLPlayerクラス内部で使用するためのメソッドです。
 * 特別な意図がないかぎり、MMLPlayerクラスの外部からは呼び出さないようにしてください。<br/>
 */
snd.mml.MMLPlayer.prototype.readNumber = function(pos) {
    var start = pos;
    var end = pos;

    while (end < this.buffer.length && this.buffer.charAt(end).match(/\d/)) {
        end++;
    }

    if (start == end) {
        return {status: snd.mml.FAILED, result: null};
    } else {
        var s = this.buffer.substring(start, end);
        return {status: end, result: parseInt(s)};
    }
};

/**
 * @class MMLのステータスを持つクラスです。
 * @param {type} tempo 現在のテンポ
 * @param {type} octave 現在のオクターブ
 * @param {type} value 現在のデフォルトの音価
 * @param {type} pos 現在の再生位置
 * @param {type} play 再生中フラグ
 * @param {type} loop ループ回数
 * @param {type} loopEnd ループ終了位置
 * @param {type} loopMax ループ最大数
 */
snd.mml.MMLStatus = function(tempo, octave, value, pos, play, loop, loopEnd, loopMax) {
    this.tempo = (tempo == null) ? snd.mml.DEFAULT_TEMPO : tempo;
    this.octave = (octave == null) ? snd.mml.DEFAULT_OCTAVE : octave;
    this.value = (value == null) ? 4 : value;
    this.pos = (pos == null || pos < 0) ? 0 : pos;
    this.play = (play == null) ? false : play;
    this.loop = loop;
    this.loopEnd = loopEnd;
    this.loopMax = loopMax;
};

snd.mml.Chord = function(parent) {
    this.parent = parent;
    this.notes = {};
    this.minNote = null;
    this.stopTick = false;
};

snd.mml.Chord.prototype.addNote = function(pitch, value) {
    var note = new snd.mml.Note(snd.mml.Note.getNoteId(), this, this.parent.mmlStatus, pitch, value);
    this.notes[note.id] = note;
    if (this.minNote == null || this.minNote.sec > note.sec) {
        this.minNote = note;
    }
};

snd.mml.Chord.prototype.on = function() {
    for (var id in this.notes) {
        this.notes[id].on();
    }
};

snd.mml.Chord.prototype.off = function() {
    for (var id in this.notes) {
        this.notes[id].off();
    }
};

snd.mml.Chord.prototype.onMMLStop = function(player) {
    this.stopTick = true;
    for (var id in this.notes) {
        this.notes[id].off();
    }
};

snd.mml.Chord.prototype.onNoteOn = function(note) {
    this.parent.onNoteOn(note);
};

snd.mml.Chord.prototype.onNoteOff = function(note) {
    if (note === this.minNote && !this.stopTick) {
        this.parent.next();
    }
    this.parent.onNoteOff(note);
};

/**
 * @class 音符クラス
 * @param {type} parent この音符オブジェクトを持つ親オブジェクト
 * @param {type} pitch 音高
 * @param {type} value 音価
 */
snd.mml.Note = function(id, parent, mmlStatus, pitch, value) {
    snd.OscillatorSource.apply(this, arguments);

    this.parent = parent;

    this.tempo = mmlStatus.tempo;
    this.octave = mmlStatus.octave;
    this.pitch = pitch;
    this.value = value;

    this.setting();
};
snd.mml.Note.prototype = Object.create(snd.OscillatorSource.prototype);
snd.mml.Note.prototype.constructor = snd.mml.Note;

/**
 * この音符の演奏を開始します。<br/>
 * コンストラクタで指定された音価に相当する時間出力を行い、自動的に停止します。
 */
snd.mml.Note.prototype.on = function() {
    var _this = this;
    snd.OscillatorSource.prototype.start.apply(this, arguments);
    setTimeout(function() {
        _this.off();
    }, 1000 * this.sec);
    this.parent.onNoteOn(this);
};

/**
 * この音符の演奏を停止します。
 */
snd.mml.Note.prototype.off = function() {
    snd.OscillatorSource.prototype.stop.apply(this, arguments);
    this.parent.onNoteOff(this);
};

/**
 * 各種設定を行います。
 */
snd.mml.Note.prototype.setting = function() {
    this.setFrequency(snd.util.noteToFrequency(this.octave, this.pitch));
    this.sec = snd.util.noteToSec(this.tempo, this.value);
    // SOUND_ENVIRONMENTへ接続
    snd.MASTER.connectAudioUnit(this.id, this);
};

/**
 * 新しい音符IDを取得します
 * @returns {String|Number}
 */
snd.mml.Note.getNoteId = function() {
    return new Date().getTime().toString() + Math.floor(Math.random() * 9999);
};
