snd.Synth = function(id, polyphony, waveForm, envelope) {
    snd.Source.apply(this, arguments);
    this.polyphony = polyphony;
    
    if (envelope == null) {
        this.envelope = new snd.Envelope();
    } else {
        this.envelope = envelope;
    }
    
    if (waveForm == null) {
        var realArray = new Float32Array(2);
        var imagArray = new Float32Array(2);
        realArray[0] = 0;
        realArray[1] = 1.0;
        imagArray[0] = 0;
        imagArray[1] = 0;
        this.waveForm = {
            real: realArray,
            imag: imagArray
        };
    } else {
        this.waveForm = waveForm;
    }
    this.periodicWave = snd.AUDIO_CONTEXT.createPeriodicWave(
            this.waveForm.real,
            this.waveForm.imag);
           
    this.partes = [];
    for (var i = 0; i < this.polyphony; i++) {
        var part = new snd.Synth.Partes(this.id + i, this);
        part.connect(this.gain);
        this.partes.push(part);
    }
};
snd.Synth.prototype = Object.create(snd.Source.prototype);
snd.Synth.prototype.constructor = snd.Synth;

snd.Synth.prototype.noteOn = function(partes) {
    for (var i = 0; i < partes.length; i++) {
        var no = partes[i].no;
        var freq = partes[i].freq;
        this.partes[no].noteOn(freq);
    }
};

snd.Synth.prototype.noteOff = function(partes) {
    for (var i = 0; i < partes.length; i++) {
        var no = partes[i].no;
        this.partes[no].noteOff();
    }
};

snd.Synth.Partes = function(id, parent) {
    snd.OscillatorSource.apply(this, arguments);
    this.parent = parent;
    this.source.setPeriodicWave(parent.periodicWave);
    this.setGain(0.0);
};
snd.Synth.Partes.prototype = Object.create(snd.OscillatorSource.prototype);
snd.Synth.Partes.prototype.constructor = snd.Synth.Note;

snd.Synth.Partes.prototype.noteOn = function(freq) {
    this.setFrequency(freq);
    this.start(0);
    
    var now = snd.AUDIO_CONTEXT.currentTime;
    this.gain.gain.cancelScheduledValues(now);
    this.gain.gain.value = 0;
    
    if (this.parent.envelope.attackTime >= 0) {
        switch (this.parent.envelope.attackType) {
           case snd.audioparam.type.LINER:
                this.gain.gain.linearRampToValueAtTime(
                        this.parent.envelope.attack,
                        now + this.parent.envelope.attackTime);
                break;
            case snd.audioparam.type.EXPONENTIALLY:
                this.gain.gain.exponentialRampToValueAtTime(
                        this.parent.envelope.attack,
                        now + this.parent.envelope.attackTime);
                break;
            default:
                this.gain.gain.setValueAtTime(
                        this.parent.envelope.attack,
                        now + this.parent.envelope.attackTime);
                break;
        };
    }
    
    if (this.parent.envelope.decayTime >= 0) {
        switch (this.parent.envelope.decayType) {
            case snd.audioparam.type.LINER:
                this.gain.gain.linearRampToValueAtTime(
                        this.parent.envelope.sustain,
                        now + this.parent.envelope.attackTime + this.parent.envelope.decayTime);
                break;
            case snd.audioparam.type.EXPONENTIALLY:
                this.gain.gain.exponentialRampToValueAtTime(
                        this.parent.envelope.sustain,
                        now + this.parent.envelope.attackTime + this.parent.envelope.decayTime);
                break;
            default:
                this.gain.gain.setValueAtTime(
                        this.parent.envelope.sustain,
                        now + this.parent.envelope.attackTime + this.parent.envelope.decayTime);
                break;
        }
    }
    
    if (this.parent.envelope.sustainTime > 0) {
        switch (this.parent.envelope.sustainType) {
            case snd.audioparam.type.LINER:
                this.gain.gain.linearRampToValueAtTime(
                        this.parent.envelope.release,
                        now + this.parent.envelope.attackTime + this.parent.envelope.decayTime + this.parent.envelope.sustainTime);
                break;
            case snd.audioparam.type.EXPONENTIALLY:
                this.gain.gain.exponentialRampToValueAtTime(
                        this.parent.envelope.release,
                        now + this.parent.envelope.attackTime + this.parent.envelope.decayTime + this.parent.envelope.sustainTime);
                break;
            default:
                this.gain.gain.setValueAtTime(
                        this.parent.envelope.release,
                        now + this.parent.envelope.attackTime + this.parent.envelope.decayTime + this.parent.envelope.sustainTime);
                break;
        }
        
        switch (this.parent.envelope.releaseType) {
            case snd.audioparam.type.LINER:
                this.gain.gain.linearRampToValueAtTime(
                        0,
                        now + this.parent.envelope.attackTime + this.parent.envelope.decayTime + this.parent.envelope.sustainTime + this.parent.envelope.releaseTime);
                break;
            case snd.audioparam.type.EXPONENTIALLY:
                this.gain.gain.exponentialRampToValueAtTime(
                        0,
                        now + this.parent.envelope.attackTime + this.parent.envelope.decayTime + this.parent.envelope.sustainTime + this.parent.envelope.releaseTime);
                break;
            default:
                this.gain.gain.setValueAtTime(
                        0,
                        now + this.parent.envelope.attackTime + this.parent.envelope.decayTime + this.parent.envelope.sustainTime + this.parent.envelope.releaseTime);
                break;
        }
    }
};

