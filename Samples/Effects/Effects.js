require([
    "snd.BufferSource",
    "snd.Analyser",
    "snd.BiquadFilter",
    "snd.Gain",
    "snd.Convolver",
    "snd.Delay",
    "snd.DynamicsCompressor",
    "snd.WaveShaper"
], function(snd) {
            MATCH_SOUND_FILE = "../sound/test.wav";
            BGM_SOUND_FILE = "../sound/01 Liftoff (Get High).wav";
            IR_CARPARK = "../sound/IR/carpark_balloon_ir_mono_16bit_44100.wav";
            IR_MAES_HOWE = "../sound/IR/mh3_000_ortf_48k.wav";
            IR_ST_PATRICKS_CHURCH_PATRINGTON = "../sound/IR/ortf_s1r1.wav";
            IR_STAIRWAY_UNIVERSITY_YORK = "../sound/IR/stairwell_ortf.wav";
            IR_INNOCENT_RAILWAY_TUNNEL = "../sound/IR/tunnel_entrance_f_1way_mono.wav";

            // Analyserのcanvasで使う横方向の分割数
            AUDIO_LEVEL_METER_BAND_NUM = 100;
            
            // 各エフェクタで使用する音源の設定
            SOUND_FILES = {
                "analyserSound": MATCH_SOUND_FILE,
                "biquadSound": MATCH_SOUND_FILE,
                "convolverSound": MATCH_SOUND_FILE,
                "delaySound": MATCH_SOUND_FILE,
                "compressorSound": MATCH_SOUND_FILE,
                "gainSound": MATCH_SOUND_FILE,
                "waveshaperSound": MATCH_SOUND_FILE
            };

            // IR(InpulseResponse:インパルス応答)データ
            // データを読み込みAudioBufferに変換するが、音源としては使用しない
            IR_FILES = {
                "irBGM": BGM_SOUND_FILE,
                "irCarpark": IR_CARPARK,
                "irMaesHowe": IR_MAES_HOWE,
                "irStPatricksChurchPatrington": IR_ST_PATRICKS_CHURCH_PATRINGTON,
                "irStairwayUniversityYork": IR_STAIRWAY_UNIVERSITY_YORK,
                "irInnocentRailwayTunnel": IR_INNOCENT_RAILWAY_TUNNEL
            };

            SOUNDS = null;
            EFFECTS = null;

            onLoad = function() {
                // 見た目関係の設定
                initHTML();
                
                // データマネージャにIR_FILESで指定されたファイルを追加
                snd.AUDIO_DATA_MANAGER.addAll(IR_FILES);
                // IRデータ読み込み終了時に呼び出されるコールバック関数
                var callback = function() {
                    // 次回読み込み時に再度callbackが呼び出されないようにリスナのリストから消しておく
                    snd.AUDIO_DATA_MANAGER.removeAllDataLoadListener(callback);
                    // BufferSourceにするファイルを読み込み
                    snd.util.createBufferSources(SOUND_FILES, false, onAllDataLoaded);
                };
                // データマネージャの全データ読み込み完了イベントのリスナにcallbackを追加
                snd.AUDIO_DATA_MANAGER.addAllDataLoadListener(callback);

                // 読み込み開始
                snd.AUDIO_DATA_MANAGER.load();
            };
            
            /**
             * 画面周りの初期設定
             */
            initHTML = function() {
                $("#tabs").tabs();
                // Analyserの画面更新を設定
                setInterval(updateChart, 1000 / 15);
            };
            
            /**
             * 音周りの初期設定
             */
            onAllDataLoaded = function(bufferSources) {
                SOUNDS = bufferSources;
                
                // エフェクト・音源・マスターを接続する
                createConnections(bufferSources);
                // 画面で設定された値を取得し、各エフェクトに設定する
                setEffectProperties();
            };
            
            /**
             * 各エフェクタと音源とを接続し、snd.MASTERへ接続します。
             */
            createConnections = function(bufferSources) {
                EFFECTS = {};

                /* Analyser */
                var analyser = new snd.Analyser("analyserEffect");
                bufferSources["analyserSound"].connect(analyser);
                analyser.connect(snd.MASTER);
                EFFECTS["analyser"] = analyser;

                /* Biquad */
                var biquad = new snd.BiquadFilter("biquadEffect");
                bufferSources["biquadSound"].connect(biquad);
                biquad.connect(snd.MASTER);
                EFFECTS["biquad"] = biquad;

                /* Convolver */
                var convolver = new snd.Convolver("convolverEffect");
                bufferSources["convolverSound"].connect(convolver);
                convolver.connect(snd.MASTER);
                EFFECTS["convolver"] = convolver;

                /* Delay */
                var delay = new snd.Delay("delayEffect");
                bufferSources["delaySound"].connect(delay);
                delay.connect(snd.MASTER);
                EFFECTS["delay"] = delay

                /* DynamicsCompressor */
                var compressor = new snd.DynamicsCompressor("compressorEffect");
                bufferSources["compressorSound"].connect(compressor);
                compressor.connect(snd.MASTER);
                EFFECTS["compressor"] = compressor;

                /* Gain */
                var gain = new snd.Gain("gainEffect");
                bufferSources["gainSound"].connect(gain);
                gain.connect(snd.MASTER);
                EFFECTS["gain"] = gain;

                /* WaveShaper */
                var waveshaper = new snd.WaveShaper("waveshaperEffect");
                bufferSources["waveshaperSound"].connect(waveshaper);
                waveshaper.connect(snd.MASTER);
                EFFECTS["waveshaper"] = waveshaper;
            };

            /**
             * 画面から値を取得して各エフェクトに設定します
             */
            setEffectProperties = function() {
                /* Analyser */
                EFFECTS['analyser'].fftSize = $('input[name=analyserFFTSize]')[0].value;
                EFFECTS['analyser'].smoothingTimeConstant = $('input[name=analyserSmoothingTimeConstant]')[0].value;
                EFFECTS['analyser'].maxDecibels = $('input[name=analyserMaxDecibels]')[0].value;
                EFFECTS['analyser'].minDecibels = $('input[name=analyserMinDecibels]')[0].value;

                /* Biquad */
                EFFECTS['biquad'].type = $('select[name=biquadBiquadType]')[0].value;
                EFFECTS['biquad'].Q = $('input[name=biquadQ]')[0].value;
                EFFECTS['biquad'].frequency = $('input[name=biquadFrequency]')[0].value;
                EFFECTS['biquad'].detune = $('input[name=biquadDetune]')[0].value;
                EFFECTS['biquad'].gain = $('input[name=biquadGain]')[0].value;

                /* Convolver */
                var selected = $('select[name=convolverBuffer]')[0].value;
                EFFECTS['convolver'].buffer = (selected != 'none') ? snd.AUDIO_DATA_MANAGER.data[selected] : null;
                EFFECTS['convolver'].normalize = ($('select[name=convolverNormalize]')[0].value == 'true') ? true : false;

                /* Delay */
                EFFECTS['delay'].maxDelay = $('input[name=delayMaxDelay]')[0].value;
                EFFECTS['delay'].delayTime = $('input[name=delayDelayTime]')[0].value;

                /* DynamicsCompressor */
                EFFECTS['compressor'].attack = $('input[name=compressorAttack]')[0].value;
                EFFECTS['compressor'].attack = $('input[name=compressorKnee]')[0].value;
                EFFECTS['compressor'].attack = $('input[name=compressorRatio]')[0].value;
                EFFECTS['compressor'].attack = $('input[name=compressorRelease]')[0].value;
                EFFECTS['compressor'].attack = $('input[name=compressorThreshold]')[0].value;

                /* Gain */
                EFFECTS['gain'].gain = $('input[name=gainGain]')[0].value;

                /* WaveShaper */
                EFFECTS['waveshaper'].curve = calcWaveShaperCurve($('input[name=waveshaperCurve]')[0].value);
                EFFECTS['waveshaper'].gain = $('input[name=waveshaperGain]')[0].value;
                EFFECTS['waveshaper'].oversample = $('select[name=waveshaperOversample]')[0].value;
            };
            
            /**
             * 引数で指定された音源を再生/停止させます
             */
            playSound = function(name) {
                if (SOUNDS) {
                    if (SOUNDS[name]) {
                        if (SOUNDS[name].status != snd.status.STARTED) {
                            SOUNDS[name].start();
                        } else {
                            SOUNDS[name].stop();
                        }
                    }
                }
            };

            /**
             * Analyserのcanvasを更新するメソッド
             */
            updateChart = function() {
                if (EFFECTS && EFFECTS["analyser"]) {
                    var data = EFFECTS["analyser"].byteFrequencyData;
                    var ctx = $("#freqAnalyser")[0].getContext("2d");

                    var dx = Math.round(ctx.canvas.clientWidth / AUDIO_LEVEL_METER_BAND_NUM);
                    var df = Math.floor(data.length / AUDIO_LEVEL_METER_BAND_NUM);

                    var x0 = 0;
                    var y0 = 0;
                    var x1 = 0;
                    var y1 = 0;
                    ctx.clearRect(0, 0, ctx.canvas.clientWidth, ctx.canvas.clientHeight);
                    ctx.beginPath();
                    for (var i = 0; (i + 1) * df < data.length; i++) {
                        x0 = dx * i;
                        y0 = (1.0 - data[Math.floor(i * df)] / 255.0) * ctx.canvas.clientHeight;
                        x1 = dx * (i + 1);
                        y1 = (1.0 - data[Math.floor((i + 1) * df)] / 255.0) * ctx.canvas.clientHeight;

                        ctx.moveTo(x0, y0);
                        ctx.lineTo(x1, y1);
                    }
                    ctx.stroke();
                }
            };

            /**
             * WaveShaperのCurveを計算するメソッド
             */
            calcWaveShaperCurve = function(clip) {
                var curve = new Float32Array(1000);
                var dx = 1.0 / curve.length;
                var clipPos = Math.floor((1.0 - clip) / dx);
                for (var i = 0; i < curve.length / 2; i++) {
                    curve[i] = -1.0;
                    curve[curve.length - i] = 1.0;
                }
                for (var i = 0; i < curve.length - 2 * clipPos; i++) {
                    curve[i + clipPos] = 2 * (i / (curve.length - 2 * clipPos) - 0.5);
                }
                return curve;
            };
            
            if (LOADED) {
                onLoad();
            } else {
                window.onload = onLoad;
            }
});
