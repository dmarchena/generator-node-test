'use strict';
var generators = require('yeoman-generator');
var extend = require('deep-extend');

module.exports = generators.Base.extend({
  constructor: function () {
    generators.Base.apply(this, arguments);

    this.option('coveralls', {
      required: false,
      defaults: false,
      desc: 'Use React syntax'
    });

    this.option('testRunner', {
      required: true,
      defaults: 'gulp',
      desc: 'Test runner'
    });
  },

  writing: {
    travisyml: function () {
      this.fs.copyTpl(
        this.templatePath('travis.yml'),
        this.destinationPath('.travis.yml'),
        {
          coveralls: this.options.coveralls,
          testRunner: this.options.testRunner,
        }
      );
    },

    package: function () {
      var pkg = this.fs.readJSON(this.destinationPath('package.json'), {});

      if (this.options.testRunner === 'karma') {
        extend(pkg, {
          devDependencies: {
            scripts: {
              "test-travis": "karma start --browsers Firefox --single-run",
            }
          }
        });
      }
      else if (this.options.testRunner === 'gulp') {
        extend(pkg, {
          devDependencies: {
            scripts: {
              "test-travis": "gulp test-travis",
            }
          }
        });
      }

      this.fs.writeJSON(this.destinationPath('package.json'), pkg);
    }
  }
});
