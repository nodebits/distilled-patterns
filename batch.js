var FS = require('fs');

function onRead(err, file) {
  if (err) throw err;
}

// A simple hash object to store the batches
var requestBatches = {};
function batchingReadFile(filename, callback) {

  // Check if it's already in progress
  if (requestBatches.hasOwnProperty(filename)) {
    // Join the existing batch and return
    requestBatches[filename].push(callback);
    return;
  }

  // There is no existing batch, so start a new one
  var batch = requestBatches[filename] = [callback];

  // Kick off the real request
  FS.readFile(filename, 'utf8', function (err, contents) {

    // Since we're done, we need to make sure new requests get their own batch
    delete requestBatches[filename];

    // Tell all interested parties the result
    for (var i = 0, l = batch.length; i < l; i++) {
      batch[i].apply(null, arguments);
    }
  });
}

for (var i = 0; i < 10000; i++) {
  batchingReadFile(__filename, onRead);
}
