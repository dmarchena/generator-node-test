'use strict';
var chalk = require('chalk');
var path = require('path');
var yeoman = require('yeoman-generator');
var yosay = require('yosay');
var _ = require('underscore.string');

var generatorName = 'Testing'

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
      default: 'A project that can'
    }, {
      type: 'list',
      name: 'testRunner',
      message: 'Which test runner do you want to use?',
      default: 'gulp',
      choices: ['gulp', 'karma']
    }, {
      type: 'list',
      name: 'testFramework',
      message: 'Which test framework do you want to use?',
      default: 'mocha',
      choices: ['jasmine', 'mocha']
    }, {
      type: 'list',
      name: 'assertionLibrary',
      message: 'Do you want to use any assertion library?',
      default: 'should',
      choices: [
        //'chai',
        'should',
        'none'
      ],
      when: function(answers){
        return answers.testRunner === 'mocha';
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
      name: 'coverage',
      message: 'Choose your coverage tools:',
      choices: [
        // new inquirer.Separator("Local:"),
        { name: 'console', checked: true },
        { name: 'html' },
        // new inquirer.Separator("Web services:"),
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
      this.props = answers;
      this.appname = answers.appname;
      done();
    }.bind(this));
  },
  default: function () {
    this.composeWith('testing:editorconfig', {}, {
      local: require.resolve('../editorconfig')
    });
    this.composeWith('testing:eslint', {
      options: {
        testFramework: this.props.testFramework,
        config: 'airbnb'
      }
    }, {
      local: require.resolve('../eslint')
    });
  },
  writing: {
    app: function () {
      console.log('Writing app');
      /*this.fs.copy(
        this.templatePath('_package.json'),
        this.destinationPath('package.json')
      );
      this.fs.copy(
        this.templatePath('_bower.json'),
        this.destinationPath('bower.json')
      );*/
    },

    projectfiles: function () {
      console.log('Writing projectfiles');
      /*
      this.fs.copy(
        this.templatePath('editorconfig'),
        this.destinationPath('.editorconfig')
      );
      this.fs.copy(
        this.templatePath('jshintrc'),
        this.destinationPath('.jshintrc')
      );*/
    }
  },

  install: function () {
    //this.installDependencies();
    /*if (this.props.testRunner === 'karma') {
      this.npmInstall(['karma'], { 'saveDev': true });
      if (this.props.testFramework === 'jasmine') {
        this.npmInstall(['jasmine-core'], { 'saveDev': true });
        this.npmInstall(['karma-jasmine'], { 'saveDev': true });
      } else if (this.props.testFramework === 'mocha') {
        this.npmInstall(['mocha'], { 'saveDev': true });
        this.npmInstall(['karma-mocha'], { 'saveDev': true });
      }
    }
    else if (this.props.testRunner === 'gulp') {
      if (this.props.testFramework === 'jasmine') {
        // this.npmInstall(['jasmine-core'], { 'saveDev': true });
        this.npmInstall(['gulp-jasmine'], { 'saveDev': true });
      } else if (this.props.testFramework === 'mocha') {
        //this.npmInstall(['mocha'], { 'saveDev': true });
        this.npmInstall(['gulp-mocha'], { 'saveDev': true });
      }
    }*/
  }
});
