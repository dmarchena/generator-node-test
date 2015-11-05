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

    package: function () {
      var pkg = this.fs.readJSON(this.destinationPath('package.json'), {});

      extend(pkg, {
        devDependencies: {
          'babel-core': '*',
          'babel-preset-es2015': '*',
        }
      });

      if (this.options.react) {
        extend(pkg, {
          devDependencies: {
            'babel-preset-react': '*'
          }
        });
      }

      this.fs.writeJSON(this.destinationPath('package.json'), pkg);
    }
  }
});
