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
    }
  });

  grunt.registerTask('version', 'Write the version.', function() {
    grunt.log.write(grunt.config('pkg.name') + ' ' + grunt.config('pkg.version') + '\n').ok();
  });

  // Default task(s).
  grunt.registerTask('default', ['version']);
};