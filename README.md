# file-symlinks [![NPM version](https://badge.fury.io/js/file-symlinks.svg)](http://badge.fury.io/js/file-symlinks)

> Resolve symlinks and expose the `stat` property on a file object.

This is inspired by the `file.stat` code in [vinyl-fs][]. I needed a function that essentially did the same thing but could be used with stream or non-stream code.

## Install

Install with [npm](https://www.npmjs.com/)

```sh
$ npm i file-symlinks --save
```

## Usage

```js
var symlinks = require('file-symlinks');
var through = require('through2');

function toStream(fp) {
  var stream = through.obj();
  stream.write({path: fp});
  stream.end();
  return stream;
}

toStream('fake.md')
  .pipe(symlinks())
  .on('data', function (file) {
    // path.basename(file.path) => 'README.md'
  })
```

**async**

The `symlinks.resolve()` method is exposed for non-stream usage.

```js
// assuming you have a symlink, `fake.md` which points to `README.md`
symlinks.resolve({path: 'fake.md'}, function (err, file) {
  // file.path => 'README.md'
});

// with `realpath: false`
symlinks.resolve({path: 'fake.md'}, {realpath: false}, function (err, file) {
  // file.path => 'fake.md'
});
```

## Related projects

* [file-contents](https://github.com/jonschlinkert/file-contents): Set the `contents` property on a file object in a stream.
* [file-stat](https://github.com/jonschlinkert/file-stat): Set the `stat` property on a file object in a stream.
* [stream-loader](https://github.com/jonschlinkert/stream-loader): create a read stream from a glob of files. can be used as a loader-cache… [more](https://github.com/jonschlinkert/stream-loader)
* [vinyl](http://github.com/wearefractal/vinyl): A virtual file format
* [vinyl-fs](http://github.com/wearefractal/vinyl-fs): Vinyl adapter for the file system

## Running tests

Install dev dependencies:

```sh
$ npm i -d && npm test
```

## Contributing

Pull requests and stars are always welcome. For bugs and feature requests, [please create an issue](https://github.com/jonschlinkert/file-symlinks/issues/new)

## Author

**Jon Schlinkert**

+ [github/jonschlinkert](https://github.com/jonschlinkert)
+ [twitter/jonschlinkert](http://twitter.com/jonschlinkert)

## License

Copyright © 2015 Jon Schlinkert
Released under the MIT license.

***

_This file was generated by [verb-cli](https://github.com/assemble/verb-cli) on July 15, 2015._