
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
 
 

if (typeof(snd) == "undefined") snd = {};

/**
 * MIDI機能の基幹ネームスペースです。
 * @property {MidiAccess} MIDI_ACCESS MIDIAccessを取得します。
 * @property {HashMap} INPUTS 接続済みのMIDI入力デバイスを列挙したハッシュマップを取得します。<br/>
 * キー値は各デバイスのIDで、値にはMIDIInputオブジェクトが格納されています。
 * @property {HashMap} OUTPUTS 接続済みのMIDI出力デバイスを列挙したハッシュマップを取得します。<br/>
 * キー値は各デバイスのIDで、値にはMIDIOutputオブジェクトが格納されています。
 * @namespace snd.MIDI
 */
snd.MIDI = {}

snd.MIDI._MIDI_ACCESS = null;
snd.MIDI._INPUTS = {};
snd.MIDI._OUTPUTS = {};

Object.defineProperties(snd.MIDI, {
    MIDI_ACCESS: {
        get: function() {
            return snd.MIDI._MIDI_ACCESS;
        }
    },
    INPUTS: {
        get: function() {
            return snd.MIDI._INPUTS;
        }
    },
    OUTPUTS: {
        get: function() {
            return snd.MIDI._OUTPUTS;
        }
    },
    DISCONNECTED: {
        value: "disconnected",
        writable: false
    },
    CONNECTED: {
        value: "connected",
        writable: false
    },
    OPEN: {
        value: "open",
        writable: false
    },
    CLOSED: {
        value: "closed",
        writable: false
    },
    PENDING: {
        value: "pending",
        writable: false
    },
    MESSAGE_FILTER: {
        value: 0xF0,
        writable: false
    },
    CH_FILTER: {
        value: 0x0F,
        writable: false
    },
    NOTE_OFF: {
        value: 0x80,
        writable: false
    },
    NOTE_ON: {
        value: 0x90,
        writable: false
    },
    POLYPHONIC_KEY_PRESSURE: {
        value: 0xA0,
        writable: false
    },
    CONTROL_CHANGE: {
        value: 0xB0,
        writable: false
    },
    PROGRAM_CHANGE: {
        value: 0xC0,
        writable: false
    },
    CHANNEL_PRESSURE: {
        value: 0xD0,
        writable: false
    },
    PITCH_BEND: {
        value: 0xE0,
        writable: false
    },
    MTC: {
        value: 0xF1,
        writable: false
    },
    SONG_POS: {
        value: 0xF2,
        writable: false
    },
    SONG_SEL: {
        value: 0xF3,
        writable: false
    },
    UNDEFINED_1: {
        value: 0xF4,
        writable: false
    },
    UNDEFINED_2: {
        value: 0xF5,
        writable: false
    },
    TUNE_REQ: {
        value: 0xF6,
        writable: false
    },
    EOX: {
        value: 0xF7,
        writable: false
    },
    TIMING_CLOCK: {
        value: 0xF8,
        writable: false
    },
    UNDEFINED_3: {
        value: 0xF9,
        writable: false
    },
    START: {
        value: 0xFA,
        writable: false
    },
    CONTINUE: {
        value: 0xFB,
        writable: false
    },
    STOP: {
        value: 0xFC,
        writable: false
    },
    UNDEFINED_4: {
        value: 0xFD,
        writable: false
    },
    ACTIVE_SENCING: {
        value: 0xFE,
        writable: false
    },
    SYSTEM_RESET: {
        value: 0xFF,
        writable: false
    },
    CTRL_BANK_SELECT: {
        value: 0x00,
        writable: false
    },
    CTRL_MODULATION: {
        value: 0x01,
        writable: false
    },
    CTRL_BREATH_CONTROLLER: {
        value: 0x02,
        writable: false
    },
    CTRL_UNDEFINED1: {
        value: 0x03,
        writable: false
    },
    CTRL_FOOT_CONTROLLER: {
        value: 0x04,
        writable: false
    },
    CTRL_PORTAMENTO_TIME: {
        value: 0x05,
        writable: false
    },
    CTRL_DATA_ENTRY_MSB: {
        value: 0x06,
        writable: false
    },
    CTRL_MAIN_VOLUME: {
        value: 0x07,
        writable: false
    },
    CTRL_BALANCE: {
        value: 0x08,
        writable: false
    },
    CTRL_UNDEFINED2: {
        value: 0x09,
        writable: false
    },
    CTRL_PAN: {
        value: 0x0A,
        writable: false
    },
    CTRL_EXPRESSION_CONTROLLER: {
        value: 0x0B,
        writable: false
    },
    CTRL_EFFECT_CONTROL1: {
        value: 0x0C,
        writable: false
    },
    CTRL_EFFECT_CONTROL2: {
        value: 0x0D,
        writable: false
    },
    CTRL_UNDEFINED3: {
        value: 0x0E,
        writable: false
    },
    CTRL_UNDEFINED4: {
        value: 0x0F,
        writable: false
    },
    CTRL_GENERAL_PURPOSE_CONTROLLER1: {
        value: 0x10,
        writable: false
    },
    CTRL_GENERAL_PURPOSE_CONTROLLER2: {
        value: 0x11,
        writable: false
    },
    CTRL_GENERAL_PURPOSE_CONTROLLER3: {
        value: 0x12,
        writable: false
    },
    CTRL_GENERAL_PURPOSE_CONTROLLER4: {
        value: 0x13,
        writable: false
    },
    CTRL_UNDEFINED5: {
        value: 0x14,
        writable: false
    },
    CTRL_UNDEFINED6: {
        value: 0x15,
        writable: false
    },
    CTRL_UNDEFINED7: {
        value: 0x16,
        writable: false
    },
    CTRL_UNDEFINED8: {
        value: 0x17,
        writable: false
    },
    CTRL_UNDEFINED9: {
        value: 0x18,
        writable: false
    },
    CTRL_UNDEFINED10: {
        value: 0x19,
        writable: false
    },
    CTRL_UNDEFINED11: {
        value: 0x1A,
        writable: false
    },
    CTRL_UNDEFINED12: {
        value: 0x1B,
        writable: false
    },
    CTRL_UNDEFINED13: {
        value: 0x1C,
        writable: false
    },
    CTRL_UNDEFINED14: {
        value: 0x1D,
        writable: false
    },
    CTRL_UNDEFINED15: {
        value: 0x1E,
        writable: false
    },
    CTRL_UNDEFINED16: {
        value: 0x1F,
        writable: false
    },
    CTRL_BANK_SELECT_LSB: {
        value: 0x20,
        writable: false
    },
    CTRL_MODULATION_LSB: {
        value: 0x21,
        writable: false
    },
    CTRL_BREATH_CONTROLLER_LSB: {
        value: 0x22,
        writable: false
    },
    CTRL_UNDEFINED1_LSB: {
        value: 0x23,
        writable: false
    },
    CTRL_FOOT_CONTROLLER_LSB: {
        value: 0x24,
        writable: false
    },
    CTRL_PORTAMENTO_TIME_LSB: {
        value: 0x25,
        writable: false
    },
    CTRL_DATA_ENTRY_MSB_LSB: {
        value: 0x26,
        writable: false
    },
    CTRL_MAIN_VOLUME_LSB: {
        value: 0x27,
        writable: false
    },
    CTRL_BALANCE_LSB: {
        value: 0x28,
        writable: false
    },
    CTRL_UNDEFINED2_LSB: {
        value: 0x29,
        writable: false
    },
    CTRL_PAN_LSB: {
        value: 0x2A,
        writable: false
    },
    CTRL_EXPRESSION_CONTROLLER_LSB: {
        value: 0x2B,
        writable: false
    },
    CTRL_EFFECT_CONTROL1_LSB: {
        value: 0x2C,
        writable: false
    },
    CTRL_EFFECT_CONTROL2_LSB: {
        value: 0x2D,
        writable: false
    },
    CTRL_UNDEFINED3_LSB: {
        value: 0x2E,
        writable: false
    },
    CTRL_UNDEFINED4_LSB: {
        value: 0x2F,
        writable: false
    },
    CTRL_GENERAL_PURPOSE_CONTROLLER1_LSB: {
        value: 0x30,
        writable: false
    },
    CTRL_GENERAL_PURPOSE_CONTROLLER2_LSB: {
        value: 0x31,
        writable: false
    },
    CTRL_GENERAL_PURPOSE_CONTROLLER3_LSB: {
        value: 0x32,
        writable: false
    },
    CTRL_GENERAL_PURPOSE_CONTROLLER4_LSB: {
        value: 0x33,
        writable: false
    },
    CTRL_UNDEFINED5_LSB: {
        value: 0x34,
        writable: false
    },
    CTRL_UNDEFINED6_LSB: {
        value: 0x35,
        writable: false
    },
    CTRL_UNDEFINED7_LSB: {
        value: 0x36,
        writable: false
    },
    CTRL_UNDEFINED8_LSB: {
        value: 0x37,
        writable: false
    },
    CTRL_UNDEFINED9_LSB: {
        value: 0x38,
        writable: false
    },
    CTRL_UNDEFINED10_LSB: {
        value: 0x39,
        writable: false
    },
    CTRL_UNDEFINED11_LSB: {
        value: 0x3A,
        writable: false
    },
    CTRL_UNDEFINED12_LSB: {
        value: 0x3B,
        writable: false
    },
    CTRL_UNDEFINED13_LSB: {
        value: 0x3C,
        writable: false
    },
    CTRL_UNDEFINED14_LSB: {
        value: 0x3D,
        writable: false
    },
    CTRL_UNDEFINED15_LSB: {
        value: 0x3E,
        writable: false
    },
    CTRL_UNDEFINED16_LSB: {
        value: 0x3F,
        writable: false
    },
    CTRL_DAMPER_PEDAL_ON: {
        value: 0x40,
        writable: false
    },
    CTRL_PORTAMENTO_ON: {
        value: 0x41,
        writable: false
    },
    CTRL_SOSTENUTO_ON: {
        value: 0x42,
        writable: false
    },
    CTRL_SOFT_PEDAL_ON: {
        value: 0x43,
        writable: false
    },
    CTRL_LEGATO_FOOT_SWITCH: {
        value: 0x44,
        writable: false
    },
    CTRL_HOLD2: {
        value: 0x45,
        writable: false
    },
    CTRL_SOUND_CONTROLLER1: {
        value: 0x46,
        writable: false
    },
    CTRL_SOUND_CONTROLLER2: {
        value: 0x47,
        writable: false
    },
    CTRL_SOUND_CONTROLLER3: {
        value: 0x48,
        writable: false
    },
    CTRL_SOUND_CONTROLLER4: {
        value: 0x49,
        writable: false
    },
    CTRL_SOUND_CONTROLLER5: {
        value: 0x4A,
        writable: false
    },
    CTRL_SOUND_CONTROLLER6: {
        value: 0x4B,
        writable: false
    },
    CTRL_SOUND_CONTROLLER7: {
        value: 0x4C,
        writable: false
    },
    CTRL_SOUND_CONTROLLER8: {
        value: 0x4D,
        writable: false
    },
    CTRL_SOUND_CONTROLLER9: {
        value: 0x4E,
        writable: false
    },
    CTRL_SOUND_CONTROLLER10: {
        value: 0x4F,
        writable: false
    },
    CTRL_GENERAL_PORPOSE_CONTROLLER5: {
        value: 0x50,
        writable: false
    },
    CTRL_GENERAL_PORPOSE_CONTROLLER6: {
        value: 0x51,
        writable: false
    },
    CTRL_GENERAL_PORPOSE_CONTROLLER7: {
        value: 0x52,
        writable: false
    },
    CTRL_GENERAL_PORPOSE_CONTROLLER8: {
        value: 0x53,
        writable: false
    },
    CTRL_PORTAMENTO: {
        value: 0x54,
        writable: false
    },
    CTRL_UNDEFINED17: {
        value: 0x55,
        writable: false
    },
    CTRL_UNDEFINED18: {
        value: 0x56,
        writable: false
    },
    CTRL_UNDEFINED19: {
        value: 0x57,
        writable: false
    },
    CTRL_HIGH_RESOLUTION_VELOCITY_PREFIX: {
        value: 0x58,
        writable: false
    },
    CTRL_UNDEFINED20: {
        value: 0x59,
        writable: false
    },
    CTRL_UNDEFINED21: {
        value: 0x5A,
        writable: false
    },
    CTRL_EFFECTS1_DEPTH: {
        value: 0x5B,
        writable: false
    },
    CTRL_EFFECTS2_DEPTH: {
        value: 0x5C,
        writable: false
    },
    CTRL_EFFECTS3_DEPTH: {
        value: 0x5D,
        writable: false
    },
    CTRL_EFFECTS4_DEPTH: {
        value: 0x5E,
        writable: false
    },
    CTRL_EFFECTS5_DEPTH: {
        value: 0x5F,
        writable: false
    },
    CTRL_DATA_INCREMENT: {
        value: 0x60,
        writable: false
    },
    CTRL_DATA_DECREMENT: {
        value: 0x61,
        writable: false
    },
    CTRL_NON_REGISTARED_PARAMETER_NUMBER_LSB: {
        value: 0x62,
        writable: false
    },
    CTRL_NON_REGISTARED_PARAMETER_NUMBER_MSB: {
        value: 0x63,
        writable: false
    },
    CTRL_REGISTARED_PARAMETER_NUMBER_LSB: {
        value: 0x64,
        writable: false
    },
    CTRL_REGISTARED_PARAMETER_NUMBER_MSB: {
        value: 0x65,
        writable: false
    },
    CTRL_UNDEFINED22: {
        value: 0x66,
        writable: false
    },
    CTRL_UNDEFINED23: {
        value: 0x67,
        writable: false
    },
    CTRL_UNDEFINED24: {
        value: 0x68,
        writable: false
    },
    CTRL_UNDEFINED25: {
        value: 0x69,
        writable: false
    },
    CTRL_UNDEFINED26: {
        value: 0x6A,
        writable: false
    },
    CTRL_UNDEFINED27: {
        value: 0x6B,
        writable: false
    },
    CTRL_UNDEFINED28: {
        value: 0x6C,
        writable: false
    },
    CTRL_UNDEFINED29: {
        value: 0x6D,
        writable: false
    },
    CTRL_UNDEFINED30: {
        value: 0x6E,
        writable: false
    },
    CTRL_UNDEFINED31: {
        value: 0x6F,
        writable: false
    },
    CTRL_UNDEFINED32: {
        value: 0x70,
        writable: false
    },
    CTRL_UNDEFINED33: {
        value: 0x71,
        writable: false
    },
    CTRL_UNDEFINED34: {
        value: 0x72,
        writable: false
    },
    CTRL_UNDEFINED35: {
        value: 0x73,
        writable: false
    },
    CTRL_UNDEFINED36: {
        value: 0x74,
        writable: false
    },
    CTRL_UNDEFINED37: {
        value: 0x75,
        writable: false
    },
    CTRL_UNDEFINED38: {
        value: 0x76,
        writable: false
    },
    CTRL_UNDEFINED39: {
        value: 0x77,
        writable: false
    },
    CTRL_ALL_SOUND_OFF: {
        value: 0x78,
        writable: false
    },
    CTRL_RESET_ALL_CONTROLLER: {
        value: 0x79,
        writable: false
    },
    CTRL_LOCAL_CONTROL: {
        value: 0x7A,
        writable: false
    },
    CTRL_ALL_NOTE_OFF: {
        value: 0x7B,
        writable: false
    },
    CTRL_MIDI_MODE_OMNI_OFF: {
        value: 0x7C,
        writable: false
    },
    CTRL_MIDI_MODE_OMNI_ON: {
        value: 0x7D,
        writable: false
    },
    CTRL_MIDI_MODE_MONO_MODE: {
        value: 0x7E,
        writable: false
    },
    CTRL_MIDI_MODE_POLY_MODE: {
        value: 0x7F,
        writable: false
    }
});

