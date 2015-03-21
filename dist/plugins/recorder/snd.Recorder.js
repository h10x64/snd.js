/**
 * snd.recorder.js
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
 * 
 * recorder.js is :
 * 
 * copyright (c) 2013 Matt Diamond
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

    var WORKER_PATH = 'recorderWorker.js';

    var Recorder = function(source, cfg) {
        var config = cfg || {};
        var bufferLen = config.bufferLen || 4096;
        var numChannels = config.numChannels || 2;
        this.context = source.context;
        this.node = (this.context.createScriptProcessor ||
                this.context.createJavaScriptNode).call(this.context,
                bufferLen, numChannels, numChannels);
        var worker = new Worker(config.workerPath || WORKER_PATH);
        worker.postMessage({
            command: 'init',
            config: {
                sampleRate: this.context.sampleRate,
                numChannels: numChannels
            }
        });
        var recording = false,
                currCallback;

        this.node.onaudioprocess = function(e) {
            if (!recording)
                return;
            var buffer = [];
            for (var channel = 0; channel < numChannels; channel++) {
                buffer.push(e.inputBuffer.getChannelData(channel));
            }
            worker.postMessage({
                command: 'record',
                buffer: buffer
            });
        }

        this.configure = function(cfg) {
            for (var prop in cfg) {
                if (cfg.hasOwnProperty(prop)) {
                    config[prop] = cfg[prop];
                }
            }
        }

        this.record = function() {
            recording = true;
        }

        this.stop = function() {
            recording = false;
        }

        this.clear = function() {
            worker.postMessage({command: 'clear'});
        }

        this.getBuffer = function(cb) {
            currCallback = cb || config.callback;
            worker.postMessage({command: 'getBuffer'})
        }

        this.exportWAV = function(cb, type) {
            currCallback = cb || config.callback;
            type = type || config.type || 'audio/wav';
            if (!currCallback)
                throw new Error('Callback not set');
            worker.postMessage({
                command: 'exportWAV',
                type: type
            });
        }

        worker.onmessage = function(e) {
            var blob = e.data;
            currCallback(blob);
        }

        source.connect(this.node);
        this.node.connect(this.context.destination);    //this should not be necessary
    };

    snd.Recorder = function(id, config) {
        snd.AudioUnit.apply(this, arguments);
        
        this._recorderGain = snd.AUDIO_CONTEXT.createGain();
        this._recorder = new Recorder(this._recorderGain, config);
        
        Object.defineProperties(this, {
            volume: {
                set: function(val) {
                    this._recorderGain.gain.value = val;
                },
                get: function() {
                    return this._recorderGain.gain.value;
                }
            }
        });
    };
    snd.Recorder.prototype = Object.create(snd.AudioUnit.prototype);
    
    snd.Recorder.prototype.record = function() {
        this._recorder.record();
    };
    
    snd.Recorder.prototype.start = function() {
        this.record();
    };
    
    snd.Recorder.prototype.stop = function() {
        this._recorder.stop();
    };
    
    snd.Recorder.prototype.exportWAV = function(callback, type) {
        this._recorder.exportWAV(callback, type);
    };

    snd.Recorder.prototype.connect = function(connectTo, indexIn, indexOut, id) {
        snd.AudioUnit.prototype.connect.apply(this, arguments);
        if (connectTo.getConnector != null) {
            this._recorderGain.connect(connectTo.getConnector(), indexIn, indexOut);
        } else {
            this._recorderGain.connect(connectTo, indexIn, indexOut);
        }
    };
    
    snd.Recorder.prototype.disconnect = function(disconnectFrom, indexIn, id) {
        snd.AudioUnit.prototype.disconnect.apply(this, arguments);
        if (disconnectFrom.getConnector != null) {
            this._recorderGain.disconnect(disconnectFrom.getConnector(), indexIn);
        } else {
            this._recorderGain.disconnect(disconnectFrom, indexIn);
        }
    };
    
    snd.Recorder.prototype.getConnector = function() {
        return this._recorderGain;
    };

    snd.Recorder.forceDownload = function(blob, filename) {
        var url = (window.URL || window.webkitURL).createObjectURL(blob);
        var link = window.document.createElement('a');
        link.href = url;
        link.download = filename || 'output.wav';
        var click = document.createEvent("Event");
        click.initEvent("click", true, true);
        link.dispatchEvent(click);
    };
});
