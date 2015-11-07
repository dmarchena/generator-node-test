'use strict';

var path = require('path');
var assert = require('yeoman-generator').assert;
var helpers = require('yeoman-generator').test;

describe('node-test:travis', function () {

  function runGeneratorWithOptions(done, options){
    options = options || {};
    options.skipInstall = true;

    helpers.run(path.join(__dirname, '../generators/travis'))
      .withOptions(options)
      .on('end', done);
  }

  before(function (done) {
    runGeneratorWithOptions(done, {
      testRunner: 'karma'
    });
  });

  it('creates files', function () {
    assert.file([
      '.travis.yml'
    ]);
  });

  describe('if Karma is the testRunner', function () {
    before(function (done) {
      runGeneratorWithOptions(done, {
        testRunner: 'karma'
      });
    });
    it('a travis script will be added in package.json', function () {
      assert.fileContent('package.json', /"scripts":\s*\{[^\}]*"test-travis":[^,\}]*karma[^\}]*\}/);
    });
  });

  describe('if Gulp is the testRunner', function () {
    before(function (done) {
      runGeneratorWithOptions(done, {
        testRunner: 'gulp'
      });
    });
    it('a travis script will be added in package.json', function () {
      assert.fileContent('package.json', /"scripts":\s*\{[^\}]*"test-travis":[^,\}]*gulp[^\}]*\}/);
    });
  });

  describe('--coveralls', function () {
    before(function (done) {
      runGeneratorWithOptions(done, {
        coveralls: true
      });
    });

    it('adds sending data to Coveralls after the script', function () {
      assert.fileContent('.travis.yml', '\/node_modules\/coveralls\/bin\/coveralls.js');
    });
  });

});
