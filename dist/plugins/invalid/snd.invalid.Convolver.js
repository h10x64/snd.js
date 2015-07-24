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
    snd.invalid.TAG_DEF["snd-convolver"] = {
        "tagName": "snd-convolver",
        "class": snd.Convolver,
        "styles": {
        },
        "attributes": {
            normalize: {type: "property", name:"normalize"},
            src: {type: "function", name:"loadURL"}
        },
        "events": {
        },
        "methods": {
        }
    };
    
    return snd;
}));
