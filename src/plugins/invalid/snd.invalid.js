snd.invalid = {varsion: 0.0, isBeta: true};
snd.invalid.CLASS_DEF = [];
snd.invalid.TAG_DEF = {};
if (jQuery && jQuery.cssHooks) {
    snd.invalid.doesCSSHooked = {};
}

snd.PLUGIN_INIT.push(function() {
    
    /**
     * 初期化を行います。<br/>
     * document.bodyを使うため、document.onload内で実行するようにしてください。
     */
    snd.invalid.init = function() {
        var baseObserver = new MutationObserver(snd.invalid.observeCallback);
        baseObserver.observe(document.body, {
            childList: true,
            subTree: true
        });
        
        var tagNames = Object.keys(snd.invalid.TAG_DEF);
        for (var i = 0; i < tagNames.length; i++) {
            var tagName = tagNames[i];
            var tags = document.getElementsByTagName(tagName);
            
            for (var j = 0; j < tags.length; j++) {
                var tag = tags[j];
                snd.invalid.Element.setup(tag, snd.invalid.TAG_DEF[tagName]);
            }
        }
    };
    
    snd.invalid.observeCallback = function(records, observer) {
        for (var i = 0; i < records.length; i++) {
            var record = records[i];
            var target = record.target;
            
            if (record.type == "childList") {
                for (var i = 0; i < record.addedNodes.length; i++) {
                    var node = record.addedNodes[i];
                    var invalid = node._invalid;

                    if (!invalid) {
                        // Setup new element
                        var tagName = node.tagName.toLowerCase();
                        if (tagName in snd.invalid.TAG_DEF) {
                            snd.invalid.Element.setup(node, snd.invalid.TAG_DEF[tagName]);
                        } else {
                            return;
                        }
                    }

                }
                
                var nodeCallback = snd.invalid.getMethod(target, "nodeCallback");
                if (typeof (nodeCallback) == "function") {
                    nodeCallback(record, observer);
                }
            } else {
                var invalid = target._invalid;
                
                if (invalid) {
                    if (record.type == "attributes") {
                        var attributeCallback = snd.invalid.getMethod(target, "attributeCallback");
                        if (typeof(attributeCallback) == "function") {
                            attributeCallback(record, observer);
                        }
                        
                        var attrName = record.attributeName;
                        if (attrName == "style") {
                            invalid.changeStyle(record, observer);
                        } else {
                            invalid.changeAttribute(record, observer);
                        }
                    } else if (record.type == "characterData") {
                        var callback = snd.invalid.getMethod(target, "characterDataCallback");
                        if (typeof(callback) == "function") {
                            callback(record, observer);
                        }
                    }
                }
            }
        }
    };
    
    snd.invalid.getMethodName = function(elem, type) {
        if (elem._invalid) {
            var invalid = elem._invalid;
            var sub = invalid._settings;
            
            for (var i = 1; i < arguments.length; i++) {
                var arg = arguments[i];
                if (sub[arg]) {
                    sub = sub[arg];
                } else {
                    return undefined;
                }
            }
            
            return sub;
        } else {
            return undefined;
        }
    };
    
    snd.invalid.getMethod = function(elem, type) {
        if (elem._invalid && elem._invalid._obj) {
            var callbackName = snd.invalid.getMethodName(elem, type);
            
            if (callbackName) {
                return elem._invalid._obj[callbackName];
            } else {
                return undefined;
            }
        } else {
            return undefined;
        }
    }
    
    snd.invalid.attributeCallback = function(records, observer) {
        for (var i = 0; i < records.length; i++) {
            var record = records[i];
            var invalid = record.target._invalid;
            
            if (invalid) {
                var callbackName = invalid._settings.attributeCallback;
                if (typeof(invalid._obj[callbackName]) == "function") {
                    invalid._obj[callbackName](records, observer);
                }
            }
            
            var changedAttrList = [];
            if (!invalid._lastAttributes) {
                for (var i = 0; i < record.target.attributes; i++) {
                    changedAttrList.push(record.target.attributes[i].nodeName);
                }
            } else {
                for (var i = 0; i < record.target.attributes; i++) {
                    if (record.target.attributes[i].nodeValue != invalid._lastAttributes[i].nodeValue) {
                        changedAttrList.push(record.target.attributes[i].nodeName);
                    }
                }
            }
            invalid.changeAttribute(changedAttrList);
            invalid._lastAttributes = record.target.attributes;
        }
    };
    
    snd.invalid.Element = function(elem, settings) {
        var baseClass = settings.class;
        
        this._parent = elem;
        this._settings = settings;
        this._observer = new MutationObserver(snd.invalid.observeCallback);
        
        this._obj = new baseClass(elem.id);
        
        this._lastAttribute = {};
        this._lastStyle = window.getComputedStyle(this._parent);
        
        this._observer.observe(elem, {
            childlist: true,
            attributes: true
        });
    };
    
    snd.invalid.Element.prototype.changeAttribute = function(record, observer) {
        var changedAttrName = record.attributeName;
        if (changedAttrName) {
            setAttribute(changedAttrName);
        }
    };
    
    snd.invalid.Element.prototype.setAttribute = function(attributeName) {
        if (attributeName == "connectto") {
            var attrVal = this._parent.getAttribute(attributeName);
            var connection;
            if (typeof (attrVal) == "string") {
                connection = attrVal.replace(/^\s*/, "").replace(/\s*$/, "").replace(/\s+/gm, " ").split(" ");
            } else {
                connection = attrVal;
            }
            this.connectTo(connection);
        } else {
            var attrMethod = snd.invalid.getMethod(this._parent, "attributes", attributeName);
            var value = this._parent.getAttribute(attributeName);

            if (typeof (attrMethod) == "function") {
                attrMethod(value);
            } else {
                var eventMethodName = snd.invalid.getMethodName(this._parent, "events", attributeName);
                if (eventMethodName) {
                    var _this = this;
                    this._obj[eventMethodName] = function() {
                        window.eval(_this._parent.getAttribute(eventMethodName));
                    };
                }
            }
        }
    };
    
    snd.invalid.Element.prototype.changeStyle = function(record, observer) {
        var last = this._lastStyle;
        var now = window.getComputedStyle(this._parent);
        var keys;
        
        var diff = {};
        for (var i = 0; i < last.length; i++) {
            var itemName = last.item(i);
            
            if (last.getPropertyValue(itemName) != now.getPropertyValue(itemName)) {
                diff[itemName] = now.getPropertyValue(itemName);
            }
        }
        for (var i = 0; i < now.length; i++) {
            var itemName = now.item(i);
            
            if (!diff[itemName]) {
                if (now.getPropertyValue(itemName) != last.getPropertyValue(itemName)) {
                    diff[itemName] = now.getPropertyValue(itemName);
                }
            }
        }
        
        keys = Object.keys(diff);
        for (var i = 0; i < keys.length; i++) {
            var key = keys[i];
            var propertyName = snd.invalid.getMethod(this._parent, "styles", key);
            var propertyValue = diff[key];
            
            this._obj[propertyName] = propertyValue;
        }
        
        this._lastStyle = now;
    };
    
    snd.invalid.Element.prototype.connectTo = function(elementIds) {
        if (!elementIds) {
            this._obj.connect(snd.MASTER);
            return;
        }
        
        for (var i = 0; i < elementIds.length; i++) {
            var elementId = elementIds[i];
            
            if (elementId.toLowerCase() == "master" || elementId.toLowerCase() == "snd.master") {
                this._obj.connect(snd.MASTER);
            } else {
                var elem = document.querySelector(elementId);
                if (elem) {
                    this._obj.connect(elem._invalid._obj);
                    this.connected.push(elementId);
                }
            }
        }
    };
    
    snd.invalid.Element.setup = function(elem, tagSettings) {
        var e = new snd.invalid.Element(elem, tagSettings);
        elem._invalid = e;
        
        var styles = tagSettings.styles;
        var methods = tagSettings.methods;
        var keys = Object.keys(styles);
        
        // Add property
        for (var keyNo = 0; keyNo < keys.length; keyNo++) {
            (function(n, _elem) {
                var i = n;
                var propName = styles[keys[i]];

                Object.defineProperty(_elem.style, keys[i], {
                    get: function() {
                        return _elem._invalid._obj[propName];
                    },
                    set: function(val) {
                        _elem._invalid._obj[propName] = val;
                    }
                });
            })(keyNo, elem);
        }
        
        // Define Methods
        keys = Object.keys(methods);
        for (var keyNo = 0; keyNo < keys.length; keyNo++) {
            (function(n, _elem) {
                var i = n;
                var methodName = methods[keys[i]];
                
                _elem[keys[i]] = function() {
                    _elem._invalid._obj[methodName].apply(_elem._invalid._obj, arguments);
                };
            })(keyNo, elem);
        }
        
        // jQuery setting
        if (jQuery && jQuery.cssHooks) {
            styles = tagSettings.styles;
            if (styles) {
                keys = Object.keys(styles);
                for (var i = 0; i < keys.length; i++) {
                    var key = keys[i];
                    (function(propName) {
                        var prop = propName;
                        
                        if (!jQuery.cssHooks[prop]) {
                            jQuery.cssHooks[prop] = {
                                get: function(ele, computed, extra) {
                                    return ele.style[prop];
                                },
                                set: function(ele, value) {
                                    ele.style[prop] = value;
                                }
                            };
                        }
                    })(key);
                }
            }
        }
        
        var hasConnectTo = false;
        for (var i = 0; i < elem.attributes; i++) {
            elem._invalid.setAttribute(elem.attributes[i].name);
            if (elem.attributes[i].name == "connectto") {
                hasConnectTo = true;
            }
        }
        
        if (!hasConnectTo) {
            elem._invalid.setAttribute("connectto");
        }
    };
    
    for (var i = 0; i < snd.invalid.CLASS_DEF.length; i++) {
        snd.invalid.CLASS_DEF[i]();
    }
});
