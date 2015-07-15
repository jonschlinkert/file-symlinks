var fs = require('fs');
var path = require('path');
var symlinks = require('./');

fs.symlink('README.md', 'fake.md', function (err) {

  // resolve the realpath of a file
  symlinks.resolve({path: 'fake.md'}, function (err, file) {
    console.log(path.basename(file.path));
    //=> 'README.md'

    // with `realpath: false`
    symlinks.resolve({path: 'fake.md'}, {realpath: false}, function (err, file) {
      console.log(file.path);
      //=> 'fake.md'

      fs.unlinkSync('fake.md');
    });
  });
});
