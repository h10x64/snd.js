snd.invalid.baseObserverCallback = function() {
    var audioElements = document.getElementsByTagName("audio");

    for (var i = 0; i < audioElements.length; i++) {
        var elem = audioElements[i];
        if (!elem.sndObj) {
            
        }
    }
};

snd.invalid.BASE_OBSERVER = new MutationObserver(snd.invalid.baseObserverCallback);
