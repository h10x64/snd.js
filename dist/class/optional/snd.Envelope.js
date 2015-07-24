
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
    snd.Envelope = function(id) {
        snd.AudioUnit.apply(this, arguments);
        
        var _this = this;
        
        this._startAt = -1;
        this._when = 0;
        this._offset = 0;
        this._duration = Infinity;
        this._stopAt = -1;
        this._stopWhen = Infinity;
        this._onendedFired = false;
        
        this._proc = snd.AUDIO_CONTEXT.createScriptProcessor(1024, 1, 1);
        
        this._dummyGain = snd.AUDIO_CONTEXT.createGain();
        this._dummyGain.gain.value = 0.000000001;
        this._dummyGain.connect(snd.MASTER.getConnector());
        
        this._onaudioprocess = function(evt) {
            var buffer = evt.outputBuffer;
            var elapsedTime = evt.playbackTime - _this._startAt;
            var stopTime = Math.min(_this._duration + _this._when, _this._stopWhen);
                
            if ((_this._startAt < 0) || (stopTime < elapsedTime)) {
                for (var i = 0; i < buffer.length; i++) {
                    for (var ch = 0; ch < buffer.numberOfChannels; ch++) {
                        buffer.getChannelData(ch)[i] = 0;
                    }
                }
                
                return;
            }
            
            if (_this._startAt == 0) {
                _this._startAt = evt.playbackTime;
            }

            for (var i = 0; i < buffer.length; i++) {
                var dt = i / snd.SAMPLE_RATE;
                var t = elapsedTime + dt;

                if (_this._when <= t && t <= stopTime) {
                    var val = _this.getValueAt(Math.max(0, t - _this._when + _this._offset));

                    for (var ch = 0; ch < buffer.numberOfChannels; ch++) {
                        buffer.getChannelData(ch)[i] = val;
                    }
                } else {
                    for (var ch = 0; ch < buffer.numberOfChannels; ch++) {
                        buffer.getChannelData(ch)[i] = 0;
                    }
                }
            }
            if ((stopTime < elapsedTime + buffer.length / snd.SAMPLE_RATE) && !_this._onendedFired) {
                _this.onended(snd.CURRENT_TIME);
                _this._onendedFired = true;
            }
        };
        this._proc.onaudioprocess = this._onaudioprocess;
        
        this._proc.connect(this._dummyGain);
    };
    snd.Envelope.prototype = Object.create(snd.AudioUnit.prototype);
    snd.Envelope.prototype.constructor = snd.Envelope;
    
    snd.Envelope.prototype.start = function(when, offset, duration) {
        this._startAt = 0;
        this._when = (when >= 0) ? when : 0;
        this._offset = (offset >= 0) ? offset : 0;
        this._duration = (duration >= 0) ? duration : Infinity;
        this._stopWhen = Infinity;
        this._onendedFired = false;
    };
    
    snd.Envelope.prototype.stop = function(when) {
        this._startAt = -1;
        this._stopWhen = snd.CURRENT_TIME - this._startAt + (when < 0) ? 0 : when;
    };
    
    snd.Envelope.prototype.onended = function() {
    };
    
    /**
     * 
     * @param {Number} elapsedTime このエンベロープが開始してからの時間[秒]
     * @returns {Number} 
     */
    snd.Envelope.prototype.getValueAt = function(elapsedTime) {
        // PLEASE OVERRIDE ME
    };
    
    return snd;
}));
