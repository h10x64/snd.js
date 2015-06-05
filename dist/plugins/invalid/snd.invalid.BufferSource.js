define(["snd.invalid"], function(snd) {
    snd.invalid.TAG_DEF["snd-buffersource"] = {
        tagName: "snd-buffersource",
        class: snd.BufferSource,
        // "attributeCallback" : "ADD_METHOD_NAME_(CHANGE_ATTRIBUTE_EVENT)_HERE",
        // "characterDataCallback" : "ADD_METHOD_NAME_(CHANGE_INNER_TEXT_EVENT)_HERE",
        // "nodeCallback" : "ADD_METHOD_NAME_(CHANGE_CHILD_NODE_EVENT)_HERE",
        styles: {
            // cssName: {type:"property", name:"propName"},
            // cssName: {type:"function", func: {getter:"getFuncName", setter:"setFuncName"}},
            volume: {type:"property", name:"volume"},
            loopStart: {type:"property", name:"loopStart"},
            loopEnd: {type:"property", name:"loopEnd"}
        },
        attributes: {
            // attrName: {type:"property", name:"propName"},
            // attrName: {type:"function", name:"funcName"},
            loop: {type:"property", name:"loop"},
            src: {type:"function", name:"loadURL"}
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


