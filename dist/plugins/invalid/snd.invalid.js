snd.invalid = {varsion: 0.0, isBeta: true};
snd.invalid.CLASS_DEF = [];

snd.PLUGIN_INIT.push(function() {
    
    /**
     * 初期化を行います。<br/>
     * document.bodyを使うため、document.onload内で実行するようにしてください。
     */
    snd.invalid.init = function() {
        var baseObserver = new MutationObserver(snd.invalid.bodyCallback);
        baseObserver.observe(document.body, {
            childList: true,
            subTree: true
        });
        
        var setup = snd.invalid.SETUP_FUNCTIONS;
        var setupKeys = Object.keys(setup);
        for (var i = 0; i < setupKeys.length; i++) {
            var key = setupKeys[i];
            if (typeof(setup[key]) == "function") {
                var elements = document.getElementsByTagName(key);
                for (var j = 0; j < elements.length; j++) {
                    var elem = elements[j];
                    setup[key](elem);
                }
            }
        }
    };
    
    snd.invalid.bodyCallback = function(record, observer) {
        var setup = snd.invalid.SETUP_FUNCTIONS;
        
        for (var i = 0; i < record.length; i++) {
            if (record[i].addedNodes) {
                for (var j = 0; j < record[i].addedNodes.length; j++) {
                    var node = record[i].addedNodes[j];

                    if (typeof (setup[node.tagName]) == "function") {
                        setup[node.tagName](node);
                    }
                }
            }
        }
    };
    
    snd.invalid.SETUP_FUNCTIONS = {};
    
    for (var i = 0; i < snd.invalid.CLASS_DEF.length; i++) {
        snd.invalid.CLASS_DEF[i]();
    }
});
    
snd.invalid.CLASS_DEF.push(function() {
    snd.invalid.Element = function(elem) {
        var _this = this;
        
        this._parent = elem;
        this._observer = new MutationObserver(function(record, observer) {
            for (var i = 0; i < record.length; i++) {
                if (record[i].attributeName) {
                    var attr = record[i].attributeName;
                    if (attr == "style") {
                        var keys = Object.keys(_this._parent.style);
                        var diff = {};
                        
                        if (_this._lastStyle) {
                            for (var j = 0; j < keys.length; j++) {
                                if ((!_this._lastStyle[keys[j]]) || ((_this._lastStyle[keys[j]]) && (_this._lastStyle[keys[j]] != _this._parent.style[keys[j]]))) {
                                    diff[keys[j]] = _this._parent.style[keys[j]];
                                }
                            }
                        } else {
                            diff = _this._parent.style;
                        }

                        _this.changeStyle(diff);

                        _this._lastStyle = _this._parent.style;
                    } else if (attr == "connectto") {
                        _this.connectTo(_this._parent.attributes["connectto"]);
                    } else {
                        _this.changeAttribute(record[i].attributeName);
                    }
                }
            }
        });
        this._obj = null;
        
        this._lastAttribute = {};
        this._lastStyle = {};
        
        this._observer.observe(elem, {
            attributes: true,
            childList: true
        });
    };
    
    snd.invalid.Element.prototype.changeAttribute = function(attrName) {
        // PLEASE OVERRIDE ME
    };
    
    snd.invalid.Element.prototype.changeStyle = function(diff) {
        // PLEASE OVERRIDE ME
    };
    
    snd.invalid.Element.prototype.nodeRemoved = function(removedNodes) {
        // PLEASE OVERRIDE ME
    };
    
    snd.invalid.Element.prototype.nodeAdded = function(addedNodes) {
        // PLEASE OVERRIDE ME
    };
    
    snd.invalid.Element.prototype.connectTo = function(elementId) {
        // PLEASE OVERRIRDE ME
    };
    
    snd.invalid.Element.setup = function(elem) {
        var e = new snd.invalid.Element(elem);
        elem._invalid = e;
    };
    
    // snd.invalid.SETUP_FUNCTIONS["element"] = snd.invalid.Element.setup;
});
