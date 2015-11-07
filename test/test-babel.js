'use strict';

var path = require('path');
var assert = require('yeoman-generator').assert;
var helpers = require('yeoman-generator').test;

describe('node-test:babel', function () {

  function runGeneratorWithOptions(done, options){
    options = options || {};
    options.skipInstall = true;

    helpers.run(path.join(__dirname, '../generators/babel'))
      .withOptions(options)
      .on('end', done);
  }

  before(function (done) {
    runGeneratorWithOptions(done);
  });

  it('creates files', function () {
    assert.file([
      '.babelrc',
      'package.json',
    ]);
  });

  it('installs dependencies and preset', function () {
    assert.fileContent('package.json', '"babelify"');
    assert.fileContent('package.json', '"babel-preset-es2015"');
  });

  describe('--browserify', function () {
    before(function (done) {
      runGeneratorWithOptions(done, {
        browserify: true,
      });
    });
    it('installs babelify', function () {
      assert.fileContent('package.json', '"babelify"');
    });
  });

  describe('--no-browserify', function () {
    before(function (done) {
      runGeneratorWithOptions(done, {
        browserify: false,
      });
    });
    it('installs babelify', function () {
      assert.fileContent('package.json', '"babel"');
    });
  });

  describe('--react', function () {
    before(function (done) {
      runGeneratorWithOptions(done, {
        react: true
      });
    });

    it('installs react  preset', function () {
      assert.fileContent('package.json', '"babel-preset-react"');
      assert.fileContent('.babelrc', /presets:\s*\[[^\]]*'react'[^\]]*\]/);
    });
  });

});
