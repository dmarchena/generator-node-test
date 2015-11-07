'use strict';
var chalk = require('chalk');
var path = require('path');
var yeoman = require('yeoman-generator');
var yosay = require('yosay');
var _ = require('underscore.string');

var generatorName = 'node-test'

module.exports = yeoman.generators.Base.extend({
  initializing: function () {
    this.argument('appname', { type: String, required: false });
    this.appname = this.appname || path.basename(process.cwd());
    this.appname = _.camelize(_.slugify(_.humanize(this.appname)));
  },

  prompting: function () {
    var done = this.async();

    // Have Yeoman greet the user.
    this.log(yosay(
      'Welcome to the ' + chalk.red(generatorName) + ' generator!'
    ));

    var prompts = [{
      type: 'input',
      name: 'appname',
      message: 'What\'s the name of your project?',
      default: this.appname
    }, {
      type: 'input',
      name: 'description',
      message: 'Please enter a short description of this project',
      default: 'Generated with generator-node-test!'
    }, {
      type: 'checkbox',
      name: 'syntax',
      message: 'Will you use any special syntax?',
      choices: [
        { name: 'es2015', checked: true },
        { name: 'react' }
      ]
    }, {
      type: 'list',
      name: 'testFramework',
      message: 'Which test framework do you want to use?',
      default: 'mocha',
      choices: ['jasmine', 'mocha']
    }, {
      type: 'confirm',
      name: 'chai',
      message: 'Do you want to use Chai as assertion library?',
      default: true,
      when: function(answers){
        return answers.testFramework === 'mocha';
      }
    }, {
      type: 'list',
      name: 'chaiInteface',
      message: 'Which assertion style do you want to use in your tests?',
      default: 'should',
      choices: [
        'assert',
        'expect',
        'should'
      ],
      when: function(answers){
        return answers.chai === true;
      }
    }, {
      type: 'confirm',
      name: 'travis',
      message: 'Do you want to sync your project with Travis CI?',
      default: true
    }, {
      type: 'confirm',
      name: 'coverage',
      message: 'Do you want to analize the code coverage of your tests?',
      default: true
    }, {
      type: 'checkbox',
      name: 'covReporters',
      message: 'Choose your coverage reporters:',
      choices: [
        { name: 'console', checked: true },
        { name: 'html' },
        { name: 'coveralls', checked: true }
      ],
      validate: function( answer ) {
        if ( answer.length < 1 ) {
          return "You must choose at least one.";
        }
        return true;
      },
      when: function(answers){
        return answers.coverage === true;
      }
    }];

    this.prompt(prompts, function (answers) {
      this.appname = answers.appname;
      this.answers = answers;
      this.answers.es2015 = answers.syntax.indexOf('es2015') > -1;
      this.answers.react = answers.syntax.indexOf('react') > -1;
      done();
    }.bind(this));
  },

  default: function () {
    // EditorConfig
    this.composeWith('testing:editorconfig', {}, {
      local: require.resolve('../editorconfig')
    });

    // Git
    this.composeWith('testing:git', {
      options: {
      }
    }, {
      local: require.resolve('../git')
    });

    // Karma
    this.composeWith('testing:karma', {
      options: this.answers
    }, {
      local: require.resolve('../karma')
    });

    // Babel
    if (this.answers.es2015 || this.answers.react) {
      this.composeWith('testing:babel', {
        options: {
          browserify: true,
          react: this.answers.react,
        }
      }, {
        local: require.resolve('../babel')
      });
    }

    // Travis
    if (this.answers.travis) {
      this.composeWith('testing:travis', {
        options: this.answers
      }, {
        local: require.resolve('../travis')
      });
    }

    // ESLint
    this.composeWith('testing:eslint', {
      options: {
        es2015: this.answers.es2015,
        react: this.answers.react,
        testFramework: this.answers.testFramework,
        config: 'airbnb',
      }
    }, {
      local: require.resolve('../eslint')
    });
  },

  writing: {
    packagejson: function () {
      this.fs.copyTpl(
        this.templatePath('package.json'),
        this.destinationPath('package.json'),
        {
          appname: this.answers.appname,
          description: this.answers.description,
        }
      );
    },
  }
});
