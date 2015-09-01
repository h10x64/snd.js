
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
        define(['snd'], factory);
    } else if (typeof exports === 'object') {
        // Node
    } else {
        // Browser globals (root is window)
        root.snd = factory(root.snd);
    }
}(this, function(snd) {
    
    if (!snd.MIDI) {
        snd.MIDI = {};
    }
    
    Object.defineProperties(snd.MIDI, {
        GENERAL_MIDI_IN: {
            value: {
                "80": {"event":"onnoteoff","attr":{"no":0,"pos":0}},
                "90": {"event":"onnoteon","attr":{"no":0,"pos":0}},
                "A0": {"event":"onpolyphonickeypressure","attr":{"no":0,"pos":0}},
                "B0": {"event":"oncontrolchange","attr":{"no":0,"pos":0},
                    "second": {
                        "00": {"event":"onbankselect","attr":{"no":0,"pos":0}},
                        "01": {"event":"onmodulationchange","attr":{"no":0,"pos":0}},
                        "02": {"event":"onbreathcontrollerchange","attr":{"no":0,"pos":0}},
                        "03": {"event":"onundef","attr":{"no":0,"pos":0}},
                        "04": {"event":"onfootcontrollerchange","attr":{"no":0,"pos":0}},
                        "05": {"event":"onportamentotimechange","attr":{"no":0,"pos":0}},
                        "06": {"event":"ondataentry","attr":{"no":0,"pos":0}},
                        "07": {"event":"onvolumechange","attr":{"no":0,"pos":0}},
                        "08": {"event":"onbalancechange","attr":{"no":0,"pos":0}},
                        "09": {"event":"onundef","attr":{"no":0,"pos":0}},
                        "0A": {"event":"onpanchange","attr":{"no":0,"pos":0}},
                        "0B": {"event":"onexpressioncontrollerchange","attr":{"no":0,"pos":0}},
                        "0C": {"event":"oneffectcontrolchange","attr":{"no":1,"pos":0}},
                        "0D": {"event":"oneffectcontrolchange","attr":{"no":2,"pos":0}},
                        "0E": {"event":"onundef","attr":{"no":0,"pos":0}},
                        "0F": {"event":"onundef","attr":{"no":0,"pos":0}},
                        "10": {"event":"ongeneralpurposecontrollerchange","attr":{"no":1,"pos":0}},
                        "11": {"event":"ongeneralpurposecontrollerchange","attr":{"no":2,"pos":0}},
                        "12": {"event":"ongeneralpurposecontrollerchange","attr":{"no":3,"pos":0}},
                        "13": {"event":"ongeneralpurposecontrollerchange","attr":{"no":4,"pos":0}},
                        "14": {"event":"onundef","attr":{"no":0,"pos":0}},
                        "15": {"event":"onundef","attr":{"no":0,"pos":0}},
                        "16": {"event":"onundef","attr":{"no":0,"pos":0}},
                        "17": {"event":"onundef","attr":{"no":0,"pos":0}},
                        "18": {"event":"onundef","attr":{"no":0,"pos":0}},
                        "19": {"event":"onundef","attr":{"no":0,"pos":0}},
                        "1A": {"event":"onundef","attr":{"no":0,"pos":0}},
                        "1B": {"event":"onundef","attr":{"no":0,"pos":0}},
                        "1C": {"event":"onundef","attr":{"no":0,"pos":0}},
                        "1D": {"event":"onundef","attr":{"no":0,"pos":0}},
                        "1E": {"event":"onundef","attr":{"no":0,"pos":0}},
                        "1F": {"event":"onundef","attr":{"no":0,"pos":0}},
                        "20": {"event":"onbankselect","attr":{"no":0,"pos":1}},
                        "21": {"event":"onmodulationchange","attr":{"no":0,"pos":1}},
                        "22": {"event":"onbreathcontrollerchange","attr":{"no":0,"pos":1}},
                        "23": {"event":"onundef","attr":{"no":0,"pos":1}},
                        "24": {"event":"onfootcontrollerchange","attr":{"no":0,"pos":1}},
                        "25": {"event":"onportamentotimechange","attr":{"no":0,"pos":1}},
                        "26": {"event":"ondataentry","attr":{"no":0,"pos":1}},
                        "27": {"event":"onvolumechange","attr":{"no":0,"pos":1}},
                        "28": {"event":"onbalancechange","attr":{"no":0,"pos":1}},
                        "29": {"event":"onundef","attr":{"no":0,"pos":1}},
                        "2A": {"event":"onpanchange","attr":{"no":0,"pos":1}},
                        "2B": {"event":"onexpressioncontrollerchange","attr":{"no":0,"pos":1}},
                        "2C": {"event":"oneffectcontrolchange","attr":{"no":1,"pos":1}},
                        "2D": {"event":"oneffectcontrolchange","attr":{"no":2,"pos":1}},
                        "2E": {"event":"onundef","attr":{"no":0,"pos":1}},
                        "2F": {"event":"onundef","attr":{"no":0,"pos":1}},
                        "30": {"event":"ongeneralpurposecontrollerchange","attr":{"no":1,"pos":1}},
                        "31": {"event":"ongeneralpurposecontrollerchange","attr":{"no":2,"pos":1}},
                        "32": {"event":"ongeneralpurposecontrollerchange","attr":{"no":3,"pos":1}},
                        "33": {"event":"ongeneralpurposecontrollerchange","attr":{"no":4,"pos":1}},
                        "34": {"event":"onundef","attr":{"no":0,"pos":1}},
                        "35": {"event":"onundef","attr":{"no":0,"pos":1}},
                        "36": {"event":"onundef","attr":{"no":0,"pos":1}},
                        "37": {"event":"onundef","attr":{"no":0,"pos":1}},
                        "38": {"event":"onundef","attr":{"no":0,"pos":1}},
                        "39": {"event":"onundef","attr":{"no":0,"pos":1}},
                        "3A": {"event":"onundef","attr":{"no":0,"pos":1}},
                        "3B": {"event":"onundef","attr":{"no":0,"pos":1}},
                        "3C": {"event":"onundef","attr":{"no":0,"pos":1}},
                        "3D": {"event":"onundef","attr":{"no":0,"pos":1}},
                        "3E": {"event":"onundef","attr":{"no":0,"pos":1}},
                        "3F": {"event":"onundef","attr":{"no":0,"pos":1}},
                        "40": {"event":"onholdchange","attr":{"no":1,"pos":0}},
                        "41": {"event":"onportamentoswitchchange","attr":{"no":0,"pos":0}},
                        "42": {"event":"onsostenutochange","attr":{"no":0,"pos":0}},
                        "43": {"event":"onsoftpedalchange","attr":{"no":0,"pos":0}},
                        "44": {"event":"onlagatofootswitchchange","attr":{"no":0,"pos":0}},
                        "45": {"event":"onholdchange","attr":{"no":2,"pos":0}},
                        "46": {"event":"onsoundvariationchange","attr":{"no":0,"pos":0}},
                        "47": {"event":"ontimbrechange","attr":{"no":0,"pos":0}},
                        "48": {"event":"onreleasetimechange","attr":{"no":0,"pos":0}},
                        "49": {"event":"onattacktimechange","attr":{"no":0,"pos":0}},
                        "4A": {"event":"onbrightnesschange","attr":{"no":0,"pos":0}},
                        "4B": {"event":"ondecaytimechange","attr":{"no":0,"pos":0}},
                        "4C": {"event":"onvibratoratechange","attr":{"no":0,"pos":0}},
                        "4D": {"event":"onvibratodepthchange","attr":{"no":0,"pos":0}},
                        "4E": {"event":"onvibratodelaychange","attr":{"no":0,"pos":0}},
                        "4F": {"event":"onsoundcontrolchange","attr":{"no":0,"pos":0}},
                        "50": {"event":"ongeneralpurposecontrollerchange","attr":{"no":5,"pos":0}},
                        "51": {"event":"ongeneralpurposecontrollerchange","attr":{"no":6,"pos":0}},
                        "52": {"event":"ongeneralpurposecontrollerchange","attr":{"no":7,"pos":0}},
                        "53": {"event":"ongeneralpurposecontrollerchange","attr":{"no":8,"pos":0}},
                        "54": {"event":"onportamentcontrollchange","attr":{"no":0,"pos":0}},
                        "55": {"event":"onundef","attr":{"no":0,"pos":0}},
                        "56": {"event":"onundef","attr":{"no":0,"pos":0}},
                        "57": {"event":"onundef","attr":{"no":0,"pos":0}},
                        "58": {"event":"onhighresolutionvelocityprefixchange","attr":{"no":0,"pos":0}},
                        "59": {"event":"onundef","attr":{"no":0,"pos":0}},
                        "5A": {"event":"onundef","attr":{"no":0,"pos":0}},
                        "5B": {"event":"oneffectdepthchange","attr":{"no":1,"pos":0}},
                        "5C": {"event":"oneffectdepthchange","attr":{"no":2,"pos":0}},
                        "5D": {"event":"oneffectdepthchange","attr":{"no":3,"pos":0}},
                        "5E": {"event":"oneffectdepthchange","attr":{"no":4,"pos":0}},
                        "5F": {"event":"oneffectdepthchange","attr":{"no":5,"pos":0}},
                        "60": {"event":"ondataincrement","attr":{"no":0,"pos":0}},
                        "61": {"event":"ondatadecrement","attr":{"no":0,"pos":0}},
                        "62": {"event":"onnrpm","attr":{"no":0,"pos":0}},
                        "63": {"event":"onnrpm","attr":{"no":0,"pos":1}},
                        "64": {"event":"onrpm","attr":{"no":0,"pos":0}},
                        "65": {"event":"onrpm","attr":{"no":0,"pos":1}},
                        "66": {"event":"onundef","attr":{"no":0,"pos":0}},
                        "67": {"event":"onundef","attr":{"no":0,"pos":0}},
                        "68": {"event":"onundef","attr":{"no":0,"pos":0}},
                        "69": {"event":"onundef","attr":{"no":0,"pos":0}},
                        "6A": {"event":"onundef","attr":{"no":0,"pos":0}},
                        "6B": {"event":"onundef","attr":{"no":0,"pos":0}},
                        "6C": {"event":"onundef","attr":{"no":0,"pos":0}},
                        "6D": {"event":"onundef","attr":{"no":0,"pos":0}},
                        "6E": {"event":"onundef","attr":{"no":0,"pos":0}},
                        "6F": {"event":"onundef","attr":{"no":0,"pos":0}},
                        "70": {"event":"onundef","attr":{"no":0,"pos":0}},
                        "71": {"event":"onundef","attr":{"no":0,"pos":0}},
                        "72": {"event":"onundef","attr":{"no":0,"pos":0}},
                        "73": {"event":"onundef","attr":{"no":0,"pos":0}},
                        "74": {"event":"onundef","attr":{"no":0,"pos":0}},
                        "75": {"event":"onundef","attr":{"no":0,"pos":0}},
                        "76": {"event":"onundef","attr":{"no":0,"pos":0}},
                        "77": {"event":"onundef","attr":{"no":0,"pos":0}},
                        "78": {"event":"onallsoundoff","attr":{"no":0,"pos":0}},
                        "79": {"event":"onresetallcontroller","attr":{"no":0,"pos":0}},
                        "7A": {"event":"onlocalcontrolchange","attr":{"no":0,"pos":0}},
                        "7B": {"event":"onallnotesoff","attr":{"no":0,"pos":0}},
                        "7C": {"event":"onomnimodeoff","attr":{"no":0,"pos":0}},
                        "7D": {"event":"onomnimodeon","attr":{"no":0,"pos":0}},
                        "7E": {"event":"onmonomodeon","attr":{"no":0,"pos":0}},
                        "7F": {"event":"onpolymodeon","attr":{"no":0,"pos":0}}
                    }
                },
                "C0": {"event":"onprogramchange","attr":{"no":0,"pos":0}},
                "D0": {"event":"onchannelpressure","attr":{"no":0,"pos":0}},
                "E0": {"event":"onpitchbendchange","attr":{"no":0,"pos":0}},
                "F0": {"event":"onsysex","attr":{"ch":false,"no":0,"pos":0}},
                "F1": {"event":"onquarterframe","attr":{"ch":false,"no":0,"pos":0}},
                "F2": {"event":"onsongselect","attr":{"ch":false,"no":0,"pos":0}},
                "F3": {"event":"onsysundef","attr":{"ch":false,"no":0,"pos":0}},
                "F4": {"event":"onsysundef","attr":{"ch":false,"no":0,"pos":0}},
                "F5": {"event":"onsysundef","attr":{"ch":false,"no":0,"pos":0}},
                "F6": {"event":"ontunerrequest","attr":{"ch":false,"no":0,"pos":0}},
                "F7": {"event":"onendex","attr":{"ch":false,"no":0,"pos":0}},
                "F8": {"event":"ontimingclock","attr":{"ch":false,"no":0,"pos":0}},
                "F9": {"event":"onsysundef","attr":{"ch":false,"no":0,"pos":0}},
                "FA": {"event":"onstart","attr":{"ch":false,"no":0,"pos":0}},
                "FB": {"event":"oncontinue","attr":{"ch":false,"no":0,"pos":0}},
                "FC": {"event":"onstop","attr":{"ch":false,"no":0,"pos":0}},
                "FD": {"event":"onsysundef","attr":{"ch":false,"no":0,"pos":0}},
                "FE": {"event":"onactivesensing","attr":{"ch":false,"no":0,"pos":0}},
                "FF": {"event":"onreset","attr":{"ch":false,"no":0,"pos":0}}
            },
            writable: false
        }
    });
    
    snd.MIDI.MIDIIn = function(midiIn, midiDef) {
        var _this = this;
        
        this._midiIn = midiIn;
        this._midiDef = (midiDef) ? midiDef : snd.MIDI.GENERAL_MIDI_IN;
        
        this._midiIn.onmidimessage = function(evt) {
            _this.receiveMessage(evt);
        };
    };
    
    snd.MIDI.MIDIIn.prototype.receiveMessage = function(evt) {
        var message = evt.data;
        
        this.onmidimessage(evt);
        
        if (message && message.length > 0) {
            var hexconv = function(v) {return ("0" + v.toString(16)).slice(-2).toUpperCase();};
            
            var msg = message[0];
            var msgID = hexconv(msg & 0xF0);
            var msgCh = msg & 0x0F;
            var val = message.subarray(1,3);
            
            var def = null;
            if (this._midiDef[msg]) {
                def = this._midiDef[msg];
            } else if (this._midiDef[msgID]) {
                def = this._midiDef[msgID];
            }
            if (def && def["second"]) {
                var secondByte = message[1];
                var secondMsgID = hexconv(secondByte & 0xFF);
                val = message.subarray(2,3);
                
                def = def["second"][secondMsgID];
            }
            
            if (!def) {
                console.log("MIDI Message [" + hexconv(message[0]) + ", " + hexconv(message[1]) + ", " + hexconv(message[2]) + "] is not listed.");
                return;
            }
            
            var func = this[def.event];
            if (typeof(func) == 'function') func(msgCh, def.attr.no, def.attr.pos, val, message);
        }
    };

    snd.MIDI.MIDIIn.prototype.onmidimessage = function(evt) {};
    snd.MIDI.MIDIIn.prototype.onnoteoff = function(ch, no, pos, values, message) {};
    snd.MIDI.MIDIIn.prototype.onnoteon = function(ch, no, pos, values, message) {};
    snd.MIDI.MIDIIn.prototype.onpolyphonickeypressure = function(ch, no, pos, values, message) {};
    snd.MIDI.MIDIIn.prototype.oncontrolchange = function(ch, no, pos, values, message) {};
    snd.MIDI.MIDIIn.prototype.onbankselect = function(ch, no, pos, values, message) {};
    snd.MIDI.MIDIIn.prototype.onmodulationchange = function(ch, no, pos, values, message) {};
    snd.MIDI.MIDIIn.prototype.onbreathcontrollerchange = function(ch, no, pos, values, message) {};
    snd.MIDI.MIDIIn.prototype.onundef = function(ch, no, pos, values, message) {};
    snd.MIDI.MIDIIn.prototype.onfootcontrollerchange = function(ch, no, pos, values, message) {};
    snd.MIDI.MIDIIn.prototype.onportamentotimechange = function(ch, no, pos, values, message) {};
    snd.MIDI.MIDIIn.prototype.ondataentry = function(ch, no, pos, values, message) {};
    snd.MIDI.MIDIIn.prototype.onvolumechange = function(ch, no, pos, values, message) {};
    snd.MIDI.MIDIIn.prototype.onbalancechange = function(ch, no, pos, values, message) {};
    snd.MIDI.MIDIIn.prototype.onpanchange = function(ch, no, pos, values, message) {};
    snd.MIDI.MIDIIn.prototype.onexpressioncontrollerchange = function(ch, no, pos, values, message) {};
    snd.MIDI.MIDIIn.prototype.oneffectcontrolchange = function(ch, no, pos, values, message) {};
    snd.MIDI.MIDIIn.prototype.ongeneralpurposecontrollerchange = function(ch, no, pos, values, message) {};
    snd.MIDI.MIDIIn.prototype.onholdchange = function(ch, no, pos, values, message) {};
    snd.MIDI.MIDIIn.prototype.onportamentoswitchchange = function(ch, no, pos, values, message) {};
    snd.MIDI.MIDIIn.prototype.onsostenutochange = function(ch, no, pos, values, message) {};
    snd.MIDI.MIDIIn.prototype.onsoftpedalchange = function(ch, no, pos, values, message) {};
    snd.MIDI.MIDIIn.prototype.onlagatofootswitchchange = function(ch, no, pos, values, message) {};
    snd.MIDI.MIDIIn.prototype.onsoundvariationchange = function(ch, no, pos, values, message) {};
    snd.MIDI.MIDIIn.prototype.ontimbrechange = function(ch, no, pos, values, message) {};
    snd.MIDI.MIDIIn.prototype.onreleasetimechange = function(ch, no, pos, values, message) {};
    snd.MIDI.MIDIIn.prototype.onattacktimechange = function(ch, no, pos, values, message) {};
    snd.MIDI.MIDIIn.prototype.onbrightnesschange = function(ch, no, pos, values, message) {};
    snd.MIDI.MIDIIn.prototype.ondecaytimechange = function(ch, no, pos, values, message) {};
    snd.MIDI.MIDIIn.prototype.onvibratoratechange = function(ch, no, pos, values, message) {};
    snd.MIDI.MIDIIn.prototype.onvibratodepthchange = function(ch, no, pos, values, message) {};
    snd.MIDI.MIDIIn.prototype.onvibratodelaychange = function(ch, no, pos, values, message) {};
    snd.MIDI.MIDIIn.prototype.onsoundcontrolchange = function(ch, no, pos, values, message) {};
    snd.MIDI.MIDIIn.prototype.onportamentcontrolchange = function(ch, no, pos, values, message) {};
    snd.MIDI.MIDIIn.prototype.onhighresolutionvelocityprefixchange = function(ch, no, pos, values, message) {};
    snd.MIDI.MIDIIn.prototype.oneffectdepthchange = function(ch, no, pos, values, message) {};
    snd.MIDI.MIDIIn.prototype.ondataincrement = function(ch, no, pos, values, message) {};
    snd.MIDI.MIDIIn.prototype.ondatadecrement = function(ch, no, pos, values, message) {};
    snd.MIDI.MIDIIn.prototype.onnrpm = function(ch, no, pos, values, message) {};
    snd.MIDI.MIDIIn.prototype.onrpm = function(ch, no, pos, values, message) {};
    snd.MIDI.MIDIIn.prototype.onallsoundoff = function(ch, no, pos, values, message) {};
    snd.MIDI.MIDIIn.prototype.onresetallcontroller = function(ch, no, pos, values, message) {};
    snd.MIDI.MIDIIn.prototype.onlocalcontrolchange = function(ch, no, pos, values, message) {};
    snd.MIDI.MIDIIn.prototype.onallnotesoff = function(ch, no, pos, values, message) {};
    snd.MIDI.MIDIIn.prototype.onomnimodeoff = function(ch, no, pos, values, message) {};
    snd.MIDI.MIDIIn.prototype.onomnimodeon = function(ch, no, pos, values, message) {};
    snd.MIDI.MIDIIn.prototype.onmonomodeon = function(ch, no, pos, values, message) {};
    snd.MIDI.MIDIIn.prototype.onpolymodeon = function(ch, no, pos, values, message) {};
    snd.MIDI.MIDIIn.prototype.onprogramchange = function(ch, no, pos, values, message) {};
    snd.MIDI.MIDIIn.prototype.onchannelpressure = function(ch, no, pos, values, message) {};
    snd.MIDI.MIDIIn.prototype.onpitchbendchange = function(ch, no, pos, values, message) {};
    snd.MIDI.MIDIIn.prototype.onsysex = function(ch, no, pos, values, message) {};
    snd.MIDI.MIDIIn.prototype.onquarterframe = function(ch, no, pos, values, message) {};
    snd.MIDI.MIDIIn.prototype.onsongselect = function(ch, no, pos, values, message) {};
    snd.MIDI.MIDIIn.prototype.onsysundef = function(ch, no, pos, values, message) {};
    snd.MIDI.MIDIIn.prototype.ontunerrequest = function(ch, no, pos, values, message) {};
    snd.MIDI.MIDIIn.prototype.onendex = function(ch, no, pos, values, message) {};
    snd.MIDI.MIDIIn.prototype.ontimingclock = function(ch, no, pos, values, message) {};
    snd.MIDI.MIDIIn.prototype.onstart = function(ch, no, pos, values, message) {};
    snd.MIDI.MIDIIn.prototype.oncontinue = function(ch, no, pos, values, message) {};
    snd.MIDI.MIDIIn.prototype.onstop = function(ch, no, pos, values, message) {};
    snd.MIDI.MIDIIn.prototype.onactivesensing = function(ch, no, pos, values, message) {};
    snd.MIDI.MIDIIn.prototype.onreset = function(ch, no, pos, values, message) {};
    
    return snd;
}));
