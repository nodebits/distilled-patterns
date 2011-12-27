var FS = require('fs');

var requestBatch = {};
function readFile(filename, callback) {
  if (requestBatch.hasOwnProperty(filename)) {
    requestBatch[filename].push(callback);
    return;
  }
  var batch = requestBatch[filename] = [callback];
  FS.readFile(filename, 'utf8', function (err, contents) {
    delete requestBatch[filename];
    for (var i = 0, l = batch.length; i < l; i++) {
      batch[i].apply(null, arguments);
    }
  });
}