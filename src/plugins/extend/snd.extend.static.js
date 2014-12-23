snd.invalid.CLASS_DEF = [];

snd.invalid.init = function() {
    for (var i = 0; i < snd.invalid.CLASS_DEF.length; i++) {
        snd.invalid.CLASS_DEF[i]();
    }
    
    snd.invalid.BASE_OBSERVER.observe(document.body, {
        childList: true,
        subtree: true
    });
    
    snd.invalid.baseObserverCallback();
};
