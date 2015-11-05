'use strict';
var generators = require('yeoman-generator');
var extend = require('deep-extend');

module.exports = generators.Base.extend({
  constructor: function () {
    generators.Base.apply(this, arguments);

    this.option('config', {
      required: false,
      defaults: 'eslint:recommended',
      desc: 'Allow shareable config'
    });

    this.option('react', {
      required: false,
      defaults: false,
      desc: 'Allow React syntax'
    });

    this.option('es2015', {
      required: false,
      defaults: false,
      desc: 'Allow ES2015 syntax'
    });
  },

  writing: {
    eslint: function () {
      var eslintrc;

      // Main .eslintrc
      if (this.options.config === 'eslint:recommended') {
        eslintrc = {
          extends: this.options.config,
          env: {
            node: true
          }
        };
        if (this.options.react) {
          extend(eslintrc, {
            plugins: [
              'react'
            ],
            ecmaFeatures: {
              jsx: true
            }
          });
        }
        if (this.options.es2015) {
          extend(eslintrc, {
            ecmaFeatures: {
              modules: true
            },
            env: {
              es6: true
            }
          });
        }
      }
      else if (this.options.config === 'airbnb') {
        var config = 'airbnb/legacy';

        if (this.options.react) {
          config = 'airbnb';
        } else if (this.options.es2015) {
          config = 'airbnb/base';
        }

        eslintrc = {
          extends: config
        }

        /*// Disable
        extend(eslintrc, {
          rules: {
            comma-dangle: 0,
            id-length: 0
          }
        });*/
      }

      this.fs.writeJSON(this.destinationPath('.eslintrc'), eslintrc);
    },

    eslint_test: function () {
      var eslintrc_test = null;
      // test/.eslintrc
      if (this.options.testFramework === 'mocha') {
        eslintrc_test = {
          env: {
            mocha: true
          }
        };
      } else if (this.options.testFramework === 'jasmine') {
        eslintrc_test = {
          env: {
            jasmine: true
          }
        };
      }
      if (eslintrc_test !== null) {
        this.fs.writeJSON(this.destinationPath('./test/.eslintrc'), eslintrc_test);
      }
    },

    eslint_ignore: function () {
      this.fs.copy(this.templatePath('eslintignore'), this.destinationPath('.eslintignore'));
    },

    package: function () {
      var pkg = this.fs.readJSON(this.destinationPath('package.json'), {});

      extend(pkg, {
        peerDependencies: {
          'eslint': '*'
        }
      });

      if (this.options.config === 'airbnb') {
        extend(pkg, {
          devDependencies: {
            'eslint-config-airbnb': '*'
          }
        });
      }
      if (this.options.react) {
        extend(pkg, {
          devDependencies: {
            'babel-eslint': '*',
            'eslint-plugin-react': '*'
          }
        });
      } else if (this.options.es2015) {
        extend(pkg, {
          devDependencies: {
            'babel-eslint': '*'
          }
        });
      }

      this.fs.writeJSON(this.destinationPath('package.json'), pkg);
    }
  }
});
