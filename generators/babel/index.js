'use strict';
var generators = require('yeoman-generator');
var extend = require('deep-extend');

module.exports = generators.Base.extend({
  constructor: function () {
    generators.Base.apply(this, arguments);

    this.option('react', {
      required: false,
      defaults: false,
      desc: 'Use React syntax'
    });

    this.option('browserify', {
      required: false,
      defaults: true,
      desc: 'Use React syntax'
    });
  },

  initializing: {
    /**
     * Retrieve devDependencies according to sub-generator options
     */
    setDevDependencies: function () {
      this.npm = {
        devDependencies: []
      };
      if (this.options.browserify) {
        this.npm.devDependencies.push('babelify');
      } else {
        this.npm.devDependencies.push('babel');
      }
      this.npm.devDependencies.push('babel-preset-es2015');
      if (this.options.react) {
        this.npm.devDependencies.push('babel-preset-react');
      }
    }
  },

  writing: {
    babel: function () {
      this.fs.copyTpl(
        this.templatePath('babelrc'),
        this.destinationPath('.babelrc'),
        {
          react: this.options.react
        }
      );
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
