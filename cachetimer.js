var FS = require('fs');

// Caching wrapper around the real FS.readFile
var requestCache = {};
var cacheLifetime = 1000;
function cachingReadFile(filename, callback) {
  // First check for a cache hit
  if (requestCache.hasOwnProperty(filename)) {
    var value = requestCache[filename];
    // Delay result till next tick to act async
    process.nextTick(function () {
      callback(null, value);
    });
    return;
  }

  // Otherwise start a real request
  FS.readFile(filename, onRealRead);

  // Cache the result if there is no error
  function onRealRead(err, contents) {
    if (!err && cacheLifetime) {
      requestCache[filename] = contents;
      setTimeout(function () {
        delete requestCache[filename];
      }, cacheLifetime);
    }
    callback(err, contents);
  }
}

// Request the same resource 10,000 times serially
var left = 10000;
(function next() {
  if (!(left--)) return;
  cachingReadFile(__filename, next);
}());
