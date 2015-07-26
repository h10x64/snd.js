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
!function(a,b){"function"==typeof define&&define.amd?define(["snd.AudioMaster"],b):"object"==typeof exports||(a.snd=b(a.snd))}(this,function(a){return a.AudioUnit=function(a){this._status=this.createStatus(),this._status.id=a,Object.defineProperties(this,{isAudioUnit:{get:function(){return this._status.isAudioUnit}},id:{get:function(){return this._status.id}},connection:{get:function(){var a=Object.create(this._status.connection);return a}},audioParams:{get:function(){var a=this.getAudioParams();return a}}})},a.AudioUnit.prototype.createStatus=function(){return new a.AudioUnit.Status},a.AudioUnit.prototype.connect=function(a,b,c,d){if(null!=a.id||null!=d){var e=null;null!=a.id?e=a.id:null!=d&&(e=d),e+="["+(null!=b?b:"0")+":"+(null!=c?c:"0")+"]",this._status.connection.push(e)}},a.AudioUnit.prototype.disconnect=function(a,b,c){if(null!=a.id||null!=c){var d=-1,e="";null!=a.id?e=a.id:null!=c&&(e=c),e+="["+(null!=b?b:"0");for(var f=0;f<this._status.connection.length;f++)if(this._status.connection[f].substring(0,e.length)===e){d=f;break}d>=0&&this._status.connection.splice(d,1)}},a.AudioUnit.prototype.getConnector=function(){},a.AudioUnit.prototype.getParamDescription=function(){return{}},a.AudioUnit.prototype.createParamGain=function(b){var c=a.AUDIO_CONTEXT.createGain();return c._audioParam=b,c.connect(c._audioParam),Object.defineProperties(c,{value:{set:function(a){c._audioParam.value=a},get:function(){return c._audioParam.value}},defaultValue:{get:function(){return c._audioParam.defaultValue}}}),c.setValueAtTime=function(a,b){c._audioParam.setValueAtTime(a,b)},c.linearRampToValueAtTime=function(a,b){c._audioParam.linearRampToValueAtTime(a,b)},c.exponentialRampToValueAtTime=function(a,b){c._audioParam.exponentialRampToValueAtTime(a,b)},c.setTargetAtTime=function(a,b,d){c._audioParam.setTargetAtTime(a,b,d)},c.setValueCurveAtTime=function(a,b,d){c._audioParam.setValueCurveAtTime(a,b,d)},c.cancelScheduledValues=function(a){c._audioParam.cancelScheduledValues(a)},c.setAudioParam=function(a){c.disconnect(c._audioParam),c._audioParam=a,c.connect(c._audioParam)},c},a.AudioUnit.prototype.toJSON=function(){return this._status},a.AudioUnit.prototype.fromJSON=function(a){var b=JSON.parse(a);try{this.loadData(b),this._status=b}catch(c){throw this._status=createStatus(),c}},a.AudioUnit.prototype.loadData=function(a){this._status.id=null!=a.id?a.id:"",this._status.connection=null!=a.connection?a.connection:[],this._status.channelCount=null!=a.channelCount?a.channelCount:2,this._status.channelCountMode=null!=a.channelCountMode?a.channelCountMode:"max",this._status.channelInterpretation=null!=a.channelInterpretation?a.channelInterpretation:"discrete"},a.AudioUnit.prototype.modAudioParam=function(b,c){if(!c.id){var d=c;c._id=this.id+"."+b,Object.defineProperties(c,{id:{get:function(){return this._id}}}),c.setScheduledValues=function(b){var c=a.CURRENT_TIME;d.cancelScheduledValues(c);for(var e=0;e<b.length;e++){var f=b[e];f.type==a.LINER?d.linearRampToValueAtTime(f.value,c+f.time):f.type==a.EXPONENTIALLY?d.exponentialRampToValueAtTime(f.value,c+f.time):d.setValueAtTime(f.value,c+f.time)}}}return c},a.AudioUnit.loadJSON=function(b){var c=new a.AudioUnit(""),d=JSON.parse(b);return c.loadData(d),c},a.AudioUnit.Status=function(){this.className="snd.AudioUnit",this.isAudioUnit=!0,this.id="",this.connection=[],this.channelCount=2,this.channelCountMode="max",this.channelInterpretation="discrete"},a});