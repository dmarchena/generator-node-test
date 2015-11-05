'use strict';

var path = require('path');
var assert = require('yeoman-generator').assert;
var helpers = require('yeoman-generator').test;

describe('node-test:karma', function () {

  function runGeneratorWithOptions(done, options){
    options = options || {};
    options.skipInstall = true;

    helpers.run(path.join(__dirname, '../generators/karma'))
      .withOptions(options)
      .on('end', done);
  }

  before(function (done) {
    runGeneratorWithOptions(done);
  });

  it('creates files', function () {
    assert.file([
      'karma.conf.js',
      'package.json'
    ]);
  });

  it('fills the files that should be load in the browser', function () {
    assert.fileContent('karma.conf.js', /files:\s*\[[^\]]*'src\/\*\*\/\*\.js'[^\]]*\]/);
    assert.fileContent('karma.conf.js', /files:\s*\[[^\]]*'test\/\*\*\/\*\.spec\.js'[^\]]*\]/);
  });

  it('installs the Karma launcher for PhantomJS', function () {
    // Launcher
    assert.fileContent('package.json', 'karma-phantomjs-launcher');
    assert.fileContent('karma.conf.js', /plugins:\s*\[[^\]]*'karma-phantomjs-launcher'[^\]]*\]/);
    // Phantom JS polyfill
    assert.fileContent('karma.conf.js', /files:\s*\[[^\]]*'\.\/node_modules\/phantomjs-polyfill\/bind-polyfill\.js'[^\]]*\]/);
    // Phantom JS
    assert.fileContent('package.json', /"phantomjs"/);
    assert.fileContent('package.json', /"phantomjs-polyfill"/);
  });

  describe('installs Browserify', function () {
    before(function (done) {
      runGeneratorWithOptions(done);
    });

    it('installs Browserify', function () {
      assert.fileContent('package.json', /"browserify"/);
      assert.fileContent('package.json', 'karma-browserify');
      assert.fileContent('karma.conf.js', /plugins:\s*\[[^\]]*'karma-browserify'[^\]]*\]/);
      assert.fileContent('karma.conf.js', /frameworks:\s*\[[^\]]*'browserify'[^\]]*\]/);
      assert.fileContent('karma.conf.js', /preprocessors:\s*\{[^\}]*'src\/\*\*\/\*\.js'[^\}]*\}/);
      assert.fileContent('karma.conf.js', /preprocessors:\s*\{[^\}]*'test\/\*\*\/\*\.spec\.js'[^\}]*\}/);
    });

    describe('--es2015', function () {
      before(function (done) {
        runGeneratorWithOptions(done, {
          es2015: true
        });
      });
      it('adds Babelify', function () {
        assert.fileContent('package.json', 'babelify');
        assert.fileContent('karma.conf.js', /transform:\s*\[[^\]]*'babelify'[^\]]*\]/);
      });
    });

    describe('--react', function () {
      before(function (done) {
        runGeneratorWithOptions(done, {
          react: true
        });
      });
      it('adds Babelify', function () {
        assert.fileContent('package.json', 'babelify');
        assert.fileContent('karma.conf.js', /transform:\s*\[[^\]]*'babelify'[^\]]*\]/);
      });
      it('fills the files that should be load in the browser', function () {
        assert.fileContent('karma.conf.js', /preprocessors:\s*\{[^\}]*'src\/\*\*\/\*\.js\*'[^\}]*\}/);
      });
    });
  });

  describe('--travisci', function () {
    before(function (done) {
      runGeneratorWithOptions(done, {
        travisci: true,
        browser: 'Firefox'
      });
    });
    it('installs the Karma launcher for Firefox', function () {
      assert.fileContent('package.json', 'karma-firefox-launcher');
      assert.fileContent('karma.conf.js', /plugins:\s*\[[^\]]*'karma-firefox-launcher'[^\]]*\]/);
    });
  });

  describe('if testFramework is Jasmine', function () {
    before(function (done) {
      runGeneratorWithOptions(done, {
        testFramework: 'jasmine'
      });
    });
    it('installs the Karma adapter', function () {
      assert.fileContent('package.json', 'karma-jasmine');
      assert.fileContent('package.json', 'jasmine-core');
      assert.fileContent('karma.conf.js', /frameworks:\s*\[[^\]]*'jasmine'[^\]]*\]/);
      assert.fileContent('karma.conf.js', /plugins:\s*\[[^\]]*'karma-jasmine'[^\]]*\]/);
    });
  });

  describe('if testFramework is Mocha', function () {
    before(function (done) {
      runGeneratorWithOptions(done, {
        testFramework: 'mocha'
      });
    });
    it('installs the Mocha adapter', function () {
      assert.fileContent('package.json', 'karma-mocha');
      assert.fileContent('package.json', '"mocha"');
      assert.fileContent('karma.conf.js', /frameworks:\s*\[[^\]]*'mocha'[^\]]*\]/);
      assert.fileContent('karma.conf.js', /plugins:\s*\[[^\]]*'karma-mocha'[^\]]*\]/);
    });
  });

});
