module.exports = function(grunt) {
    grunt.initConfig({
        watch: {
            scripts: {
                files: ['src/*.js', 'src/**/*.js'],
                tasks: ['default'],
            }
        },
        pkg: grunt.file.readJSON('package.json'),
        concat: {
            basic_and_extras: {
                files: {
                    
                    /* base */
                    
                    'dist/snd.js': [
                        'src/COPYRIGHT',
                        'src/snd.base.js',
                        'src/snd.util.js'
                    ],
                    'dist/snd.all.in.one.js': [
                        'src/COPYRIGHT',
                        'src/snd.base.js',
                        'src/snd.util.js',
                        'src/class/required/snd.Exception.js',
                        'src/class/required/snd.AudioDataManager.js',
                        'src/class/required/snd.AudioMaster.js',
                        'src/class/required/snd.AudioUnit.js',
                        'src/class/required/snd.Source.js',
                        'src/class/optional/snd.Analyser.js',
                        'src/class/optional/snd.BiquadFilter.js',
                        'src/class/optional/snd.BufferSource.js',
                        'src/class/optional/snd.Convolver.js',
                        'src/class/optional/snd.DynamicsCompressor.js',
                        'src/class/optional/snd.Delay.js',
                        'src/class/optional/snd.Gain.js',
                        'src/class/optional/snd.MediaElementAudioSource.js',
                        'src/class/optional/snd.MediaStreamAudioSource.js',
                        'src/class/optional/snd.OscillatorSource.js',
                        'src/class/optional/snd.ScriptProcessor.js',
                        'src/class/optional/snd.WaveShaper.js'
                    ],
                    'dist/snd.using.js': [
                        'src/COPYRIGHT',
                        'src/snd.using.js'
                    ],
                    
                    /* required */
                    
                    'dist/class/required/snd.Exception.js': [
                        'src/COPYRIGHT',
                        'src/class/required/snd.Exception.js'
                    ],
                    'dist/class/required/snd.AudioDataManager.js': [
                        'src/COPYRIGHT',
                        'src/class/required/snd.AudioDataManager.js'
                    ],
                    'dist/class/required/snd.AudioMaster.js': [
                        'src/COPYRIGHT',
                        'src/class/required/snd.AudioMaster.js'
                    ],
                    'dist/class/required/snd.AudioUnit.js': [
                        'src/COPYRIGHT',
                        'src/class/required/snd.AudioUnit.js'
                    ],
                    'dist/class/required/snd.Source.js': [
                        'src/COPYRIGHT',
                        'src/class/required/snd.Source.js'
                    ],
                    
                    /* optional */
                    
                    'dist/class/optional/snd.Analyser.js': [
                        'src/COPYRIGHT',
                        'src/class/optional/snd.Analyser.js'
                    ],
                    'dist/class/optional/snd.BiquadFilter.js': [
                        'src/COPYRIGHT',
                        'src/class/optional/snd.BiquadFilter.js'
                    ],
                    'dist/class/optional/snd.BufferSource.js': [
                        'src/COPYRIGHT',
                        'src/class/optional/snd.BufferSource.js'
                    ],
                    'dist/class/optional/snd.Convolver.js': [
                        'src/COPYRIGHT',
                        'src/class/optional/snd.Convolver.js'
                    ],
                    'dist/class/optional/snd.Delay.js': [
                        'src/COPYRIGHT',
                        'src/class/optional/snd.Delay.js'
                    ],
                    'dist/class/optional/snd.DynamicsCompressor.js': [
                        'src/COPYRIGHT',
                        'src/class/optional/snd.DynamicsCompressor.js'
                    ],
                    'dist/class/optional/snd.Gain.js': [
                        'src/COPYRIGHT',
                        'src/class/optional/snd.Gain.js'
                    ],
                    'dist/class/optional/snd.MediaElementAudioSource.js': [
                        'src/COPYRIGHT',
                        'src/class/optional/snd.MediaElementAudioSource.js'
                    ],
                    'dist/class/optional/snd.MediaStreamAudioSource.js': [
                        'src/COPYRIGHT',
                        'src/class/optional/snd.MediaStreamAudioSource.js'
                    ],
                    'dist/class/optional/snd.OscillatorSource.js': [
                        'src/COPYRIGHT',
                        'src/class/optional/snd.OscillatorSource.js'
                    ],
                    'dist/class/optional/snd.ScriptProcessor.js': [
                        'src/COPYRIGHT',
                        'src/class/optional/snd.ScriptProcessor.js'
                    ],
                    'dist/class/optional/snd.Synth.js': [
                        'src/COPYRIGHT',
                        'src/class/optional/snd.Synth.js'
                    ],
                    'dist/class/optional/snd.WaveShaper.js': [
                        'src/COPYRIGHT',
                        'src/class/optional/snd.WaveShaper.js'
                    ],
                    'dist/class/optional/snd.Noise.js': [
                        'src/COPYRIGHT',
                        'src/class/optional/snd.Noise.js'
                    ],
                    
                    /* plugin */
                    
                    // mml
                    'dist/plugins/mml/snd.mml.js': [
                        'src/plugins/mml/COPYRIGHT',
                        'src/plugins/mml/snd.mml.js'
                    ],
                    
                    // three
                    'dist/plugins/three/snd.three.js': [
                        'src/plugins/three/COPYRIGHT',
                        'src/plugins/three/snd.three.static.js',
                        'src/plugins/three/snd.PosDir.js',
                        'src/plugins/three/snd.Listener.js',
                        'src/plugins/three/snd.SoundEnvironment.js',
                        'src/plugins/three/snd.SoundNode.js',
                        'src/plugins/three/snd.BufferSoundNode.js',
                        'src/plugins/three/snd.MediaElementAudioNode.js',
                        'src/plugins/three/snd.three.js',
                        'src/plugins/three/snd.three.util.js'
                    ],
                    
                    // encrypt
                    'dist/plugins/encrypt/snd.encrypt.js': [
                        'src/plugins/encrypt/COPYRIGHT',
                        'src/plugins/encrypt/snd.encrypt.js'
                    ],
                    'dist/plugins/encrypt/createKey.rb': [
                        'src/plugins/encrypt/createKey.rb'
                    ],
                    'dist/plugins/encrypt/encrypt.rb': [
                        'src/plugins/encrypt/encrypt.rb'
                    ],
                    'dist/plugins/encrypt/keygen.rb': [
                        'src/plugins/encrypt/keygen.rb'
                    ],
                    
                    // invalid
                    'dist/plugins/invalid/snd.invalid.js': [
                        'src/plugins/invalid/snd.invalid.js'
                    ],
                    'dist/plugins/invalid/snd.invalid.Analyser.js': [
                        'src/plugins/invalid/snd.invalid.Analyser.js'
                    ],
                    'dist/plugins/invalid/snd.invalid.BiquadFilter.js': [
                        'src/plugins/invalid/snd.invalid.BiquadFilter.js'
                    ],
                    'dist/plugins/invalid/snd.invalid.BufferSource.js': [
                        'src/plugins/invalid/snd.invalid.BufferSource.js'
                    ],
                    'dist/plugins/invalid/snd.invalid.Convolver.js': [
                        'src/plugins/invalid/snd.invalid.Convolver.js'
                    ],
                    'dist/plugins/invalid/snd.invalid.Delay.js': [
                        'src/plugins/invalid/snd.invalid.Delay.js'
                    ],
                    'dist/plugins/invalid/snd.invalid.Gain.js': [
                        'src/plugins/invalid/snd.invalid.Gain.js'
                    ],
                    'dist/plugins/invalid/snd.invalid.Oscillator.js': [
                        'src/plugins/invalid/snd.invalid.Oscillator.js'
                    ],
                    'dist/plugins/invalid/snd.invalid.Noise.js': [
                        'src/plugins/invalid/snd.invalid.Noise.js'
                    ]

                }
            }
        },
        uglify: {
            options: {
                banner: '/**' + '\n' +
                        ' * snd.js - The Sound Library for JavaScript with WebAudioAPI - v.1.0 beta' + '\n' +
                        ' * ' + '\n' +
                        ' * The MIT License (MIT)' + '\n' +
                        ' * copyright (c) 2014 N_H <h.10x64@gmail.com>' + '\n' +
                        ' * ' + '\n' +
                        ' * Permission is hereby granted, free of charge, to any person obtaining a copy' + '\n' +
                        ' * of this software and associated documentation files (the "Software"), to deal' + '\n' +
                        ' * in the Software without restriction, including without limitation the rights' + '\n' +
                        ' * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell' + '\n' +
                        ' * copies of the Software, and to permit persons to whom the Software is' + '\n' +
                        ' * furnished to do so, subject to the following conditions:' + '\n' +
                        ' * ' + '\n' +
                        ' * The above copyright notice and this permission notice shall be included in' + '\n' +
                        ' * all copies or substantial portions of the Software.' + '\n' +
                        ' * ' + '\n' +
                        ' * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR' + '\n' +
                        ' * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,' + '\n' +
                        ' * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE' + '\n' +
                        ' * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER' + '\n' +
                        ' * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,' + '\n' +
                        ' * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN' + '\n' +
                        ' * THE SOFTWARE.' + '\n' +
                        ' * ' + '\n' +
                        ' **/' + '\n'
            },
            dist: {
                files: {
                    'dist/snd.min.js': ['dist/snd.js'],
                    'dist/snd.all.in.one.min.js': ['dist/snd.all.in.one.js'],
                    'dist/class.min/required/snd.AudioDataManager.min.js': ['dist/class/required/snd.AudioDataManager.js'],
                    'dist/class.min/required/snd.AudioMaster.min.js': ['dist/class/required/snd.AudioMaster.js'],
                    'dist/class.min/required/snd.AudioUnit.min.js': ['dist/class/required/snd.AudioUnit.js'],
                    'dist/class.min/required/snd.Exception.min.js': ['dist/class/required/snd.Exception.js'],
                    'dist/class.min/required/snd.Source.min.js': ['dist/class/required/snd.Source.js'],
                    'dist/class.min/optional/snd.Analyser.min.js': ['dist/class/optional/snd.Analyser.js'],
                    'dist/class.min/optional/snd.BiquadFilter.min.js': ['dist/class/optional/snd.BiquadFilter.js'],
                    'dist/class.min/optional/snd.BufferSource.min.js': ['dist/class/optional/snd.BufferSource.js'],
                    'dist/class.min/optional/snd.Convolver.min.js': ['dist/class/optional/snd.Convolver.js'],
                    'dist/class.min/optional/snd.Delay.min.js': ['dist/class/optional/snd.Delay.js'],
                    'dist/class.min/optional/snd.DynamicsCompressor.min.js': ['dist/class/optional/snd.DynamicsCompressor.js'],
                    'dist/class.min/optional/snd.Gain.min.js': ['dist/class/optional/snd.Gain.js'],
                    'dist/class.min/optional/snd.MediaElementAudioSource.min.js': ['dist/class/optional/snd.MediaElementAudioSource.js'],
                    'dist/class.min/optional/snd.MediaStreamAudioSource.min.js': ['dist/class/optional/snd.MediaStreamAudioSource.js'],
                    'dist/class.min/optional/snd.OscillatorSource.min.js': ['dist/class/optional/snd.OscillatorSource.js'],
                    'dist/class.min/optional/snd.ScriptProcessor.min.js': ['dist/class/optional/snd.ScriptProcessor.js'],
                    'dist/class.min/optional/snd.Synth.min.js': ['dist/class/optional/snd.Synth.js'],
                    'dist/class.min/optional/snd.WaveShaper.min.js': ['dist/class/optional/snd.WaveShaper.js'],
                    'dist/plugins/mml/snd.mml.min.js': ['dist/plugins/mml/snd.mml.js'],
                    'dist/plugins/three/snd.three.min.js': ['dist/plugins/three/snd.three.js'],
                    'dist/plugins/encrypt/snd.encrypt.min.js': ['dist/plugins/encrypt/snd.encrypt.js'],
                    'dist/plugins/invalid/min/snd.invalid.min.js':['dist/plugins/invalid/snd.invalid.js'],
                    'dist/plugins/invalid/min/snd.invalid.Analyser.min.js':['dist/plugins/invalid/snd.invalid.Analyser.js'],
                    'dist/plugins/invalid/min/snd.invalid.BiquadFilter.min.js':['dist/plugins/invalid/snd.invalid.BiquadFilter.js'],
                    'dist/plugins/invalid/min/snd.invalid.BufferSource.min.js':['dist/plugins/invalid/snd.invalid.BufferSource.js'],
                    'dist/plugins/invalid/min/snd.invalid.Convolver.min.js':['dist/plugins/invalid/snd.invalid.Convolver.js'],
                    'dist/plugins/invalid/min/snd.invalid.Delay.min.js':['dist/plugins/invalid/snd.invalid.Delay.js'],
                    'dist/plugins/invalid/min/snd.invalid.Oscillator.min.js':['dist/plugins/invalid/snd.invalid.Oscillator.js'],
                    'dist/plugins/invalid/min/snd.invalid.Noise.min.js':['dist/plugins/invalid/snd.invalid.Noise.js']
                }
            }
        },
        jsdoc: {
            options: {
                destination: 'doc',
                configure: 'docConfig.json'
            },
            src: ['dist/snd.all.in.one.js', 'README.md']
        },
    });

    /* load npm Tasks */

    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-jsdoc');

    /* Register Tasks */

    grunt.registerTask('default', ['concat', 'uglify', 'jsdoc']);
};
