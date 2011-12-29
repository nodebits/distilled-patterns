var FS = require('fs');

function onRead(err, file) {
  if (err) throw err;
}

var requestBatches = {};
var requestCache = {};
function readFile(filename, callback) {
  if (requestCache.hasOwnProperty(filename)) {
    callback(null, requestCache[filename]);
    return;
  }
  if (requestBatches.hasOwnProperty(filename)) {
    requestBatches[filename].push(callback);
    return;
  }
  var batch = requestBatches[filename] = [callback];
  FS.readFile(filename, 'utf8', function (err, contents) {
    if (!err) {
      requestCache[filename] = contents;
    }
    delete requestBatches[filename];
    for (var i = 0, l = batch.length; i < l; i++) {
      batch[i].apply(null, arguments);
    }
  });
}

// Request the same resource 10,000 times concurrently 10,000 times serially
var left = 10000;
(function next(err) {
  if (err) throw err;
  if (left) return;
  for (var i = 0; i < 10000; i++) {
    readFile(__filename, onRead);
  }
  left--;
})();
