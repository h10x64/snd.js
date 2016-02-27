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
                "80": {"event":"onnoteoff","attr":{"no":0,"pos":0},
                    "second": undefined
                },
                "90": {"event":"onnoteon","attr":{"no":0,"pos":0},
                    "second": undefined
                },
                "A0": {"event":"onpolyphonickeypressure","attr":{"no":0,"pos":0},
                    "second": undefined
                },
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
                "C0": {"event":"onprogramchange","attr":{"no":0,"pos":0},
                    "second": undefined
                },
                "D0": {"event":"onchannelpressure","attr":{"no":0,"pos":0},
                    "second": undefined
                },
                "E0": {"event":"onpitchbendchange","attr":{"no":0,"pos":0},
                    "second": undefined
                },
                "F0": {"event":"onsysex","attr":{"ch":false,"no":0,"pos":0},
                    "second": undefined
                },
                "F1": {"event":"onquarterframe","attr":{"ch":false,"no":0,"pos":0},
                    "second": undefined
                },
                "F2": {"event":"onsongselect","attr":{"ch":false,"no":0,"pos":0},
                    "second": undefined
                },
                "F3": {"event":"onsysundef","attr":{"ch":false,"no":0,"pos":0},
                    "second": undefined
                },
                "F4": {"event":"onsysundef","attr":{"ch":false,"no":0,"pos":0},
                    "second": undefined
                },
                "F5": {"event":"onsysundef","attr":{"ch":false,"no":0,"pos":0},
                    "second": undefined
                },
                "F6": {"event":"ontunerrequest","attr":{"ch":false,"no":0,"pos":0},
                    "second": undefined
                },
                "F7": {"event":"onendex","attr":{"ch":false,"no":0,"pos":0},
                    "second": undefined
                },
                "F8": {"event":"ontimingclock","attr":{"ch":false,"no":0,"pos":0},
                    "second": undefined
                },
                "F9": {"event":"onsysundef","attr":{"ch":false,"no":0,"pos":0},
                    "second": undefined
                },
                "FA": {"event":"onstart","attr":{"ch":false,"no":0,"pos":0},
                    "second": undefined
                },
                "FB": {"event":"oncontinue","attr":{"ch":false,"no":0,"pos":0},
                    "second": undefined
                },
                "FC": {"event":"onstop","attr":{"ch":false,"no":0,"pos":0},
                    "second": undefined
                },
                "FD": {"event":"onsysundef","attr":{"ch":false,"no":0,"pos":0},
                    "second": undefined
                },
                "FE": {"event":"onactivesensing","attr":{"ch":false,"no":0,"pos":0},
                    "second": undefined
                },
                "FF": {"event":"onreset","attr":{"ch":false,"no":0,"pos":0},
                    "second": undefined
                }
            },
            writable: false
        }
    });

    snd.MIDI.MIDIIn = function(midiIn, midiDef) {
        var _this = this;

        this._midiIn = midiIn;
        this._midiDef = (midiDef) ? midiDef : snd.MIDI.GENERAL_MIDI_IN;

        this._onnoteoffEventListeners = [];
        this._onnoteonEventListeners = [];
        this._onpolyphonickeypressureEventListeners = [];
        this._oncontrolchangeEventListeners = [];
        this._onbankselectEventListeners = [];
        this._onmodulationchangeEventListeners = [];
        this._onbreathcontrollerchangeEventListeners = [];
        this._onundefEventListeners = [];
        this._onfootcontrollerchangeEventListeners = [];
        this._onportamentotimechangeEventListeners = [];
        this._ondataentryEventListeners = [];
        this._onvolumechangeEventListeners = [];
        this._onbalancechangeEventListeners = [];
        this._onpanchangeEventListeners = [];
        this._onexpressioncontrollerchangeEventListeners = [];
        this._oneffectcontrolchangeEventListeners = [];
        this._ongeneralpurposecontrollerchangeEventListeners = [];
        this._onholdchangeEventListeners = [];
        this._onportamentoswitchchangeEventListeners = [];
        this._onsostenutochangeEventListeners = [];
        this._onsoftpedalchangeEventListeners = [];
        this._onlagatofootswitchchangeEventListeners = [];
        this._onsoundvariationchangeEventListeners = [];
        this._ontimbrechangeEventListeners = [];
        this._onreleasetimechangeEventListeners = [];
        this._onattacktimechangeEventListeners = [];
        this._onbrightnesschangeEventListeners = [];
        this._ondecaytimechangeEventListeners = [];
        this._onvibratoratechangeEventListeners = [];
        this._onvibratodepthchangeEventListeners = [];
        this._onvibratodelaychangeEventListeners = [];
        this._onsoundcontrolchangeEventListeners = [];
        this._onportamentcontrolchangeEventListeners = [];
        this._onhighresolutionvelocityprefixchangeEventListeners = [];
        this._oneffectdepthchangeEventListeners = [];
        this._ondataincrementEventListeners = [];
        this._ondatadecrementEventListeners = [];
        this._onnrpmEventListeners = [];
        this._onrpmEventListeners = [];
        this._onallsoundoffEventListeners = [];
        this._onresetallcontrollerEventListeners = [];
        this._onlocalcontrolchangeEventListeners = [];
        this._onallnotesoffEventListeners = [];
        this._onomnimodeoffEventListeners = [];
        this._onomnimodeonEventListeners = [];
        this._onmonomodeonEventListeners = [];
        this._onpolymodeonEventListeners = [];
        this._onprogramchangeEventListeners = [];
        this._onchannelpressureEventListeners = [];
        this._onpitchbendchangeEventListeners = [];
        this._onsysexEventListeners = [];
        this._onquarterframeEventListeners = [];
        this._onsongselectEventListeners = [];
        this._onsysundefEventListeners = [];
        this._ontunerrequestEventListeners = [];
        this._onendexEventListeners = [];
        this._ontimingclockEventListeners = [];
        this._onstartEventListeners = [];
        this._oncontinueEventListeners = [];
        this._onstopEventListeners = [];
        this._onactivesensingEventListeners = [];
        this._onresetEventListeners = [];

        Object.defineProperties({
            onnoteoffEventListeners: {get: function() {
                    return this._onnoteoffEventListeners;
                }},
            onnoteonEventListeners: {get: function() {
                    return this._onnoteonEventListeners;
                }},
            onpolyphonickeypressureEventListeners: {get: function() {
                    return this._onpolyphonickeypressureEventListeners;
                }},
            oncontrolchangeEventListeners: {get: function() {
                    return this._oncontrolchangeEventListeners;
                }},
            onbankselectEventListeners: {get: function() {
                    return this._onbankselectEventListeners;
                }},
            onmodulationchangeEventListeners: {get: function() {
                    return this._onmodulationchangeEventListeners;
                }},
            onbreathcontrollerchangeEventListeners: {get: function() {
                    return this._onbreathcontrollerchangeEventListeners;
                }},
            onundefEventListeners: {get: function() {
                    return this._onundefEventListeners;
                }},
            onfootcontrollerchangeEventListeners: {get: function() {
                    return this._onfootcontrollerchangeEventListeners;
                }},
            onportamentotimechangeEventListeners: {get: function() {
                    return this._onportamentotimechangeEventListeners;
                }},
            ondataentryEventListeners: {get: function() {
                    return this._ondataentryEventListeners;
                }},
            onvolumechangeEventListeners: {get: function() {
                    return this._onvolumechangeEventListeners;
                }},
            onbalancechangeEventListeners: {get: function() {
                    return this._onbalancechangeEventListeners;
                }},
            onpanchangeEventListeners: {get: function() {
                    return this._onpanchangeEventListeners;
                }},
            onexpressioncontrollerchangeEventListeners: {get: function() {
                    return this._onexpressioncontrollerchangeEventListeners;
                }},
            oneffectcontrolchangeEventListeners: {get: function() {
                    return this._oneffectcontrolchangeEventListeners;
                }},
            ongeneralpurposecontrollerchangeEventListeners: {get: function() {
                    return this._ongeneralpurposecontrollerchangeEventListeners;
                }},
            onholdchangeEventListeners: {get: function() {
                    return this._onholdchangeEventListeners;
                }},
            onportamentoswitchchangeEventListeners: {get: function() {
                    return this._onportamentoswitchchangeEventListeners;
                }},
            onsostenutochangeEventListeners: {get: function() {
                    return this._onsostenutochangeEventListeners;
                }},
            onsoftpedalchangeEventListeners: {get: function() {
                    return this._onsoftpedalchangeEventListeners;
                }},
            onlagatofootswitchchangeEventListeners: {get: function() {
                    return this._onlagatofootswitchchangeEventListeners;
                }},
            onsoundvariationchangeEventListeners: {get: function() {
                    return this._onsoundvariationchangeEventListeners;
                }},
            ontimbrechangeEventListeners: {get: function() {
                    return this._ontimbrechangeEventListeners;
                }},
            onreleasetimechangeEventListeners: {get: function() {
                    return this._onreleasetimechangeEventListeners;
                }},
            onattacktimechangeEventListeners: {get: function() {
                    return this._onattacktimechangeEventListeners;
                }},
            onbrightnesschangeEventListeners: {get: function() {
                    return this._onbrightnesschangeEventListeners;
                }},
            ondecaytimechangeEventListeners: {get: function() {
                    return this._ondecaytimechangeEventListeners;
                }},
            onvibratoratechangeEventListeners: {get: function() {
                    return this._onvibratoratechangeEventListeners;
                }},
            onvibratodepthchangeEventListeners: {get: function() {
                    return this._onvibratodepthchangeEventListeners;
                }},
            onvibratodelaychangeEventListeners: {get: function() {
                    return this._onvibratodelaychangeEventListeners;
                }},
            onsoundcontrolchangeEventListeners: {get: function() {
                    return this._onsoundcontrolchangeEventListeners;
                }},
            onportamentcontrolchangeEventListeners: {get: function() {
                    return this._onportamentcontrolchangeEventListeners;
                }},
            onhighresolutionvelocityprefixchangeEventListeners: {get: function() {
                    return this._onhighresolutionvelocityprefixchangeEventListeners;
                }},
            oneffectdepthchangeEventListeners: {get: function() {
                    return this._oneffectdepthchangeEventListeners;
                }},
            ondataincrementEventListeners: {get: function() {
                    return this._ondataincrementEventListeners;
                }},
            ondatadecrementEventListeners: {get: function() {
                    return this._ondatadecrementEventListeners;
                }},
            onnrpmEventListeners: {get: function() {
                    return this._onnrpmEventListeners;
                }},
            onrpmEventListeners: {get: function() {
                    return this._onrpmEventListeners;
                }},
            onallsoundoffEventListeners: {get: function() {
                    return this._onallsoundoffEventListeners;
                }},
            onresetallcontrollerEventListeners: {get: function() {
                    return this._onresetallcontrollerEventListeners;
                }},
            onlocalcontrolchangeEventListeners: {get: function() {
                    return this._onlocalcontrolchangeEventListeners;
                }},
            onallnotesoffEventListeners: {get: function() {
                    return this._onallnotesoffEventListeners;
                }},
            onomnimodeoffEventListeners: {get: function() {
                    return this._onomnimodeoffEventListeners;
                }},
            onomnimodeonEventListeners: {get: function() {
                    return this._onomnimodeonEventListeners;
                }},
            onmonomodeonEventListeners: {get: function() {
                    return this._onmonomodeonEventListeners;
                }},
            onpolymodeonEventListeners: {get: function() {
                    return this._onpolymodeonEventListeners;
                }},
            onprogramchangeEventListeners: {get: function() {
                    return this._onprogramchangeEventListeners;
                }},
            onchannelpressureEventListeners: {get: function() {
                    return this._onchannelpressureEventListeners;
                }},
            onpitchbendchangeEventListeners: {get: function() {
                    return this._onpitchbendchangeEventListeners;
                }},
            onsysexEventListeners: {get: function() {
                    return this._onsysexEventListeners;
                }},
            onquarterframeEventListeners: {get: function() {
                    return this._onquarterframeEventListeners;
                }},
            onsongselectEventListeners: {get: function() {
                    return this._onsongselectEventListeners;
                }},
            onsysundefEventListeners: {get: function() {
                    return this._onsysundefEventListeners;
                }},
            ontunerrequestEventListeners: {get: function() {
                    return this._ontunerrequestEventListeners;
                }},
            onendexEventListeners: {get: function() {
                    return this._onendexEventListeners;
                }},
            ontimingclockEventListeners: {get: function() {
                    return this._ontimingclockEventListeners;
                }},
            onstartEventListeners: {get: function() {
                    return this._onstartEventListeners;
                }},
            oncontinueEventListeners: {get: function() {
                    return this._oncontinueEventListeners;
                }},
            onstopEventListeners: {get: function() {
                    return this._onstopEventListeners;
                }},
            onactivesensingEventListeners: {get: function() {
                    return this._onactivesensingEventListeners;
                }},
            onresetEventListeners: {get: function() {
                    return this._onresetEventListeners;
                }}
        });

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

    snd.MIDI.MIDIIn.prototype.fireonnoteoffevent = function(ch, no, pos, values, message) {
        this.fireEvent(this.onnoteoffEventListeners, ch, no, pos, values, message);
    };
    snd.MIDI.MIDIIn.prototype.fireonnoteonevent = function(ch, no, pos, values, message) {
        this.fireEvent(this.onnoteonEventListeners, ch, no, pos, values, message);
    };
    snd.MIDI.MIDIIn.prototype.fireonpolyphonickeypressureevent = function(ch, no, pos, values, message) {
        this.fireEvent(this.onpolyphonickeypressureEventListeners, ch, no, pos, values, message);
    };
    snd.MIDI.MIDIIn.prototype.fireoncontrolchangeevent = function(ch, no, pos, values, message) {
        this.fireEvent(this.oncontrolchangeEventListeners, ch, no, pos, values, message);
    };
    snd.MIDI.MIDIIn.prototype.fireonbankselectevent = function(ch, no, pos, values, message) {
        this.fireEvent(this.onbankselectEventListeners, ch, no, pos, values, message);
    };
    snd.MIDI.MIDIIn.prototype.fireonmodulationchangeevent = function(ch, no, pos, values, message) {
        this.fireEvent(this.onmodulationchangeEventListeners, ch, no, pos, values, message);
    };
    snd.MIDI.MIDIIn.prototype.fireonbreathcontrollerchangeevent = function(ch, no, pos, values, message) {
        this.fireEvent(this.onbreathcontrollerchangeEventListeners, ch, no, pos, values, message);
    };
    snd.MIDI.MIDIIn.prototype.fireonundefevent = function(ch, no, pos, values, message) {
        this.fireEvent(this.onundefEventListeners, ch, no, pos, values, message);
    };
    snd.MIDI.MIDIIn.prototype.fireonfootcontrollerchangeevent = function(ch, no, pos, values, message) {
        this.fireEvent(this.onfootcontrollerchangeEventListeners, ch, no, pos, values, message);
    };
    snd.MIDI.MIDIIn.prototype.fireonportamentotimechangeevent = function(ch, no, pos, values, message) {
        this.fireEvent(this.onportamentotimechangeEventListeners, ch, no, pos, values, message);
    };
    snd.MIDI.MIDIIn.prototype.fireondataentryevent = function(ch, no, pos, values, message) {
        this.fireEvent(this.ondataentryEventListeners, ch, no, pos, values, message);
    };
    snd.MIDI.MIDIIn.prototype.fireonvolumechangeevent = function(ch, no, pos, values, message) {
        this.fireEvent(this.onvolumechangeEventListeners, ch, no, pos, values, message);
    };
    snd.MIDI.MIDIIn.prototype.fireonbalancechangeevent = function(ch, no, pos, values, message) {
        this.fireEvent(this.onbalancechangeEventListeners, ch, no, pos, values, message);
    };
    snd.MIDI.MIDIIn.prototype.fireonpanchangeevent = function(ch, no, pos, values, message) {
        this.fireEvent(this.onpanchangeEventListeners, ch, no, pos, values, message);
    };
    snd.MIDI.MIDIIn.prototype.fireonexpressioncontrollerchangeevent = function(ch, no, pos, values, message) {
        this.fireEvent(this.onexpressioncontrollerchangeEventListeners, ch, no, pos, values, message);
    };
    snd.MIDI.MIDIIn.prototype.fireoneffectcontrolchangeevent = function(ch, no, pos, values, message) {
        this.fireEvent(this.oneffectcontrolchangeEventListeners, ch, no, pos, values, message);
    };
    snd.MIDI.MIDIIn.prototype.fireongeneralpurposecontrollerchangeevent = function(ch, no, pos, values, message) {
        this.fireEvent(this.ongeneralpurposecontrollerchangeEventListeners, ch, no, pos, values, message);
    };
    snd.MIDI.MIDIIn.prototype.fireonholdchangeevent = function(ch, no, pos, values, message) {
        this.fireEvent(this.onholdchangeEventListeners, ch, no, pos, values, message);
    };
    snd.MIDI.MIDIIn.prototype.fireonportamentoswitchchangeevent = function(ch, no, pos, values, message) {
        this.fireEvent(this.onportamentoswitchchangeEventListeners, ch, no, pos, values, message);
    };
    snd.MIDI.MIDIIn.prototype.fireonsostenutochangeevent = function(ch, no, pos, values, message) {
        this.fireEvent(this.onsostenutochangeEventListeners, ch, no, pos, values, message);
    };
    snd.MIDI.MIDIIn.prototype.fireonsoftpedalchangeevent = function(ch, no, pos, values, message) {
        this.fireEvent(this.onsoftpedalchangeEventListeners, ch, no, pos, values, message);
    };
    snd.MIDI.MIDIIn.prototype.fireonlagatofootswitchchangeevent = function(ch, no, pos, values, message) {
        this.fireEvent(this.onlagatofootswitchchangeEventListeners, ch, no, pos, values, message);
    };
    snd.MIDI.MIDIIn.prototype.fireonsoundvariationchangeevent = function(ch, no, pos, values, message) {
        this.fireEvent(this.onsoundvariationchangeEventListeners, ch, no, pos, values, message);
    };
    snd.MIDI.MIDIIn.prototype.fireontimbrechangeevent = function(ch, no, pos, values, message) {
        this.fireEvent(this.ontimbrechangeEventListeners, ch, no, pos, values, message);
    };
    snd.MIDI.MIDIIn.prototype.fireonreleasetimechangeevent = function(ch, no, pos, values, message) {
        this.fireEvent(this.onreleasetimechangeEventListeners, ch, no, pos, values, message);
    };
    snd.MIDI.MIDIIn.prototype.fireonattacktimechangeevent = function(ch, no, pos, values, message) {
        this.fireEvent(this.onattacktimechangeEventListeners, ch, no, pos, values, message);
    };
    snd.MIDI.MIDIIn.prototype.fireonbrightnesschangeevent = function(ch, no, pos, values, message) {
        this.fireEvent(this.onbrightnesschangeEventListeners, ch, no, pos, values, message);
    };
    snd.MIDI.MIDIIn.prototype.fireondecaytimechangeevent = function(ch, no, pos, values, message) {
        this.fireEvent(this.ondecaytimechangeEventListeners, ch, no, pos, values, message);
    };
    snd.MIDI.MIDIIn.prototype.fireonvibratoratechangeevent = function(ch, no, pos, values, message) {
        this.fireEvent(this.onvibratoratechangeEventListeners, ch, no, pos, values, message);
    };
    snd.MIDI.MIDIIn.prototype.fireonvibratodepthchangeevent = function(ch, no, pos, values, message) {
        this.fireEvent(this.onvibratodepthchangeEventListeners, ch, no, pos, values, message);
    };
    snd.MIDI.MIDIIn.prototype.fireonvibratodelaychangeevent = function(ch, no, pos, values, message) {
        this.fireEvent(this.onvibratodelaychangeEventListeners, ch, no, pos, values, message);
    };
    snd.MIDI.MIDIIn.prototype.fireonsoundcontrolchangeevent = function(ch, no, pos, values, message) {
        this.fireEvent(this.onsoundcontrolchangeEventListeners, ch, no, pos, values, message);
    };
    snd.MIDI.MIDIIn.prototype.fireonportamentcontrolchangeevent = function(ch, no, pos, values, message) {
        this.fireEvent(this.onportamentcontrolchangeEventListeners, ch, no, pos, values, message);
    };
    snd.MIDI.MIDIIn.prototype.fireonhighresolutionvelocityprefixchangeevent = function(ch, no, pos, values, message) {
        this.fireEvent(this.onhighresolutionvelocityprefixchangeEventListeners, ch, no, pos, values, message);
    };
    snd.MIDI.MIDIIn.prototype.fireoneffectdepthchangeevent = function(ch, no, pos, values, message) {
        this.fireEvent(this.oneffectdepthchangeEventListeners, ch, no, pos, values, message);
    };
    snd.MIDI.MIDIIn.prototype.fireondataincrementevent = function(ch, no, pos, values, message) {
        this.fireEvent(this.ondataincrementEventListeners, ch, no, pos, values, message);
    };
    snd.MIDI.MIDIIn.prototype.fireondatadecrementevent = function(ch, no, pos, values, message) {
        this.fireEvent(this.ondatadecrementEventListeners, ch, no, pos, values, message);
    };
    snd.MIDI.MIDIIn.prototype.fireonnrpmevent = function(ch, no, pos, values, message) {
        this.fireEvent(this.onnrpmEventListeners, ch, no, pos, values, message);
    };
    snd.MIDI.MIDIIn.prototype.fireonrpmevent = function(ch, no, pos, values, message) {
        this.fireEvent(this.onrpmEventListeners, ch, no, pos, values, message);
    };
    snd.MIDI.MIDIIn.prototype.fireonallsoundoffevent = function(ch, no, pos, values, message) {
        this.fireEvent(this.onallsoundoffEventListeners, ch, no, pos, values, message);
    };
    snd.MIDI.MIDIIn.prototype.fireonresetallcontrollerevent = function(ch, no, pos, values, message) {
        this.fireEvent(this.onresetallcontrollEventListeners, ch, no, pos, values, message);
    };
    snd.MIDI.MIDIIn.prototype.fireonlocalcontrolchangeevent = function(ch, no, pos, values, message) {
        this.fireEvent(this.onlocalcontrolchangeEventListeners, ch, no, pos, values, message);
    };
    snd.MIDI.MIDIIn.prototype.fireonallnotesoffevent = function(ch, no, pos, values, message) {
        this.fireEvent(this.onallnotesoffEventListeners, ch, no, pos, values, message);
    };
    snd.MIDI.MIDIIn.prototype.fireonomnimodeoffevent = function(ch, no, pos, values, message) {
        this.fireEvent(this.onomnimodeoffEventListeners, ch, no, pos, values, message);
    };
    snd.MIDI.MIDIIn.prototype.fireonomnimodeonevent = function(ch, no, pos, values, message) {
        this.fireEvent(this.onomnimodeonEventListeners, ch, no, pos, values, message);
    };
    snd.MIDI.MIDIIn.prototype.fireonmonomodeonevent = function(ch, no, pos, values, message) {
        this.fireEvent(this.onmonomodeonEventListeners, ch, no, pos, values, message);
    };
    snd.MIDI.MIDIIn.prototype.fireonpolymodeonevent = function(ch, no, pos, values, message) {
        this.fireEvent(this.onpolymodeonEventListeners, ch, no, pos, values, message);
    };
    snd.MIDI.MIDIIn.prototype.fireonprogramchangeevent = function(ch, no, pos, values, message) {
        this.fireEvent(this.onprogramchangeEventListeners, ch, no, pos, values, message);
    };
    snd.MIDI.MIDIIn.prototype.fireonchannelpressureevent = function(ch, no, pos, values, message) {
        this.fireEvent(this.onchannelpressureEventListeners, ch, no, pos, values, message);
    };
    snd.MIDI.MIDIIn.prototype.fireonpitchbendchangeevent = function(ch, no, pos, values, message) {
        this.fireEvent(this.onpitchbendchangeEventListeners, ch, no, pos, values, message);
    };
    snd.MIDI.MIDIIn.prototype.fireonsysexevent = function(ch, no, pos, values, message) {
        this.fireEvent(this.onsysexEventListeners, ch, no, pos, values, message);
    };
    snd.MIDI.MIDIIn.prototype.fireonquarterframeevent = function(ch, no, pos, values, message) {
        this.fireEvent(this.onquarterframeEventListeners, ch, no, pos, values, message);
    };
    snd.MIDI.MIDIIn.prototype.fireonsongselectevent = function(ch, no, pos, values, message) {
        this.fireEvent(this.onsongselectEventListeners, ch, no, pos, values, message);
    };
    snd.MIDI.MIDIIn.prototype.fireonsysundefevent = function(ch, no, pos, values, message) {
        this.fireEvent(this.onsysundefEventListeners, ch, no, pos, values, message);
    };
    snd.MIDI.MIDIIn.prototype.fireontunerrequestevent = function(ch, no, pos, values, message) {
        this.fireEvent(this.ontunerrequestEventListeners, ch, no, pos, values, message);
    };
    snd.MIDI.MIDIIn.prototype.fireonendexevent = function(ch, no, pos, values, message) {
        this.fireEvent(this.onendexEventListeners, ch, no, pos, values, message);
    };
    snd.MIDI.MIDIIn.prototype.fireontimingclockevent = function(ch, no, pos, values, message) {
        this.fireEvent(this.ontimingclockEventListeners, ch, no, pos, values, message);
    };
    snd.MIDI.MIDIIn.prototype.fireonstartevent = function(ch, no, pos, values, message) {
        this.fireEvent(this.onstartEventListeners, ch, no, pos, values, message);
    };
    snd.MIDI.MIDIIn.prototype.fireoncontinueevent = function(ch, no, pos, values, message) {
        this.fireEvent(this.oncontinueEventListeners, ch, no, pos, values, message);
    };
    snd.MIDI.MIDIIn.prototype.fireonstopevent = function(ch, no, pos, values, message) {
        this.fireEvent(this.onstopEventListeners, ch, no, pos, values, message);
    };
    snd.MIDI.MIDIIn.prototype.fireonactivesensingevent = function(ch, no, pos, values, message) {
        this.fireEvent(this.onactivesensingEventListeners, ch, no, pos, values, message);
    };
    snd.MIDI.MIDIIn.prototype.fireonresetevent = function(ch, no, pos, values, message) {
        this.fireEvent(this.onresetEventListeners, ch, no, pos, values, message);
    };

    snd.MIDI.MIDIIn.prototype.fireEvent = function(listeners, ch, no, pos, values, message) {
        for (var key in listeners) {
            listeners[key](ch, no, pos, values, message);
        }
    };

    return snd;
}));
