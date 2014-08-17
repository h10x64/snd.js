/**
 * x, y, zで指定した値を持つ新しいインスタンスを生成します。
 * @param {Number} x ベクトルのX値
 * @param {Number} y ベクトルのY値
 * @param {Number} z ベクトルのZ値
 * @class 3次元ベクトルクラスです。<br/>
 * 球座標としても使われ、その場合、x, y, zの値はそれぞれ<br/>
 * x: 方位角<br/>
 * y: 仰角<br/>
 * z: 距離<br/>
 * として扱われます。
 */
snd.vec3 = function(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;

    Object.defineProperties(this, {
        length: {
            get: function() {
                return Math.sqrt(this._x * this._x + this._y * this._y + this._z * this._z);
            }
        }
    });
};

/**
 * @deprecated getAddVectorにリネームされる予定です。
 */
snd.vec3.prototype.add = function(pos) {
    return new snd.vec3(this.x + pos.x, this.y + pos.y, this.z + pos.z);
};

/**
 * @deprecated getMultVectorにリネームされる予定です。
 */
snd.vec3.prototype.mult = function(a) {
    return new snd.vec3(a * this.x, a * this.y, a * this.z);
};

/**
 * @deprecated getSubVectorにリネームされる予定です。
 */
snd.vec3.prototype.sub = function(pos) {
    return this.add(pos.mult(-1));
};

/**
 * @deprecated lengthプロパティを使用してください。
 */
snd.vec3.prototype.length = function() {
    return this.length;
};

/**
 * @deprecated getNormalizedVectorにリネームされる予定です。
 */
snd.vec3.prototype.normalize = function() {
    return this.mult(1.0 / this.length());
};

/**
 * @deprecated このメソッドは削除される予定です。
 * @returns {snd.vec3}
 */
snd.vec3.prototype.toSphericalCoordinate = function() {
    var azimuth = Math.atan2(this.z, this.x);
    var elevation = Math.atan2(this.y, Math.sqrt(this.z * this.z + this.x * this.x));
    var length = this.length();
    return new snd.vec3(azimuth, elevation, length);
};

/**
 * @deprecated このメソッドは削除される予定です。
 * @returns {snd.vec3}
 */
snd.vec3.prototype.toOrthogonalCoordinate = function() {
    var retY = this.z * Math.sin(this.y);
    var retX = this.z * Math.cos(this.y) * Math.cos(this.x);
    var retZ = this.z * Math.cos(this.y) * Math.sin(this.x);
    return new snd.vec3(retX, retY, retZ);
};

/**
 * 位置(0, 0, 0), 向き(0, 0, -1), 上方向(0, 1, 0)となる新しいインスタンスを作ります。
 * @class 位置と向きをあらわすクラスです。<br/>
 * 位置を表すposベクトル、正面向きを表すdirベクトル、上方向を表すupベクトルの3つのベクトルで位置と向きを管理します。
 */
snd.PosDir = function() {
    this.pos = new snd.vec3(0, 0, 0);
    this.dir = new snd.vec3(0, 0, -1);
    this.up = new snd.vec3(0, 1, 0);
};

snd.PosDir.prototype.setPosition = function(x, y, z) {
    this.pos.x = x;
    this.pos.y = y;
    this.pos.z = z;
};

snd.PosDir.prototype.setDir = function(x, y, z) {
    this.dir.x = x;
    this.dir.y = y;
    this.dir.z = z;
    this.dir.normalize();
};

snd.PosDir.prototype.setUp = function(x, y, z) {
    this.up.x = x;
    this.up.y = y;
    this.up.z = z;
    this.up.normalize();
};

snd.PosDir.prototype.setOrientation = function(x, y, z, ux, uy, uz) {
    this.setDir(x, y, z);
    this.setUp(ux, uy, uz);
};

snd.PosDir.prototype.setOrientationBySpherical = function(dir, up) {
    var orthDir;
    if (up != null) {
        var orthUp = up.toOrthogonalCoordinate();
        this.setTop(orthUp.x, orthUp.y, orthUp.z);

        var rotDir = dir.sub(up);
        rotDir.normalize();

        orthDir = rotDir.toOrthogonalCoordinate();
    } else {
        orthDir = dir.toOrthogonalCoordinate();
    }

    this.setDir(orthDir.x, orthDir.y, orthDir.z);
};

snd.PosDir.interpolation = function(left, right, ratio) {
    var calc = {};
    var values = {
        px: {left: left.pos.x, right: right.pos.x},
        py: {left: left.pos.y, right: right.pos.y},
        pz: {left: left.pos.z, right: right.pos.z},
        ux: {left: left.up.x, right: right.up.x},
        uy: {left: left.up.y, right: right.up.y},
        uz: {left: left.up.z, right: right.up.z},
        dx: {left: left.dir.x, right: right.dir.x},
        dy: {left: left.dir.y, right: right.dir.y},
        dz: {left: left.dir.z, right: right.dir.z}
    };

    for (var key in values) {
        calc[key] = values[key].left + (values[key].right - values[key].left) * ratio;
    }

    var ret = new snd.PosDir();
    ret.setPos(calc.px, calc.py, calc.pz);
    ret.setUp(calc.ux, calc.uy, calc.uz);
    ret.setDir(calc.dx, calc.dy, calc.dz);

    return ret;
};
