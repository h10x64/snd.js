define(["snd.invalid"], function(snd) {
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
});
