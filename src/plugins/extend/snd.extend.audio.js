snd.invalid.CLASS_DEF.add(function() {
    snd.invalid.Audio = function(elem) {
        snd.invalid.Audio.call(this, elem.id, elem);
        
        this.observer = new MutationObserver(this.observeCallback);
        this.observer.observe(this.elem, {
            childTree: true,
            attributes: true
        });
        
        this.parseChildren(elem);
    };
    snd.invalid.Audio.prototype = Object.create(snd.MediaElementAudioSource.prototype);
    snd.invalid.Audio.prototype.constructor = snd.invalid.Audio;
    
    snd.invalid.Audio.setupElem = function(elem) {
        var audioObj = new snd.invalid.Audio(elem);
        elem.sndObj = audioObj;
    };
    
    snd.invalid.prototype.observeCallback = function(records, observer) {
        
    };

    snd.invalid.Audio.prototype.parseChildren = function() {
        if (this.elem.hasChildNodes()) {
        } else {
            this.sndObj.connectTo(snd.MASTER);
        }
    };
});
