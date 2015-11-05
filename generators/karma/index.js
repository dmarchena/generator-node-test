'use strict';
var generators = require('yeoman-generator');
var extend = require('deep-extend');

module.exports = generators.Base.extend({
  constructor: function () {
    generators.Base.apply(this, arguments);

    this.option('coverage', {
      required: false,
      defaults: false,
      desc: 'Coverage'
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

  writing: {
    karmaconf: function () {
      this.fs.copyTpl(
        this.templatePath('karma.conf.js'),
        this.destinationPath('karma.conf.js'),
        {
          coverage: this.options.coverage,
          es2015: this.options.es2015,
          react: this.options.react,
          testFramework: this.options.testFramework,
          travisci: this.options.travisci,
        }
      );
    },

    package: function () {
      var pkg = this.fs.readJSON(this.destinationPath('package.json'), {});

      extend(pkg, {
        devDependencies: {
          'browserify': '*',
          'karma': '*',
          'karma-browserify': '*',
          'karma-phantomjs-launcher': '*',
          'phantomjs': '*',
          'phantomjs-polyfill': '*',
        }
      });

      if (this.options.es2015 || this.options.react) {
        extend(pkg, {
          devDependencies: {
            'karma-babelify': '*'
          }
        });
      }

      if (this.options.testFramework === 'jasmine') {
        extend(pkg, {
          devDependencies: {
            'karma-jasmine': '*',
            'jasmine-core': '*',
          }
        });
      } else if (this.options.testFramework === 'mocha') {
        extend(pkg, {
          devDependencies: {
            'karma-mocha': '*',
            'mocha': '*',
          }
        });
      }

      if (this.options.travisci) {
        extend(pkg, {
          devDependencies: {
            'karma-firefox-launcher': '*'
          }
        });
      }

      this.fs.writeJSON(this.destinationPath('package.json'), pkg);
    }
  }
});
