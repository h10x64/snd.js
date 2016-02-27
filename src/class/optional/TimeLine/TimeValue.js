(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD
        define([], factory);
    } else if (typeof exports === 'object') {
        // Node
    } else {
        // Browser globals (root is window)
        root.snd = factory(root.snd);
    }
}(this, function(snd) {
    
    snd.TimeValue = function(time, value) {
        this._time = time;
        this._value = value;
        
        this._timeValueChangeEventListeners = [];
        
        Object.defineProperties(this, {
            time: {
                get: function() {
                    return this._time;
                },
                set: function(val) {
                    var prevTime = this._time;
                    this._time = val;
                    this.fireTimeValueChangeEvent(this, prevTime, this._value);
                }
            },
            value: {
                get: function() {
                    return this._value;
                },
                set: function(val) {
                    var prevValue = this._value;
                    this._value = val;
                    this.fireTimeValueChangeEvent(this, this._time, prevValue);
                }
            }
        });
    };
    
    snd.TimeValue.prototype.onTimeValueChanged = function(obj, prevTime, prevValue) {};
    
    snd.TimeValue.prototype.addTimeValueChangeEventListener = function(listener) {
        this._timeValueChangeEventListeners.push(listener);
    };
    
    snd.TimeValue.prototype.removeTimeValueChangeEventListener = function(listener) {
        var idx = this._timeChangeEventListeners.indexOf(listener);
        if (idx > 0) {
            this._timeValueChangeEventListeners.splice(idx, 1);
        }
    };
    
    snd.TimeValue.prototype.set = function(time, value) {
        var prevTime = this._time;
        var prevValue = this._value;
        
        this._time = time;
        this._value = value;
        
        this.fireTimeValueChangeEvent(this, prevTime, prevValue);
    };
    
    snd.TimeValue.prototype.fireTimeValueChangeEvent = function(obj, prevTime, prevValue) {
        this.onTimeChanged(obj, prevTime, prevValue);
        for (var func in this._timeChangeEventListeners) {
            if (typeof(func) == 'function') {
                func(obj, prevTime, prevValue);
            }
        }
    };
    
    return snd;
}));
