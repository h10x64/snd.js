
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
 
 

(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD
        define(['snd.AudioUnit', 'snd.PosDir'], factory);
    } else if (typeof exports === 'object') {
        // Node
    } else {
        // Browser globals (root is window)
        root.snd = factory(root.snd);
    }
}(this, function(snd) {
    /**
     * @class PannerNodeを使用するパンニングに対応したユニットです。
     * @param {String} id このユニットを表す固有のID
     */
    snd.SoundNode = function(id) {
        snd.AudioUnit.apply(this, arguments);
        snd.PosDir.apply(this, arguments);

        this.gain = snd.AUDIO_CONTEXT.createGain();
        this.pannerNode = snd.AUDIO_CONTEXT.createPanner();

        this.gain.connect(this.pannerNode);
    };
    snd.SoundNode.prototype = Object.create(snd.AudioUnit.prototype);
    snd.SoundNode.prototype.constructor = snd.SoundNode;

    /**
     * @see snd.AudioUnit#connect
     */
    snd.SoundNode.prototype.connect = function(connectTo, chOut, chIn, id) {
        snd.AudioUnit.prototype.connect.apply(this, arguments);

        if (connectTo.isAudioUnit) {
            this.pannerNode.connect(connectTo.getConnector());
        } else {
            this.pannerNode.connect(connectTo);
        }
    };

    /**
     * @see snd.AudioUnit#disconnect
     */
    snd.SoundNode.prototype.disconnect = function(disconnectFrom) {
        snd.AudioUnit.prototype.disconnect.apply(this, arguments);

        if (disconnectFrom.isAudioUnit) {
            this.pannerNode.disconnect(disconnectFrom.getConnector());
        } else {
            this.pannerNode.disconnect(disconnectFrom);
        }
    };

    /**
     * @see snd.AudioUnit#getConnector
     */
    snd.SoundNode.prototype.getConnector = function() {
        return this.gain;
    };

    /**
     * メインボリュームを取得します。<br/>
     * @returns {snd.GainNode} this.gain
     */
    snd.SoundNode.prototype.getGain = function() {
        return this.gain;
    };


    snd.SoundNode.start = function(when, offset, duration) {
        // PLEASE OVERIDE ME
    };

    snd.SoundNode.stop = function(when) {
        // PLEASE OVERRIDE ME
    };

    snd.SoundNode.pause = function() {
        // PLEASE OVERRIDE ME
    };

    /**
     * この音源の位置を設定します。
     * @param {type} x 設定する位置のX値
     * @param {type} y 設定する位置のY値
     * @param {type} z 設定する位置のZ値
     */
    snd.SoundNode.prototype.setPosition = function(x, y, z) {
        snd.PosDir.prototype.setPosition.call(this, x, y, z);
        this.pannerNode.setPosition(
                snd.SOUND_ENVIRONMENT.unit * this.pos.x,
                snd.SOUND_ENVIRONMENT.unit * this.pos.y,
                snd.SOUND_ENVIRONMENT.unit * this.pos.z);
    };

    /**
     * この音源の向きを設定します
     * @param {Number} x 正面方向ベクトルのX値
     * @param {Number} y 正面方向ベクトルのY値
     * @param {Number} z 正面方向ベクトルのZ値
     */
    snd.SoundNode.prototype.setDir = function(x, y, z) {
        snd.PosDir.prototype.setDir.call(this, x, y, z);
        this.pannerNode.setOrientation(this.dir.x, this.dir.y, this.dir.z);
    };

    /**
     * この音源の上向きベクトルを設定します。
     * @param {Number} x 上向きベクトルのX値
     * @param {Number} y 上向きベクトルのY値
     * @param {Number} z 上向きベクトルのZ値
     */
    snd.SoundNode.prototype.setUp = function(x, y, z) {
        snd.PosDir.prototype.setUp.call(this, x, y, z);
    };

    /**
     * この音源の向きを設定します
     * @param {Number} dx 正面方向ベクトルのX値
     * @param {Number} dy 正面方向ベクトルのY値
     * @param {Number} dz 正面方向ベクトルのZ値
     * @param {Number} ux 上方向ベクトルのX値
     * @param {Number} uy 上方向ベクトルのY値
     * @param {Number} uz 上方向ベクトルのZ値
     */
    snd.SoundNode.prototype.setOrientation = function(dx, dy, dz, ux, uy, uz) {
        snd.PosDir.prototype.setOrientation.call(this, dx, dy, dz, ux, uy, uz);
        this.pannerNode.setOrientation(this.dir.x, this.dir.y, this.dir.z);
    };

    /**
     * この音源の速度を設定します。
     * @param {type} x 速度ベクトルのX値
     * @param {type} y 速度ベクトルのY値
     * @param {type} z 速度ベクトルのZ値
     */
    snd.SoundNode.prototype.setVelocity = function(x, y, z) {
        this.pannerNode.setVelocity(
                snd.SOUND_ENVIRONMENT.unit * x,
                snd.SOUND_ENVIRONMENT.unit * y,
                snd.SOUND_ENVIRONMENT.unit * z);
    };

    return snd;
}));

