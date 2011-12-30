var FS = require('fs');

for (var i = 0; i < 10000; i++) {
  FS.readFileSync(__filename);
}
