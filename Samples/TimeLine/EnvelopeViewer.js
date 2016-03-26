define([], function() {
    var EnvelopeEditor = function(canvas, envelope, maxVal, minVal, maxTime, backgroundColor, color, pointColor) {
        var _this = this;

        this._canvas = canvas;
        this._envelope = envelope;
        this._maxVal = maxVal;
        this._minVal = minVal;
        this._maxTime = maxTime;
        this._backgroundColor = (backgroundColor) ? backgroundColor : "#FFF";
        this._color = (color) ? color : "#000";
        this._pointColor = (pointColor) ? pointColor : this._color;

        this._timeValues = [];

        Object.defineProperties(this, {
            max: {
                get: function() {
                    return this._max;
                },
                set: function(val) {
                    this._max = val;
                }
            },
            min: {
                get: function() {
                    return this._min;
                },
                set: function(val) {
                    this._min = val;
                }
            },
            backgroundColor: {
                get: function() {
                    return this._backgroundColor;
                },
                set: function(val) {
                    this._backgroundColor = val;
                }
            },
            color: {
                get: function() {
                    return this.color;
                },
                set: function(val) {
                    this._color = val;
                }
            },
            pointColor: {
                get: function() {
                    return this._pointColor;
                },
                set: function(val) {
                    this._pointColor = val;
                }
            }
        });

        this._envelope.addTimeValueAddEventListener(function(e,tv){_this.receiveTimeValueAddEvent(e,tv);});
        this._envelope.addTimeValueRemoveEventListener(function(e,tv){_this.receiveTimeValueRemoveEvent(e,tv);});
        this._envelope.addTimeValueChangeEventListener(function(e,tv){_this.receiveTimeValueChangeEvent(e,tv);});
    };

    EnvelopeEditor.prototype.draw = function() {
        var context = this._canvas.getContext("2d");

        context.clearRect(0, 0, this._canvas.width, this._canvas.height);

        this.drawLines(context);
    };

    EnvelopeEditor.prototype.drawLines = function(context) {
        if (this._envelope.length <= 0) {
            return;
        }

        var p0, p1;
        context.beginPath();

        p0 = this.timeValueToPos(this._envelope.get(0));

        if (this._envelope.get(0).time > 0) {
            context.moveTo(0, p0.y);
            context.lineTo(p0.x, p0.y);
        } else {
            context.moveTo(p0.x, p0.y);
            context.lineTo(0, p0.y);
        }

        for (var i = 0; i < this._envelope.length - 1; i++) {
          p1 = this.timeValueToPos(this._envelope.get(i + 1));
          context.moveTo(p0.x, p0.y);
          context.lineTo(p1.x, p1.y);
          context.stroke();
          p0 = p1;
        }

        if (this._envelope.get(this._envelope.length - 1).time < this._maxTime) {
            context.lineTo(this._canvas.width, p0.y);
        }

        context.stroke();
    };

    EnvelopeEditor.prototype.receiveTimeValueAddEvent = function(envelope, timeValue) {
        if (envelope == this._envelope) {
            this._timeValues.push(timeValue);

            this.draw();
        }
    };

    EnvelopeEditor.prototype.receiveTimeValueRemoveEvent = function(envelope, timeValue) {
        if (envelope == this._envelope) {
            var idx = this.indexOf(timeValue);
            if (idx >= 0) {
                this._timeValues.splice(idx, 1);

                this.draw();
            }
        }
    };

    EnvelopeEditor.prototype.receiveTimeValueChangeEvent = function(envelope, timeValue, prevTime, prevValue) {
        if (envelope == this._envelope) {
            var idx = this.indexOf(timeValue);
            if (idx >= 0) {
                this.draw();
            }
        }
    };

     EnvelopeEditor.prototype.indexOf = function(timeValue) {
        var idx = this._timeValues.indexOf(timeValue);
        return idx;
    };

    EnvelopeEditor.prototype.timeValueToPos = function(timeValue) {
        return {x: timeValue.time / this._maxTime * this._canvas.width, y: this._canvas.height - (timeValue.value - this._minVal) / (this._maxVal - this._minVal) * this._canvas.height};
    };

    return EnvelopeEditor;
});
