var FS = require('fs');

function onRead(err, file) {
  if (err) throw err;
}

// A simple hash object to store the cached results
var requestCache = {};
function cachingReadFile(filename, callback) {

  // Check if this request is in the cache
  if (requestCache.hasOwnProperty(filename)) {
    // If it is, return the value and we're done!
    callback(null, requestCache[filename]);
    return;
  }

  // Otherwise, start a real request
  FS.readFile(filename, 'utf8', function (err, contents) {
    // If the result wasn't an error, remember the result
    if (!err) {
      requestCache[filename] = contents;
    }
    // Forward the response (good or bad) to the caller.
    callback(err, contents);
  });
}

// Request the same resource 10,000 times serially
var left = 10000;
(function next(err) {
  if (err) throw err;
  if (left) return;
  cachingReadFile(__filename, next);
  left--;
})();
