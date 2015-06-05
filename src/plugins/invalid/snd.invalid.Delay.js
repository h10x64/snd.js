define(["snd.invalid"], function(snd) {
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
});
