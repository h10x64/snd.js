snd.mml = {};

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
 * ループ始点を表すmml
 * @type String
 */
snd.mml.LOOP_START = '[';

/**
 * ループ終点を表すmml
 * @type String
 */
snd.mml.LOOP_END = ']';

snd.mml.MMLPlayer = function(id) {
    snd.OscillatorSource.apply(this, arguments);
    this.stack = [];
    this.status = {
        tempo: snd.mml.DEFAULT_TEMPO, // 現在のテンポ
        octave: snd.mml.DEFAULT_OCTAVE, // 現在のオクターブ
        value: 4, // 現在のデフォルト音符
        pos: 0, // 現在の読込位置
    };
    this.buffer = ""; // MMLデータ
};
snd.mml.MMLPlayer.prototype = Object.create(snd.OscillatorSource.prototype);
snd.mml.MMLPlayer.prototype.constructor = snd.mml.MMLPlayer;

snd.mml.MMLPlayer.prototype.playNote = function(note) {
    var freq = snd.util.noteToFrequency(this.status.octave, note.pitch);
    var sec = snd.util.noteToSec(this.status.tempo, note.value);
    
    
};

snd.mml.MMLPlayer.prototype.next = function() {
    var nextChar = this.buffer.charAt(this.status.pos);
    
    if (nextChar === 'T') {
        // テンポ制御
        this.readTempo();
    } else if (nextChar === '[') {
        // ループ始点
        this.startLoop();
    } else if (nextChar === ']') {
        // ループ終点
        this.endLoop();
    } else if (nextChar === 'A'
            || nextChar === 'B'
            || nextChar === 'C'
            || nextChar === 'D'
            || nextChar === 'E'
            || nextChar === 'F'
            || nextChar === 'G') {
        // 音高制御
        var note = this.readNote();
        this.playNote(note);
    }
    
};

snd.mml.MMLPlayer.prototype.readTempo = function() {
    if (this.buffer.charAt(this.status.pos) === 'T') {
        this.status.pos++;
        this.status.tempo = this.readNumber();
    }
    return;
};

snd.mml.MMLPlayer.prototype.startLoop = function() {
    this.stack.push(this.status);
};

snd.mml.MMLPlayer.prototype.endLoop = function() {
    this.status = this.stack.pop();
};

/**
 * バッファから音符データを読み込みます。<br/>
 * メソッド終了時に、this.status.posが音符指定部分の最後尾+1文字目に変更されます。<br/>
 * this.status.posの文字が音符指定文字でない場合はthis.status.posの値は変更されません。
 * @return {Object} 音符オブジェクト {pitch: 音高, value: 音長}。音符指定ではない場合はnull
 */
snd.mml.MMLPlayer.prototype.readNote = function() {
    var pitch = 0;
    var value = this.status.value;
    var p = this.status.pos;
    
    switch (buffer.charAt(p).toUpperCase()) {
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
    
    pitch += this.readAccidental();
    value = this.readNumber();
    
    return {pitch:pitch, value:value};
};

snd.mml.MMLPlayer.prototype.readAccidental = function() {
    var ret = 0;
    
    while (this.status.pos < this.buffer.length) {
         var c = this.buffer.charAt(this.status.pos);
         if (c === '#' || c === '+') {
             ret++;
         } else if (c === '-') {
             ret--;
         } else {
             break;
         }
    }
    
    return ret;
};

snd.mml.MMLPlayer.prototype.readNumber = function() {
    var from = this.status.pos;
    
    while (this.status.pos < this.buffer.length && this.buffer.charAt(this.status.pos).match(/\d/)) {
        this.status.pos++;
    }
    
    var numstr = this.buffer.substring(from, this.status.pos);
    return parseInt(numstr);
};

