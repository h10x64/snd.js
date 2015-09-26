
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

    snd.MediaStreamAudioDestination = function(id) {
        snd.AudioUnit.apply(this, arguments);
        
        this._dest = snd.AUDIO_CONTEXT.createMediaStreamDestination();
        this._gain = snd.AUDIO_CONTEXT.createGain();
        
        this._gain.connect(this._dest);
        
        Object.defineProperties(this, {
            volume: {
                get: function() {
                    return this._gain.gain.value;
                },
                set: function(val) {
                    this._gain.gain.value = val;
                }
            },
            volumeParam: {
                get: function() {
                    return this._gain.gain;
                }
            },
            stream: {
                get: function() {
                    return this._dest.stream;
                }
            }
        });
    };
    snd.MediaStreamAudioDestination.prototype = Object.create(snd.AudioUnit.prototype);
    snd.MediaStreamAudioDestination.prototype.constructor = snd.MediaStreamAudioDestination;

    snd.MediaStreamAudioDestination.prototype.getConnector = function() {
        return this._gain;
    };
    
    snd.STREAM_MASTER = new snd.MediaStreamAudioDestination("STREAM_MASTER");

    return snd;
}));
