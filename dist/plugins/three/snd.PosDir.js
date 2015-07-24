
/**
 * snd.js
 * three.js plugin
 * 
 * The MIT License (MIT)
 * copyright (c) 2014 N_H <h.10x64@gmail.com>
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 * 
 **/
 
 

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
    snd.PosDir = function() {
        this._pos = {x: 0, y: 0, z: 0};
        this._dir = {x: 0, y: 0, z: 0};
        this._up = {x: 0, y: 0, z: 0};

        Object.defineProperties(this, {
            pos: {
                get: function() {
                    var _this = this;
                    var ret = {};
                    Object.defineProperties(ret, {
                        x: {
                            get: function() {
                                return _this._pos.x;
                            },
                            set: function(val) {
                                _this._pos.x = val;
                            }
                        },
                        y: {
                            get: function() {
                                return _this._pos.y;
                            },
                            set: function(val) {
                                _this._pos.y = val;
                            }
                        },
                        z: {
                            get: function() {
                                return _this._pos.z;
                            },
                            set: function(val) {
                                _this._pos.z = val;
                            }
                        }
                    });
                    return ret;
                }
            },
            dir: {
                get: function() {
                    var _this = this;
                    var ret = {};
                    Object.defineProperties(ret, {
                        x: {
                            get: function() {
                                return _this._dir.x;
                            },
                            set: function(val) {
                                _this._dir.x = val;
                            }
                        },
                        y: {
                            get: function() {
                                return _this._dir.y;
                            },
                            set: function(val) {
                                _this._dir.y = val;
                            }
                        },
                        z: {
                            get: function() {
                                return _this._dir.z;
                            },
                            set: function(val) {
                                _this._dir.z = val;
                            }
                        }
                    });
                    return ret;
                }
            },
            up: {
                get: function() {
                    var _this = this;
                    var ret = {};
                    Object.defineProperties(ret, {
                        x: {
                            get: function() {
                                return _this._up.x;
                            },
                            set: function(val) {
                                _this._up.x = val;
                            }
                        },
                        y: {
                            get: function() {
                                return _this._up.y;
                            },
                            set: function(val) {
                                _this._up.y = val;
                            }
                        },
                        z: {
                            get: function() {
                                return _this._up.z;
                            },
                            set: function(val) {
                                _this._up.z = val;
                            }
                        }
                    });
                    return ret;
                }
            }
        });
    };

    snd.PosDir.prototype.setPosition = function(x, y, z) {
        this.pos.x = x;
        this.pos.y = y;
        this.pos.z = z;
    };

    snd.PosDir.prototype.setOrientation = function(x, y, z, ux, uy, uz) {
        this.dir.x = x;
        this.dir.y = y;
        this.dir.z = z;
        this.up.x = ux;
        this.up.y = uy;
        this.up.z = uz;
    };

    return snd;
}));
