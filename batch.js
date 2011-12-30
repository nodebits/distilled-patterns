var FS = require('fs');

function onRead(err, file) {
  if (err) throw err;
}

var requestBatches = {};
function batchingReadFile(filename, callback) {

  if (requestBatches.hasOwnProperty(filename)) {
    requestBatches[filename].push(callback);
    return;
  }

  var batch = requestBatches[filename] = [callback];

  FS.readFile(filename, 'utf8', onRead);
  
  function onRead() {
    delete requestBatches[filename];
    for (var i = 0, l = batch.length; i < l; i++) {
      batch[i].apply(null, arguments);
    }
  }
}

for (var i = 0; i < 10000; i++) {
  batchingReadFile(__filename, onRead);
}
