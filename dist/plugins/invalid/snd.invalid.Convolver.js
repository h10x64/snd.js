define(["snd.invalid"], function(snd) {
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
});
