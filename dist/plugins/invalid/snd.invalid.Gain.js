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
    snd.invalid.TAG_DEF["snd-gain"] = {
        "tagName": "snd-gain",
        "class": snd.Gain,
        "styles": {
            gain: {type: "property", name: "gain"}
        },
        "attributes": {
        },
        parameters: [
            {name: "gain-param", param: "gainParam"}
        ],
        "events": {
        },
        "methods": {
        }
    };
    
    return snd;
}));
