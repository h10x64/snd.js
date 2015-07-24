(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD
        define(['snd.Invalid'], factory);
    } else if (typeof exports === 'object') {
        // Node
    } else {
        // Browser globals (root is window)
        root.snd = factory(root.snd);
    }
}(this, function(snd) {
    snd.invalid.TAG_DEF["snd-analyser"] = {
        "tagName": "snd-analyser",
        "class": snd.Analyser,
        "styles": {
            // "CSS_NAME" : "PROPERTY_NAME"
            floatFrequencyData: {type:"property", name:"floatFrequencyData"},
            byteFrequencyData: {type:"property", name:"byteFrequencyData"},
            floatTimeDomainData: {type:"property", name:"floatTimeDomainData"},
            byteTimeDomainData: {type:"property", name:"byteTimeDomainData"},
            fftSize: {type:"property", name:"fftSize"},
            frequencyBinCount: {type:"property", name:"frequencyBinCount"},
            minDecibels: {type:"property", name:"minDecibels"},
            maxDecibels: {type:"property", name:"maxDecibels"},
            smoothingTimeConstant: {type:"property", name:"smoothingTimeConstant"}
        },
        "attributes": {
        },
        "events": {
        },
        "methods": {
        }
    };
    
    return snd;
}));
