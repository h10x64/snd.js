snd.invalid.CLASS_DEF.push(function() {
    snd.invalid.Oscillator = function(elem) {
        snd.invalid.Element.apply(this, arguments);
        
        this._obj = new snd.OscillatorSource(elem.id);
    };
    snd.invalid.Oscillator.prototype = Object.create(snd.invalid.Element.prototype);
    snd.invalid.Oscillator.prototype.constructor = snd.invalid.Oscillator;
    
    snd.invalid.Oscillator.prototype.changeAttribute = function(attrName) {
        if (attrName.toLowerCase() == "start") {
            var val = parseFloat(this._parent.attributes.start);
            if (val) {
                this._obj.start(val);
                this._obj.volume = 1.0;
            } else if (this._parent.attributes.start) {
                this._obj.start();
                this._obj.volume = 1.0;
            } else {
                this._obj.volume = 0.0;
            }
        }
        if (!("volume" in this._parent.style)) {
            snd.invalid.Oscillator.defProp(this._parent);
        }
    };
    
    snd.invalid.Oscillator.prototype.changeStyle = function(diff) {
        if (diff["frequency"]) {
            this._obj.frequency = parseFloat(diff["frequency"]);
        }
        if (diff["volume"]) {
            this._obj.volume = parseFloat(diff["volume"]);
        }
        if (diff["detune"]) {
            this._obj.detune = parseFloat(diff["detune"]);
        }
    };
    
    snd.invalid.Oscillator.prototype.nodeRemoved = function(removedNodes) {
    };
    
    snd.invalid.Oscillator.prototype.nodeAdded = function(addedNodes) {
    };
    
    snd.invalid.Oscillator.prototype.connectTo = function(elementId) {
        if ((!elementId) || elementId == snd.invalid.MASTER) {
            this._obj.connect(snd.MASTER);
        } else {
            var connectElem = elem.childNodes.getElementById(elementId);
            if (connectElem && connectElem._invalid && connectElem._invalid._obj) {
                this._obj.connect(connectElem._invalid._obj);
            }
        }
    };
    
    snd.invalid.Oscillator.setup = function(elem) {
        // Create invalid object
        var e = new snd.invalid.Oscillator(elem);
        elem._invalid = e;
        snd.invalid.Oscillator.defProp(elem);
        
        // Setup connection
        e.connectTo(elem.attributes["connectto"]);
    };
    
    snd.invalid.Oscillator.defProp = function(elem) {
        var e = elem._invalid;
        
        Object.defineProperties(elem.style, {
            volume: {
                get: function() {
                    return e._obj.volume;
                },
                set: function(val) {
                    e._obj.volume = parseFloat(val);
                }
            },
            frequency: {
                get: function() {
                    return e._obj.frequency;
                },
                set: function(val) {
                    e._obj.frequency = parseFloat(val);
                }
            },
            detune: {
                get: function() {
                    return e._obj.detune;
                },
                set: function(val) {
                    e._obj.detune = parseFloat(val);
                }
            }
        });
    };

    // Customize jQuery
    if (jQuery) {
        if (jQuery.cssNumber) {
            if (!jQuery.cssNumber["volume"]) {
                jQuery.cssNumber["volume"] = true;
            }
            if (!jQuery.cssNumber["frequency"]) {
                jQuery.cssNumber["frequency"] = true;
            }
            if (!jQuery.cssNumber["detune"]) {
                jQuery.cssNumber["detune"] = true;
            }
        }
        if (jQuery.cssHooks) {
            var hooks = jQuery.cssHooks;
            if (!hooks["volume"]) {
                hooks["volume"] = {
                    get: function(elem, computed, extra) {
                        return elem.style.volume;
                    },
                    set: function(elem, val) {
                        elem.style.volume = val;
                    }
                };
            }
            if (!hooks["frequency"]) {
                hooks["frequency"] = {
                    get: function(elem, computed, extra) {
                        return elem.style.frequency;
                    },
                    set: function(elem, val) {
                        elem.style.frequency = val;
                    }
                };
            }
            if (!hooks["detune"]) {
                hooks["detune"] = {
                    get: function(elem, computed, extra) {
                        return elem.style.detune;
                    },
                    set: function(elem, val) {
                        elem.style.detune = val;
                    }
                };
            }
        }
    };
    
    snd.invalid.SETUP_FUNCTIONS["OSCILLATOR"] = snd.invalid.Oscillator.setup;
});
