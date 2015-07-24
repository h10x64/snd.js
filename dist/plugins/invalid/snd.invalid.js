(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD
        define(['snd'], factory);
    } else if (typeof exports === 'object') {
        // Node
    } else {
        // Browser globals (root is window)
        root.snd = factory(root.snd);
    }
}(this, function(snd) {
    snd.invalid = {varsion: "0.1.20150606",  isBeta: true};
    snd.invalid.CLASS_DEF = [];
    snd.invalid.TAG_DEF = {};
    if (jQuery && jQuery.cssHooks) {
        snd.invalid.doesCSSHooked = {};
    }

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
            
            var elements = document.getElementsByTagName(tagName);
            for (var j = 0; j < elements.length; j++) {
                var elem = elements[j];
                snd.invalid.Element.setup(elem, snd.invalid.TAG_DEF[tagName]);
            }
        }
        
        for (var i = 0; i < tagNames.length; i++) {
            var tagName = tagNames[i];
            
            var elements = document.getElementsByTagName(tagName);
            for (var j = 0; j < elements.length; j++) {
                var elem = elements[j];
                if (elem._invalid) {
                    elem._invalid.setConnectTo();
                }
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
                            node._invalid.setConnectTo();
                        } else {
                            continue;
                        }
                    }
                }
                for (var i = 0; i < record.removedNodes.length; i++) {
                    var node = record.removedNodes[i];
                    var invalid = node._invalid;

                    if (invalid) {
                        invalid.disconnectFromAll();
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
                        if (typeof (attributeCallback) == "function") {
                            attributeCallback(record, observer);
                        }

                        var attrName = record.attributeName;
                        if (attrName) {
                            invalid.changeAttribute(record, observer);
                        }
                    } else if (record.type == "characterData") {
                        var callback = snd.invalid.getMethod(target, "characterDataCallback");
                        if (typeof (callback) == "function") {
                            callback(record, observer);
                        }
                    }
                }
            }
        }
    };

    snd.invalid.getSetting = function(elem, type) {
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
        if (!elem._invalid || !elem._invalid._obj) {
            return undefined;
        }
        var methodName = snd.invalid.getSetting.apply(this, arguments);
        
        if (typeof(methodName) == "string") {
            return elem._invalid._obj[methodName];
        }
    };

    snd.invalid.attributeCallback = function(records, observer) {
        for (var i = 0; i < records.length; i++) {
            var record = records[i];
            var invalid = record.target._invalid;

            if (invalid) {
                var callbackName = invalid._settings.attributeCallback;
                if (typeof (invalid._obj[callbackName]) == "function") {
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
    
    /*******************
     *  Define Element *
     *******************/
    
    snd.invalid.Element = function(elem, settings) {
        var baseClass = settings.class;

        this._htmlElem = elem;
        this._settings = settings;
        this._observer = new MutationObserver(snd.invalid.observeCallback);
        this._connection = {
            in: {},
            out: {}
        };

        this._obj = new baseClass(elem.id);

        this._lastAttribute = {};

        this._observer.observe(elem, {
            childlist: true,
            attributes: true
        });
    };
    
    snd.invalid.Element.prototype.setAttribute = function(attributeName) {
        if (attributeName == "style") {
            this.setStyle();
        } else if (attributeName != "connectto") {
            var setting = snd.invalid.getSetting(this._htmlElem, "attributes", attributeName);
            var value = this._htmlElem.getAttribute(attributeName);
            
            if (setting) {
                if (setting.type == "function") {
                    this._obj[setting.name](value);
                } else if (setting.type == "property") {
                    this._obj[setting.name] = value;
                }
            } else {
                var eventMethodName = snd.invalid.getSetting(this._htmlElem, "events", attributeName);
                if (eventMethodName) {
                    var _this = this;
                    this._obj[eventMethodName] = function() {
                        window.eval(_this._htmlElem.getAttribute(eventMethodName));
                    };
                }
            }
        }
    };
    
    snd.invalid.Element.prototype.setConnectTo = function() {
        var val = this._htmlElem.getAttribute("connectto");
        var connection;
        if (typeof (val) == "string") {
            connection = val.replace(/^\s*/, "").replace(/\s*$/, "").replace(/\s+/gm, " ").split(",");
        } else {
            connection = val;
        }
        this.changeConnectTo(connection);
    };
    
    snd.invalid.Element.prototype.setStyle = function() {
        var styles = snd.invalid.Element.parseStyleAttribute(this._htmlElem);
        var keys = Object.keys(styles);
        
        for (var i = 0; i < keys.length; i++) {
            var key = keys[i];
            var setting = snd.invalid.getSetting(this._htmlElem, "styles", key);
            
            if (setting) {
                if (setting.type == "function") {
                    this._obj[setting.name](styles[key]);
                } else if (setting.type == "property") {
                    this._obj[setting.name] = styles[key];
                }
            }
        }
    };

    snd.invalid.Element.prototype.changeAttribute = function(record, observer) {
        var changedAttrName = record.attributeName.toLowerCase();
        if (changedAttrName == "connectto") {
            this.setConnectTo();
        } else {
            this.setAttribute(changedAttrName);
        }
    };

    snd.invalid.Element.prototype.changeStyle = function(record, observer) {
        setStyle();
    };

    snd.invalid.Element.prototype.changeConnectTo = function(elementIds) {
        if (elementIds) {
            var keys = Object.keys(this._connection.out);
            for (var i = 0; i < keys.length; i++) {
                if (elementIds.indexOf(keys[i]) < 0) {
                    this.disconnect(keys[i]);
                }
            }
            for (var i = 0; i < elementIds.length; i++) {
                if (!this._connection.out[elementIds[i]]) {
                    this.connect(elementIds[i]);
                }
            }
        }

        if (Object.keys(this._connection.out).length <= 0) {
            this.connect("MASTER");
        }
    };
    
    snd.invalid.Element.prototype.connected = function(htmlElem) {
        htmlElem._invalid._connection.out["#" + htmlElem.id] = true;
        this._connection.in["#" + htmlElem.id] = true;
    };
    
    snd.invalid.Element.prototype.connect = function(selector) {
        var sel = selector.replace(/^\s*/, "").replace(/\s$/, "");
        
        if (sel.toUpperCase() == "MASTER") {
            this._obj.connect(snd.MASTER);
            this._connection.out["MASTER"] = true;

            return;
        } else if (!sel) {
            return;
        }

        var connectToElements = document.querySelectorAll(sel);
        for (var i = 0; i < connectToElements.length; i++) {
            var connectToElem = connectToElements[i];
            if (connectToElem && !this._connection.out["#" + connectToElem.id]) {
                if (!connectToElem._invalid) {
                    console.log("Tag #" + connectToElem.id + " isn't snd-tag.");
                    return;
                }

                this._obj.connect(connectToElem._invalid._obj);
                this._connection.out["#" + connectToElem.id] = true;
                connectToElem._invalid.connected(connectToElem);
            }
        }
    };

    snd.invalid.Element.prototype.disconnected = function(htmlElem) {
        delete htmlElem._invalid._connection.out["#" + htmlElem.id];
        delete this._connection.in["#" + htmlElem.id];
    };
    
    snd.invalid.Element.prototype.disconnect = function(selector) {
        if (selector.toUpperCase() == "MASTER") {
            this._obj.disconnect(snd.MASTER);
            delete this._connection.out["MASTER"];

            return;
        } else if (!selector) {
            return;
        }

        var disconnectFromElements = document.querySelectorAll(selector);
        for (var i = 0; i < disconnectFromElements.length; i++) {
            var disconnectFromElem = disconnectFromElements[i];
            if (disconnectFromElem && this._connection.out["#" + disconnectFromElem.id]) {
                if (!disconnectFromElem._invalid) {
                    console.log("Tag #" + disconnectFromElem.id + " isn't snd-tag.");
                    return;
                }

                this._obj.disconnect(disconnectFromElem._invalid._obj);
                delete this._connection.out["#" + disconnectFromElem.id];
                disconnectFromElem._invalid.disconnected(disconnectFromElem);
            }
        }
    };
    
    snd.invalid.Element.prototype.disconnectFromAll = function() {
        var keys = Object.keys(this._connection.out);
        if (keys.length > 0) {
            for (var i = 0; i < keys.length; i++) {
                this.disconnect(keys[i]);
            }
        }
        keys = Object.keys(this._connection.in);
        if (keys.length > 0) {
            for (var i = 0; i < keys.length; i++) {
                var elem = document.querySelector(keys[i]);
                if (elem) {
                    elem._invalid._obj.disconnect(this._obj);
                }
            }
        }
    };

    snd.invalid.Element.setup = function(elem, tagSettings) {
        var e = new snd.invalid.Element(elem, tagSettings);
        elem._invalid = e;

        var styles = tagSettings.styles;
        var methods = tagSettings.methods;
        var parameters = tagSettings.parameters;
        var keys = Object.keys(styles);

        // Add property
        for (var keyNo = 0; keyNo < keys.length; keyNo++) {
            (function(n, _elem) {
                var i = n;
                var setting = styles[keys[i]];
                
                var getter = function() {return undefined;};
                var setter = function(val) {};
                if (setting.type == "function") {
                    getter = function() {
                        return _elem._invalid._obj[setting.func.getter]();
                    };
                    setter = function(val) {
                        return _elem._invalid._obj[setting.func.setter](val);
                    };
                } else if (setting.type == "property") {
                    getter = function() {
                        return _elem._invalid._obj[setting.name];
                    };
                    setter = function(val) {
                        return _elem._invalid._obj[setting.name] = val;
                    };
                }

                Object.defineProperty(_elem.style, keys[i], {
                    get: function() {
                        return getter();
                    },
                    set: function(val) {
                        setter(val);
                    }
                });
            })(keyNo, elem);
        }
        
        // Set Attributes
        for (var i = 0; i < elem.attributes.length; i++) {
            elem._invalid.setAttribute(elem.attributes[i].name);
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
        
        // Add ParameterElement
        if (parameters && parameters.length > 0) {
            for (var i = 0; i < parameters.length; i++) {
                var paramSetting = parameters[i];
                snd.invalid.ParamElement.setup(elem, paramSetting);
            }
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
    };
    
    snd.invalid.Element.parseStyleAttribute = function(htmlElem) {
        if (!htmlElem) {
            return undefined;
        }
        var stylesStr = htmlElem.getAttribute("style");
        if (!stylesStr) {
            return undefined;
        }
        
        var ret = {};
        var styles = stylesStr.split(";");
        for (var i = 0; i < styles.length; i++) {
            var styleStr = styles[i].replace(/\s+/gm, " ").replace(/^\s*/, "").replace(/\s*$/, "");
            var style = styleStr.split(":");
            
            ret[style[0]] = style[1];
        }
        return ret;
    }
    
    /***********************
     * Define ParamElement *
     ***********************/
    
    snd.invalid.ParamElement = function(htmlElem, audioParam) {
        this._htmlElem = htmlElem;
        this._obj = audioParam;
        this._connection = {
            in: {}
        };
    };
    
    snd.invalid.ParamElement.setup = function(parentHTMLElem, paramSetting) {
        var elem = document.createElement(paramSetting.name);
        var audioParam = parentHTMLElem._invalid._obj[paramSetting.param];
        
        var invalid = new snd.invalid.ParamElement(elem, audioParam);
        elem._invalid = invalid;
        
        parentHTMLElem.appendChild(elem);
    };
    
    snd.invalid.ParamElement.prototype.connected = function(htmlElem) {
        var parentElem = this._htmlElem.parentNode;
        if (!parentElem) {
            throw new snd.Exception("#" + this._htmlElem.id + " have not parent node.");
        } else if (!parentElem._invalid) {
            throw new snd.Exception("#" + parentElem.id + " isn't snd-tag.(or lost _invalid accidentary.)");
        }
        
        parentElem._invalid._connection.in["#" + htmlElem.id] = true;
        htmlElem._invalid._connection.in["#" + this._htmlElem.id] = true;
    };
    
    snd.invalid.ParamElement.prototype.disconnected = function(htmlElem) {
        var parentElem = this._htmlElem.parentNode;
        if (!parentElem) {
            throw new snd.Exception("#" + this._htmlElem.id + " have not parent node.");
        } else if (!parentElem._invalid) {
            throw new snd.Exception("#" + parentElem.id + " isn't snd-tag.(or lost _invalid accidentary.)");
        }
        
        delete parentElem._invalid._connection.in["#" + htmlElem.id];
        delete htmlElem._invalid._connection.out["#" + this._htmlElem.id];
    };
    
    return snd;
}));