/**
 * MIDIを初期化します。
 * 
 * @param {MIDIOption} opt MIDIアクセスリクエストに使用されるMIDIOptionを設定します。(未設定可)
 * @param {function} successCallback 初期化成功時に呼び出されるメソッドです。(未設定可)<br/>引数にはMIDIAccessが渡されます。
 * @param {function} failureCallback 初期化失敗時に呼び出されるメソッドです。(未設定可)<br/>引数にはDOMExceptionが渡されます
 * @memberOf snd.MIDI
 */
snd.MIDI.init = function(opt, successCallback, failureCallback) {
    if (navigator && typeof(navigator.requestMIDIAccess) == "function") {
        navigator.requestMIDIAccess(opt).then(
                function(midiAccess) {
                    var values = null, v = null;
                    
                    snd.MIDI._MIDI_ACCESS = midiAccess;
                    
                    values = snd.MIDI._MIDI_ACCESS.inputs.values();
                    while (!(v = values.next()).done) {
                        snd.MIDI._INPUTS[v.value.id] = v.value;
                    }
                    
                    values = snd.MIDI._MIDI_ACCESS.outputs.values();
                    while (!(v = values.next()).done) {
                        snd.MIDI._OUTPUTS[v.value.id] = v.value;
                    }
                    
                    if (typeof(successCallback) == "function") {
                        successCallback(snd.MIDI.MIDI_ACCESS);
                    }
                },
                function(domException) {
                    if (typeof(failureCallback) == "function") {
                        failureCallback(domException);
                    } else {
                        console.log(domException);
                    }
                }
            );
    } else {
        failureCallback(undefined);
    }
};

