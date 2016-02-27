(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD
        define(['snd.MIDI'], factory);
    } else if (typeof exports === 'object') {
        // Node
    } else {
        // Browser globals (root is window)
        root.snd = factory(root.snd);
    }
}(this, function(snd) {

    /**
     * MIDI機能でよく使う機能をまとめたネームスペースです
     * @namespace snd.MIDI.util
     */
    snd.MIDI.util = {};

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
}));
