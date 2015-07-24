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
    snd.invalid.TAG_DEF["snd-noise"] = {
        "tagName": "snd-noise",
        "class": snd.Noise,
        "styles": {
            volume: {type: "property", name: "volume"}
        },
        "attributes": {
        },
        parameters: [
            {name: "volume-param", param: "volumeParam"}
        ],
        "events": {
        },
        "methods": {
        }
    };
    
    return snd;
}));
