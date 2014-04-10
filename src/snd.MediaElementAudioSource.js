/**
 * @class HTMLのメディアタグを音源として使用する音源クラスです。<br/>
 * 詳細は<a href="http://g200kg.github.io/web-audio-api-ja/#MediaElementAudioSourceNode">WebAudioAPI仕様を参照してください。
 * @param {String} id この音源のID
 * @param {HTMLMediaElement} htmlMediaElement HTMLのメディアタグ要素
 */
snd.MediaElementAudioSource = function(id, htmlMediaElement) {
    snd.Source.apply(this, arguments);
    this.source = snd.AUDIO_CONTEXT.createMediaElementSource(htmlMediaElement);
    this.source.connect(this.gain);
    this.type = snd.srctype.MEDIA_ELEMENT;
    this.element = htmlMediaElement;
    this.status = snd.status.NONE;
    
    this.addEvent("onplay", "Start", function(_this) {_this.status = snd.status.STARTED;});
    this.addEvent("pause", "Pause", function(_this) {_this.status = snd.status.PAUSED;});
    this.addEvent("onended", "Stop", function(_this) {_this.status = snd.status.STOPPED;});
    this.addEvent("onabort", "Abort");
    this.addEvent("oncanplay", "CanPlay", function(_this){_this.status = snd.status.READY;});
    this.addEvent("oncanplaythrough", "CanPlayThrough");
    this.addEvent("ondurationchange", "DurationChange");
    this.addEvent("onemptied", "Emptied");
    this.addEvent("onerror", "Error");
    this.addEvent("onloadeddata", "LoadedData");
    this.addEvent("onloadedmetadata", "LoadedMetaData");
    this.addEvent("onloadstart", "LoadStart");
    this.addEvent("onplaying", "Playing");
    this.addEvent("onprogress", "Progress");
    this.addEvent("onratechange", "RateChange");
    this.addEvent("onseeked", "Seeked");
    this.addEvent("onseeking", "Seeking");
    this.addEvent("onstalled", "Stalled");
    this.addEvent("onsuspend", "Suspend");
    this.addEvent("ontimeupdate", "TimeUpdate");
    this.addEvent("onvalumechange", "VolumeChange");
    this.addEvent("onwaiting", "Wating");
    
    this.setEventMethod(this.source);
};
snd.MediaElementAudioSource.prototype = Object.create(snd.Source.prototype);
snd.MediaElementAudioSource.prototype.constructor = snd.MediaElementAudioSource;

snd.MediaElementAudioSource.prototype.load = function() {
    this.source.load();
};

snd.MediaElementAudioSource.prototype.start = function() {
    this.source.play();
};

snd.MediaElementAudioSource.prototype.pause = function() {
    this.source.pause();
};

snd.MediaElementAudioSource.prototype.stop = function() {
    this.source.stop();
};


