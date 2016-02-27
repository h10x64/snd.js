/*
 * require.jsのコンフィグファイルです。<br/>
 * サーバ上で各ファイルが配置されたパスに合わせて書き換えて使用してください。<br/>
 * "%SND_BASE_URL%"で置換すると便利です。<br/>
 * 実例はディレクトリ Samples 以下の各サンプル内にありますので、参照してみて下さい。<br/>
 * <br/>
 * コメント * Plugins * 以下は各種プラグイン用の定義です。<br/>
 * <br/>
 * 使用しない行は消してしまって問題ありません。
 */
var require = {
//    baseUrl: "%BASE_URL%"
    paths: {
        /* snd */
        'snd': '%SND_BASE_URL%/class/snd',
        'snd.util': '%SND_BASE_URL%/class/snd.util',
        'snd.AudioDataManager': '%SND_BASE_URL%/class/required/snd.AudioDataManager',
        'snd.AudioMaster': '%SND_BASE_URL%/class/required/snd.AudioMaster',
        'snd.AudioUnit': '%SND_BASE_URL%/class/required/snd.AudioUnit',
        'snd.Exception': '%SND_BASE_URL%/class/required/snd.Exception',
        'snd.Source': '%SND_BASE_URL%/class/required/snd.Source',
        'snd.Analyser': '%SND_BASE_URL%/class/optional/snd.Analyser',
        'snd.BiquadFilter': '%SND_BASE_URL%/class/optional/snd.BiquadFilter',
        'snd.BufferSource': '%SND_BASE_URL%/class/optional/snd.BufferSource',
        'snd.Convolver': '%SND_BASE_URL%/class/optional/snd.Convolver',
        'snd.Delay': '%SND_BASE_URL%/class/optional/snd.Delay',
        'snd.DynamicsCompressor': '%SND_BASE_URL%/class/optional/snd.DynamicsCompressor',
        'snd.Envelope': '%SND_BASE_URL%/class/optional/snd.Envelope',
        'snd.Gain': '%SND_BASE_URL%/class/optional/snd.Gain',
        'snd.MediaElementAudioSource': '%SND_BASE_URL%/class/optional/snd.MediaElementAudioSource',
        'snd.MediaStreamAudioSource': '%SND_BASE_URL%/class/optional/snd.MediaStreamAudioSource',
        'snd.MediaStreamAudioDestination': '%SND_BASE_URL%/class/optional/snd.MediaStreamAudioDestination',
        'snd.OscillatorSource': '%SND_BASE_URL%/class/optional/snd.OscillatorSource',
        'snd.ScriptProcessor': '%SND_BASE_URL%/class/optional/snd.ScriptProcessor',
        'snd.Synth': '%SND_BASE_URL%/class/optional/snd.Synth',
        'snd.TimeLine': '%SND_BASE_URL%/class/optional/TimeLine/snd.TimeLine',
        'snd.TimeLineEvent': '%SND_BASE_URL%/class/optional/TimeLine/snd.TimeLineEvent',
        'snd.WaveShaper': '%SND_BASE_URL%/class/optional/snd.WaveShaper',
        'snd.Noise': '%SND_BASE_URL%/class/optional/snd.Noise',
        'snd.VinylNoise': '%SND_BASE_URL%/class/optional/snd.VinylNoise',
        'snd.MIDI': '%SND_BASE_URL%/class/optional/MIDI/snd.MIDI',
        'snd.MIDIIn': '%SND_BASE_URL%/class/optional/MIDI/snd.MIDIIn',
        'snd.MIDIOut': '%SND_BASE_URL%/class/optional/MIDI/snd.MIDIOut',
        'snd.MIDI.util': '%SND_BASE_URL%/class/optional/MIDI/snd.MIDI.util',
        /* Plugins */
        /* snd.invalid.js */
        'snd.invalid': '%SND_BASE_URL%/plugins/invalid/snd.invalid',
        'snd.invalid.Analyser': '%SND_BASE_URL%/plugins/invalid/snd.invalid.Analyser',
        'snd.invalid.BiquadFilter': '%SND_BASE_URL%/plugins/invalid/snd.invalid.BiquadFilter',
        'snd.invalid.BufferSource': '%SND_BASE_URL%/plugins/invalid/snd.invalid.BufferSource',
        'snd.invalid.Convolver': '%SND_BASE_URL%/plugins/invalid/snd.invalid.Convolver',
        'snd.invalid.Delay': '%SND_BASE_URL%/plugins/invalid/snd.invalid.Delay',
        'snd.invalid.Gain': '%SND_BASE_URL%/plugins/invalid/snd.invalid.Gain',
        'snd.invalid.Noise': '%SND_BASE_URL%/plugins/invalid/snd.invalid.Noise',
        'snd.invalid.Oscillator': '%SND_BASE_URL%/plugins/invalid/snd.invalid.Oscillator',
        /* snd.Peer.js */
        'snd.Peer': '%SND_BASE_URL%/plugins/peer/snd.Peer',
        /* snd.encrypt.js */
        'snd.encrypt': '%SND_BASE_URL%/plugins/encript/snd.encrypt',
        /* snd.three.js */
        'snd.three': '%SND_BASE_URL%/plugins/three/snd.three',
        'snd.three.util': '%SND_BASE_URL%/plugins/three/snd.three.util',
        'snd.PosDir': '%SND_BASE_URL%/plugins/three/snd.PosDir',
        'snd.Listener': '%SND_BASE_URL%/plugins/three/snd.Listener',
        'snd.SoundEnvironment': '%SND_BASE_URL%/plugins/three/snd.SoundEnvironment',
        'snd.SoundNode': '%SND_BASE_URL%/plugins/three/snd.SoundNode',
        'snd.BufferSoundNode': '%SND_BASE_URL%/plugins/three/snd.BufferSoundNode',
        'snd.MediaElementAudioNode': '%SND_BASE_URL%/plugins/three/snd.MediaElementAudioNode'
    }
};
