
/**
 * snd.js
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
 
 

snd.CLASS_DEF.push(function() {
    /**
     * コンストラクタは使用せず、snd.MASTERを使用してください。
     * @class ミキサークラスです。<br/>
     * snd.initメソッドでsnd.MASTERにインスタンスが生成されます。
     */
    snd.AudioMaster = function() {
        this.unitList = {};
        this._gain = snd.AUDIO_CONTEXT.createGain();
        this._gain.channelCount = snd.MAX_CHANNEL_COUNT;
        this._gain.connect(snd.AUDIO_CONTEXT.destination);
        this.id = snd.AudioMaster.ID;
    };

    snd.AudioMaster.ID = "snd.MASTER";

    /**
     * 新しくaudioUnitで指定されたユニットを接続します。
     * @param {type} key 接続するユニットを表すキー値
     * @param {snd.AudioUnit} audioUnit 接続するユニット
     */
    snd.AudioMaster.prototype.connectAudioUnit = function(key, audioUnit) {
        if (key == null && audioUnit.id == null) {
            throw "key == null && audioUnit.id == null";
        }

        if (key == null) {
            if (this.unitList[audioUnit.id] == null) {
                this.unitList[audioUnit.id] = audioUnit;
                audioUnit.connect(this._gain, snd.AudioMaster.ID);
            }
        } else {
            this.unitList[key] = audioUnit;
            audioUnit.connect(this._gain, snd.AudioMaster.ID);
        }
    };

    /**
     * 接続済みのユニットを取得します。
     * @param {String} key キー値
     */
    snd.AudioMaster.prototype.getAudioUnit = function(key) {
        return this.unitList[key];
    };

    /**
     * 接続されたユニットを切断します。
     * @param {String} key 切断するユニット
     */
    snd.AudioMaster.prototype.disconnectAudioUnit = function(key) {
        var audioUnit = this.unitList[key];
        audioUnit.getConnector().disconnect(this._gain);
        delete this.unitList[key];
    };

    snd.AudioMaster.prototype.getConnector = function() {
        return this._gain;
    };
});
