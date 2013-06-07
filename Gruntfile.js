module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    clean: {
        bin: ["bin"],
        cleanup: ["src/**/*.d.ts", "src/**/*.js.map"]
    },
    copy: {
        main: {
            files: [
                {expand: false, src: ['package.json'], dest: 'bin/package.json'},
                {expand: false, src: ['config.json'], dest: 'bin/config.json'},
                {expand: true, cwd: 'src/', src: ['**/*.js'], dest: 'bin/'},
                {expand: true, cwd: 'src/', src: ['**/*.ejs'], dest: 'bin/'}
            ]
        },
        release: {
            files: [
                {expand: true, src: ['src/config.json.copy'], dest: 'bin/config.json'}
            ]
        }
    },
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %>. All rights reserved. */\n'
      },
      res: {
          files: [
            { 'bin/res/master.min.js': ['bin/res/master.js'] }
          ]
      }
    },
    typescript: {
      res: {
        files: [
            { dest: 'bin/res/master.js', src: ['src/res/*.ts'] }
        ],
        options: {
            module: 'amd', //or commonjs
            target: 'es5', //or es3
            base_path: 'src/res',
            sourcemap: false,
            fullSourceMap: false,
            declaration: false
        }
      }
    },
    cssmin: {
      res: {
        files: {
          'bin/res/master.min.css': ['bin/res/master.css']
        }
      }
    },
    sass: {
        res: {
          options: {
            style: 'expanded'
          },
          files: {
            'bin/res/master.css': ['src/res/*.scss']
          }
        }
    },
    watch: {
        files: 'src/res/**/*.ts',
        tasks: ['typescript:res']
    },
    jshint: {
        files: ['Gruntfile.js', 'src/**/*.js'],
        options: {
            curly: true,
            eqeqeq: false,
            eqnull: true,
            browser: true,
            globals: {
                jQuery: true
            }
        }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-typescript');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-jshint');

  // tasks
  grunt.registerTask('watch', ['watch']);
  grunt.registerTask('default', ['jshint', 'clean:bin', 'copy:main', 'typescript:res', 'uglify:res', 'sass:res', 'cssmin:res', 'clean:cleanup']);
  grunt.registerTask('release', ['jshint', 'clean:bin', 'copy:main', 'copy:release', 'typescript:res', 'uglify:res', 'sass:res', 'cssmin:res', 'clean:cleanup']);
  grunt.registerTask('build', ['jshint', 'copy:main']);

};
