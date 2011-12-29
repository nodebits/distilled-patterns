var FS = require('fs');

function onRead(err, file) {
  if (err) throw err;
}

for (var i = 0; i < 10000; i++) {
  FS.readFile(__filename, 'utf8', onRead);
}
