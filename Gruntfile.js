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
        banner: '/* <%=pkg.name%> - The Sound Library for JavaScript with WebAudioAPI - v.<%=pkg.version%> */'
      },
      basic_and_extras: {
        files: {
          'dist/snd.js': [
              'src/COPYRIGHT',
              'src/snd.base.js',
              'src/snd.vec3.js',
              'src/snd.Source.js',
              'src/snd.BufferSource.js',
              'src/snd.OscillatorSource.js',
              'src/snd.MediaElementAudioSource.js',
              'src/snd.MediaStreamAudioSource.js',
              'src/snd.AudioUnit.js',
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
        banner: '/* <%=pkg.name%> - The Sound Library for JavaScript with WebAudioAPI - v.<%=pkg.version%> */'
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
