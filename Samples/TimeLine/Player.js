define([], function() {
    var Player = function(canvas, timeLine, maxTime) {
        var _this = this;

        this._canvas = canvas;
        this._canvas.addEventListener('mousedown', function(evt){_this.receiveMousePressEvent(_this, evt)}, false);
        this._canvas.addEventListener('mouseup', function(evt){_this.receiveMouseRereaseEvent(_this, evt)}, false);
        this._canvas.addEventListener('mousemove', function(evt){_this.receiveMouseMoveEvent(_this, evt)}, false);

        this._timeLine = timeLine;
        this._timeLine.onTimeLineEventAdded = function(evt) {
            _this.addObject(evt.id, evt, "rgba(0, 0, 255, 0.25)");
        };
        this._timeLine.onTimeLineEventRemoved = function(evt) {
            _this.removeObject(evt.id);
        };
        this._timeLine.onStartAtChanged = function(t) {
            _this._startAt = t;
        };

        this._mousePressed = false;
        this._startBarPressed = false;
        this._maxTime = maxTime;
        this._startPos = 0;
        this._nowPos = 0;
        this._nowBarColor = "rgba(255, 0, 0, 0.5)";
        this._startAtBarColor = "rgba(0, 0, 0, 0.5)";

        this._objects = {};

        Object.defineProperties(this, {
            "pos" : {
                get: function() {
                    return this._pos;
                }
            },
            "nowBarColor" : {
                get: function() {
                    return this._nowBarColor;
                },
                set: function(val) {
                    this._nowBarColor = val;
                }
            },
            "startAtBarColor" : {
                get: function() {
                    return this._startAtBarColor;
                },
                set: function(val) {
                    this._startAtBarColor = val;
                }
            }
        });

        this._timerId = this.startTimer();
    };

    Player.prototype.start = function() {
        this._timeLine.start();
    };

    Player.prototype.stop = function() {
        this._timeLine.stop();
    };

    Player.prototype.setStartPos = function(pos) {
        this._timeLine.startAt = this.convTimeToPos();
        draw();
    };

    /**
     * obj := {
     *   x := int,
     *   y := int,
     *   w := int,
     *   h := int,
     *   color := String,
     *   draw := function(context2d)[Optional],
     *
     *   * [These are defined in this method] *
     *   doesMousePressed := bool[readonly],
     *   onMousePress := function,
     *   onMouseRerease := function,
     *   onMouseMove := function
     * }
     */
    Player.prototype.addObject = function(key, obj, color) {
        obj._doesMousePressed = false;
        Object.defineProperties(obj, {
            doesMousePressed: {
                get: function() {
                    return obj._doesMousePressed;
                }
            }
        });
        obj.onMousePress = function(evt){};
        obj.onMouseRerease = function(evt){};
        obj.onMouseMove = function(evt){};

        if (obj.x == null && obj.y == null && obj.w == null && obj.h == null) {
            if (obj.startTime == 0 || obj.startTime != null) {
                obj.x = this.convTimeToPos(obj.startTime);
            }
            if (obj.endTime == 0 || obj.endTime != null) {
                obj.w = this.convTimeToPos(obj.endTime) - obj.x;
            }
            if (obj.x != null && obj.w != null) {
                obj.y = 0;
                obj.h = 30;
            } else {
                return;
            }
        }

        if (!obj.color) {
            obj.color = "rgba(0, 0, 255, 0.75)";
        }

        this._objects[key] = obj;
    };

    Player.prototype.getObject = function(key) {
        return this._objects[key];
    };

    Player.prototype.removeObject = function(key) {
        delete this._objects[key];
    };

    Player.prototype.tick = function(_this) {
        _this._nowPos = _this.convTimeToPos(_this._timeLine.now);
        _this._startPos = _this.convTimeToPos(_this._timeLine.startAt);

        _this.draw();
    };

    Player.prototype.draw = function() {
        var context = this._canvas.getContext("2d");
        context.clearRect(0, 0, this._canvas.width, this._canvas.height);

        // Objects
        for (var key in this._objects) {
            var obj = this._objects[key];
            this.drawObject(obj);
        }

        // Lines
        this.drawBar(this._nowPos, this._nowBarColor);
        this.drawBar(this._startPos, this._startAtBarColor);
    };

    Player.prototype.drawObject = function(obj) {
        var context = this._canvas.getContext("2d");

        if (typeof obj.draw == "function") {
            obj.draw(context);
        } else {
            context.grobalAlpha = obj.alpha;

            context.beginPath();
            context.rect(obj.x, obj.y, obj.w, obj.h);
            context.fillStyle = obj.color;
            context.fill();
        }
    };

    Player.prototype.drawBar = function(pos, color) {
        var context = this._canvas.getContext("2d");

        context.beginPath();
        context.moveTo(pos, 0);
        context.lineTo(pos, 30);

        context.lineWidth = 2;
        context.strokeStyle = color;

        context.stroke();
    };

    Player.prototype.receiveTimeLineEventAddedEvent = function(evt) {
        this.addObject(evt.id, evt);
    };

    Player.prototype.receiveTimeLineEventRemovedEvent = function(evt) {
        this.removeObject(evt.id);
    };

    Player.prototype.receiveOnStartAtChangedEvent = function(t) {
        this._startPos = convTimeToPos(t);
    };

    Player.prototype.receiveMousePressEvent = function(_this, evt) {
        var pos = _this.getMousePos(evt);

        _this._mousePressed = true;
    };

    Player.prototype.receiveMouseRereaseEvent = function(_this, evt) {
        var pos = _this.getMousePos(evt);

        _this._mousePressed = false;
    };

    Player.prototype.receiveMouseMoveEvent = function(_this, evt) {
        var pos = _this.getMousePos(evt);

        if (_this._mousePressed) {
            var time = _this.convPosToTime(pos.x);

            _this._timeLine.startAt = time;
        }
    };

    Player.prototype.startTimer = function() {
        var _this = this;
        return window.setInterval(this.tick, 33, _this);
    };

    Player.prototype.convTimeToPos = function(time) {
        return this._canvas.width * time / this._maxTime;
    };

    Player.prototype.convPosToTime = function(pos) {
        return this._maxTime * pos / this._canvas.width;
    };

    Player.prototype.getMousePos = function(evt) {
        var x=0, y=0;
        var r = this._canvas.getBoundingClientRect();

        x = evt.clientX - r.left;
        y = evt.clientY - r.top;

        return {'x': x, 'y': y};
    };

    return Player;
});
