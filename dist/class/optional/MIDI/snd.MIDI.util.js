
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
 
 

define(["snd.MIDI"], function(snd) {

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
    
    return snd;
});