snd.Synth.Partes.prototype.noteOff = function() {
        var now = snd.AUDIO_CONTEXT.currentTime;
        this.gain.gain.cancelScheduledValues(now);
        
        switch (this.parent.envelope.releaseType) {
           case snd.audioparam.type.LINER:
                this.gain.gain.linearRampToValueAtTime(
                        0,
                        now + this.parent.envelope.releaseTime);
                break;
            case snd.audioparam.type.EXPONENTIALLY:
                this.gain.gain.exponentialRampToValueAtTime(
                        0,
                        now + this.parent.envelope.releaseTime);
                break;
            default:
                this.gain.gain.setValueAtTime(
                        0,
                        now + this.parent.envelope.releaseTime);
                break;
        }
    
};

/**
 * エンベロープの設定値を保持するクラスです。<br/>
 * ADSR(Attack, Decay, Sustain, Release)を、時間と音量と補間処理の種類の3つの値で制御します。<br/>
 * 時間の単位は全て秒単位です。<br/>
 * アタック、ディケイ、サスティーン、リリースの値はゲインの値で、出力に乗じる値を指定します(デシベルではありません)。<br/>
 * 補間処理の種類は、「補間なし」「直線補間」「対数補間」の3種類があり、snd.audioparam.type名前空間にある定数を使って、いずれか一つを指定します。<br/>
 * <table>
 * <tr>定数値<td></td><td>補間方法</td></tr>
 * <tr><td>snd.audioparam.type.SET</td><td>補間なし</td></tr>
 * <tr><td>snd.audioparam.type.LINER</td><td>直線補間</td></tr>
 * <tr><td>snd.audioparam.type.EXPONENTIALLY</td><td>対数補間</td></tr>
 * </table><br/>
 * また、エンベロープについて詳しくは<a href="http://en.wikipedia.org/wiki/Synthesizer#ADSR_envelope">Wikipedia(英)</a>や<a href="http://ja.wikipedia.org/wiki/ADSR">Wikipedia(日)</a>を参照してください。<br/>
 * 
 * @param {type} attackTime アタックタイム[秒]
 * @param {type} attack アタック
 * @param {type} attackType アタックの補間法
 * @param {type} decayTime ディケイタイム[秒]
 * @param {type} decayType ディケイの補間法
 * @param {type} sustainTime サスティーンタイム[秒](0以下の値が指定された場合、NoteOffまで変化なし)
 * @param {type} sutain サスティーン
 * @param {type} sustainType サスティーンの補間法
 * @param {type} releaseTime リリースタイム[秒]
 * @param {type} release リリース
 * @param {type} releaseType リリースの補間法
 * @class
 */
snd.Envelope = function(
        attackTime, attack, attackType,
        decayTime, decayType,
        sustainTime, sustain, sustainType,
        releaseTime, release, releaseType) {
    this.attackTime = (attackTime == null) ? 0.1 : attackTime;
    this.attack = (attack == null) ? 0.75 : attack;
    this.attackType = (attackType == null) ? snd.audioparam.type.LINER : attackType;
    this.decayTime = (decayTime == null) ? 0.1 : decayTime;
    this.decayType = (decayType == null) ? snd.audioparam.type.LINER : decayType;
    this.sustainTime = (sustainTime == null) ? -1 : sustainTime;
    this.sustain = (sustain == null) ? 0.25 : sustain;
    this.sustainType = (sustainType == null) ? snd.audioparam.type.LINER : sustainType;
    this.releaseTime = (releaseTime == null) ? 0.5 : releaseTime;
    this.release = (release == null) ? 0.25 : release;
    this.releaseType = (releaseType == null) ? snd.audioparam.type.LINER : releaseType;
};
