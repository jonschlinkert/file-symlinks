'use strict';

var path = require('path');
var fs = require('graceful-fs');
var through = require('through2');

module.exports = function symlinks(options) {
  return through.obj(function (file, enc, cb) {
    var stream = this;

    return resolve(file, options, function (err, res) {
      if (err) {
        stream.emit('error', new Error(err));
        return cb(err);
      }
      stream.push(res);
      cb();
    });
  });
};

/**
 * Recursively resolve a filepath to get the real path for a
 * symlink. Exposes the `stat` property on file objects as
 * a (wanted) side effect.
 */

function resolve(file, opts, cb) {
  if (typeof opts === 'function') {
    cb = opts;
    opts = {};
  }

  opts = opts || {};

  fs.lstat(file.path, function (err, stat) {
    if (err) return cb(err);

    file.stat = stat;

    if (opts.realpath === false || opts.symlinks === true) {
      return cb(null, file);
    }

    if (!stat.isSymbolicLink()) {
      return cb(null, file);
    }

    fs.realpath(file.path, function (err, fp) {
      if (err) return cb(err);

      file.base = path.dirname(fp);
      file.path = fp;

      // if we're here, that means we need to
      // recurse to get the real file path
      resolve(file, opts, cb);
    });
  });
}

function format(err) {
  if (err.code === 'ENOENT') {
    err.message = 'file-symlinks: "'
      + err.path + '" does not exist. '
      + err.message;
  }
  return err;
}

/**
 * Expose `resolve`
 */

module.exports.resolve = resolve;
