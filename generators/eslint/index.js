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

  initializing: {
    /**
     * Retrieve devDependencies according to sub-generator options
     */
    setDevDependencies: function () {
      this.npm = {
        devDependencies: ['eslint']
      };

      if (this.options.config === 'airbnb') {
        this.npm.devDependencies.push('eslint-config-airbnb');
      }
      if (this.options.react) {
        this.npm.devDependencies.push('babel-eslint', 'eslint-plugin-react');
      } else if (this.options.es2015) {
        this.npm.devDependencies.push('babel-eslint');
      }
    }
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

    packageJson: function () {
      var pkg = this.fs.readJSON(this.destinationPath('package.json'), {});

      if (this.options.react) {
        extend(pkg, {
          scripts: {
            "lint": "eslint --ext js --ext jsx src test",
          }
        });
      } else {
        extend(pkg, {
          scripts: {
            "lint": "eslint --ext js src test",
          }
        });
      }

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

  install: function () {
    this.npmInstall(this.npm.devDependencies, { saveDev: true });
  }
});
