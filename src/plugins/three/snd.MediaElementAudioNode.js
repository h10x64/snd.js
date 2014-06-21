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
    this.source = source;
    this.source.connect(this);
    
    Object.defineProperties(this, {
        src: {
            enumerable: true,
            get: function() {
                return this.source.src;
            },
            set: function(uri) {
                this.source.src = uri;
            }
        }
    });
};
snd.MediaElementAudioNode.prototype = Object.create(snd.SoundNode.prototype);
snd.MediaElementAudioNode.prototype.constructor = snd.MediaElementAudioNode;

/**
 * この音源の読み込みを開始します。
 */
snd.MediaElementAudioNode.prototype.load = function() {
    this.source.load();
};

/**
 * この音源の再生を開始します。
 */
snd.MediaElementAudioNode.prototype.start = function() {
    this.source.start();
};

/**
 * この音源を一時停止します。
 */
snd.MediaElementAudioNode.prototype.pause = function() {
    this.source.pause();
};

/**
 * この音源を停止し、時刻を0へ戻します。
 */
snd.MediaElementAudioNode.prototype.stop = function() {
    this.source.pause();
};

/**
 * この音源をループ再生するかどうかを設定します。<br/>
 * Audioタグを使用するため、ループ終点からループ始点に戻る速度がBufferSoundSourceと比較して遅く、間にブレイクが入る可能性があります。<br/>
 * なめらかにループしたい場合はBufferSoundSourceの使用を検討してください。
 * @param {type} doesLoop ループ再生するか否か
 */
snd.MediaElementAudioNode.prototype.setLoop = function(doesLoop) {
    this.source.setLoop(doesLoop);
};

/* Add/Remove Listener Methods */

/**
 * この音源のonplayイベント発生時に呼び出すコールバックメソッドを追加します。
 * @param {function} listener 追加するコールバックメソッド
 */
snd.MediaElementAudioNode.prototype.addOnPlayEventListener = function(listener) {
    this.source.addOnPlayEventListener(listener);
};

/**
 * listenerで指定されたコールバックメソッドをonplayイベント発生時に呼び出されるリストから削除します。
 * @param {function} listener 削除するコールバックメソッド
 * @returns 削除されたらtrue, 削除されなかったらfalse
 */
snd.MediaElementAudioNode.prototype.removeOnPlayEventListener = function(listener) {
    return this.source.removeOnPlayEventListener(listener);
};

/**
 * この音源のイベント発生時に呼び出すコールバックメソッドを追加します。
 * @param {function} listener 追加するコールバックメソッド
 */
snd.MediaElementAudioNode.prototype.addOnPauseEventListener = function(listener) {
    this.source.addOnPauseEventListener(listener);
};

/**
 * listenerで指定されたコールバックメソッドをイベント発生時に呼び出されるリストから削除します。
 * @param {function} listener 削除するコールバックメソッド
 * @returns 削除されたらtrue, 削除されなかったらfalse
 */
snd.MediaElementAudioNode.prototype.removeOnPauseEventListener = function(listener) {
    return this.source.removeOnPauseEventListener(listener);
};

/**
 * この音源のonendedイベント発生時に呼び出すコールバックメソッドを追加します。
 * @param {function} listener 追加するコールバックメソッド
 */
snd.MediaElementAudioNode.prototype.addOnEndedEventListener = function(listener) {
    this.source.addOnEndedEventListener(listener);
};

/**
 * listenerで指定されたコールバックメソッドをonendedイベント発生時に呼び出されるリストから削除します。
 * @param {function} listener 削除するコールバックメソッド
 * @returns 削除されたらtrue, 削除されなかったらfalse
 */
snd.MediaElementAudioNode.prototype.removeOnEndedEventListener = function(listener) {
    return this.source.removeOnEndedEventListener(listener);
};

/**
 * この音源のonabortイベント発生時に呼び出すコールバックメソッドを追加します。
 * @param {function} listener 追加するコールバックメソッド
 */
snd.MediaElementAudioNode.prototype.addOnAbortEventListener = function(listener) {
    this.source.addOnAbortEventListener(listener);
};

/**
 * listenerで指定されたコールバックメソッドをonabortイベント発生時に呼び出されるリストから削除します。
 * @param {function} listener 削除するコールバックメソッド
 * @returns 削除されたらtrue, 削除されなかったらfalse
 */
snd.MediaElementAudioNode.prototype.removeOnAbortEventListener = function(listener) {
    return this.source.removeOnAbortEventListener(listener);
};

