/*
 * require.jsのコンフィグファイルです。<br/>
 * サーバ上で各ファイルが配置されたパスに合わせて書き換えて使用してください。<br/>
 * "../../../dist"で置換すると便利です。<br/>
 * 実例はディレクトリ Samples 以下の各サンプル内にありますので、参照してみて下さい。<br/>
 * <br/>
 * コメント * Plugins * 以下は各種プラグイン用の定義です。<br/>
 * <br/>
 * 使用しない行は消してしまって問題ありません。
 */
var require = {
    paths: {
        /* snd */
        'snd': '../../../dist/class/snd',
        'snd.util': '../../../dist/class/snd.util',
        'snd.AudioDataManager': '../../../dist/class/required/snd.AudioDataManager',
        'snd.AudioMaster': '../../../dist/class/required/snd.AudioMaster',
        'snd.AudioUnit': '../../../dist/class/required/snd.AudioUnit',
        'snd.Exception': '../../../dist/class/required/snd.Exception',
        'snd.Source': '../../../dist/class/required/snd.Source',
        'snd.Analyser': '../../../dist/class/optional/snd.Analyser',
        'snd.BiquadFilter': '../../../dist/class/optional/snd.BiquadFilter',
        'snd.BufferSource': '../../../dist/class/optional/snd.BufferSource',
        'snd.Convolver': '../../../dist/class/optional/snd.Convolver',
        'snd.Delay': '../../../dist/class/optional/snd.Delay',
        'snd.DynamicsCompressor': '../../../dist/class/optional/snd.DynamicsCompressor',
        'snd.Gain': '../../../dist/class/optional/snd.Gain',
        'snd.MediaElementAudioSource': '../../../dist/class/optional/snd.MediaElementAudioSource',
        'snd.MediaStreamAudioSource': '../../../dist/class/optional/snd.MediaStreamAudioSource',
        'snd.OscillatorSource': '../../../dist/class/optional/snd.OscillatorSource',
        'snd.ScriptProcessor': '../../../dist/class/optional/snd.ScriptProcessor',
        'snd.Synth': '../../../dist/class/optional/snd.Synth',
        'snd.TimeLine': '../../../dist/class/optional/TimeLine/snd.TimeLine',
        'snd.TimeLineEvent': '../../../dist/class/optional/TimeLine/snd.TimeLineEvent',
        'snd.WaveShaper': '../../../dist/class/optional/snd.WaveShaper',
        'snd.Noise': '../../../dist/class/optional/snd.Noise',
        'snd.VinylNoise': '../../../dist/class/optional/snd.VinylNoise',
        'snd.MIDI': '../../../dist/class/optional/snd.MIDI',
        'snd.MIDI.util': '../../../dist/class/optional/snd.MIDI.util',
        /* Plugins */
        /* snd.invalid.js */
        'snd.invalid': '../../../dist/plugins/invalid/snd.invalid',
        'snd.invalid.Analyser': '../../../dist/plugins/invalid/snd.invalid.Analyser',
        'snd.invalid.BiquadFilter': '../../../dist/plugins/invalid/snd.invalid.BiquadFilter',
        'snd.invalid.BufferSource': '../../../dist/plugins/invalid/snd.invalid.BufferSource',
        'snd.invalid.Convolver': '../../../dist/plugins/invalid/snd.invalid.Convolver',
        'snd.invalid.Delay': '../../../dist/plugins/invalid/snd.invalid.Delay',
        'snd.invalid.Gain': '../../../dist/plugins/invalid/snd.invalid.Gain',
        'snd.invalid.Noise': '../../../dist/plugins/invalid/snd.invalid.Noise',
        'snd.invalid.Oscillator': '../../../dist/plugins/invalid/snd.invalid.Oscillator',
    }
};
