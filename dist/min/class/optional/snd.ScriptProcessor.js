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
!function(a,b){"function"==typeof define&&define.amd?define(["snd.Source"],b):"object"==typeof exports||(a.snd=b(a.snd))}(this,function(snd){return snd.ScriptProcessor=function(){snd.Source.apply(this,arguments),Object.defineProperties(this,{inputChannels:{get:function(){return this._status.inputChannels},set:function(a){this._status.inputChannels!=a&&(this._status.inputChannels=a,this.resetScriptProcessor())}},outputChannels:{get:function(){return this._status.outputChannels},set:function(a){this._status.outputChannels!=a&&(this._status.outputChannels=a,this.resetScriptProcessor())}},bufferLength:{get:function(){return this._status.bufferLength},set:function(a){this._status.bufferLength!=a&&(this._status.bufferLength=a,this.resetScriptProcessor())}},script:{get:function(){return this._status.script},set:function(a){this._status.script=a}}}),this.resetScriptProcessor()},snd.ScriptProcessor.prototype=Object.create(snd.Source.prototype),snd.ScriptProcessor.prototype.constructor=snd.ScriptProcessor,snd.ScriptProcessor.CLASS_NAME="snd.SciptProcessorUnit",snd.ScriptProcessor.prototype.resetScriptProcessor=function(){var _this=this;this._gain.channelCount=this._status.outputChannels,null!=this._unit&&(this._unit.disconnect(this._gain),delete this._unit),this._unit=snd.AUDIO_CONTEXT.createScriptProcessor(this._status.bufferLength,this._status.inputChannels,this._status.outputChannels),this._unit.onaudioprocess=function(evt){null!=_this.script&&("function"==typeof _this.script?_this._status.script(evt):eval(_this._status.script))},this._unit.connect(this._gain)},snd.ScriptProcessor.prototype.getParamDescription=function(){var a=snd.Source.prototype.getParamDescription.apply(this,arguments);return a.bufferLength={type:snd.params.type.ENUM,value:[0,256,512,1024,2048,4096,8192,16384],"default":4096},a.script={type:snd.params.type.VALUE,"default":void 0,max:void 0,min:void 0},a},snd.ScriptProcessor.prototype.createStatus=function(){return new snd.ScriptProcessor.Status},snd.ScriptProcessor.prototype.toJSON=function(){return this._status},snd.ScriptProcessor.prototype.loadData=function(a){snd.Source.prototype.loadData.apply(this,arguments),this._status.inputChannels=a.inputChannels>0?a.inputChannels:0,this._status.outputChannels=a.outputChannels>0?a.outputChannels:0,this._status.bufferLength=a.bufferLength>0?a.bufferLength:0,this._status.script=null!=a.script?a.script:"",this.resetScriptProcessor()},snd.ScriptProcessor.loadJSON=function(a){var b=JSON.parse(a);if(b.className!=snd.ScriptProcessor.CLASS_NAME)throw new snd.Exception(b.id+" is not instanceof 'snd.ScriptProcessorUnit'.");var c=new snd.ScriptProcessor(b.id);return c.loadData(b),c},snd.ScriptProcessor.Status=function(){snd.Source.Status.apply(this,arguments),this.className=snd.ScriptProcessor.CLASS_NAME,this.isSource=!0,this.inputChannels=0,this.outputChannels=1,this.bufferLength=4096,this.script=""},snd.ScriptProcessor.Status.prototype=Object.create(snd.Source.prototype),snd.ScriptProcessor.Status.prototype.constructor=snd.ScriptProcessor.Status,snd});