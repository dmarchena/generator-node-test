'use strict';

var path = require('path');
var assert = require('yeoman-generator').assert;
var helpers = require('yeoman-generator').test;

describe('node-test:github', function () {

  before(function (done) {
    helpers.run(path.join(__dirname, '../generators/github'))
      .on('end', done);
  });

  it('creates .gitignore file', function () {
    assert.file('.gitignore');
  });

});
