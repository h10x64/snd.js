/**
 * sourceで指定された音源を使用して新しいインスタンスを生成します。<br/>
 * sourceで渡すオブジェクトは、snd.MediaElementAudioSourceクラスである必要があります。
 * @param {id} id ID
 * @param {snd.MediaELementAudioSource} source MediaElementAudioSourceクラスの音源
 * @class MediaElementAudioSourceクラスを使用するSoundNodeクラスです。<br/>
 * startやstopなどの各種メソッドを移譲しているため、音源とエフェクトの区別をつけないまま操作が可能です。<br/>
 * 豊富なイベントや一時停止などの機能があるため、BufferSoundNodeと比べて扱いやすいですが、
 * ループ終点から始点に戻る際にブレイクが入ってしまうなどの欠点もあります。<br/>
 * 用途により使い分けてください。
 */
snd.MediaElementAudioNode = function(id, source) {
    snd.SoundNode.apply(this, arguments);
    this.src = source;
    this.src.connect(this);
};
snd.MediaElementAudioNode.prototype = Object.create(snd.SoundNode.prototype);
snd.MediaElementAudioNode.prototype.constructor = snd.MediaElementAudioNode;

/**
 * この音源の読み込みを開始します。
 */
snd.MediaElementAudioNode.prototype.load = function() {
    this.src.load();
};

/**
 * この音源の再生を開始します。
 */
snd.MediaElementAudioNode.prototype.start = function() {
    this.src.play();
};

/**
 * この音源を一時停止します。
 */
snd.MediaElementAudioNode.prototype.pause = function() {
    this.src.pause();
};

/**
 * この音源を停止し、時刻を0へ戻します。
 */
snd.MediaElementAudioNode.prototype.stop = function() {
    this.src.pause();
};

/**
 * この音源をループ再生するかどうかを設定します。<br/>
 * Audioタグを使用するため、ループ終点からループ始点に戻る速度がBufferSoundSourceと比較して遅く、間にブレイクが入る可能性があります。<br/>
 * なめらかにループしたい場合はBufferSoundSourceの使用を検討してください。
 * @param {type} doesLoop ループ再生するか否か
 */
snd.MediaElementAudioNode.prototype.setLoop = function(doesLoop) {
    this.src.setLoop(doesLoop);
};

/* Add/Remove Listener Methods */

/**
 * この音源のonplayイベント発生時に呼び出すコールバックメソッドを追加します。
 * @param {function} listener 追加するコールバックメソッド
 */
snd.MediaElementAudioNode.prototype.addOnPlayEventListener = function(listener) {
    this.src.addOnPlayEventListener(listener);
};

/**
 * listenerで指定されたコールバックメソッドをonplayイベント発生時に呼び出されるリストから削除します。
 * @param {function} listener 削除するコールバックメソッド
 * @returns 削除されたらtrue, 削除されなかったらfalse
 */
snd.MediaElementAudioNode.prototype.removeOnPlayEventListener = function(listener) {
    return this.src.removeOnPlayEventListener(listener);
};

/**
 * この音源のイベント発生時に呼び出すコールバックメソッドを追加します。
 * @param {function} listener 追加するコールバックメソッド
 */
snd.MediaElementAudioNode.prototype.addOnPauseEventListener = function(listener) {
    this.src.addOnPauseEventListener(listener);
};

/**
 * listenerで指定されたコールバックメソッドをイベント発生時に呼び出されるリストから削除します。
 * @param {function} listener 削除するコールバックメソッド
 * @returns 削除されたらtrue, 削除されなかったらfalse
 */
snd.MediaElementAudioNode.prototype.removeOnPauseEventListener = function(listener) {
    return this.src.removeOnPauseEventListener(listener);
};

/**
 * この音源のonendedイベント発生時に呼び出すコールバックメソッドを追加します。
 * @param {function} listener 追加するコールバックメソッド
 */
snd.MediaElementAudioNode.prototype.addOnEndedEventListener = function(listener) {
    this.src.addOnEndedEventListener(listener);
};

/**
 * listenerで指定されたコールバックメソッドをonendedイベント発生時に呼び出されるリストから削除します。
 * @param {function} listener 削除するコールバックメソッド
 * @returns 削除されたらtrue, 削除されなかったらfalse
 */
snd.MediaElementAudioNode.prototype.removeOnEndedEventListener = function(listener) {
    return this.src.removeOnEndedEventListener(listener);
};

/**
 * この音源のonabortイベント発生時に呼び出すコールバックメソッドを追加します。
 * @param {function} listener 追加するコールバックメソッド
 */
