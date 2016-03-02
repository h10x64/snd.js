declare module snd {

  /**
   * Analyser analyse wave form from connected input.<br/>
   * This class provides real-time frequency and time domain analysis information.
   * @see <a href="https://www.w3.org/TR/webaudio/#the-analysernode-interface">WebAudioAPI - 2.23 The AnalyserNode Interface</a>
   */
  export class Analyser extends snd.AudioUnit {
    constructor (id:string);
    /**
     * Get frequency domain analysis information as Float32Array.<br/>
     * This property's length are defined by the Analyser#fftSize.
     * @see #fftSize
     * @readonly
     */
    floatFrequencyData : Float32Array;
    /**
     * Get frequency domain analysis information as Uint8Array.<br/>
     * This property's length are defined by the Analyser#fftSize.
     * @see #fftSize
     * @readonly
     */
    byteFrequencyData : Uint8Array;
    /**
     * Get time domain analysis information as Float32Array.<br/>
     * This property's length are defined by the Analyser#fftSize.
     * @see #fftSize
     * @readonly
     */
    floatTimeDomainData : Float32Array;
    /**
     * Get time domain analysis information as Uint8Array.<br/>
     * This property's length are defined by the Analyser#fftSize.
     * @see #fftSize
     * @readonly
     */
    byteTimeDomainData : Uint8Array;
    /**
     * The size of FFT.<br/>
     * This must be power of two range 32 to 32768.
     */
    fftSize : number;
    /**
     * The size of frequency bin.<br/>
     * This number is half of fftSize simply.
     * @see <a href="https://en.wikipedia.org/wiki/Nyquist_frequency">wikipedia - Nyquist_frequency</a>
     */
    frequencyBinCount : number;
    /**
     * Minimum power value in the scaling range for the FFT analysis data for conversion to unsinged byte values.<br/>
     * Default value is -100.
     */
    minDecibels : number;
    /**
     * Maximum power value in the scaling range for the FFT analysis data for conversion to unsinged byte values.<br/>
     * Default value is -100.
     */
    maxDecibels : number;
    /**
     * A value from 0 to 1.
     * This value control time averaging with the last analysis frame.
     * @see <a href="https://www.w3.org/TR/webaudio/#fft-windowing-and-smoothing-over-time">WebAudioAPI - 2.23.3 FFT Windowing and smoothing over time</a>
     */
    smoothingTimeConstant : number;
  }
}
