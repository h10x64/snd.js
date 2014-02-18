/**
 * @class BGM等の音源を表す抽象クラスです。<br/>
 * AudioBufferSourceNode, MediaElementSourceNode, MediaStreamSourceNode, Oscillatorなどの
 * WebAudioAPIで定義された各種音源を同じように扱うための
 * @param {String} id オブジェクトを識別するID
 * @extends {snd.GainOnlyUnit} 
 */
snd.Sound = function(id) {
    snd.GainOnlyUnit.apply(this, arguments);

    // properties
    this.id = id;
    this.status = snd.status.NONE;
    this.type = snd.srctype.NONE;

    this.source = null;
};
snd.Sound.prototype = Object.create(snd.GainOnlyUnit.prototype);
snd.Sound.prototype.constructor = snd.Sound;

/**
 * この音源の再生を開始します。<br/>
 * when, offset, durationは、音源の種類によっては使用されない場合があります。<br/>
 * 
 * @param {Number} when 再生を開始する時刻(秒)
 * @param {Number} offset 再生を開始する位置(秒)
 * @param {Number} duration 再生する長さ(秒)
 */
snd.Sound.prototype.start = function(when, offset, duration) {
    // PLEASE OVERRIDE ME
};

/**
 * 再生を停止します。
 * @param {double} when
 */
snd.Sound.prototype.stop = function(when) {
    // PLEASE OVERRIDE ME
};

/**
 * 再生終了時に呼び出されるメソッドです。<br>
 * 内部でstatusアトリビュートにsnd.status.ENDEDを設定しているため、このメソッドを
 * オーバーライドする際は、オーバーライドしたメソッド内でsnd.Sound.prototype.onended.call(this)を使用して
 * 親クラスのonendedを呼び出すようにしてください。
 */
snd.Sound.prototype.onended = function() {
    this.status = snd.status.ENDED;
};
