'use strict';

var path = require('path');
var assert = require('yeoman-generator').assert;
var helpers = require('yeoman-generator').test;

describe('node-test:editorconfig', function () {

  before(function (done) {
    helpers.run(path.join(__dirname, '../generators/editorconfig'))
      .on('end', done);
  });

  it('creates file', function () {
    assert.file('.editorconfig');
  });

});
