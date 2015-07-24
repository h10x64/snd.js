
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
        define(['snd', 'snd.PosDir'], factory);
    } else if (typeof exports === 'object') {
        // Node
    } else {
        // Browser globals (root is window)
        root.snd = factory(root.snd);
    }
}(this, function(snd) {
    /**
     * 新しいインスタンスを作ります。
     * @class リスナを表すクラスです。<br/>
     * AudioContext#Listenerをラップしています。<br/>
     * <a href="#setListener">setListener</a>メソッドを呼び出すまでは実際の出力へは反映されませんが、setPositionなどで設定された位置情報は保持されます。<br/>
     * （setListenerメソッドでListenerをセットした時点でListenerにこのオブジェクトの姿勢情報が反映されるようになります。）<br/>
     * @param {Listener} listener AudioContext.Listener (nullでもよい)
     */
    snd.Listener = function(listener) {
        snd.PosDir.apply(this, arguments);
        this.listener = listener;

        if (listener != null) {
            this.listener.setOrientation(this.dir.x, this.dir.y, this.dir.z, this.up.x, this.up.y, this.up.z);
        }
    };
    snd.Listener.prototype = Object.create(snd.PosDir.prototype);
    snd.Listener.prototype.constructor = snd.Listener;

    /**
     * listenerを設定します。<br/>
     * このメソッドで設定されるまで、WebAudioAPIのlistenerには反映されません。
     * @param {Listener} AudioContext.Listener
     */
    snd.Listener.prototype.setListener = function(listener) {
        this.listener = listener;
        this.setPosition(this.pos.x, this.pos.y, this.pos.z);
        this.setOrientation(this.dir.x, this.dir.y, this.dir.z, this.up.x, this.up.y, this.up.z);
    };

    /**
     * このオブジェクトに設定されているlistenerをnullへリセットします。
     */
    snd.Listener.prototype.resetListener = function() {
        this.setListener(null);
    };

    /**
     * リスナの位置を設定します。
     * @param {float} x X軸の値
     * @param {float} y Y軸の値
     * @param {float} z Z軸の値
     */
    snd.Listener.prototype.setPosition = function(x, y, z) {
        snd.PosDir.prototype.setPosition.call(this, x, y, z);
        if (this.listener != null) {
            this.listener.setPosition(
                    snd.SOUND_ENVIRONMENT.unit * this.pos.x,
                    snd.SOUND_ENVIRONMENT.unit * this.pos.y,
                    snd.SOUND_ENVIRONMENT.unit * this.pos.z);
        }
    };

    /**
     * リスナの向きを設定します。
     * @param {flaot} x 正面方向ベクトルのX値
     * @param {flaot} y 正面方向ベクトルのY値
     * @param {flaot} z 正面方向ベクトルのZ値
     * @param {flaot} ux 上方向ベクトルのX値
     * @param {flaot} uy 上方向ベクトルのY値
     * @param {flaot} uz 上方向ベクトルのZ値
     */
    snd.Listener.prototype.setOrientation = function(x, y, z, ux, uy, uz) {
        snd.PosDir.prototype.setOrientation.call(this, x, y, z, ux, uy, uz);
        if (this.listener != null) {
            this.listener.setOrientation(this.dir.x, this.dir.y, this.dir.z, this.up.x, this.up.y, this.up.z);
        }
    };

    /**
     * 速度を設定します。
     * @param {type} x X軸方向の速度
     * @param {type} y Y軸方向の速度
     * @param {type} z Z軸方向の速度
     */
    snd.Listener.prototype.setVelocity = function(x, y, z) {
        if (this.listener != null) {
            this.listener.setVelocity(
                    snd.SOUND_ENVIRONMENT.unit * x,
                    snd.SOUND_ENVIRONMENT.unit * y,
                    snd.SOUND_ENVIRONMENT.unit * z);
        }
    };

    return snd;
}));