/**
 * この音源のoncanplayイベント発生時に呼び出すコールバックメソッドを追加します。
 * @param {function} listener 追加するコールバックメソッド
 */
snd.MediaElementAudioNode.prototype.addOnCanPlayEventListener = function(listener) {
    this.source.addOnCanPlayEventListener(listener);
};

/**
 * listenerで指定されたコールバックメソッドをoncanplayイベント発生時に呼び出されるリストから削除します。
 * @param {function} listener 削除するコールバックメソッド
 * @returns 削除されたらtrue, 削除されなかったらfalse
 */
snd.MediaElementAudioNode.prototype.removeOnCanPlayEventListener = function(listener) {
    return this.source.removeOnCanPlayEventListener(listener);
};

/**
 * この音源のoncanplaythroughイベント発生時に呼び出すコールバックメソッドを追加します。
 * @param {function} listener 追加するコールバックメソッド
 */
snd.MediaElementAudioNode.prototype.addOnCanPlayThroughEventListener = function(listener) {
    this.source.addOnCanPlayThroughEventListener(listener);
};

/**
 * listenerで指定されたコールバックメソッドをoncanplaythroughイベント発生時に呼び出されるリストから削除します。
 * @param {function} listener 削除するコールバックメソッド
 * @returns 削除されたらtrue, 削除されなかったらfalse
 */
snd.MediaElementAudioNode.prototype.removeOnCanPlayThroughEventListener = function(listener) {
    return this.source.removeOnCanPlayThroughEventListener(listener);
};

/**
 * この音源のondurationchangeイベント発生時に呼び出すコールバックメソッドを追加します。
 * @param {function} listener 追加するコールバックメソッド
 */
snd.MediaElementAudioNode.prototype.addOnDurationChangeEventListener = function(listener) {
    this.source.addOnDurationChangeEventListener(listener);
};

/**
 * listenerで指定されたコールバックメソッドをoncanplaythroughイベント発生時に呼び出されるリストから削除します。
 * @param {function} listener 削除するコールバックメソッド
 * @returns 削除されたらtrue, 削除されなかったらfalse
 */
snd.MediaElementAudioNode.prototype.removeOnCanPlayThroughEventListener = function(listener) {
    return this.source.removeOnCanPlayEventListener(listener);
};

/**
 * この音源のonemptiedイベント発生時に呼び出すコールバックメソッドを追加します。
 * @param {function} listener 追加するコールバックメソッド
 */
snd.MediaElementAudioNode.prototype.addOnEmptiedEventListener = function(listener) {
    this.source.addOnEmptiedEventListener(listener);
};

/**
 * listenerで指定されたコールバックメソッドをonemptiedイベント発生時に呼び出されるリストから削除します。
 * @param {function} listener 削除するコールバックメソッド
 * @returns 削除されたらtrue, 削除されなかったらfalse
 */
snd.MediaElementAudioNode.prototype.removeOnEmptiedEventListener = function(listener) {
    return this.source.removeOnEmptiedEventListener(listener);
};

/**
 * この音源のonerrorイベント発生時に呼び出すコールバックメソッドを追加します。
 * @param {function} listener 追加するコールバックメソッド
 */
snd.MediaElementAudioNode.prototype.addOnErrorEventListener = function(listener) {
    this.source.addOnErrorEventListener(listener);
};

/**
 * listenerで指定されたコールバックメソッドをonerrorイベント発生時に呼び出されるリストから削除します。
 * @param {function} listener 削除するコールバックメソッド
 * @returns 削除されたらtrue, 削除されなかったらfalse
 */
snd.MediaElementAudioNode.prototype.removeOnErrorEventListener = function(listener) {
    return this.source.removeOnErrorEventListener(listener);
};

/**
 * この音源のonloadeddataイベント発生時に呼び出すコールバックメソッドを追加します。
 * @param {function} listener 追加するコールバックメソッド
 */
snd.MediaElementAudioNode.prototype.addOnLoadedDataEventListener = function(listener) {
    this.source.addOnLoadedDataEventListener(listener);
};

/**
 * listenerで指定されたコールバックメソッドをonloadeddataイベント発生時に呼び出されるリストから削除します。
 * @param {function} listener 削除するコールバックメソッド
 * @returns 削除されたらtrue, 削除されなかったらfalse
 */
snd.MediaElementAudioNode.prototype.removeOnLoadedDataEventListener = function(listener) {
    return this.source.removeOnLoadedDataEventListener(listener);
};