snd.MediaElementAudioNode.prototype.addOnAbortEventListener = function(listener) {
    this.src.addOnAbortEventListener(listener);
};

/**
 * listenerで指定されたコールバックメソッドをonabortイベント発生時に呼び出されるリストから削除します。
 * @param {function} listener 削除するコールバックメソッド
 * @returns 削除されたらtrue, 削除されなかったらfalse
 */
snd.MediaElementAudioNode.prototype.removeOnAbortEventListener = function(listener) {
    return this.src.removeOnAbortEventListener(listener);
};

/**
 * この音源のoncanplayイベント発生時に呼び出すコールバックメソッドを追加します。
 * @param {function} listener 追加するコールバックメソッド
 */
snd.MediaElementAudioNode.prototype.addOnCanPlayEventListener = function(listener) {
    this.src.addOnCanPlayEventListener(listener);
};

/**
 * listenerで指定されたコールバックメソッドをoncanplayイベント発生時に呼び出されるリストから削除します。
 * @param {function} listener 削除するコールバックメソッド
 * @returns 削除されたらtrue, 削除されなかったらfalse
 */
snd.MediaElementAudioNode.prototype.removeOnCanPlayEventListener = function(listener) {
    return this.src.removeOnCanPlayEventListener(listener);
};

/**
 * この音源のoncanplaythroughイベント発生時に呼び出すコールバックメソッドを追加します。
 * @param {function} listener 追加するコールバックメソッド
 */
snd.MediaElementAudioNode.prototype.addOnCanPlayThroughEventListener = function(listener) {
    this.src.addOnCanPlayThroughEventListener(listener);
};

/**
 * listenerで指定されたコールバックメソッドをoncanplaythroughイベント発生時に呼び出されるリストから削除します。
 * @param {function} listener 削除するコールバックメソッド
 * @returns 削除されたらtrue, 削除されなかったらfalse
 */
snd.MediaElementAudioNode.prototype.removeOnCanPlayThroughEventListener = function(listener) {
    return this.src.removeOnCanPlayThroughEventListener(listener);
};

/**
 * この音源のondurationchangeイベント発生時に呼び出すコールバックメソッドを追加します。
 * @param {function} listener 追加するコールバックメソッド
 */
snd.MediaElementAudioNode.prototype.addOnDurationChangeEventListener = function(listener) {
    this.src.addOnDurationChangeEventListener(listener);
};

/**
 * listenerで指定されたコールバックメソッドをoncanplaythroughイベント発生時に呼び出されるリストから削除します。
 * @param {function} listener 削除するコールバックメソッド
 * @returns 削除されたらtrue, 削除されなかったらfalse
 */
snd.MediaElementAudioNode.prototype.removeOnCanPlayThroughEventListener = function(listener) {
    return this.src.removeOnCanPlayEventListener(listener);
};

/**
 * この音源のonemptiedイベント発生時に呼び出すコールバックメソッドを追加します。
 * @param {function} listener 追加するコールバックメソッド
 */
snd.MediaElementAudioNode.prototype.addOnEmptiedEventListener = function(listener) {
    this.src.addOnEmptiedEventListener(listener);
};

/**
 * listenerで指定されたコールバックメソッドをonemptiedイベント発生時に呼び出されるリストから削除します。
 * @param {function} listener 削除するコールバックメソッド
 * @returns 削除されたらtrue, 削除されなかったらfalse
 */
snd.MediaElementAudioNode.prototype.removeOnEmptiedEventListener = function(listener) {
    return this.src.removeOnEmptiedEventListener(listener);
};

/**
 * この音源のonerrorイベント発生時に呼び出すコールバックメソッドを追加します。
 * @param {function} listener 追加するコールバックメソッド
 */
snd.MediaElementAudioNode.prototype.addOnErrorEventListener = function(listener) {
    this.src.addOnErrorEventListener(listener);
};

/**
 * listenerで指定されたコールバックメソッドをonerrorイベント発生時に呼び出されるリストから削除します。
 * @param {function} listener 削除するコールバックメソッド
 * @returns 削除されたらtrue, 削除されなかったらfalse
 */
snd.MediaElementAudioNode.prototype.removeOnErrorEventListener = function(listener) {
    return this.src.removeOnErrorEventListener(listener);
};

/**
 * この音源のonloadeddataイベント発生時に呼び出すコールバックメソッドを追加します。
 * @param {function} listener 追加するコールバックメソッド
 */
snd.MediaElementAudioNode.prototype.addOnLoadedDataEventListener = function(listener) {
    this.src.addOnLoadedDataEventListener(listener);
};

