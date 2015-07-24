(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD
        define(['snd.invalid'], factory);
    } else if (typeof exports === 'object') {
        // Node
    } else {
        // Browser globals (root is window)
        root.snd = factory(root.snd);
    }
}(this, function(snd) {
    snd.invalid.TAG_DEF["snd-filter"] = {
        "tagName": "snd-filter",
        "class": snd.BiquadFilter,
        "styles": {
            frequency: {type: "property", name: "frequency"},
            detune: {type: "property", name: "detune"},
            q: {type: "property", name: "Q"},
            gain: {type: "property", name: "gain"}
        },
        "attributes": {
            type: {type: "property", name: "type"},
        },
        "events": {
        },
        "methods": {
        }
    };
    
    return snd;
}));

