
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
 
 

(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD
        define(['snd.MIDIIn','snd.MIDIOut'], factory);
    } else if (typeof exports === 'object') {
        // Node
    } else {
        // Browser globals (root is window)
        root.snd = factory(root.snd);
    }
}(this, function(snd) {

    if (!snd.MIDI) {
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
    }

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
        if (navigator && typeof (navigator.requestMIDIAccess) == "function") {
            navigator.requestMIDIAccess(opt).then(
                    function(midiAccess) {
                        var values = null, v = null;

                        snd.MIDI._MIDI_ACCESS = midiAccess;

                        values = snd.MIDI._MIDI_ACCESS.inputs.values();
                        while (!(v = values.next()).done) {
                            snd.MIDI._INPUTS[v.value.name] = new snd.MIDI.MIDIIn(v.value);
                        }

                        values = snd.MIDI._MIDI_ACCESS.outputs.values();
                        while (!(v = values.next()).done) {
                            snd.MIDI._OUTPUTS[v.value.name] = new snd.MIDI.MIDIOut(v.value);
                        }

                        if (typeof (successCallback) == "function") {
                            successCallback(snd.MIDI.MIDI_ACCESS);
                        }
                    },
                    function(domException) {
                        if (typeof (failureCallback) == "function") {
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
    
    return snd;
}));
