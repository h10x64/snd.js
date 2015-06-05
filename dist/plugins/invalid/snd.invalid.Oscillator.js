define(["snd.invalid", "snd.OscillatorSource"], function(snd) {
    snd.invalid.TAG_DEF["snd-oscillator"] = {
        tagName: "snd-oscillator",
        class: snd.OscillatorSource,
        // "attributeCallback" : "ADD_METHOD_NAME_(CHANGE_ATTRIBUTE_EVENT)_HERE",
        // "characterDataCallback" : "ADD_METHOD_NAME_(CHANGE_INNER_TEXT_EVENT)_HERE",
        // "nodeCallback" : "ADD_METHOD_NAME_(CHANGE_CHILD_NODE_EVENT)_HERE",
        styles: {
            // cssName: {type:"property", name:"propName"},
            // cssName: {type:"function", func: {getter:"getFuncName", setter:"setFuncName"}},
            volume: {type:"property", name:"volume"},
            frequency: {type:"property", name:"frequency"},
            detune: {type:"property", name:"detune"}
        },
        attributes: {
            // attrName: {type:"property", name:"propName"},
            // attrName: {type:"function", {name:"attrName", func:"functionName"}},
            type: {type:"property", name:"oscillatorType"}
        },
        parameters: [
            {name: "volume-param", param: "volumeParam"},
            {name: "frequency-param", param: "frequencyParam"},
            {name: "detune-param", param: "detuneParam"}
        ],
        events: {
            onended:"onended"
        },
        methods: {
            start:"start",
            stop:"stop"
        }
    };
    
    return snd;
});
