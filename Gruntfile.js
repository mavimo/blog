module.exports = function (grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: {
      options: {
        stripBanners: true,
        separator: ';',
        banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      dist: {
        src: [
          'source/libraries/prism/prism.js',
          'source/libraries/prism/components/prism-bash.min.js',
          'source/libraries/prism/components/prism-css.min.js',
          'source/libraries/prism/components/prism-css-extras.min.js',
          'source/libraries/prism/components/prism-gherkin.min.js',
          'source/libraries/prism/components/prism-http.min.js',
          'source/libraries/prism/components/prism-javascript.min.js',
          'source/libraries/prism/components/prism-markup.min.js',
          'source/libraries/prism/components/prism-php.js',
          'source/libraries/prism/components/prism-php-extras.min.js',
          'source/libraries/prism-monokai-php/dist/prism-monokai-php.min.js',
          'source/libraries/prism/components/prism-python.min.js',
          'source/libraries/prism/components/prism-ruby.min.js',
          'source/libraries/prism/components/prism-scss.min.js',
          'source/libraries/prism/components/prism-core.min.js',
          'source/libraries/prism/plugins/line-numbers/prism-line-numbers.min.js',
          'source/js/jquery.sharedcount.js',
          'source/js/init.js'
        ],
        dest: 'source/js/mavimo-blog.js'
      }
    },
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      build: {
        src: 'source/js/mavimo-blog.js',
        dest: 'source/js/mavimo-blog.min.js'
      }
    },
    jshint: {
      files: [
        'Gruntfile.js',
        'source/js/init.js',
        'source/js/jquery.sharedcount.js'
      ],
      options: {
        globals: {
          jQuery: true
        },
        regexp: true
      }
    }
  });

  // Load the plugins
  require('load-grunt-tasks')(grunt);

  // Default task(s).
  grunt.registerTask('default', ['jshint', 'concat', 'uglify']);
};
