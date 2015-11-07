'use strict';

var path = require('path');
var assert = require('yeoman-generator').assert;
var helpers = require('yeoman-generator').test;

describe('node-test:eslint', function () {

  function runGeneratorWithOptions(done, options){
    options = options || {};
    options.skipInstall = true;

    helpers.run(path.join(__dirname, '../generators/eslint'))
      .withOptions(options)
      .on('end', done);
  }

  before(function (done) {
    runGeneratorWithOptions(done);
  });

  it('creates files', function () {
    assert.file([
      '.eslintrc',
      '.eslintignore',
      'package.json'
    ]);
    assert.noFile('test/.eslintrc');
  });

  it('fills .eslintrc with recommended rules and env', function () {
    assert.fileContent('.eslintrc', /"extends": "eslint:recommended"/);
    assert.fileContent('.eslintrc', /"env": {\s*"node": true\s*}/);
  });

  it('includes eslint dependencies', function () {
    assert.fileContent('package.json', '"eslint"');
  });

  it('includes "lint" script in package.json', function () {
    assert.fileContent('package.json', /"scripts":\s*\{[^\}]*"lint":[^\}]*\}/);
  });

  describe('--es2015', function () {
    before(function (done) {
      runGeneratorWithOptions(done, {
        es2015: true
      });
    });
    it('fills ES2015 related options', function () {
      assert.fileContent('.eslintrc', /"es6": true/);
      assert.fileContent('.eslintrc', /"ecmaFeatures": {\s*"modules": true\s*}/);
    });
    it('includes babel dependencies', function () {
      assert.fileContent('package.json', '"babel-eslint"');
    });
  });

  describe('--react', function () {
    before(function (done) {
      runGeneratorWithOptions(done, {
        react: true
      });
    });
    it('fills react related options', function () {
      assert.fileContent('.eslintrc', /"plugins": \[\s*"react"\s*\]/);
      assert.fileContent('.eslintrc', /"ecmaFeatures": {\s*"jsx": true\s*}/);
    });
    it('includes react dependencies', function () {
      assert.fileContent('package.json', '"eslint-plugin-react"');
    });
    it('includes jsx in "lint" script', function () {
      assert.fileContent('package.json', /"scripts":\s*\{[^\}]*"lint":[^,\}]*jsx[^\}]*\}/);
    });
  });

  describe('if shareable config is Airbnb\'s one', function () {
    before(function (done) {
      runGeneratorWithOptions(done, {
        config: 'airbnb'
      });
    });
    it('includes Airbnb\'s dependencies', function () {
      assert.fileContent('package.json', '"eslint-config-airbnb"');
    });
    it('fills extends with Airbnb\'s legacy rules', function () {
      assert.noFileContent('.eslintrc', /"extends": "eslint:recommended"/);
      assert.fileContent('.eslintrc', /"extends": "airbnb\/legacy"/);
    });

    describe('--react', function () {
      before(function (done) {
        runGeneratorWithOptions(done, {
          config: 'airbnb',
          react: true
        });
      });
      it('fills extends with all Airbnb\'s rules', function () {
        assert.fileContent('.eslintrc', /"extends": "airbnb"/);
      });
    });

    describe('--es2015', function () {
      before(function (done) {
        runGeneratorWithOptions(done, {
          config: 'airbnb',
          es2015: true
        });
      });
      it('fills extends Airbnb\'s base rules', function () {
        assert.fileContent('.eslintrc', /"extends": "airbnb\/base"/);
      });
    });
  });

  describe('if testFramework is jasmine', function () {
    before(function (done) {
      runGeneratorWithOptions(done, {
        testFramework: 'jasmine'
      });
    });
    it('fills jasmine env', function () {
      assert.file('test/.eslintrc');
      assert.fileContent('test/.eslintrc', /"env": {\s*"jasmine": true\s*}/);
    });
  });

  describe('if testFramework is mocha', function () {
    before(function (done) {
      runGeneratorWithOptions(done, {
        testFramework: 'mocha'
      });
    });
    it('fills mocha env', function () {
      assert.file('test/.eslintrc');
      assert.fileContent('test/.eslintrc', /"env": {\s*"mocha": true\s*}/);
    });
  });

});
