snd.Listener = function(listener) {
    snd.SoundObject.apply(this, arguments);
    
    this._listener = listener;
    
    this._status = new snd.Listener.Status();
    glMatrix.vec3.set(this._status.up, 0, 1.0, 0);
    this._status.dopplerFactor = this._listener.dopplerFactor;
    this._status.speedOfSound = this._listener.speedOfSound;
};
snd.Listener.prototype = Object.create(snd.SoundObject.prototype);
snd.Listener.prototype.constructor = snd.Listener;

snd.Listener.prototype.setPosition = function(x, y, z) {
    this._listener.setPosition(x, y, z);
    snd.SoundObject.prototype.setPosition.apply(this, arguments);
};

snd.Listener.prototype.setOrientation = function(x, y, z, xUp, yUp, zUp) {
    this._listener.setOrientation(x, y, z, xUp, yUp, zUp);
    snd.SoundObject.prototype.setOrientation.apply(this, arguments);
};

snd.Listener.Status = function() {
    snd.SoundObject.Status.apply(this, arguments);
    this.dopplerFactor = 0;
    this.speedOfSound = 300.0;
};
snd.Listener.Status.prototype = Object.create(snd.SoundObject.Status.prototype);
snd.Listener.Status.prototype.constructor = snd.Listener.Status;