/**
 * この音源のonloadedmetadataイベント発生時に呼び出すコールバックメソッドを追加します。
 * @param {function} listener 追加するコールバックメソッド
 */
snd.MediaElementAudioNode.prototype.addOnLoadedMetadataEventListener = function(listener) {
    this.source.addOnLoadedMetadataEventListener(listener);
};

/**
 * listenerで指定されたコールバックメソッドをonloadedmetadataイベント発生時に呼び出されるリストから削除します。
 * @param {function} listener 削除するコールバックメソッド
 * @returns 削除されたらtrue, 削除されなかったらfalse
 */
snd.MediaElementAudioNode.prototype.removeOnLoadedMetaDataEventListener = function(listener) {
    return this.source.removeOnLoadedMetaDataEventListener(listener);
};

/**
 * この音源のonloadstartイベント発生時に呼び出すコールバックメソッドを追加します。
 * @param {function} listener 追加するコールバックメソッド
 */
snd.MediaElementAudioNode.prototype.addOnLoadStartEventListener = function(listener) {
    this.source.addOnLoadStartEventListener(listener);
};

/**
 * listenerで指定されたコールバックメソッドをonloadstartイベント発生時に呼び出されるリストから削除します。
 * @param {function} listener 削除するコールバックメソッド
 * @returns 削除されたらtrue, 削除されなかったらfalse
 */
snd.MediaElementAudioNode.prototype.removeOnLoadStartEventListener = function(listener) {
    return this.source.removeOnLoadStartEventListener(listener);
};

/**
 * この音源のonplayingイベント発生時に呼び出すコールバックメソッドを追加します。
 * @param {function} listener 追加するコールバックメソッド
 */
snd.MediaElementAudioNode.prototype.addOnPlayingEventListener = function(listener) {
    this.source.addOnPlayingEventListener(listener);
};

/**
 * listenerで指定されたコールバックメソッドをonplayingイベント発生時に呼び出されるリストから削除します。
 * @param {function} listener 削除するコールバックメソッド
 * @returns 削除されたらtrue, 削除されなかったらfalse
 */
snd.MediaElementAudioNode.prototype.removeOnPlayingEventListener = function(listener) {
    return this.source.removeOnPlayingEventListener(listener);
};

/**
 * この音源のonprogressイベント発生時に呼び出すコールバックメソッドを追加します。
 * @param {function} listener 追加するコールバックメソッド
 */
snd.MediaElementAudioNode.prototype.addOnProgressEventListener = function(listener) {
    this.source.addOnProgressEventListener(listener);
};

/**
 * listenerで指定されたコールバックメソッドをonprogressイベント発生時に呼び出されるリストから削除します。
 * @param {function} listener 削除するコールバックメソッド
 * @returns 削除されたらtrue, 削除されなかったらfalse
 */
snd.MediaElementAudioNode.prototype.removeOnProgressEventListener = function(listener) {
    return this.source.removeOnProgressEventListener(listener);
};

/**
 * この音源のonratecahngeイベント発生時に呼び出すコールバックメソッドを追加します。
 * @param {function} listener 追加するコールバックメソッド
 */
snd.MediaElementAudioNode.prototype.addOnRateChangeEventListener = function(listener) {
    this.source.addOnRateChangeEventListener(listener);
};

/**
 * listenerで指定されたコールバックメソッドをonratechangeイベント発生時に呼び出されるリストから削除します。
 * @param {function} listener 削除するコールバックメソッド
 * @returns 削除されたらtrue, 削除されなかったらfalse
 */
snd.MediaElementAudioNode.prototype.removeOnRateChangeEventListener = function(listener) {
    return this.source.removeOnRateChangeEventListener(listener);
};

/**
 * この音源のonseekedイベント発生時に呼び出すコールバックメソッドを追加します。
 * @param {function} listener 追加するコールバックメソッド
 */
snd.MediaElementAudioNode.prototype.addOnSeekedEventListener = function(listener) {
    this.source.addOnSeekedEventListener(listener);
};

/**
 * listenerで指定されたコールバックメソッドをonseekedイベント発生時に呼び出されるリストから削除します。
 * @param {function} listener 削除するコールバックメソッド
 * @returns 削除されたらtrue, 削除されなかったらfalse
 */
snd.MediaElementAudioNode.prototype.removeOnSeekedEventListener = function(listener) {
    return this.source.removeOnSeekedEventListener(listener);
};

