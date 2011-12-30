var FS = require('fs');

// Batching wrapper around the real FS.readFile
var requestBatches = {};
function batchingReadFile(filename, callback) {
  // First check to see if there is already a batch
  if (requestBatches.hasOwnProperty(filename)) {
    requestBatches[filename].push(callback);
    return;
  }

  // Otherwise start a new one and make a real request
  var batch = requestBatches[filename] = [callback];
  FS.readFile(filename, onRealRead);
  
  // Flush out the batch on complete
  function onRealRead() {
    delete requestBatches[filename];
    for (var i = 0, l = batch.length; i < l; i++) {
      batch[i].apply(null, arguments);
    }
  }
}

// Request the same resource 10,000 times at once
for (var i = 0; i < 10000; i++) {
  batchingReadFile(__filename, onRead);
}

function onRead(err, file) {
  if (err) throw err;
}

