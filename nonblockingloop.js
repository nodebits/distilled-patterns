var FS = require('fs');

for (var i = 0; i < 10000; i++) {
  FS.readFile(__filename, 'utf8', function (err, data) {
    if (err) throw err;
  });
}