/**
 * この音源のonseekingイベント発生時に呼び出すコールバックメソッドを追加します。
 * @param {function} listener 追加するコールバックメソッド
 */
snd.MediaElementAudioNode.prototype.addOnSeekingEventListener = function(listener) {
    this.source.addOnSeekingEventListener(listener);
};

/**
 * listenerで指定されたコールバックメソッドをonseekingイベント発生時に呼び出されるリストから削除します。
 * @param {function} listener 削除するコールバックメソッド
 * @returns 削除されたらtrue, 削除されなかったらfalse
 */
snd.MediaElementAudioNode.prototype.removeOnSeekingEventListener = function(listener) {
    return this.source.removeOnSeekingEventListener(listener);
};

/**
 * この音源のonstalledイベント発生時に呼び出すコールバックメソッドを追加します。
 * @param {function} listener 追加するコールバックメソッド
 */
snd.MediaElementAudioNode.prototype.addOnStalledEventListener = function(listener) {
    this.source.addOnStalledEventListener(listener);
};

/**
 * listenerで指定されたコールバックメソッドをonstalledイベント発生時に呼び出されるリストから削除します。
 * @param {function} listener 削除するコールバックメソッド
 * @returns 削除されたらtrue, 削除されなかったらfalse
 */
snd.MediaElementAudioNode.prototype.removeOnStalledEventListener = function(listener) {
    return this.source.removeOnStalledEventListener(listener);
};

/**
 * この音源のonsuspendイベント発生時に呼び出すコールバックメソッドを追加します。
 * @param {function} listener 追加するコールバックメソッド
 */
snd.MediaElementAudioNode.prototype.addOnSuspendEventListener = function(listener) {
    this.source.addOnSuspendEventListener(listener);
};

/**
 * listenerで指定されたコールバックメソッドをonsupendイベント発生時に呼び出されるリストから削除します。
 * @param {function} listener 削除するコールバックメソッド
 * @returns 削除されたらtrue, 削除されなかったらfalse
 */
snd.MediaElementAudioNode.prototype.removeOnSuspendEventListener = function(listener) {
    return this.source.removeOnSuspendEventListener(listener);
};

/**
 * この音源のnotimeupdateイベント発生時に呼び出すコールバックメソッドを追加します。
 * @param {function} listener 追加するコールバックメソッド
 */
snd.MediaElementAudioNode.prototype.addOnTimeUpdateEventListener = function(listener) {
    this.source.addOnTimeUpdateEventListener(listener);
};

/**
 * listenerで指定されたコールバックメソッドをontimeupdateイベント発生時に呼び出されるリストから削除します。
 * @param {function} listener 削除するコールバックメソッド
 * @returns 削除されたらtrue, 削除されなかったらfalse
 */
snd.MediaElementAudioNode.prototype.removeOnTimeUpdateEventListener = function(listener) {
    return this.source.removeOnTimeUpdateEventListener(listener);
};

/**
 * この音源のonvolumechangeイベント発生時に呼び出すコールバックメソッドを追加します。
 * @param {function} listener 追加するコールバックメソッド
 */
snd.MediaElementAudioNode.prototype.addOnVolumeChangeEventListener = function(listener) {
    this.source.addOnVolumeChangeEventListener(listener);
};

/**
 * listenerで指定されたコールバックメソッドをonvolumechangeイベント発生時に呼び出されるリストから削除します。
 * @param {function} listener 削除するコールバックメソッド
 * @returns 削除されたらtrue, 削除されなかったらfalse
 */
snd.MediaElementAudioNode.prototype.removeOnVolumeChangeEventListener = function(listener) {
    return this.source.removeOnVolumeChangeEventListener(listener);
};

/**
 * この音源のonwaitingeイベント発生時に呼び出すコールバックメソッドを追加します。
 * @param {function} listener 追加するコールバックメソッド
 */
snd.MediaElementAudioNode.prototype.addOnWaitingEventListener = function(listener) {
    this.source.addOnWaitingEventListener(listener);
};

/**
 * listenerで指定されたコールバックメソッドをonwaitingイベント発生時に呼び出されるリストから削除します。
 * @param {function} listener 削除するコールバックメソッド
 * @returns 削除されたらtrue, 削除されなかったらfalse
 */
snd.MediaElementAudioNode.prototype.removeOnWaitingEventListener = function(listener) {
    return this.source.removeOnWaitingEventListener(listener);
};


