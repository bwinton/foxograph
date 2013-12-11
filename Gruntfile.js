/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

/*jshint forin:true, noarg:true, noempty:true, eqeqeq:true, bitwise:true,
  strict:true, undef:true, node:true, indent:2, maxerr:50, devel:true,
  boss:true, white:true, globalstrict:true, nomen:false, newcap:true*/


'use strict';

var Tail = require('tail').Tail;

module.exports = function (grunt) {

  var settings = grunt.file.readJSON('grunt-settings.json');
  process.env.FIREFOX_BIN = settings.firefox_bin;

  var ssh_settings = (function () {
    var obj = {
      path: settings.path,
      srcBasePath: './website/',
      host: settings.host,
      createDirectories: true,
      username: settings.username
    };
    /* handle privateKey ssh or password based ssh */
    if (settings.privateKey) {
      obj.privateKey = grunt.file.read(settings.privateKey);
      obj.passphrase = settings.passphrase;
    }
    else {
      obj.password = settings.password;
    }
    return obj;
  })();

  var lintable_files = [
    'public/js/**/*.js',
    '!public/js/lib/**/*.js',
    'public/js/lib/angular-tools/**/*.js'
  ];

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
      files: lintable_files,
      options: {
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
    },

    express: {
      options: {
        // Override defaults here
      },
      dev: {
        options: {
          script: 'app.js'
        }
      },
      prod: {
        options: {
          script: 'app.js',
          node_env: 'production'
        }
      }
    },
    karma: {
      unit: {
        options: {
          frameworks: ['jasmine'],
          files: [
            'public/js/lib/jquery/jquery.js',
            'public/js/lib/bootstrap/dist/js/bootstrap.js',
            'public/js/lib/lodash/dist/lodash.js',
            'public/js/lib/angular/angular.js',
            'public/js/lib/angular-mocks/angular-mocks.js',
            'public/js/lib/restangular/dist/restangular.js',
            'public/js/lib/angular-ui-router/release/angular-ui-router.js',
            'public/js/lib/angular-tools/*.js',
            'public/js/*.js',
            'public/js/directives/*.js',
            'public/js/controllers/*.js',
            'test/frontend/*.js'
          ],
          singleRun: true,
          browsers: ['Chrome', 'Firefox']
        }
      }
    },
    watch: {
      scripts: {
        files: lintable_files,
        tasks: ['jshint'],
        options: {
          interrupt: true,
        },
      },
      express: {
        files:  lintable_files.concat('public/js/lib/bugzillaMockup.js').concat('views/**'),
        tasks:  [ 'copy:debug', 'express:dev' ],
        options: {
          nospawn: true //Without this option specified express won't be reloaded
        }
      }
    },
    copy: {
      debug: {
        files: [
          {expand: true, cwd: 'public/', src: ['**'], dest: 'www/'},
          {expand: true, cwd: 'views/partials/', src: ['**'], dest: 'www/'},
        ]
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-express-server');
  grunt.loadNpmTasks('grunt-karma');

  grunt.registerTask('version', 'Write the version.', function () {
    grunt.log.write(grunt.config('pkg.name') + ' ' + grunt.config('pkg.version') + '\n').ok();
  });

  grunt.registerTask('server', [ 'express:dev', 'watch' ]);

  grunt.registerTask('debug', 'Run a debug server, and open the site in a tab.', function () {
    process.env.DEBUG = 'foxograph:*';
    var done = this.async();
    grunt.event.once('mongod.started', function () {
      if (grunt.file.exists('www')) {
        grunt.file.delete('www');
      }
      grunt.task.run('copy:debug');
      grunt.task.run('server');
      grunt.event.emit('express.started');
    });
    grunt.event.once('express.started', function () {
      // grunt.util.spawn({cmd: 'open', args: ['http://127.0.0.1:3000']}, function (err, result, code) {
      //   console.log("Done open " + err + ", " + result + ", " + code);
      done();
      // });
    });
    new Tail('mongo.log').on('line', function (data) {
      data = data.toString().trim();
      if (data.match(/\[initandlisten\] waiting for connections on port \d+$/)) {
        grunt.event.emit('mongod.started');
      }
    });
    var mongod = grunt.util.spawn({cmd: 'mongod', args: ['--logpath', 'mongo.log']}, function (err, result, code) {
      console.log('Done mongod ' + err + ', ' + result + ', ' + code);
      if (err && code === 100) {
        console.log('Mongo already started.');
        grunt.event.emit('mongod.started');
      } else if (err) {
        throw err;
      }
    });
  });

  // Default task(s).
  grunt.registerTask('default', ['version']);
};