/**
 * listenerで指定されたコールバックメソッドをonloadeddataイベント発生時に呼び出されるリストから削除します。
 * @param {function} listener 削除するコールバックメソッド
 * @returns 削除されたらtrue, 削除されなかったらfalse
 */
snd.MediaElementAudioNode.prototype.removeOnLoadedDataEventListener = function(listener) {
    return this.src.removeOnLoadedDataEventListener(listener);
};

/**
 * この音源のonloadedmetadataイベント発生時に呼び出すコールバックメソッドを追加します。
 * @param {function} listener 追加するコールバックメソッド
 */
snd.MediaElementAudioNode.prototype.addOnLoadedMetadataEventListener = function(listener) {
    this.src.addOnLoadedMetadataEventListener(listener);
};

/**
 * listenerで指定されたコールバックメソッドをonloadedmetadataイベント発生時に呼び出されるリストから削除します。
 * @param {function} listener 削除するコールバックメソッド
 * @returns 削除されたらtrue, 削除されなかったらfalse
 */
snd.MediaElementAudioNode.prototype.removeOnLoadedMetaDataEventListener = function(listener) {
    return this.src.removeOnLoadedMetaDataEventListener(listener);
};

/**
 * この音源のonloadstartイベント発生時に呼び出すコールバックメソッドを追加します。
 * @param {function} listener 追加するコールバックメソッド
 */
snd.MediaElementAudioNode.prototype.addOnLoadStartEventListener = function(listener) {
    this.src.addOnLoadStartEventListener(listener);
};

/**
 * listenerで指定されたコールバックメソッドをonloadstartイベント発生時に呼び出されるリストから削除します。
 * @param {function} listener 削除するコールバックメソッド
 * @returns 削除されたらtrue, 削除されなかったらfalse
 */
snd.MediaElementAudioNode.prototype.removeOnLoadStartEventListener = function(listener) {
    return this.src.removeOnLoadStartEventListener(listener);
};

/**
 * この音源のonplayingイベント発生時に呼び出すコールバックメソッドを追加します。
 * @param {function} listener 追加するコールバックメソッド
 */
snd.MediaElementAudioNode.prototype.addOnPlayingEventListener = function(listener) {
    this.src.addOnPlayingEventListener(listener);
};

/**
 * listenerで指定されたコールバックメソッドをonplayingイベント発生時に呼び出されるリストから削除します。
 * @param {function} listener 削除するコールバックメソッド
 * @returns 削除されたらtrue, 削除されなかったらfalse
 */
snd.MediaElementAudioNode.prototype.removeOnPlayingEventListener = function(listener) {
    return this.src.removeOnPlayingEventListener(listener);
};

/**
 * この音源のonprogressイベント発生時に呼び出すコールバックメソッドを追加します。
 * @param {function} listener 追加するコールバックメソッド
 */
snd.MediaElementAudioNode.prototype.addOnProgressEventListener = function(listener) {
    this.src.addOnProgressEventListener(listener);
};

/**
 * listenerで指定されたコールバックメソッドをonprogressイベント発生時に呼び出されるリストから削除します。
 * @param {function} listener 削除するコールバックメソッド
 * @returns 削除されたらtrue, 削除されなかったらfalse
 */
snd.MediaElementAudioNode.prototype.removeOnProgressEventListener = function(listener) {
    return this.src.removeOnProgressEventListener(listener);
};

/**
 * この音源のonratecahngeイベント発生時に呼び出すコールバックメソッドを追加します。
 * @param {function} listener 追加するコールバックメソッド
 */
snd.MediaElementAudioNode.prototype.addOnRateChangeEventListener = function(listener) {
    this.src.addOnRateChangeEventListener(listener);
};

/**
 * listenerで指定されたコールバックメソッドをonratechangeイベント発生時に呼び出されるリストから削除します。
 * @param {function} listener 削除するコールバックメソッド
 * @returns 削除されたらtrue, 削除されなかったらfalse
 */
snd.MediaElementAudioNode.prototype.removeOnRateChangeEventListener = function(listener) {
    return this.src.removeOnRateChangeEventListener(listener);
};

/**
 * この音源のonseekedイベント発生時に呼び出すコールバックメソッドを追加します。
 * @param {function} listener 追加するコールバックメソッド
 */
snd.MediaElementAudioNode.prototype.addOnSeekedEventListener = function(listener) {
    this.src.addOnSeekedEventListener(listener);
};

/**
 * listenerで指定されたコールバックメソッドをonseekedイベント発生時に呼び出されるリストから削除します。
 * @param {function} listener 削除するコールバックメソッド
 * @returns 削除されたらtrue, 削除されなかったらfalse
 */
