
snd.SoundObject = function() {
    this._status = new snd.SoundObject.Status();
    
    Object.defineProperties(this, {
        position: {
            get: function() {
                var _this = this;
                var ret = {};
                Object.defineProperties(ret, {
                    x: {
                        get: function() {
                            return _this._status.position[0];
                        },
                        set: function(val) {
                            _this.setPosition(val, _this._status.position[1], _this._status.position[2]);
                        }
                    },
                    y: {
                        get: function() {
                            return _this._status.position[1];
                        },
                        set: function(val) {
                            _this.setPosition(_this._status.position[0], val, _this._status.position[2]);
                        }
                    },
                    z: {
                        get: function() {
                            return _this._status.position[2];
                        },
                        set: function(val) {
                            _this.setPosition(_this._status.position[0], _this._status.position[1], val);
                        }
                    }
                });
                return ret;
            }
        },
        orientation: {
            get: function() {
                var _this = this;
                var ret = {};
                Object.defineProperties(ret, {
                    x: {
                        get: function() {
                            return _this._status.orientation[0];
                        },
                        set: function(val) {
                            _this.setOrientation(val, _this._status.orientation[1], _this._status.orientation[2], _this._status.up[0], _this._status.up[1], _this._status.up[2]);
                        }
                    },
                    y: {
                        get: function() {
                            return _this._status.orientation[1];
                        },
                        set: function(val) {
                            _this.setOrientation(_this._status.orientation[0], val, _this._status.orientation[2], _this._status.up[0], _this._status.up[1], _this._status.up[2]);
                        }
                    },
                    z: {
                        get: function() {
                            return _this._status.orientation[2];
                        },
                        set: function(val) {
                            _this.setOrientation(_this._status.orientation[0], _this._status.orientation[1], val, _this._status.up[0], _this._status.up[1], _this._status.up[2]);
                        }
                    },
                    upX: {
                        get: function() {
                            return _this._status.up[0];
                        },
                        set: function(val) {
                            _this.setOrientation(_this._status.orientation[0], _this._status.orientation[1], _this._status.orientation[2], val, _this._status.up[1], _this._status.up[2]);
                        }
                    },
                    upY: {
                        get: function() {
                            return _this._status.up[1];
                        },
                        set: function(val) {
                            _this.setOrientation(_this._status.orientation[0], _this._status.orientation[1], _this._status.orientation[2], _this._status.up[0], val, _this._status.up[2]);
                        }
                    },
                    upZ: {
                        get: function() {
                            return _this._status.up[2];
                        },
                        set: function(val) {
                            _this.setOrientation(_this._status.orientation[0], _this._status.orientation[1], _this._status.orientation[2], _this._status.up[0], _this._status.up[1], val);
                        }
                    }
                });
                return ret;
            }
        }
    });
};

snd.SoundObject.getRelative = function(out, base, target) {
    var transform = glMatrix.mat4.create();
    glMatrix.mat4.lookAt(transform, base._status.position, base._status.orientation, base._status.up);
    
    glMatrix.vec3.add(out._status.orientation, target._status.orientation, target._status.position);
    glMatrix.vec3.add(out._status.up, target._status.up, target._status.position);
    
    glMatrix.vec3.transformMat4(out._status.orientation, out._status.orientation, transform);
    glMatrix.vec3.transformMat4(out._status.up, out._status.up, transform);
    glMatrix.vec3.transformMat4(out._status.position, target._status.position, transform);
    
    glMatrix.vec3.subtract(out._status.orientation, out._status.orientation, out._status.position);
    glMatrix.vec3.subtract(out._status.up, out._status.up, out._status.position);
};

snd.SoundObject.prototype.setPosition = function(x, y, z) {
    glMatrix.vec3.set(this._status.position, x, y, z);
    if (this.onpositionchange != null) {
        this.onpositionchange();
    }
};

snd.SoundObject.prototype.setOrientation = function(x, y, z, upX, upY, upZ) {
    glMatrix.vec3.set(this._status.orientation, x, y, z);
    glMatrix.vec3.set(this._status.up, upX, upY, upZ);
    if (this.onorientationchange != null) {
        this.onorientationchange();
    }
};

snd.SoundObject.prototype.onpositionchange = function() {
    // PLEASE OVERRIDE ME
};

snd.SoundObject.prototype.onorientationchange = function() {
    // PLEASE OVERRIDE ME
};

snd.SoundObject.Status = function() {
    this.position = glMatrix.vec3.create();
    
    this.orientation = glMatrix.vec3.create();
    this.orientation[0] = 0;
    this.orientation[1] = 0;
    this.orientation[2] = 1;
    
    this.up = glMatrix.vec3.create();
    this.up[0] = 0;
    this.up[1] = 1;
    this.up[2] = 0;
};
