
function MousePosition(e) {
    var boundingClientRect = e.target.getBoundingClientRect();
    this.width = boundingClientRect.right - boundingClientRect.left;
    this.height = boundingClientRect.bottom - boundingClientRect.top;
    this.x = e.clientX - boundingClientRect.left;
    this.y = e.clientY - boundingClientRect.top;
    this.posX = this.x - this.width / 2;
    this.posY = this.y - this.height / 2;
}

function TestCanvas(source, listener) {
    this.canvas = document.getElementById("canvas");
    this.context = this.canvas.getContext("2d");
    this.source = source;
    snd.LISTENER = listener;
}

TestCanvas.prototype.setOnMouseMove = function() {
    var _this = this;
    this.canvas.onmousemove = function(e) {
        var mousePosition = new MousePosition(e);

        // 位置設定できる音源が生成済みでデータの読み込みも終わっていたら
        if ((_this.source != null) && (_this.source.status != snd.status.ENDED)) {
            // マウスの位置を元にして音源の位置を設定
            _this.source.setPosition(mousePosition.posX, 0, mousePosition.posY);
        }

        _this.draw();
    };
};

TestCanvas.prototype.onkeydown = function(e) {
    switch (e.keyCode) {
        case 87: // W↑
            snd.LISTENER.setPosition(snd.LISTENER.pos.x, snd.LISTENER.pos.y, snd.LISTENER.pos.z - 1);
            break;
        case 83: // S↓
            snd.LISTENER.setPosition(snd.LISTENER.pos.x, snd.LISTENER.pos.y, snd.LISTENER.pos.z + 1);
            break;
        case 65: // A←
            snd.LISTENER.setPosition(snd.LISTENER.pos.x - 1, snd.LISTENER.pos.y, snd.LISTENER.pos.z);
            break;
        case 68: // D→
            snd.LISTENER.setPosition(snd.LISTENER.pos.x + 1, snd.LISTENER.pos.y, snd.LISTENER.pos.z);
            break;
        case 74: // J rot←
            // 球座標(ラジアン)へ変換 (球座標の場合、x:方位角, y:仰角, z:長さ)
            var spherical = snd.LISTENER.dir.toSphericalCoordinate();
            // 方位角から5度引く
            spherical.x -= 5.0 * Math.PI / 180.0;
            // リスナーの向きを設定
            snd.LISTENER.setOrientationBySpherical(spherical);
            break;
        case 76: // L rot→
            var spherical = snd.LISTENER.dir.toSphericalCoordinate();
            spherical.x += 5.0 * Math.PI / 180.0;
            snd.LISTENER.setOrientationBySpherical(spherical);
            break;
    }
};

TestCanvas.prototype.draw = function() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.drawAxis("#000000");

    this.drawPosDir(this.source, "#0000FF");
    this.drawPosDir(snd.LISTENER, "#FF0000");
};

TestCanvas.prototype.drawPosDir = function(obj, fillStyle) {
    if (obj != null) {
        this.context.fillStyle = fillStyle;
        var drawX = obj.pos.x + this.canvas.width / 2;
        var drawY = obj.pos.z + this.canvas.height / 2;
        this.context.fillRect(drawX - 2, drawY - 2, 4, 4);

        this.context.strokeStyle = fillStyle;
        this.context.beginPath();
        this.context.moveTo(drawX, drawY);
        this.context.lineTo(drawX + obj.dir.x * 5, drawY + obj.dir.z * 5);
        this.context.stroke();
    }
};

TestCanvas.prototype.drawAxis = function(fillStyle) {
    this.context.strokeStyle = fillStyle;

    // draw line
    this.context.beginPath();
    this.context.moveTo(0, this.canvas.height / 2);
    this.context.lineTo(this.canvas.width, this.canvas.height / 2);
    this.context.stroke();

    this.context.beginPath();
    this.context.moveTo(this.canvas.width / 2, 0);
    this.context.lineTo(this.canvas.width / 2, this.canvas.height);
    this.context.stroke();
};

