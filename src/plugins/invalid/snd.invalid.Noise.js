define(["snd.invalid"], function(snd) {
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
});
