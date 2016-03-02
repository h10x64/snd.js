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
!function(a,b){"function"==typeof define&&define.amd?define(["snd"],b):"object"==typeof exports||(a.snd=b(a.snd))}(this,function(a){return a.MIDI||(a.MIDI={}),Object.defineProperties(a.MIDI,{GENERAL_MIDI_IN:{value:{80:{event:"onnoteoff",attr:{no:0,pos:0},second:void 0},90:{event:"onnoteon",attr:{no:0,pos:0},second:void 0},A0:{event:"onpolyphonickeypressure",attr:{no:0,pos:0},second:void 0},B0:{event:"oncontrolchange",attr:{no:0,pos:0},second:{"00":{event:"onbankselect",attr:{no:0,pos:0}},"01":{event:"onmodulationchange",attr:{no:0,pos:0}},"02":{event:"onbreathcontrollerchange",attr:{no:0,pos:0}},"03":{event:"onundef",attr:{no:0,pos:0}},"04":{event:"onfootcontrollerchange",attr:{no:0,pos:0}},"05":{event:"onportamentotimechange",attr:{no:0,pos:0}},"06":{event:"ondataentry",attr:{no:0,pos:0}},"07":{event:"onvolumechange",attr:{no:0,pos:0}},"08":{event:"onbalancechange",attr:{no:0,pos:0}},"09":{event:"onundef",attr:{no:0,pos:0}},"0A":{event:"onpanchange",attr:{no:0,pos:0}},"0B":{event:"onexpressioncontrollerchange",attr:{no:0,pos:0}},"0C":{event:"oneffectcontrolchange",attr:{no:1,pos:0}},"0D":{event:"oneffectcontrolchange",attr:{no:2,pos:0}},"0E":{event:"onundef",attr:{no:0,pos:0}},"0F":{event:"onundef",attr:{no:0,pos:0}},10:{event:"ongeneralpurposecontrollerchange",attr:{no:1,pos:0}},11:{event:"ongeneralpurposecontrollerchange",attr:{no:2,pos:0}},12:{event:"ongeneralpurposecontrollerchange",attr:{no:3,pos:0}},13:{event:"ongeneralpurposecontrollerchange",attr:{no:4,pos:0}},14:{event:"onundef",attr:{no:0,pos:0}},15:{event:"onundef",attr:{no:0,pos:0}},16:{event:"onundef",attr:{no:0,pos:0}},17:{event:"onundef",attr:{no:0,pos:0}},18:{event:"onundef",attr:{no:0,pos:0}},19:{event:"onundef",attr:{no:0,pos:0}},"1A":{event:"onundef",attr:{no:0,pos:0}},"1B":{event:"onundef",attr:{no:0,pos:0}},"1C":{event:"onundef",attr:{no:0,pos:0}},"1D":{event:"onundef",attr:{no:0,pos:0}},"1E":{event:"onundef",attr:{no:0,pos:0}},"1F":{event:"onundef",attr:{no:0,pos:0}},20:{event:"onbankselect",attr:{no:0,pos:1}},21:{event:"onmodulationchange",attr:{no:0,pos:1}},22:{event:"onbreathcontrollerchange",attr:{no:0,pos:1}},23:{event:"onundef",attr:{no:0,pos:1}},24:{event:"onfootcontrollerchange",attr:{no:0,pos:1}},25:{event:"onportamentotimechange",attr:{no:0,pos:1}},26:{event:"ondataentry",attr:{no:0,pos:1}},27:{event:"onvolumechange",attr:{no:0,pos:1}},28:{event:"onbalancechange",attr:{no:0,pos:1}},29:{event:"onundef",attr:{no:0,pos:1}},"2A":{event:"onpanchange",attr:{no:0,pos:1}},"2B":{event:"onexpressioncontrollerchange",attr:{no:0,pos:1}},"2C":{event:"oneffectcontrolchange",attr:{no:1,pos:1}},"2D":{event:"oneffectcontrolchange",attr:{no:2,pos:1}},"2E":{event:"onundef",attr:{no:0,pos:1}},"2F":{event:"onundef",attr:{no:0,pos:1}},30:{event:"ongeneralpurposecontrollerchange",attr:{no:1,pos:1}},31:{event:"ongeneralpurposecontrollerchange",attr:{no:2,pos:1}},32:{event:"ongeneralpurposecontrollerchange",attr:{no:3,pos:1}},33:{event:"ongeneralpurposecontrollerchange",attr:{no:4,pos:1}},34:{event:"onundef",attr:{no:0,pos:1}},35:{event:"onundef",attr:{no:0,pos:1}},36:{event:"onundef",attr:{no:0,pos:1}},37:{event:"onundef",attr:{no:0,pos:1}},38:{event:"onundef",attr:{no:0,pos:1}},39:{event:"onundef",attr:{no:0,pos:1}},"3A":{event:"onundef",attr:{no:0,pos:1}},"3B":{event:"onundef",attr:{no:0,pos:1}},"3C":{event:"onundef",attr:{no:0,pos:1}},"3D":{event:"onundef",attr:{no:0,pos:1}},"3E":{event:"onundef",attr:{no:0,pos:1}},"3F":{event:"onundef",attr:{no:0,pos:1}},40:{event:"onholdchange",attr:{no:1,pos:0}},41:{event:"onportamentoswitchchange",attr:{no:0,pos:0}},42:{event:"onsostenutochange",attr:{no:0,pos:0}},43:{event:"onsoftpedalchange",attr:{no:0,pos:0}},44:{event:"onlagatofootswitchchange",attr:{no:0,pos:0}},45:{event:"onholdchange",attr:{no:2,pos:0}},46:{event:"onsoundvariationchange",attr:{no:0,pos:0}},47:{event:"ontimbrechange",attr:{no:0,pos:0}},48:{event:"onreleasetimechange",attr:{no:0,pos:0}},49:{event:"onattacktimechange",attr:{no:0,pos:0}},"4A":{event:"onbrightnesschange",attr:{no:0,pos:0}},"4B":{event:"ondecaytimechange",attr:{no:0,pos:0}},"4C":{event:"onvibratoratechange",attr:{no:0,pos:0}},"4D":{event:"onvibratodepthchange",attr:{no:0,pos:0}},"4E":{event:"onvibratodelaychange",attr:{no:0,pos:0}},"4F":{event:"onsoundcontrolchange",attr:{no:0,pos:0}},50:{event:"ongeneralpurposecontrollerchange",attr:{no:5,pos:0}},51:{event:"ongeneralpurposecontrollerchange",attr:{no:6,pos:0}},52:{event:"ongeneralpurposecontrollerchange",attr:{no:7,pos:0}},53:{event:"ongeneralpurposecontrollerchange",attr:{no:8,pos:0}},54:{event:"onportamentcontrollchange",attr:{no:0,pos:0}},55:{event:"onundef",attr:{no:0,pos:0}},56:{event:"onundef",attr:{no:0,pos:0}},57:{event:"onundef",attr:{no:0,pos:0}},58:{event:"onhighresolutionvelocityprefixchange",attr:{no:0,pos:0}},59:{event:"onundef",attr:{no:0,pos:0}},"5A":{event:"onundef",attr:{no:0,pos:0}},"5B":{event:"oneffectdepthchange",attr:{no:1,pos:0}},"5C":{event:"oneffectdepthchange",attr:{no:2,pos:0}},"5D":{event:"oneffectdepthchange",attr:{no:3,pos:0}},"5E":{event:"oneffectdepthchange",attr:{no:4,pos:0}},"5F":{event:"oneffectdepthchange",attr:{no:5,pos:0}},60:{event:"ondataincrement",attr:{no:0,pos:0}},61:{event:"ondatadecrement",attr:{no:0,pos:0}},62:{event:"onnrpm",attr:{no:0,pos:0}},63:{event:"onnrpm",attr:{no:0,pos:1}},64:{event:"onrpm",attr:{no:0,pos:0}},65:{event:"onrpm",attr:{no:0,pos:1}},66:{event:"onundef",attr:{no:0,pos:0}},67:{event:"onundef",attr:{no:0,pos:0}},68:{event:"onundef",attr:{no:0,pos:0}},69:{event:"onundef",attr:{no:0,pos:0}},"6A":{event:"onundef",attr:{no:0,pos:0}},"6B":{event:"onundef",attr:{no:0,pos:0}},"6C":{event:"onundef",attr:{no:0,pos:0}},"6D":{event:"onundef",attr:{no:0,pos:0}},"6E":{event:"onundef",attr:{no:0,pos:0}},"6F":{event:"onundef",attr:{no:0,pos:0}},70:{event:"onundef",attr:{no:0,pos:0}},71:{event:"onundef",attr:{no:0,pos:0}},72:{event:"onundef",attr:{no:0,pos:0}},73:{event:"onundef",attr:{no:0,pos:0}},74:{event:"onundef",attr:{no:0,pos:0}},75:{event:"onundef",attr:{no:0,pos:0}},76:{event:"onundef",attr:{no:0,pos:0}},77:{event:"onundef",attr:{no:0,pos:0}},78:{event:"onallsoundoff",attr:{no:0,pos:0}},79:{event:"onresetallcontroller",attr:{no:0,pos:0}},"7A":{event:"onlocalcontrolchange",attr:{no:0,pos:0}},"7B":{event:"onallnotesoff",attr:{no:0,pos:0}},"7C":{event:"onomnimodeoff",attr:{no:0,pos:0}},"7D":{event:"onomnimodeon",attr:{no:0,pos:0}},"7E":{event:"onmonomodeon",attr:{no:0,pos:0}},"7F":{event:"onpolymodeon",attr:{no:0,pos:0}}}},C0:{event:"onprogramchange",attr:{no:0,pos:0},second:void 0},D0:{event:"onchannelpressure",attr:{no:0,pos:0},second:void 0},E0:{event:"onpitchbendchange",attr:{no:0,pos:0},second:void 0},F0:{event:"onsysex",attr:{ch:!1,no:0,pos:0},second:void 0},F1:{event:"onquarterframe",attr:{ch:!1,no:0,pos:0},second:void 0},F2:{event:"onsongselect",attr:{ch:!1,no:0,pos:0},second:void 0},F3:{event:"onsysundef",attr:{ch:!1,no:0,pos:0},second:void 0},F4:{event:"onsysundef",attr:{ch:!1,no:0,pos:0},second:void 0},F5:{event:"onsysundef",attr:{ch:!1,no:0,pos:0},second:void 0},F6:{event:"ontunerrequest",attr:{ch:!1,no:0,pos:0},second:void 0},F7:{event:"onendex",attr:{ch:!1,no:0,pos:0},second:void 0},F8:{event:"ontimingclock",attr:{ch:!1,no:0,pos:0},second:void 0},F9:{event:"onsysundef",attr:{ch:!1,no:0,pos:0},second:void 0},FA:{event:"onstart",attr:{ch:!1,no:0,pos:0},second:void 0},FB:{event:"oncontinue",attr:{ch:!1,no:0,pos:0},second:void 0},FC:{event:"onstop",attr:{ch:!1,no:0,pos:0},second:void 0},FD:{event:"onsysundef",attr:{ch:!1,no:0,pos:0},second:void 0},FE:{event:"onactivesensing",attr:{ch:!1,no:0,pos:0},second:void 0},FF:{event:"onreset",attr:{ch:!1,no:0,pos:0},second:void 0}},writable:!1}}),a.MIDI.MIDIIn=function(b,c){var d=this;this._midiIn=b,this._midiDef=c?c:a.MIDI.GENERAL_MIDI_IN,this._onnoteoffEventListeners=[],this._onnoteonEventListeners=[],this._onpolyphonickeypressureEventListeners=[],this._oncontrolchangeEventListeners=[],this._onbankselectEventListeners=[],this._onmodulationchangeEventListeners=[],this._onbreathcontrollerchangeEventListeners=[],this._onundefEventListeners=[],this._onfootcontrollerchangeEventListeners=[],this._onportamentotimechangeEventListeners=[],this._ondataentryEventListeners=[],this._onvolumechangeEventListeners=[],this._onbalancechangeEventListeners=[],this._onpanchangeEventListeners=[],this._onexpressioncontrollerchangeEventListeners=[],this._oneffectcontrolchangeEventListeners=[],this._ongeneralpurposecontrollerchangeEventListeners=[],this._onholdchangeEventListeners=[],this._onportamentoswitchchangeEventListeners=[],this._onsostenutochangeEventListeners=[],this._onsoftpedalchangeEventListeners=[],this._onlagatofootswitchchangeEventListeners=[],this._onsoundvariationchangeEventListeners=[],this._ontimbrechangeEventListeners=[],this._onreleasetimechangeEventListeners=[],this._onattacktimechangeEventListeners=[],this._onbrightnesschangeEventListeners=[],this._ondecaytimechangeEventListeners=[],this._onvibratoratechangeEventListeners=[],this._onvibratodepthchangeEventListeners=[],this._onvibratodelaychangeEventListeners=[],this._onsoundcontrolchangeEventListeners=[],this._onportamentcontrolchangeEventListeners=[],this._onhighresolutionvelocityprefixchangeEventListeners=[],this._oneffectdepthchangeEventListeners=[],this._ondataincrementEventListeners=[],this._ondatadecrementEventListeners=[],this._onnrpmEventListeners=[],this._onrpmEventListeners=[],this._onallsoundoffEventListeners=[],this._onresetallcontrollerEventListeners=[],this._onlocalcontrolchangeEventListeners=[],this._onallnotesoffEventListeners=[],this._onomnimodeoffEventListeners=[],this._onomnimodeonEventListeners=[],this._onmonomodeonEventListeners=[],this._onpolymodeonEventListeners=[],this._onprogramchangeEventListeners=[],this._onchannelpressureEventListeners=[],this._onpitchbendchangeEventListeners=[],this._onsysexEventListeners=[],this._onquarterframeEventListeners=[],this._onsongselectEventListeners=[],this._onsysundefEventListeners=[],this._ontunerrequestEventListeners=[],this._onendexEventListeners=[],this._ontimingclockEventListeners=[],this._onstartEventListeners=[],this._oncontinueEventListeners=[],this._onstopEventListeners=[],this._onactivesensingEventListeners=[],this._onresetEventListeners=[],Object.defineProperties({onnoteoffEventListeners:{get:function(){return this._onnoteoffEventListeners}},onnoteonEventListeners:{get:function(){return this._onnoteonEventListeners}},onpolyphonickeypressureEventListeners:{get:function(){return this._onpolyphonickeypressureEventListeners}},oncontrolchangeEventListeners:{get:function(){return this._oncontrolchangeEventListeners}},onbankselectEventListeners:{get:function(){return this._onbankselectEventListeners}},onmodulationchangeEventListeners:{get:function(){return this._onmodulationchangeEventListeners}},onbreathcontrollerchangeEventListeners:{get:function(){return this._onbreathcontrollerchangeEventListeners}},onundefEventListeners:{get:function(){return this._onundefEventListeners}},onfootcontrollerchangeEventListeners:{get:function(){return this._onfootcontrollerchangeEventListeners}},onportamentotimechangeEventListeners:{get:function(){return this._onportamentotimechangeEventListeners}},ondataentryEventListeners:{get:function(){return this._ondataentryEventListeners}},onvolumechangeEventListeners:{get:function(){return this._onvolumechangeEventListeners}},onbalancechangeEventListeners:{get:function(){return this._onbalancechangeEventListeners}},onpanchangeEventListeners:{get:function(){return this._onpanchangeEventListeners}},onexpressioncontrollerchangeEventListeners:{get:function(){return this._onexpressioncontrollerchangeEventListeners}},oneffectcontrolchangeEventListeners:{get:function(){return this._oneffectcontrolchangeEventListeners}},ongeneralpurposecontrollerchangeEventListeners:{get:function(){return this._ongeneralpurposecontrollerchangeEventListeners}},onholdchangeEventListeners:{get:function(){return this._onholdchangeEventListeners}},onportamentoswitchchangeEventListeners:{get:function(){return this._onportamentoswitchchangeEventListeners}},onsostenutochangeEventListeners:{get:function(){return this._onsostenutochangeEventListeners}},onsoftpedalchangeEventListeners:{get:function(){return this._onsoftpedalchangeEventListeners}},onlagatofootswitchchangeEventListeners:{get:function(){return this._onlagatofootswitchchangeEventListeners}},onsoundvariationchangeEventListeners:{get:function(){return this._onsoundvariationchangeEventListeners}},ontimbrechangeEventListeners:{get:function(){return this._ontimbrechangeEventListeners}},onreleasetimechangeEventListeners:{get:function(){return this._onreleasetimechangeEventListeners}},onattacktimechangeEventListeners:{get:function(){return this._onattacktimechangeEventListeners}},onbrightnesschangeEventListeners:{get:function(){return this._onbrightnesschangeEventListeners}},ondecaytimechangeEventListeners:{get:function(){return this._ondecaytimechangeEventListeners}},onvibratoratechangeEventListeners:{get:function(){return this._onvibratoratechangeEventListeners}},onvibratodepthchangeEventListeners:{get:function(){return this._onvibratodepthchangeEventListeners}},onvibratodelaychangeEventListeners:{get:function(){return this._onvibratodelaychangeEventListeners}},onsoundcontrolchangeEventListeners:{get:function(){return this._onsoundcontrolchangeEventListeners}},onportamentcontrolchangeEventListeners:{get:function(){return this._onportamentcontrolchangeEventListeners}},onhighresolutionvelocityprefixchangeEventListeners:{get:function(){return this._onhighresolutionvelocityprefixchangeEventListeners}},oneffectdepthchangeEventListeners:{get:function(){return this._oneffectdepthchangeEventListeners}},ondataincrementEventListeners:{get:function(){return this._ondataincrementEventListeners}},ondatadecrementEventListeners:{get:function(){return this._ondatadecrementEventListeners}},onnrpmEventListeners:{get:function(){return this._onnrpmEventListeners}},onrpmEventListeners:{get:function(){return this._onrpmEventListeners}},onallsoundoffEventListeners:{get:function(){return this._onallsoundoffEventListeners}},onresetallcontrollerEventListeners:{get:function(){return this._onresetallcontrollerEventListeners}},onlocalcontrolchangeEventListeners:{get:function(){return this._onlocalcontrolchangeEventListeners}},onallnotesoffEventListeners:{get:function(){return this._onallnotesoffEventListeners}},onomnimodeoffEventListeners:{get:function(){return this._onomnimodeoffEventListeners}},onomnimodeonEventListeners:{get:function(){return this._onomnimodeonEventListeners}},onmonomodeonEventListeners:{get:function(){return this._onmonomodeonEventListeners}},onpolymodeonEventListeners:{get:function(){return this._onpolymodeonEventListeners}},onprogramchangeEventListeners:{get:function(){return this._onprogramchangeEventListeners}},onchannelpressureEventListeners:{get:function(){return this._onchannelpressureEventListeners}},onpitchbendchangeEventListeners:{get:function(){return this._onpitchbendchangeEventListeners}},onsysexEventListeners:{get:function(){return this._onsysexEventListeners}},onquarterframeEventListeners:{get:function(){return this._onquarterframeEventListeners}},onsongselectEventListeners:{get:function(){return this._onsongselectEventListeners}},onsysundefEventListeners:{get:function(){return this._onsysundefEventListeners}},ontunerrequestEventListeners:{get:function(){return this._ontunerrequestEventListeners}},onendexEventListeners:{get:function(){return this._onendexEventListeners}},ontimingclockEventListeners:{get:function(){return this._ontimingclockEventListeners}},onstartEventListeners:{get:function(){return this._onstartEventListeners}},oncontinueEventListeners:{get:function(){return this._oncontinueEventListeners}},onstopEventListeners:{get:function(){return this._onstopEventListeners}},onactivesensingEventListeners:{get:function(){return this._onactivesensingEventListeners}},onresetEventListeners:{get:function(){return this._onresetEventListeners}}}),this._midiIn.onmidimessage=function(a){d.receiveMessage(a)}},a.MIDI.MIDIIn.prototype.receiveMessage=function(a){var b=a.data;if(this.onmidimessage(a),b&&b.length>0){var c=function(a){return("0"+a.toString(16)).slice(-2).toUpperCase()},d=b[0],e=c(240&d),f=15&d,g=b.subarray(1,3),h=null;if(this._midiDef[d]?h=this._midiDef[d]:this._midiDef[e]&&(h=this._midiDef[e]),h&&h.second){var i=b[1],j=c(255&i);g=b.subarray(2,3),h=h.second[j]}if(!h)return void console.log("MIDI Message ["+c(b[0])+", "+c(b[1])+", "+c(b[2])+"] is not listed.");var k=this[h.event];"function"==typeof k&&k(f,h.attr.no,h.attr.pos,g,b)}},a.MIDI.MIDIIn.prototype.onmidimessage=function(){},a.MIDI.MIDIIn.prototype.onnoteoff=function(){},a.MIDI.MIDIIn.prototype.onnoteon=function(){},a.MIDI.MIDIIn.prototype.onpolyphonickeypressure=function(){},a.MIDI.MIDIIn.prototype.oncontrolchange=function(){},a.MIDI.MIDIIn.prototype.onbankselect=function(){},a.MIDI.MIDIIn.prototype.onmodulationchange=function(){},a.MIDI.MIDIIn.prototype.onbreathcontrollerchange=function(){},a.MIDI.MIDIIn.prototype.onundef=function(){},a.MIDI.MIDIIn.prototype.onfootcontrollerchange=function(){},a.MIDI.MIDIIn.prototype.onportamentotimechange=function(){},a.MIDI.MIDIIn.prototype.ondataentry=function(){},a.MIDI.MIDIIn.prototype.onvolumechange=function(){},a.MIDI.MIDIIn.prototype.onbalancechange=function(){},a.MIDI.MIDIIn.prototype.onpanchange=function(){},a.MIDI.MIDIIn.prototype.onexpressioncontrollerchange=function(){},a.MIDI.MIDIIn.prototype.oneffectcontrolchange=function(){},a.MIDI.MIDIIn.prototype.ongeneralpurposecontrollerchange=function(){},a.MIDI.MIDIIn.prototype.onholdchange=function(){},a.MIDI.MIDIIn.prototype.onportamentoswitchchange=function(){},a.MIDI.MIDIIn.prototype.onsostenutochange=function(){},a.MIDI.MIDIIn.prototype.onsoftpedalchange=function(){},a.MIDI.MIDIIn.prototype.onlagatofootswitchchange=function(){},a.MIDI.MIDIIn.prototype.onsoundvariationchange=function(){},a.MIDI.MIDIIn.prototype.ontimbrechange=function(){},a.MIDI.MIDIIn.prototype.onreleasetimechange=function(){},a.MIDI.MIDIIn.prototype.onattacktimechange=function(){},a.MIDI.MIDIIn.prototype.onbrightnesschange=function(){},a.MIDI.MIDIIn.prototype.ondecaytimechange=function(){},a.MIDI.MIDIIn.prototype.onvibratoratechange=function(){},a.MIDI.MIDIIn.prototype.onvibratodepthchange=function(){},a.MIDI.MIDIIn.prototype.onvibratodelaychange=function(){},a.MIDI.MIDIIn.prototype.onsoundcontrolchange=function(){},a.MIDI.MIDIIn.prototype.onportamentcontrolchange=function(){},a.MIDI.MIDIIn.prototype.onhighresolutionvelocityprefixchange=function(){},a.MIDI.MIDIIn.prototype.oneffectdepthchange=function(){},a.MIDI.MIDIIn.prototype.ondataincrement=function(){},a.MIDI.MIDIIn.prototype.ondatadecrement=function(){},a.MIDI.MIDIIn.prototype.onnrpm=function(){},a.MIDI.MIDIIn.prototype.onrpm=function(){},a.MIDI.MIDIIn.prototype.onallsoundoff=function(){},a.MIDI.MIDIIn.prototype.onresetallcontroller=function(){},a.MIDI.MIDIIn.prototype.onlocalcontrolchange=function(){},a.MIDI.MIDIIn.prototype.onallnotesoff=function(){},a.MIDI.MIDIIn.prototype.onomnimodeoff=function(){},a.MIDI.MIDIIn.prototype.onomnimodeon=function(){},a.MIDI.MIDIIn.prototype.onmonomodeon=function(){},a.MIDI.MIDIIn.prototype.onpolymodeon=function(){},a.MIDI.MIDIIn.prototype.onprogramchange=function(){},a.MIDI.MIDIIn.prototype.onchannelpressure=function(){},a.MIDI.MIDIIn.prototype.onpitchbendchange=function(){},a.MIDI.MIDIIn.prototype.onsysex=function(){},a.MIDI.MIDIIn.prototype.onquarterframe=function(){},a.MIDI.MIDIIn.prototype.onsongselect=function(){},a.MIDI.MIDIIn.prototype.onsysundef=function(){},a.MIDI.MIDIIn.prototype.ontunerrequest=function(){},a.MIDI.MIDIIn.prototype.onendex=function(){},a.MIDI.MIDIIn.prototype.ontimingclock=function(){},a.MIDI.MIDIIn.prototype.onstart=function(){},a.MIDI.MIDIIn.prototype.oncontinue=function(){},a.MIDI.MIDIIn.prototype.onstop=function(){},a.MIDI.MIDIIn.prototype.onactivesensing=function(){},a.MIDI.MIDIIn.prototype.onreset=function(){},a.MIDI.MIDIIn.prototype.fireonnoteoffevent=function(a,b,c,d,e){this.fireEvent(this.onnoteoffEventListeners,a,b,c,d,e)},a.MIDI.MIDIIn.prototype.fireonnoteonevent=function(a,b,c,d,e){this.fireEvent(this.onnoteonEventListeners,a,b,c,d,e)},a.MIDI.MIDIIn.prototype.fireonpolyphonickeypressureevent=function(a,b,c,d,e){this.fireEvent(this.onpolyphonickeypressureEventListeners,a,b,c,d,e)},a.MIDI.MIDIIn.prototype.fireoncontrolchangeevent=function(a,b,c,d,e){this.fireEvent(this.oncontrolchangeEventListeners,a,b,c,d,e)},a.MIDI.MIDIIn.prototype.fireonbankselectevent=function(a,b,c,d,e){this.fireEvent(this.onbankselectEventListeners,a,b,c,d,e)},a.MIDI.MIDIIn.prototype.fireonmodulationchangeevent=function(a,b,c,d,e){this.fireEvent(this.onmodulationchangeEventListeners,a,b,c,d,e)},a.MIDI.MIDIIn.prototype.fireonbreathcontrollerchangeevent=function(a,b,c,d,e){this.fireEvent(this.onbreathcontrollerchangeEventListeners,a,b,c,d,e)},a.MIDI.MIDIIn.prototype.fireonundefevent=function(a,b,c,d,e){this.fireEvent(this.onundefEventListeners,a,b,c,d,e)},a.MIDI.MIDIIn.prototype.fireonfootcontrollerchangeevent=function(a,b,c,d,e){this.fireEvent(this.onfootcontrollerchangeEventListeners,a,b,c,d,e)},a.MIDI.MIDIIn.prototype.fireonportamentotimechangeevent=function(a,b,c,d,e){this.fireEvent(this.onportamentotimechangeEventListeners,a,b,c,d,e)},a.MIDI.MIDIIn.prototype.fireondataentryevent=function(a,b,c,d,e){this.fireEvent(this.ondataentryEventListeners,a,b,c,d,e)},a.MIDI.MIDIIn.prototype.fireonvolumechangeevent=function(a,b,c,d,e){this.fireEvent(this.onvolumechangeEventListeners,a,b,c,d,e)},a.MIDI.MIDIIn.prototype.fireonbalancechangeevent=function(a,b,c,d,e){this.fireEvent(this.onbalancechangeEventListeners,a,b,c,d,e)},a.MIDI.MIDIIn.prototype.fireonpanchangeevent=function(a,b,c,d,e){this.fireEvent(this.onpanchangeEventListeners,a,b,c,d,e)},a.MIDI.MIDIIn.prototype.fireonexpressioncontrollerchangeevent=function(a,b,c,d,e){this.fireEvent(this.onexpressioncontrollerchangeEventListeners,a,b,c,d,e)},a.MIDI.MIDIIn.prototype.fireoneffectcontrolchangeevent=function(a,b,c,d,e){this.fireEvent(this.oneffectcontrolchangeEventListeners,a,b,c,d,e)},a.MIDI.MIDIIn.prototype.fireongeneralpurposecontrollerchangeevent=function(a,b,c,d,e){this.fireEvent(this.ongeneralpurposecontrollerchangeEventListeners,a,b,c,d,e)},a.MIDI.MIDIIn.prototype.fireonholdchangeevent=function(a,b,c,d,e){this.fireEvent(this.onholdchangeEventListeners,a,b,c,d,e)},a.MIDI.MIDIIn.prototype.fireonportamentoswitchchangeevent=function(a,b,c,d,e){this.fireEvent(this.onportamentoswitchchangeEventListeners,a,b,c,d,e)},a.MIDI.MIDIIn.prototype.fireonsostenutochangeevent=function(a,b,c,d,e){this.fireEvent(this.onsostenutochangeEventListeners,a,b,c,d,e)},a.MIDI.MIDIIn.prototype.fireonsoftpedalchangeevent=function(a,b,c,d,e){this.fireEvent(this.onsoftpedalchangeEventListeners,a,b,c,d,e)},a.MIDI.MIDIIn.prototype.fireonlagatofootswitchchangeevent=function(a,b,c,d,e){this.fireEvent(this.onlagatofootswitchchangeEventListeners,a,b,c,d,e)},a.MIDI.MIDIIn.prototype.fireonsoundvariationchangeevent=function(a,b,c,d,e){this.fireEvent(this.onsoundvariationchangeEventListeners,a,b,c,d,e)},a.MIDI.MIDIIn.prototype.fireontimbrechangeevent=function(a,b,c,d,e){this.fireEvent(this.ontimbrechangeEventListeners,a,b,c,d,e)},a.MIDI.MIDIIn.prototype.fireonreleasetimechangeevent=function(a,b,c,d,e){this.fireEvent(this.onreleasetimechangeEventListeners,a,b,c,d,e)},a.MIDI.MIDIIn.prototype.fireonattacktimechangeevent=function(a,b,c,d,e){this.fireEvent(this.onattacktimechangeEventListeners,a,b,c,d,e)},a.MIDI.MIDIIn.prototype.fireonbrightnesschangeevent=function(a,b,c,d,e){this.fireEvent(this.onbrightnesschangeEventListeners,a,b,c,d,e)},a.MIDI.MIDIIn.prototype.fireondecaytimechangeevent=function(a,b,c,d,e){this.fireEvent(this.ondecaytimechangeEventListeners,a,b,c,d,e)},a.MIDI.MIDIIn.prototype.fireonvibratoratechangeevent=function(a,b,c,d,e){this.fireEvent(this.onvibratoratechangeEventListeners,a,b,c,d,e)},a.MIDI.MIDIIn.prototype.fireonvibratodepthchangeevent=function(a,b,c,d,e){this.fireEvent(this.onvibratodepthchangeEventListeners,a,b,c,d,e)},a.MIDI.MIDIIn.prototype.fireonvibratodelaychangeevent=function(a,b,c,d,e){this.fireEvent(this.onvibratodelaychangeEventListeners,a,b,c,d,e)},a.MIDI.MIDIIn.prototype.fireonsoundcontrolchangeevent=function(a,b,c,d,e){this.fireEvent(this.onsoundcontrolchangeEventListeners,a,b,c,d,e)},a.MIDI.MIDIIn.prototype.fireonportamentcontrolchangeevent=function(a,b,c,d,e){this.fireEvent(this.onportamentcontrolchangeEventListeners,a,b,c,d,e)},a.MIDI.MIDIIn.prototype.fireonhighresolutionvelocityprefixchangeevent=function(a,b,c,d,e){this.fireEvent(this.onhighresolutionvelocityprefixchangeEventListeners,a,b,c,d,e)},a.MIDI.MIDIIn.prototype.fireoneffectdepthchangeevent=function(a,b,c,d,e){this.fireEvent(this.oneffectdepthchangeEventListeners,a,b,c,d,e)},a.MIDI.MIDIIn.prototype.fireondataincrementevent=function(a,b,c,d,e){this.fireEvent(this.ondataincrementEventListeners,a,b,c,d,e)},a.MIDI.MIDIIn.prototype.fireondatadecrementevent=function(a,b,c,d,e){this.fireEvent(this.ondatadecrementEventListeners,a,b,c,d,e)},a.MIDI.MIDIIn.prototype.fireonnrpmevent=function(a,b,c,d,e){this.fireEvent(this.onnrpmEventListeners,a,b,c,d,e)},a.MIDI.MIDIIn.prototype.fireonrpmevent=function(a,b,c,d,e){this.fireEvent(this.onrpmEventListeners,a,b,c,d,e)},a.MIDI.MIDIIn.prototype.fireonallsoundoffevent=function(a,b,c,d,e){this.fireEvent(this.onallsoundoffEventListeners,a,b,c,d,e)},a.MIDI.MIDIIn.prototype.fireonresetallcontrollerevent=function(a,b,c,d,e){this.fireEvent(this.onresetallcontrollEventListeners,a,b,c,d,e)},a.MIDI.MIDIIn.prototype.fireonlocalcontrolchangeevent=function(a,b,c,d,e){this.fireEvent(this.onlocalcontrolchangeEventListeners,a,b,c,d,e)},a.MIDI.MIDIIn.prototype.fireonallnotesoffevent=function(a,b,c,d,e){this.fireEvent(this.onallnotesoffEventListeners,a,b,c,d,e)},a.MIDI.MIDIIn.prototype.fireonomnimodeoffevent=function(a,b,c,d,e){this.fireEvent(this.onomnimodeoffEventListeners,a,b,c,d,e)},a.MIDI.MIDIIn.prototype.fireonomnimodeonevent=function(a,b,c,d,e){this.fireEvent(this.onomnimodeonEventListeners,a,b,c,d,e)},a.MIDI.MIDIIn.prototype.fireonmonomodeonevent=function(a,b,c,d,e){this.fireEvent(this.onmonomodeonEventListeners,a,b,c,d,e)},a.MIDI.MIDIIn.prototype.fireonpolymodeonevent=function(a,b,c,d,e){this.fireEvent(this.onpolymodeonEventListeners,a,b,c,d,e)},a.MIDI.MIDIIn.prototype.fireonprogramchangeevent=function(a,b,c,d,e){this.fireEvent(this.onprogramchangeEventListeners,a,b,c,d,e)},a.MIDI.MIDIIn.prototype.fireonchannelpressureevent=function(a,b,c,d,e){this.fireEvent(this.onchannelpressureEventListeners,a,b,c,d,e)},a.MIDI.MIDIIn.prototype.fireonpitchbendchangeevent=function(a,b,c,d,e){this.fireEvent(this.onpitchbendchangeEventListeners,a,b,c,d,e)},a.MIDI.MIDIIn.prototype.fireonsysexevent=function(a,b,c,d,e){this.fireEvent(this.onsysexEventListeners,a,b,c,d,e)},a.MIDI.MIDIIn.prototype.fireonquarterframeevent=function(a,b,c,d,e){this.fireEvent(this.onquarterframeEventListeners,a,b,c,d,e)},a.MIDI.MIDIIn.prototype.fireonsongselectevent=function(a,b,c,d,e){this.fireEvent(this.onsongselectEventListeners,a,b,c,d,e)},a.MIDI.MIDIIn.prototype.fireonsysundefevent=function(a,b,c,d,e){this.fireEvent(this.onsysundefEventListeners,a,b,c,d,e)},a.MIDI.MIDIIn.prototype.fireontunerrequestevent=function(a,b,c,d,e){this.fireEvent(this.ontunerrequestEventListeners,a,b,c,d,e)},a.MIDI.MIDIIn.prototype.fireonendexevent=function(a,b,c,d,e){this.fireEvent(this.onendexEventListeners,a,b,c,d,e)},a.MIDI.MIDIIn.prototype.fireontimingclockevent=function(a,b,c,d,e){this.fireEvent(this.ontimingclockEventListeners,a,b,c,d,e)},a.MIDI.MIDIIn.prototype.fireonstartevent=function(a,b,c,d,e){this.fireEvent(this.onstartEventListeners,a,b,c,d,e)},a.MIDI.MIDIIn.prototype.fireoncontinueevent=function(a,b,c,d,e){this.fireEvent(this.oncontinueEventListeners,a,b,c,d,e)},a.MIDI.MIDIIn.prototype.fireonstopevent=function(a,b,c,d,e){this.fireEvent(this.onstopEventListeners,a,b,c,d,e)},a.MIDI.MIDIIn.prototype.fireonactivesensingevent=function(a,b,c,d,e){this.fireEvent(this.onactivesensingEventListeners,a,b,c,d,e)},a.MIDI.MIDIIn.prototype.fireonresetevent=function(a,b,c,d,e){this.fireEvent(this.onresetEventListeners,a,b,c,d,e)},a.MIDI.MIDIIn.prototype.fireEvent=function(a,b,c,d,e,f){for(var g in a)a[g](b,c,d,e,f)},a});