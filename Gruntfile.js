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
      options: {
        banner: '/* snd.js - The Sound Library for JavaScript with WebAudioAPI - v.0.85 */'
      },
      basic_and_extras: {
        files: {
          'dist/snd.js': [
              'src/COPYRIGHT',
              'src/snd.base.js',
              'src/snd.Exception.js',
              'src/snd.vec3.js',
              'src/snd.AudioUnit.js',
              'src/snd.Source.js',
              'src/snd.BufferSource.js',
              'src/snd.OscillatorSource.js',
              'src/snd.MediaElementAudioSource.js',
              'src/snd.MediaStreamAudioSource.js',
              'src/snd.Synth.js',
              'src/snd.Listener.js',
              'src/snd.AudioDataManager.js',
              'src/snd.AudioMaster.js',
              'src/snd.util.js',
              'src/snd.static.js'
          ],
          'dist/plugins/snd.mml.js': [
              'src/plugins/mml/COPYRIGHT',
              'src/plugins/mml/snd.mml.js'
          ],
          'dist/plugins/snd.three.js': [
              'src/plugins/three/COPYRIGHT',
              'src/plugins/three/snd.three.static.js',
              'src/plugins/three/snd.Listener.js',
              'src/plugins/three/snd.SoundEnvironment.js',
              'src/plugins/three/snd.SoundNode.js',
              'src/plugins/three/snd.BufferSoundNode.js',
              'src/plugins/three/snd.MediaElementAudioNode.js',
              'src/plugins/three/snd.three.js',
              'src/plugins/three/snd.three.util.js'
          ]
        }
      }
    },
    uglify: {
      options: {
        banner: '/* snd.js - The Sound Library for JavaScript with WebAudioAPI - v.0.85 */' + '\n' +
                '/**' + '\n' +
                ' * snd.js' + '\n' +
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
                ' **/'
      },
      dist: {
        files: {
          'dist/snd.min.js' : ['dist/snd.js'],
          'dist/plugins/snd.mml.min.js' : ['dist/plugins/snd.mml.js'],
          'dist/plugins/snd.three.min.js' : ['dist/plugins/snd.three.js']
        }
      }
    },
    jsdoc: {
      options: {
        destination: 'doc',
        configure: 'docConfig.json'
      },
      src: ['dist/snd.js', 'README.md']
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
