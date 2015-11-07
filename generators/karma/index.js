'use strict';
var generators = require('yeoman-generator');
var extend = require('deep-extend');

module.exports = generators.Base.extend({
  constructor: function () {
    generators.Base.apply(this, arguments);

    this.option('chai', {
      required: false,
      defaults: false,
      desc: 'Use chai assertion library'
    });

    this.option('coverage', {
      required: false,
      defaults: false,
      desc: 'Coverage'
    });

    this.option('covReporters', {
      required: false,
      defaults: ['console'],
      desc: 'Coverage reporters'
    });

    this.option('es2015', {
      required: false,
      defaults: false,
      desc: 'Use ES2015 syntax'
    });

    this.option('react', {
      required: false,
      defaults: false,
      desc: 'Use React syntax'
    });

    this.option('testFramework', {
      required: false,
      defaults: 'jasmine',
      desc: 'Coverage'
    });

    this.option('travisci', {
      required: false,
      defaults: false,
      desc: 'Tracis CI'
    });
  },

  initializing: {
    /**
     * Retrieve devDependencies according to sub-generator options
     */
    setDevDependencies: function () {
      this.npm = {
        devDependencies: [
          'browserify',
          'karma',
          'karma-browserify',
          'karma-phantomjs-launcher',
          'phantomjs',
          'phantomjs-polyfill'
        ]
      }

      if (this.options.coverage) {
        this.npm.devDependencies.push('browserify-istanbul', 'karma-coverage');
      }
      if (this.options.testFramework === 'jasmine') {
        this.npm.devDependencies.push('jasmine-core', 'karma-jasmine');
      } else if (this.options.testFramework === 'mocha') {
        this.npm.devDependencies.push('mocha', 'karma-mocha');
        if (this.options.chai) {
          this.npm.devDependencies.push('chai');
        }
      }
      if (this.options.travisci) {
        this.npm.devDependencies.push('karma-firefox-launcher');
      }
    }
  },

  writing: {
    karmaconf: function () {
      this.fs.copyTpl(
        this.templatePath('karma.conf.js'),
        this.destinationPath('karma.conf.js'),
        {
          chai: this.options.chai,
          coverage: this.options.coverage,
          covReporters: this.options.covReporters,
          es2015: this.options.es2015,
          react: this.options.react,
          testFramework: this.options.testFramework,
          travisci: this.options.travisci,
        }
      );
    },

    packageJson: function () {
      var pkg = this.fs.readJSON(this.destinationPath('package.json'), {});

      extend(pkg, {
        scripts: {
          "karma": "karma start ./karma.conf.js",
        }
      });

      this.fs.writeJSON(this.destinationPath('package.json'), pkg);
    },

    /**
     * Overwrite package.json in order to make dependencies visible for tests
     */
    testPackageJson: function () {
      var pkg = null;
      if (this.options.skipInstall){
        pkg = this.fs.readJSON(this.destinationPath('package.json'), {});
        for (var i in this.npm.devDependencies) {
          extend(pkg, JSON.parse('{ "devDependencies": { "' + this.npm.devDependencies[i] + '": "*" } }'));
        }
        this.fs.writeJSON(this.destinationPath('package.json'), pkg);
      }
    }
  },

  install: function(){
    this.npmInstall(this.npm.devDependencies, { saveDev: true });
  }
});
