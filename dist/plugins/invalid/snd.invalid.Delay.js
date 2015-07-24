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
    snd.invalid.TAG_DEF["snd-delay"] = {
        "tagName": "snd-delay",
        "class": snd.Delay,
        "styles": {
            maxDelay: {type: "property", name: "maxDelay"},
            delayTime: {type: "property", name: "delayTime"}
        },
        "attributes": {
        },
        parameters: [
            {name: "delaytime-param", param: "delayTimeParam"}
        ],
        "events": {
        },
        "methods": {
        }
    };
    
    return snd;
}));