/**
 * MIDI機能でよく使う機能をまとめたネームスペースです
 * @namespace snd.MIDI.util
 */
snd.MIDI.util = {};

/**
 * MIDIメッセージからチャンネルNoが取得できる場合、そのチャンネルNoを返します。<br/>
 * 取得できなかった場合はundefinedを返します。
 * @param {Array} bytes MIDIメッセージ
 * @returns {Integer} チャンネルが取得できるメッセージの場合はそのチャンネルNo、チャンネルが取得できない場合はundefined
 * @memberOf snd.MIDI.util
 */
snd.MIDI.util.getCh = function(bytes) {
    if (bytes.length <= 0) {
        return undefined;
    }
    
    if (bytes[0] & snd.MIDI.NOTE_OFF != 0
            || bytes[0] & snd.MIDI.NOTE_ON != 0
            || bytes[0] & snd.MIDI.POLYPHONIC_KEY_PRESSURE != 0
            || bytes[0] & snd.MIDI.CONTROL_CHANGE != 0
            || bytes[0] & snd.MIDI.PROGRAM_CHANGE != 0
            || bytes[0] & snd.MIDI.CHANNEL_PRESSURE != 0
            || bytes[0] & snd.MIDI.PITCH_BEND != 0) {
        return bytes[0] & snd.MIDI.CH_FILTER;
    } else {
        return undefined;
    }
};

/**
 * MIDIメッセージで渡されるMIDIノートNo(中央ドが60)を周波数に変換して返します。<br/>
 * MIDIノートNoの範囲外(負の値など)でも計算結果を返します。
 * @param {type} noteNo MIDIノートNo
 * @returns {Number} 周波数
 * @memberOf snd.MIDI.util
 */
snd.MIDI.util.toHz = function(noteNo) {
    return 440.0 * Math.pow(2, (noteNo - 69) / 12);
};
