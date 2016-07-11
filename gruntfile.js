module.exports = function(grunt) {
  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    
    compass:{
      dist: {                   // Target
        options: {              // Target options
          sassDir: './app/sass',
          cssDir: './app/build'
        }
      }
    },

    bower_concat: {
      all: {
        dest: './app/build/_lib.js',
        cssDest: './app/build/_lib.css',
        dependencies: {
        },
        bowerOptions: {
          relative: false
        },
        exclude: [
          'bootstrap'
        ],
        mainFiles: {
          
        },
      }
    },

    cssmin: {
      options: {
        sourceMap: true,
      },
      app: {
        src: './app/build/*.css',
        dest: './app/css/style.min.css'
      }
    },

    uglify: {
      options: {
        mangle: false,
        sourceMap: true,
      },
      app: {
        files: {
          'app/js/main.min.js': ['build/_lib.js', 'app/js/*.js', '!app/js/*.min.js']
        }
      },
    },
    
    watch: {
      css: {
        files: 'app/sass/**/*.scss',
        tasks: ['theme']
      },

      scripts: {
        files: ['app/js/**/*.js', '!app/js/**/*.min.js'],
        tasks: ['uglify']
      }
    }
  });

  // Load the Grunt plugins.
  require('load-grunt-tasks')(grunt);
  require('grunt-contrib-compass')(grunt);


  // Register the default tasks.
  grunt.registerTask('default', ['compass', 'bower_concat', 'cssmin', 'uglify']);
  grunt.registerTask('theme', ['compass', 'cssmin']);
};