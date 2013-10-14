module.exports = function(grunt) {

  var settings = grunt.file.readJSON('grunt-settings.json');

  var ssh_settings = (function(){
    var obj = {
      path: settings.path,
      srcBasePath: "./website/",
      host: settings.host,
      createDirectories: true,
      username: settings.username
    };
    /* handle privateKey ssh or password based ssh */
    if(settings.privateKey){
      obj.privateKey = grunt.file.read(settings.privateKey);
      obj.passphrase = settings.passphrase;
    }
    else{
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
        ]
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-express-server');

  grunt.registerTask('version', 'Write the version.', function() {
    grunt.log.write(grunt.config('pkg.name') + ' ' + grunt.config('pkg.version') + '\n').ok();
  });

  grunt.registerTask('server', [ 'express:dev', 'watch' ]);

  grunt.registerTask('debug', 'Run a debug server, and open the site in a tab.', function(){
    var done = this.async();
    grunt.event.once('mongod.started', function (){
      if (grunt.file.exists('www')) {
        grunt.file.delete('www');
      }
      grunt.task.run('copy:debug');
      grunt.task.run('server');
      grunt.event.emit('express.started');
    });
    grunt.event.once('express.started', function (){
      // grunt.util.spawn({cmd: 'open', args: ['http://127.0.0.1:3000']}, function (err, result, code) {
      //   console.log("Done open " + err + ", " + result + ", " + code);
      done();
      // });
    });
    var mongod = grunt.util.spawn({cmd: 'mongod'}, function (err, result, code) {
      console.log("Done mongod " + err + ", " + result + ", " + code);
      if (err && code === 100) {
        console.log("Mongo already started.");
        grunt.event.emit('mongod.started');
      } else if (err) {
        throw err;
      }
    });
    mongod.stdout.on('data', function (data) {
      data = data.toString().trim();
      if (data.match(/\[initandlisten\] waiting for connections on port \d+$/)) {
        grunt.event.emit('mongod.started');
      }
    });
  });

  // Default task(s).
  grunt.registerTask('default', ['version']);
};