snd.MediaElementAudioNode.prototype.removeOnSeekedEventListener = function(listener) {
    return this.src.removeOnSeekedEventListener(listener);
};

/**
 * この音源のonseekingイベント発生時に呼び出すコールバックメソッドを追加します。
 * @param {function} listener 追加するコールバックメソッド
 */
snd.MediaElementAudioNode.prototype.addOnSeekingEventListener = function(listener) {
    this.src.addOnSeekingEventListener(listener);
};

/**
 * listenerで指定されたコールバックメソッドをonseekingイベント発生時に呼び出されるリストから削除します。
 * @param {function} listener 削除するコールバックメソッド
 * @returns 削除されたらtrue, 削除されなかったらfalse
 */
snd.MediaElementAudioNode.prototype.removeOnSeekingEventListener = function(listener) {
    return this.src.removeOnSeekingEventListener(listener);
};

/**
 * この音源のonstalledイベント発生時に呼び出すコールバックメソッドを追加します。
 * @param {function} listener 追加するコールバックメソッド
 */
snd.MediaElementAudioNode.prototype.addOnStalledEventListener = function(listener) {
    this.src.addOnStalledEventListener(listener);
};

/**
 * listenerで指定されたコールバックメソッドをonstalledイベント発生時に呼び出されるリストから削除します。
 * @param {function} listener 削除するコールバックメソッド
 * @returns 削除されたらtrue, 削除されなかったらfalse
 */
snd.MediaElementAudioNode.prototype.removeOnStalledEventListener = function(listener) {
    return this.src.removeOnStalledEventListener(listener);
};

/**
 * この音源のonsuspendイベント発生時に呼び出すコールバックメソッドを追加します。
 * @param {function} listener 追加するコールバックメソッド
 */
snd.MediaElementAudioNode.prototype.addOnSuspendEventListener = function(listener) {
    this.src.addOnSuspendEventListener(listener);
};

/**
 * listenerで指定されたコールバックメソッドをonsupendイベント発生時に呼び出されるリストから削除します。
 * @param {function} listener 削除するコールバックメソッド
 * @returns 削除されたらtrue, 削除されなかったらfalse
 */
snd.MediaElementAudioNode.prototype.removeOnSuspendEventListener = function(listener) {
    return this.src.removeOnSuspendEventListener(listener);
};

/**
 * この音源のnotimeupdateイベント発生時に呼び出すコールバックメソッドを追加します。
 * @param {function} listener 追加するコールバックメソッド
 */
snd.MediaElementAudioNode.prototype.addOnTimeUpdateEventListener = function(listener) {
    this.src.addOnTimeUpdateEventListener(listener);
};

/**
 * listenerで指定されたコールバックメソッドをontimeupdateイベント発生時に呼び出されるリストから削除します。
 * @param {function} listener 削除するコールバックメソッド
 * @returns 削除されたらtrue, 削除されなかったらfalse
 */
snd.MediaElementAudioNode.prototype.removeOnTimeUpdateEventListener = function(listener) {
    return this.src.removeOnTimeUpdateEventListener(listener);
};

/**
 * この音源のonvolumechangeイベント発生時に呼び出すコールバックメソッドを追加します。
 * @param {function} listener 追加するコールバックメソッド
 */
snd.MediaElementAudioNode.prototype.addOnVolumeChangeEventListener = function(listener) {
    this.src.addOnVolumeChangeEventListener(listener);
};

/**
 * listenerで指定されたコールバックメソッドをonvolumechangeイベント発生時に呼び出されるリストから削除します。
 * @param {function} listener 削除するコールバックメソッド
 * @returns 削除されたらtrue, 削除されなかったらfalse
 */
snd.MediaElementAudioNode.prototype.removeOnVolumeChangeEventListener = function(listener) {
    return this.src.removeOnVolumeChangeEventListener(listener);
};

/**
 * この音源のonwaitingeイベント発生時に呼び出すコールバックメソッドを追加します。
 * @param {function} listener 追加するコールバックメソッド
 */
snd.MediaElementAudioNode.prototype.addOnWaitingEventListener = function(listener) {
    this.src.addOnWaitingEventListener(listener);
};

/**
 * listenerで指定されたコールバックメソッドをonwaitingイベント発生時に呼び出されるリストから削除します。
 * @param {function} listener 削除するコールバックメソッド
 * @returns 削除されたらtrue, 削除されなかったらfalse
 */
snd.MediaElementAudioNode.prototype.removeOnWaitingEventListener = function(listener) {
    return this.src.removeOnWaitingEventListener(listener);
};


