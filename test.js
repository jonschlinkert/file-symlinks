'use strict';

/* deps: mocha */
var fs = require('fs');
var path = require('path');
var through = require('through2');
var assert = require('assert');
var symlinks = require('./');

function toStream(fp) {
  var stream = through.obj();
  stream.write({path: fp});
  stream.end();
  return stream;
}

describe('add a `stat` property to the given object', function (done) {
  beforeEach(function (done) {
    fs.symlink('README.md', 'fake.md', function (err) {
      if (err) return done(err);
      done();
    });
  });

  afterEach(function (done) {
    fs.unlink('fake.md', function (err) {
      if (err) return done(err);
      done();
    });
  });

  it('should resolve the realpath of a file:', function (done) {
    symlinks.resolve({path: 'fake.md'}, function (err, file) {
      if (err) return done(err);

      assert.equal(typeof file.stat, 'object');
      assert.equal(path.basename(file.path), 'README.md');
      done();
    });
  });

  it('should not resolve the realpath when `opts.realpath` is false:', function (done) {
    symlinks.resolve({path: 'fake.md'}, {realpath: false}, function (err, file) {
      if (err) return done(err);

      assert.equal(typeof file.stat, 'object');
      assert.equal(path.basename(file.path), 'fake.md');
      done();
    });
  });

  it('should work as a plugin:', function (done) {
    toStream('fake.md')
      .pipe(symlinks())
      .on('data', function (file) {
        assert.equal(typeof file.stat, 'object');
        assert.equal(path.basename(file.path), 'README.md');
      })
      .on('error', console.error)
      .on('end', function () {
        done();
      });
  });
});
