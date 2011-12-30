var FS = require('fs');

// A combined wrapper for both caching and batching of requests
var requestBatches = {};
var requestCache = {};
function readFile(filename, callback) {
  // First check for a cache hit
  if (requestCache.hasOwnProperty(filename)) {
    var value = requestCache[filename];
    // Delay result till next tick to act async
    process.nextTick(function () {
      callback(null, value);
    });
    return;
  }
  // Otherwise check to see if there is already a batch
  if (requestBatches.hasOwnProperty(filename)) {
    requestBatches[filename].push(callback);
    return;
  }

  // If there is neighter, create a new batch and request
  var batch = requestBatches[filename] = [callback];
  FS.readFile(filename, onRealRead);

  // Cache the result if there is no error and flush the batch
  function onRealRead(err, contents) {
    if (!err) requestCache[filename] = contents;
    delete requestBatches[filename];
    for (var i = 0, l = batch.length; i < l; i++) {
      batch[i].apply(null, arguments);
    }
  }
}

// Request the same resource 10,000 times using 100 parallel chains
var left = 10000;
for (var i = 0; i < 100; i++) {
  (function next() {
    if (left-- <= 0) return;
    readFile(__filename, next);
  }());
}
