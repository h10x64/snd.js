/**
 * snd.js - The Sound Library for JavaScript with WebAudioAPI - v.1.0 beta
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
!function(a,b){"function"==typeof define&&define.amd?define(["snd"],b):"object"==typeof exports||(a.snd=b(a.snd))}(this,function(a){return a.AudioMaster=function(){this.unitList={},this._gain=a.AUDIO_CONTEXT.createGain(),this._gain.channelCount=a.MAX_CHANNEL_COUNT,this._gain.connect(a.AUDIO_CONTEXT.destination),this.id=a.AudioMaster.ID},a.AudioMaster.ID="snd.MASTER",a.AudioMaster.prototype.connectAudioUnit=function(b,c){if(null==b&&null==c.id)throw"key == null && audioUnit.id == null";null==b?null==this.unitList[c.id]&&(this.unitList[c.id]=c,c.connect(this._gain,a.AudioMaster.ID)):(this.unitList[b]=c,c.connect(this._gain,a.AudioMaster.ID))},a.AudioMaster.prototype.getAudioUnit=function(a){return this.unitList[a]},a.AudioMaster.prototype.disconnectAudioUnit=function(a){var b=this.unitList[a];b.getConnector().disconnect(this._gain),delete this.unitList[a]},a.AudioMaster.prototype.getConnector=function(){return this._gain},a._MASTER=new a.AudioMaster,a});