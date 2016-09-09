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
!function(a,b){"function"==typeof define&&define.amd?define(["snd.AudioMaster"],b):"object"==typeof exports||(a.snd=b(a.snd))}(this,function(a){return a.AudioUnit=function(a){this._status=this.createStatus(),this._status.id=a,Object.defineProperties(this,{className:{get:function(){return this._status.className}},isAudioUnit:{get:function(){return this._status.isAudioUnit}},id:{get:function(){return this._status.id}},connection:{get:function(){var a=[];for(var b in this._status.connection)a.push(this._status.connection[b]);return a}},channelCount:{get:function(){return this._status.channelCount},set:function(a){this._output.channelCount=a,this._connector.channelCount=a,this._convolver.channelCount=a,this._status.channelCount=a}},channelCountMode:{get:function(){return this._status.channelCountMode},set:function(a){this._output.channelCountMode=a,this._conector.channelCountMode=a,this._convolver.channelCountMode=a,this._status.channelCountMode=a}},channelInterpretation:{get:function(){return this._status.channelInterpretation},set:function(a){this._output.channelInterpretation=a,this._connector.channelInterpretation=a,this._convolver.channelInterpretation=a,this._status.channelInterpretation=a}}})},a.AudioUnit.prototype.createStatus=function(){var a=this.getParamDescription(),b={};for(var c in a)null!=a[c]["default"]&&(b[c]=a[c]["default"]);return b.className="snd.AudioUnit",b.connection=[],b},a.AudioUnit.prototype.connect=function(a,b,c,d){if(Array.isArray(a))for(var e in a)this.connect(a[e],b,c,d);else if(null!=a.id||null!=d){var f=null,g=this.getOutputConnector();if(null!=g)if(null!=a.id?f=a.id:null!=d&&(f=d),f+="["+(null!=b?b:"0")+":"+(null!=c?c:"0")+"]",this._status.connection.push(f),"function"==typeof a.getConnector){var h=a.getConnector();null==h?console.log(a.id+" have not output node."):g.connect(a.getConnector(),b,c,d)}else g.connect(a,b,c,d)}},a.AudioUnit.prototype.disconnect=function(a,b,c){if(Array.isArray(a))for(var d in a)this.disconnect(a[d],b,c);else if(null!=a.id||null!=c){var e=-1,f="",g=this.getOutputConnector();if(null!=g){null!=a.id?f=a.id:null!=c&&(f=c),f+="["+(null!=b?b:"0");for(var d=0;d<this._status.connection.length;d++)if(this._status.connection[d].substring(0,f.length)===f){e=d;break}if(e>=0&&this._status.connection.splice(e,1),"function"==typeof a.getConnector){var h=a.getConnector();null==h?console.log(a.id+" have not input node."):g.disconnect(a.getConnector,b,c)}else g.disconnect(a,b,c)}}},a.AudioUnit.prototype.getConnector=function(){},a.AudioUnit.prototype.getOutputConnector=function(){},a.AudioUnit.prototype.getParamDescription=function(){var b={};return b.className={type:a.params.type.READ_ONLY},b.isAudioUnit={type:a.params.type.READ_ONLY,"default":!0},b.id={type:a.params.type.READ_ONLY,loader:function(a){a._status.id=id}},b.connection={type:a.params.type.READ_ONLY,loader:function(a,b){a._status.connection=b}},b.channelCount={type:a.params.type.VALUE,"default":2,max:a.MAX_CHANNEL_COUNT,min:1,loader:function(a,b){a.channelCount=b}},b.channelCountMode={type:a.params.type.ENUM,value:["max","clamped-max","explicit"],"default":"explicit",loader:function(a,b){a.channelCountMode=b}},b.channelInterpretation={type:a.params.type.ENUM,value:["speakers","discrete"],"default":"speakers",loader:function(a,b){a.channelCountMode=b}},b},a.AudioUnit.prototype.createParamGain=function(){var b=a.AUDIO_CONTEXT.createGain();return b._audioParams=[],Object.defineProperties(b,{value:{set:function(a){for(var b in this._audioParams)this._audioParams[b].value=a},get:function(){return this._audioParams.length<=0?void 0:this._audioParams[0].value}},defaultValue:{get:function(){return this._audioParams.length<=0?void 0:this._audioParams[0].defaultValue}}}),b.setValueAtTime=function(a,c){for(var d in b._audioParams)b._audioParams[d].setValueAtTime(a,c)},b.linearRampToValueAtTime=function(a,c){for(var d in b._audioParams)b._audioParams[d].linearRampToValueAtTime(a,c)},b.exponentialRampToValueAtTime=function(a,c){for(var d in b._audioParams)b._audioParams[d].exponentialRampToValueAtTime(a,c)},b.setTargetAtTime=function(a,c,d){for(var e in b._audioParams)b._audioParams[e].setTargetAtTime(a,c,d)},b.setValueCurveAtTime=function(a,c,d){for(var e in b._audioParams)b._audioParams[e].setValueCurveAtTime(a,c,d)},b.cancelScheduledValues=function(a){for(var c in b._audioParams)b._audioParams[c].cancelScheduledValues(a)},b.addAudioParam=function(a){b.connect(a),b._audioParams.push(a)},b.removeAudioParam=function(a){b.disconnect(a);var c=b._audioParams.indexOf(a);c>=0&&b._audioParams.splice(c,1)},b},a.AudioUnit.prototype.toJSON=function(){var a={},b=this.getParamDescription();for(var c in b){var d=this[c];null==d&&null!=b[c]["default"]&&(d=b[c]["default"]),a[c]=d}return a},a.AudioUnit.prototype.fromJSON=function(a){try{var b=JSON.parse(a);this.loadData(b),this._status=b}catch(c){throw this._status=createStatus(),c}},a.AudioUnit.prototype.loadData=function(a){var b=this.getparamDescription();for(var c in b)null!=a[c]&&"function"==typeof b[c].loader&&b[c].loader(this,a[c])},a.AudioUnit.prototype.modAudioParam=function(b,c){if(!c.id){var d=c;c._id=this.id+"."+b,Object.defineProperties(c,{id:{get:function(){return this._id}}}),c.setScheduledValues=function(b){var c=a.CURRENT_TIME;d.cancelScheduledValues(c);for(var e=0;e<b.length;e++){var f=b[e];f.type==a.LINER?d.linearRampToValueAtTime(f.value,c+f.time):f.type==a.EXPONENTIALLY?d.exponentialRampToValueAtTime(f.value,c+f.time):d.setValueAtTime(f.value,c+f.time)}}}return c},a.AudioUnit.loadJSON=function(b){var c=new a.AudioUnit(""),d=JSON.parse(b);return c.loadData(d),c},a});