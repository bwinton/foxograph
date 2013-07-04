module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    version: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      build: {
        src: 'src/<%= pkg.name %>.js',
        dest: 'build/<%= pkg.name %>.min.js'
      }
    },
    jshint: {
      files: ['public/js/**/*.js'],
      options: {
        ignores: [
          'public/js/lib/angular/*.js',
          'public/js/lib/bugzillaMockup.js',
          'public/js/lib/jquery.js',
          'public/js/lib/underscore.js'
        ],
        curly: true,
        eqeqeq: true,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        sub: true,
        undef: true,
        boss: true,
        eqnull: true,
        browser: true,
        globals: {
          require: true,
          define: true,
          requirejs: true,
          describe: true,
          expect: true,
          it: true,
        }
      },
    }
  });

  grunt.registerTask('version', 'Write the version.', function() {
    grunt.log.write(grunt.config('pkg.name') + ' ' + grunt.config('pkg.version') + '\n').ok();
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');

  // Default task(s).
  grunt.registerTask('default', ['version']);
};