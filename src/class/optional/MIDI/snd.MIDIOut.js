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
        GENERAL_MIDI_OUT: {
            value: {
                noteoff: {ch:true,val:0x80},
                noteon: {ch:true,val:0x90},
                sysex: {ch:true,val:0xF0},
                quarterframe: {ch:true,val:0xF1},
                songselect: {ch:true,val:0xF2},
                start: {ch:true,val:0xFA},
                continue: {ch:true,val:0xFB},
                stop: {ch:true,val:0xFC},
                endex: {ch:true,val:0xF7},
                reset: {ch:true,val:0xFF},
                sysundef: {ch:true,val:0xB0,second:[
                    [0xF3],
                    [0xF4],
                    [0xF5],
                    [0xF9],
                    [0xFD]
                ]},
                activesensing: {ch:true,val:0xB0,second:[
                    [0xFE]
                ]},
                allnotesoff	: {ch:true,val:0xB0,second:[
                    [0x7B]
                ]},
                allsoundoff	: {ch:true,val:0xB0,second:[
                    [0x78]
                ]},
                attacktime: {ch:true,val:0xB0,second:[
                    [0x49]
                ]},
                balance: {ch:true,val:0xB0,second:[
                    [0x08,0x28]
                ]},
                bankselect: {ch:true,val:0xB0,second:[
                    [0x00,0x20]
                ]},
                breathcontroller: {ch:true,val:0xB0,second:[
                    [0x02,0x22]
                ]},
                brightness: {ch:true,val:0xB0,second:[
                    [0x4A,0xD0]
                ]},
                control: {ch:true,val:0xB0,second:[
                    [0xB0]
                ]},
                datadecrement: {ch:true,val:0xB0,second:[
                    [0x61]
                ]},
                dataentry: {ch:true,val:0xB0,second:[
                    [0x06,0x26]
                ]},
                dataincrement: {ch:true,val:0xB0,second:[
                    [0x60]
                ]},
                decaytime: {ch:true,val:0xB0,second:[
                    [0x4B]
                ]},
                effectcontrol: {ch:true,val:0xB0,second:[
                    [0x0C,0x2C],
                    [0x0D,0x2D]
                ]},
                effectdepth: {ch:true,val:0xB0,second:[
                    [0x5B],
                    [0x5C],
                    [0x5D],
                    [0x5E],
                    [0x5F]
                ]},
                expressioncontroller: {ch:true,val:0xB0,second:[
                    [0x0B,0x2B]
                ]},
                footcontroller: {ch:true,val:0xB0,second:[
                    [0x04,0x24]
                ]},
                generalpurposecontroller: {ch:true,val:0xB0,second:[
                    [0x10,0x30],
                    [0x11,0x31],
                    [0x12,0x32],
                    [0x13,0x33],
                    [0x50],
                    [0x51],
                    [0x52],
                    [0x53]
                ]},
                highresolutionvelocityprefix: {ch:true,val:0xB0,second:[
                    [0x58]
                ]},
                hold: {ch:true,val:0xB0,second:[
                    [0x40,0x45]
                ]},
                lagatofootswitch: {ch:true,val:0xB0,second:[
                    [0x44]
                ]},
                localcontrol: {ch:true,val:0xB0,second:[
                    [0x7A]
                ]},
                modulationchange: {ch:true,val:0xB0,second:[
                    [0x01,0x21]
                ]},
                monomodeon: {ch:true,val:0xB0,second:[
                    [0x7E]
                ]},
                nrpm: {ch:true,val:0xB0,second:[
                    [0x62,0x63]
                ]},
                rpm: {ch:true,val:0xB0,second:[
                    [0x64,0x65]
                ]},
                omnimodeoff: {ch:true,val:0xB0,second:[
                    [0x7C]
                ]},
                omnimodeon: {ch:true,val:0xB0,second:[
                    [0x7D]
                ]},
                pan: {ch:true,val:0xB0,second:[
                    [0x0A,0x2A]
                ]},
                pitchbend: {ch:true,val:0xB0,second:[
                    [0xE0]
                ]},
                polymodeon: {ch:true,val:0xB0,second:[
                    [0x7F]
                ]},
                polyphonickeypressure: {ch:true,val:0xB0,second:[
                    [0xA0]
                ]},
                portamentcontroll: {ch:true,val:0xB0,second:[
                    [0x54]
                ]},
                portamentoswitch: {ch:true,val:0xB0,second:[
                    [0x41]
                ]},
                portamentotime: {ch:true,val:0xB0,second:[
                    [0x05,0x25]
                ]},
                program: {ch:true,val:0xB0,second:[
                    [0xC0]
                ]},
                releasetime: {ch:true,val:0xB0,second:[
                    [0x48]
                ]},
                resetallcontroller: {ch:true,val:0xB0,second:[
                    [0x79]
                ]},
                softpedal: {ch:true,val:0xB0,second:[
                    [0x43]
                ]},
                sostenuto: {ch:true,val:0xB0,second:[
                    [0x42]
                ]},
                soundcontrol: {ch:true,val:0xB0,second:[
                    [0x4F]
                ]},
                soundvariation: {ch:true,val:0xB0,second:[
                    [0x46]
                ]},
                timbre: {ch:true,val:0xB0,second:[
                    [0x47]
                ]},
                timingclock: {ch:true,val:0xB0,second:[
                    [0xF8]
                ]},
                tunerrequest: {ch:true,val:0xB0,second:[
                    [0xF6]
                ]},
                vibratodelay: {ch:true,val:0xB0,second:[
                    [0x4E]
                ]},
                vibratodepth: {ch:true,val:0xB0,second:[
                    [0x4D]
                ]},
                vibratorate: {ch:true,val:0xB0,second:[
                    [0x4C]
                ]},
                volume: {ch:true,val:0xB0,second:[
                    [0x07, 0x27]
                ]},
                undef: {ch:true,val:0xB0,second:[
                    [0x03,0x23],
                    [0x09,0x29],
                    [0x0E,0x2E],
                    [0x0F,0x2F],
                    [0x14,0x34],
                    [0x15,0x35],
                    [0x16,0x36],
                    [0x17,0x37],
                    [0x18,0x38],
                    [0x19,0x39],
                    [0x1A,0x3A],
                    [0x1B,0x3B],
                    [0x1C,0x3C],
                    [0x1D,0x3D],
                    [0x1E,0x3E],
                    [0x1F,0x3F],
                    [0x55],
                    [0x56],
                    [0x57],
                    [0x59],
                    [0x5A],
                    [0x66],
                    [0x67],
                    [0x68],
                    [0x69],
                    [0x6A],
                    [0x6B],
                    [0x6C],
                    [0x6D],
                    [0x6E],
                    [0x6F],
                    [0x70],
                    [0x71],
                    [0x72],
                    [0x73],
                    [0x74],
                    [0x75],
                    [0x76],
                    [0x77]
                ]}
            },
            writable: false
        }
    });
    
    snd.MIDI.MIDIOut = function(midiOut, midiDef) {
        this._midiOut = midiOut;
        this._midiDef = (midiDef) ? midiDef : snd.MIDI.GENERAL_MIDI_OUT;
    };
    
    snd.MIDI.MIDIOut.prototype.sendMessage = function(message, ch, no, pos, values, timestamp) {
        var msgBytes = [];
        var keys;
        
        if (typeof(message) == "string") {
            var headerBytes = snd.MIDI.MIDIOut.convMsgStrToByte(message, ch, no, pos);
            if (headerBytes.length == 0) {
                return this;
            }
            
            keys = Object.keys(headerBytes);
            for (var key in keys) {
                msgBytes.push(headerBytes[key]);
            }
        } else {
            console.log("message must be String like \"NoteOn\".(If you need send some MIDI Bytes like [0x81, 60, 127], please use send method.)");
            return;
        }
        
        var keys = Object.keys(values);
        for (var key in keys) {
            msgBytes.push(values[key]);
        }
        
        return this.send(msgBytes.slice(0, 3), timestamp);
    }
    
    snd.MIDI.MIDIOut.prototype.send = function(messageBytes, timestamp) {
        this._midiOut.send(messageBytes, timestamp);
        return this;
    };
    
    snd.MIDI.MIDIOut.convMsgStrToBytes = function(str, ch, no, pos) {
        var ret = [];
        var b;
        
        var def = this._midiDef[str.toLowerCase()];
        if (!def) {
            console.log("\"" + str + "\" is not supported.");
            return ret;
        }
        
        if (def.ch) {
            b = (def.val & 0xF0) | (ch & 0x0F);
        } else {
            b = def.val;
        }
        ret.push(b);
        
        if (def.second) {
            var second = null;
            
            if (def.second.length == 1) {
                if (def.second[0].length == 1) {
                    second = def.second[0][0];
                } else {
                    if (def.second[0][pos]) {
                        second = def.second[0][pos];
                    }
                }
            } else {
                if (def.second[no]) {
                    second = def.second[no];
                } else {
                    if (def.second[no][pos]) {
                        second = def.second[no][pos];
                    }
                }
            }
            
            if (!second) {
                console.log("Massage \"" + str + "\" (no." + no + " pos." + pos + ") is not listed.");
                ret = [];
            }
            
            ret.push(second);
        }
        
        return ret;
    };
    
    return snd;
}));
