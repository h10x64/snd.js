require([
    'snd.invalid.Analyser',
    'snd.invalid.BiquadFilter',
    'snd.invalid.BufferSource',
    'snd.invalid.Convolver',
    'snd.invalid.Delay',
    'snd.invalid.Gain',
    'snd.invalid.Noise',
    'snd.invalid.Oscillator'
], function(snd) {
    snd.invalid.init();
});