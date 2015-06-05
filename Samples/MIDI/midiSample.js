require(["snd.OscillatorSource", "snd.VinylNoise", "snd.MIDI", "snd.MIDI.util"], function(snd) {
    // div tag
    var WORNINIG = null;
    // select tag
    var INPUT_SELECT = null;
    var TYPE_SELECT = null;
    var MOD_SELECT = null;
    var MOD_TYPE_SELECT = null;
    // input tag
    var NOISE_CHECK = null;
    // Selected MIDI Input
    var SELECTED = null;
    var MIDI_CHANNELS = null;
    var MOD_VALUE = 0;
    getSelectedType = function() {
        if (!TYPE_SELECT) {
            return undefined;
        } else {
            return TYPE_SELECT.options[TYPE_SELECT.selectedIndex].text;
        }
    };
    getSelectedMod = function() {
        if (!MOD_SELECT) {
            return undefined;
        } else {
            return MOD_SELECT.options[MOD_SELECT.selectedIndex].text;
        }
    };
    getSelectedModType = function() {
        if (!MOD_TYPE_SELECT) {
            return undefined;
        } else {
            return MOD_TYPE_SELECT.options[MOD_TYPE_SELECT.selectedIndex].text;
        }
    };
    getAddNoise = function() {
        if (!NOISE_CHECK) {
            return undefined;
        } else {
            return NOISE_CHECK.checked;
        }
    }

    setLFO = function(lfo, val) {
        if (MOD_VALUE == 0) {
            lfo.volume = 0;
        } else {
            lfo.volume = val;
            lfo.frequency = snd.MIDI.util.toHz(60) / 0x7F * MOD_VALUE;
        }
        setNoiseSize(lfo.noise, lfo.volume);
    };
    setNoiseSize = function(noise, val) {
        if (getAddNoise()) {
            noise.maxPetitNoiseSize = val;
            noise.minPetitNoiseSize = val / 100;
            noise.maxNoiseSize = val / 1000;
            noise.often = 1;
            noise.probability = 0.2;
        } else {
            noise.maxPetitNoiseSize = 0;
            noise.minPetitNoiseSize = 0;
            noise.maxNoiseSize = 0;
        }
    };
    onInputSelectChange = function() {
        if (!INPUT_SELECT) {
            return;
        }

        var selectedValue = (INPUT_SELECT.selectedIndex != 0) ? INPUT_SELECT.options[INPUT_SELECT.selectedIndex].text : undefined;
        if (selectedValue) {
            var selectedInput = snd.MIDI.INPUTS[selectedValue];
            if (SELECTED) {
                SELECTED.onmidimessage = function() {
                };
            }
            SELECTED = selectedInput;
            SELECTED.onmidimessage = onMIDIMessage;
        }
    };
    onTypeSelectChange = function() {
        var type = getSelectedType();
        if (!type) {
            return;
        }

        for (var ch = 0; ch < MIDI_CHANNELS.length; ch++) {
            var notes = Object.keys(MIDI_CHANNELS[ch]);
            for (var i = 0; i < notes.length; i++) {
                MIDI_CHANNELS[ch][notes[i]].osc.oscillatorType = type;
            }
        }
    };
    onModulationSelectChange = function() {
        var selectedValue = getSelectedMod();
        if (!selectedValue) {
            return;
        }

        for (var ch = 0; ch < MIDI_CHANNELS.length; ch++) {
            var notes = Object.keys(MIDI_CHANNELS[ch]);
            for (var i = 0; i < notes.length; i++) {
                if (selectedValue == "gain") {
                    MIDI_CHANNELS[ch][notes[i]].lfo.disconnect(MIDI_CHANNELS[ch][notes[i]].osc.frequencyParam);
                    MIDI_CHANNELS[ch][notes[i]].lfo.connect(MIDI_CHANNELS[ch][notes[i]].osc.volumeParam);
                    setLFO(MIDI_CHANNELS[ch][notes[i]].lfo, MIDI_CHANNELS[ch][notes[i]].osc.volume)
                } else if (selectedValue == "frequency") {
                    MIDI_CHANNELS[ch][notes[i]].lfo.disconnect(MIDI_CHANNELS[ch][notes[i]].osc.volumeParam);
                    MIDI_CHANNELS[ch][notes[i]].lfo.connect(MIDI_CHANNELS[ch][notes[i]].osc.frequencyParam);
                    setLFO(MIDI_CHANNELS[ch][notes[i]].lfo, MIDI_CHANNELS[ch][notes[i]].osc.frequency)
                }
            }
        }
    };
    onModulationTypeSelectChange = function() {
        var type = getSelectedModType();
        if (!type) {
            return;
        }

        for (var ch = 0; ch < MIDI_CHANNELS.length; ch++) {
            var notes = Object.keys(MIDI_CHANNELS[ch]);
            for (var i = 0; i < notes.length; i++) {
                MIDI_CHANNELS[ch][notes[i]].lfo.oscillatorType = type;
            }
        }
    };
    onNoiseCheckClick = function() {
        var selectedMod = getSelectedMod();
        var addNoise = getAddNoise();
        for (var ch = 0; ch < MIDI_CHANNELS.length; ch++) {
            var notes = Object.keys(MIDI_CHANNELS[ch]);
            for (var i = 0; i < notes.length; i++) {
                var depth = 0;
                if (addNoise) {
                    if (selectedMod == "gain") {
                        depth = MIDI_CHANNELS[ch][notes[i]].lfo.volume;
                    } else if (selectedMod == "frequency") {
                        depth = MIDI_CHANNELS[ch][notes[i]].lfo.frequency;
                    }
                }
            }
        }
    };
    onNoteOn = function(message) {
        var ch = message[0] & snd.MIDI.CH_FILTER;
        var note = message[1];
        var velocity = message[2];
        if (!MIDI_CHANNELS[ch][note]) {
            MIDI_CHANNELS[ch][note] = {};
            MIDI_CHANNELS[ch][note].osc = new snd.OscillatorSource("OSC" + note);
            MIDI_CHANNELS[ch][note].osc.frequency = snd.MIDI.util.toHz(note);
            MIDI_CHANNELS[ch][note].osc.oscillatorType = getSelectedType();
            MIDI_CHANNELS[ch][note].osc.connect(snd.MASTER);
            MIDI_CHANNELS[ch][note].lfo = new snd.OscillatorSource("LFO" + note);
            MIDI_CHANNELS[ch][note].lfo.frequency = 0;
            MIDI_CHANNELS[ch][note].lfo.oscillatorType = getSelectedModType();
            if (getSelectedMod() == "gain") {
                MIDI_CHANNELS[ch][note].lfo.connect(MIDI_CHANNELS[ch][note].osc.volumeParam);
            } else if (getSelectedMod() == "frequency") {
                MIDI_CHANNELS[ch][note].lfo.connect(MIDI_CHANNELS[ch][note].osc.frequencyParam);
            }

            MIDI_CHANNELS[ch][note].lfo.noise = new snd.VinylNoise("NOISE" + note, 256);
            MIDI_CHANNELS[ch][note].lfo.noise.connect(MIDI_CHANNELS[ch][note].lfo.volumeParam);
        }

        MIDI_CHANNELS[ch][note].osc.volume = 1.0 / 128 * velocity;
        MIDI_CHANNELS[ch][note].osc.start();
        if (getSelectedMod() == "gain") {
            setLFO(MIDI_CHANNELS[ch][note].lfo, MIDI_CHANNELS[ch][note].osc.volume);
        } else if (getSelectedMod() == "frequency") {
            setLFO(MIDI_CHANNELS[ch][note].lfo, MIDI_CHANNELS[ch][note].osc.frequency);
        }

        MIDI_CHANNELS[ch][note].lfo.start();
    };
    onNoteOff = function(message) {
        var ch = message[0] & snd.MIDI.CH_FILTER;
        var note = message[1];
        MIDI_CHANNELS[ch][note].osc.stop();
        MIDI_CHANNELS[ch][note].lfo.stop();
    };
    onPitchBend = function(message) {
        var ch = message[0] & snd.MIDI.CH_FILTER;
        var val = (message[2] << 7) | message[1];
        if (Math.abs(val) >= 0.0) {
            val = 2.0 * (val - 0x2000) / 0x2000;
        }

        var notes = Object.keys(MIDI_CHANNELS[ch]);
        var selectedMod = getSelectedMod();
        for (var i = 0; i < notes.length; i++) {
            var note = notes[i];
            MIDI_CHANNELS[ch][note].osc.frequency = snd.MIDI.util.toHz(parseFloat(note) + val);
            if (selectedMod == "frequency") {
                setLFO(MIDI_CHANNELS[ch][note].lfo, MIDI_CHANNELS[ch][note].osc.frequency);
            }
        }
    };
    onModulationChange = function(message) {
        var ch = message[0] & snd.MIDI.CH_FILTER;
        MOD_VALUE = message[2];
        var notes = Object.keys(MIDI_CHANNELS[ch]);
        for (var i = 0; i < notes.length; i++) {
            var note = notes[i];
            if (MIDI_CHANNELS[ch][note]) {
                var selectedMod = getSelectedMod();
                MIDI_CHANNELS[ch][note].lfo.frequency = snd.MIDI.util.toHz(MOD_VALUE);
                var depth = 0;
                if (selectedMod == "frequency") {
                    depth = MIDI_CHANNELS[ch][note].osc.frequency;
                } else if (selectedMod == "gain") {
                    depth = MIDI_CHANNELS[ch][note].osc.volume;
                }
                setLFO(MIDI_CHANNELS[ch][note].lfo, depth);
            }
        }
    };
    onMIDIMessage = function(evt) {
        console.log(evt);
        var message = evt.data;
        if (message.length > 0) {
            var messageID = message[0] & snd.MIDI.MESSAGE_FILTER;
            if (messageID == snd.MIDI.NOTE_ON) {
                onNoteOn(message);
            } else if (messageID == snd.MIDI.NOTE_OFF) {
                onNoteOff(message);
            } else if (messageID == snd.MIDI.PITCH_BEND) {
                onPitchBend(message);
            } else if (messageID == snd.MIDI.CONTROL_CHANGE) {
                if (message[1] == snd.MIDI.CTRL_MODULATION) {
                    onModulationChange(message);
                }
            }
        }
    };
    
    var onLoad = function() {
        WORNING = document.getElementById("worning");
        INPUT_SELECT = document.getElementById("inputs");
        TYPE_SELECT = document.getElementById("type");
        MOD_SELECT = document.getElementById("mod");
        MOD_TYPE_SELECT = document.getElementById("modType");
        NOISE_CHECK = document.getElementById("noise");
        if (window.navigator.userAgent.toLowerCase().indexOf('chrome') == -1) {
            WORNING.innerHTML = "No MIDI support present in your browser.<br/>Please use Chrome.";
            return;
        }

        MIDI_CHANNELS = [];
        for (var i = 0; i < 0x0F; i++) {
            MIDI_CHANNELS[i] = {};
        }
        snd.MIDI.init(null,
                function() {
                    var inputKeys = Object.keys(snd.MIDI.INPUTS);
                    for (var i = 0; i < inputKeys.length; i++) {
                        var opt = document.createElement("option");
                        opt.text = inputKeys[i];
                        INPUT_SELECT.appendChild(opt);
                    }
                },
                function(e) {
                    console.log(e);
                    WORNING.innerHTML = "MIDIRequest Error: code = " + e.code;
                }
        );
    };
    
    if (LOADED) {
        onLoad();
    } else {
        window.onload = onLoad;
    }
});
