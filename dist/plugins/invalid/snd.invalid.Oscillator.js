snd.invalid.CLASS_DEF.push(function() {
    snd.invalid.TAG_DEF["snd-oscillator"] = {
        "tagName": "snd-oscillator",
        "class": snd.OscillatorSource,
        // "attributeCallback" : "ADD_METHOD_NAME_(CHANGE_ATTRIBUTE_EVENT)_HERE",
        // "characterDataCallback" : "ADD_METHOD_NAME_(CHANGE_INNER_TEXT_EVENT)_HERE",
        // "nodeCallback" : "ADD_METHOD_NAME_(CHANGE_CHILD_NODE_EVENT)_HERE",
        "styles": {
            // "CSS_NAME" : "PROPERTY_NAME"
            "type": "oscillatorType",
            "volume": "volume",
            "frequency": "frequency",
            "detune": "detune"
        },
        "attributes": {
            // "ATTRIBUTE_NAME" : "METHOD_NAME"
            // "connectto": "connectTo" <- define automatically
        },
        "events": {
            "onended": "onended"
        },
        "methods": {
            "start": "start",
            "stop": "stop"
        }
    };
});
