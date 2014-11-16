snd.PosDir = function () {
    this._pos = {x: 0, y: 0, z: 0};
    this._dir = {x: 0, y: 0, z: 0};
    this._up = {x: 0, y: 0, z: 0};

    Object.defineProperties(this, {
        pos: {
            get: function () {
                var _this = this;
                var ret = {};
                Object.defineProperties(ret, {
                    x: {
                        get: function () {
                            return _this._pos.x;
                        },
                        set: function (val) {
                            _this._pos.x = val;
                        }
                    },
                    y: {
                        get: function () {
                            return _this._pos.y;
                        },
                        set: function (val) {
                            _this._pos.y = val;
                        }
                    },
                    z: {
                        get: function () {
                            return _this._pos.z;
                        },
                        set: function (val) {
                            _this._pos.z = val;
                        }
                    }
                });
                return ret;
            }
        },
        dir: {
            get: function () {
                var _this = this;
                var ret = {};
                Object.defineProperties(ret, {
                    x: {
                        get: function () {
                            return _this._dir.x;
                        },
                        set: function (val) {
                            _this._dir.x = val;
                        }
                    },
                    y: {
                        get: function () {
                            return _this._dir.y;
                        },
                        set: function (val) {
                            _this._dir.y = val;
                        }
                    },
                    z: {
                        get: function () {
                            return _this._dir.z;
                        },
                        set: function (val) {
                            _this._dir.z = val;
                        }
                    }
                });
                return ret;
            }
        },
        up: {
            get: function () {
                var _this = this;
                var ret = {};
                Object.defineProperties(ret, {
                    x: {
                        get: function () {
                            return _this._up.x;
                        },
                        set: function (val) {
                            _this._up.x = val;
                        }
                    },
                    y: {
                        get: function () {
                            return _this._up.y;
                        },
                        set: function (val) {
                            _this._up.y = val;
                        }
                    },
                    z: {
                        get: function () {
                            return _this._up.z;
                        },
                        set: function (val) {
                            _this._up.z = val;
                        }
                    }
                });
                return ret;
            }
        }
    });
};

snd.PosDir.prototype.setPosition = function (x, y, z) {
    this.pos.x = x;
    this.pos.y = y;
    this.pos.z = z;
};

snd.PosDir.prototype.setOrientation = function (x, y, z, ux, uy, uz) {
    this.dir.x = x;
    this.dir.y = y;
    this.dir.z = z;
    this.up.x = ux;
    this.up.y = uy;
    this.up.z = uz;
};
