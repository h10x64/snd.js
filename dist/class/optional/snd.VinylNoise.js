
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
        define(['snd.AudioUnit'], factory);
    } else if (typeof exports === 'object') {
        // Node
    } else {
        // Browser globals (root is window)
        root.snd = factory(root.snd);
    }
}(this, function(snd) {
    var calcNoise = function(buffer, maxPetitNoiseSize, minPetitNoiseSize, maxNoiseSize, probability) {
        for (var ch = 0; ch < buffer.numberOfChannels; ch++) {
            var chBuf = buffer.getChannelData(ch);
            var petitNoisePos = 0;
            
            for (i = 0; i < buffer.length; i++) {
                chBuf[i] = (Math.random() * 2.0 - 1.0) * maxNoiseSize;
            }
            
            if (Math.random() < probability && buffer.length > 0) {
                petitNoisePos = Math.round(Math.random() * (buffer.length - 1));
                chBuf[petitNoisePos] = ((Math.random() >= 0.5) ? 1.0 : -1.0) * ((Math.random() * (maxPetitNoiseSize - minPetitNoiseSize)) + minPetitNoiseSize);
            }
        }
    };
    
    /**
     * プチノイズ付きノイズ源を新しく生成します。
     * @class レコードで再生したときのようなアナログなプチノイズ付きのホワイトノイズを生成します。<br/>
     * 音の感じはBiquadFilterを使って調整して下さい。<br/>
     * probabilityを大きくすれば、レコードを横断するヒケ傷があるような定期的なプチノイズになり、小さくするとホコリがあるようなランダムなノイズになります。<br/>
     * ホコリまみれのレコードはoftenとprobabilityを小さくします。<br/>
     * oftenを1にしても不足な場合はbufferLengthを短くする事を検討して下さい。<br/>
     * 45回転のレコードに直線の傷があるような場合、oftenを57(≒ (1[回転] / (45[rpm] / 60[sec]) * 44100[サンプリングレート]) / 1024[バッファ長])、probabilityを大きくします。<br/>
     * @property {Integer} often 何回に一度プチノイズを発生させるかを設定する値です。<br/>
     * 正の整数を入れるようにしてください。<br/>
     * たとえば、44100Hzで再生している場合、bufferLength = 1024, often = 100とすることで約2秒に一度プチノイズがランダムに発生するようになります。
     * @property {Number} probability プチノイズを発生させる確率を設定します。<br/>
     * 1.0で100%(often回に1度確実に)プチノイズが発生し、0.0で発生しなくなります。
     * @property {Number} maxPetitNoiseSize プチノイズの最大音量を設定する値です。<br/>
     * 1.0が最大音量、0.0で無音になります。<br/>
     * 1.0以上は1.0に、0.0以下は0.0に設定されます。<br/>
     * minPetitNoiseSize以下の値が渡された場合、minPetitNoiseSizeも同時に同じ値に設定されます。
     * @property {Number} minPetitNoiseSize プチノイズの最小音量を設定する値です。<br/>
     * 1.0が最大音量、0.0で無音になります。<br/>
     * 1.0以上は1.0に、0.0以下は0.0に設定されます。<br/>
     * maxPetitNoiseSize以上の値が渡された場合、maxPetitNoiseSizeも同時に同じ値に設定されます。
     * @property {Number} maxNoiseSize ホワイトノイズの最大音量を設定する値です。<br/>
     * 1.0が最大音量、0.0で無音になります。<br/>
     * 1.0以上は1.0に、0.0以下は0.0に設定されます。<br/>
     * @param {type} id 生成するオブジェクトのID
     * @param {type} bufferLength 一度に生成するノイズのバッファ長<br/>デフォルト値は1024です。
     * @param {type} channel チャネル数<br/>デフォルト値は1(モノラル)です。
     * @returns {snd.VinylNoise} 生成されたオブジェクト
     */
    snd.VinylNoise = function(id, bufferLength, channel) {
        snd.AudioUnit.apply(this, arguments);

        var _this = this;
        
        this._noise = snd.AUDIO_CONTEXT.createScriptProcessor(
                (!bufferLength) ? 1024 : bufferLength,
                1,
                (!channel) ? 1 : channel);
        this._gain = snd.AUDIO_CONTEXT.createGain();
        
        this._num = 0;
        
        this._gain.channelCount = (!channel) ? 1 : channel;
        this._noise.onaudioprocess = function(evt) {
            if (_this._num == 0) {
                calcNoise(evt.outputBuffer, _this.maxPetitNoiseSize, _this.minPetitNoiseSize, _this.maxNoiseSize, _this.probability);
            } else {
                calcNoise(evt.outputBuffer, _this.maxPetitNoiseSize, _this.minPetitNoiseSize, _this.maxNoiseSize, 0);
            }
            _this._num = (_this._num + 1) % _this.often;
        };

        /* DEFINE PROPERTIES */
        Object.defineProperties(this, {
            channelCount: {
                get: function() {
                    return this._status.channelCount;
                }
            },
            volume: {
                get: function() {
                    return this._gain.gain.value;
                },
                set: function(val) {
                    this._gain.gain.value = val;
                    this._status.gain = val;
                }
            },
            volumeParam: {
                get: function() {
                    var ret = this._gain.gain;
                    ret.id = this.id + ".gain";
                    return ret;
                }
            },
            often: {
                get: function() {
                    return this._status.often;
                },
                set: function(val) {
                    this._status.often = Math.abs((val <= 1) ? 1 : val);
                }
            },
            maxPetitNoiseSize: {
                get: function() {
                    return this._status.maxPetitNoiseSize;
                },
                set: function(val) {
                    this._status.maxPetitNoiseSize = (val < 0.0) ? 0.0 : val;
                    if (this._status.maxPetitNoiseSize < this._status.minPetitNoiseSize) {
                        this._status.minPetitNoiseSize = this._status.maxPetitNoiseSize;
                    }
                }
            },
            minPetitNoiseSize: {
                get: function() {
                    return this._status.minPetitNoiseSize;
                },
                set: function(val) {
                    this._status.minPetitNoiseSize = (val < 0.0) ? 0.0 : val;
                    if (this._status.minPetitNoiseSize > this._status.maxPetitNoiseSize) {
                        this._status.maxPetitNoiseSize = this._status.minPetitNoiseSize;
                    }
                }
            },
            maxNoiseSize: {
                get: function() {
                    return this._status.maxNoiseSize;
                },
                set: function(val) {
                    this._status.maxNoiseSize = (val < 0.0) ? 0.0 : val;
                }
            },
            probability: {
                get: function() {
                    return this._status.probability;
                },
                set: function(val) {
                    this._status.probability = val;
                }
            }
        });
        
        this._noise.connect(this._gain);
    };
    snd.VinylNoise.prototype = Object.create(snd.AudioUnit.prototype);
    snd.VinylNoise.prototype.constructor = snd.VinylNoise;
    
    snd.VinylNoise.prototype.getParamDescription = function() {
        var ret = snd.AudioUnit.prototype.getParamDescription.apply(this, arguments);
        
            ret.volume = {
                type: snd.params.type.VALUE,
                default: 1.0,
                max: Infinity,
                min: -Infinity
            };
            ret.often = {
                type: snd.params.type.VALUE,
                default: 57,
                max: Infinity,
                min: 0
            };
            ret.maxPetitNoiseSize = {
                type: snd.params.type.VALUE,
                default: 0.5,
                max: Infinity,
                min: 0
            };
            ret.minPetitNoiseSize = {
                type: snd.params.type.VALUE,
                default: 0.0,
                max: Infinity,
                min: 0
            };
            ret.maxNoiseSize = {
                type: snd.params.type.VALUE,
                default: 0.0025,
                max: Infinity,
                min: 0
            };
            ret.probability = {
                type: snd.params.type.VALUE,
                default: 0.8,
                max: 1.0,
                min: 0
            }
            ret.volumeParam = {
                type: snd.params.type.AUDIO_PARAM,
                value: this.volumeParam,
                default: ret.volume.default,
                max: ret.volume.max,
                min: ret.volume.min
            };
        
        return ret;
    };
    
    snd.VinylNoise.prototype.createStatus = function() {
        return new snd.VinylNoise.Status();
    };
    
    snd.VinylNoise.prototype.getConnector = function() {
        return undefined;
    };
    
    snd.VinylNoise.prototype.getOutputConnector = function() {
        return this._gain;
    };
    
    snd.VinylNoise.prototype.loadData = function(data) {
        snd.AudioUnit.prototype.loadData.apply(this, arguments);

        this.gain = data.gain;
    };

    snd.VinylNoise.Status = function() {
        snd.AudioUnit.Status.apply(this, arguments);
        this.gain = 1.0;
        this.channelCount = 1;
        this.often = 57;
        this.maxPetitNoiseSize = 0.5;
        this.minPetitNoiseSize = 0.0;
        this.maxNoiseSize = 0.0025;
        this.probability = 0.80;
    };
    snd.VinylNoise.Status.prototype = Object.create(snd.AudioUnit.Status.prototype);
    snd.VinylNoise.Status.prototype.constructor = snd.VinylNoise.Status;
    
    return snd;
}));
