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
};
snd.MediaElementAudioSource.prototype = Object.create(snd.Source.prototype);
snd.MediaElementAudioSource.prototype.constructor = snd.MediaElementAudioSource;


