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
