
/**
 * snd.js
 * three.js plugin
 * 
 * The MIT License (MIT)
 * copyright (c) 2014 N_H <h.10x64@gmail.com>
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
 
 

define(["snd", "snd.BufferSource", "snd.SoundNode"], function(snd) {
    /**
     * 新しいインスタンスを作成します。<br/>
     * sourceで渡すオブジェクトは、snd.BufferSoundSourceクラスである必要があります。
     * @param {String} id この音源オブジェクトのID
     * @param {snd.BufferSource} source 使用する音源
     * @class BufferSourceクラスを使用するSoundNodeクラスです。<br/>
     * startやstopなどの各種メソッドを移譲しているため、音源とエフェクトの区別をつけないまま操作が可能です。<br/>
     * MediaElementAudioSource/Nodeと比較して、一時停止ができないなどの不便さがありますが、
     * なめらかにループがつながるなどの利点があります。<br/>
     * 用途によって使い分けてください。
     */
    snd.BufferSoundNode = function(id, source) {
        snd.SoundNode.apply(this, arguments);

        if (source == null) {
            this.source = new snd.BufferSource(id + "_src");
        } else {
            this.source = source;
        }
        this.source.connect(this);
    };
    snd.BufferSoundNode.prototype = Object.create(snd.SoundNode.prototype);
    snd.BufferSoundNode.prototype.constructor = snd.BufferSoundNode;

    /**
     * オーディオバッファを設定するメソッドです。
     * @param {AudioBuffer} audioBuffer
     */
    snd.BufferSoundNode.prototype.setAudioBuffer = function(audioBuffer) {
        this.source.setAudioBuffer(audioBuffer);
    };


    /**
     * この音源の再生を開始します。<br/>
     * 一時停止はできません。<br/>
     * start()とすると、すぐにデータの頭から終わりまでの再生が開始されます。
     * 
     * @param {Number} when 何秒後に再生を開始するか
     * @param {Number} offset 音源の再生開始位置（単位:秒）
     * @param {Number} duration 音源の再生終了位置（単位:秒）
     */
    snd.BufferSoundNode.prototype.start = function(when, offset, duration) {
        this.source.start(when, offset, duration);
    };

    /**
     * この音源を停止します。<br/>
     * 停止後も再度startメソッドを呼ぶことで何度でも再生が可能です。
     * @param {Number} when 何秒後に再生を停止するか 
     */
    snd.BufferSoundNode.prototype.stop = function(when) {
        this.source.stop(when);
    };


    /**
     * この音源がループするかどうかを設定します。
     * @param {boolean} status ループするか否か
     */
    snd.BufferSoundNode.prototype.setLoop = function(status) {
        this.source.setLoop(status);
    };

    /**
     * この音源がループするかどうかを取得します。
     * @returns {Boolean} この音源がループするか否か
     */
    snd.BufferSoundNode.prototype.getLoop = function() {
        return this.source.getLoop();
    };

    /**
     * ループの開始位置を設定します。
     * @param {double} when ループの開始位置[秒]
     */
    snd.BufferSoundNode.prototype.setLoopStart = function(when) {
        this.source.setLoopStart(when);
    };

    /**
     * ループの開始位置を取得します。
     * @returns {double} ループの開始位置[秒]
     */
    snd.BufferSoundNode.prototype.getLoopStart = function() {
        return this.source.getLoopStart();
    };

    /**
     * ループの終端を設定します。
     * @param {double} when
     */
    snd.BufferSoundNode.prototype.setLoopEnd = function(when) {
        this.source.setLoopEnd(when);
    };

    /**
     * ループの終端を取得します。
     * @returns {double} ループの終了位置[秒]
     */
    snd.BufferSoundNode.prototype.getLoopEnd = function() {
        return this.source.getLoopEnd()
    };

    /* Add/Remove Event Listener Methods */

    /**
     * 渡されたイベントリスナーをこの音源の再生終了イベントのリスナーリストへ追加します。<br/>
     * 追加されたlistenerは、この音源の再生が終了したとき(onendedイベント発生時)にコールバックメソッドとして呼び出されます<br/>
     * @param {function} listener 音源の再生終了イベント発生時に呼び出されるコールバックメソッド
     */
    snd.BufferSoundNode.prototype.addOnEndedEventListener = function(listener) {
        this.source.addOnEndedEventListener(listener);
    };

    /**
     * 渡されたイベントリスナーをこの音源の再生終了イベントのリスナーリストから削除します。<br/>
     * 与えられたlistenerが見つかった場合、削除を行いtrueを返します。<br/>
     * 見つからなかった場合は、何もせずにfalseを返します。
     * @param {function} listener イベントのリスナー
     * @return {boolean} listenerが見つかり、実際に削除が行われたらtrue, そうでなければfalse
     */
    snd.BufferSoundNode.prototype.removeOnEndedEventListener = function(listener) {
        return this.source.removeOnEndedEventListener(listener);
    };

    return snd;
});
