var FS = require('fs');

var cacheLifetime = 100;
var requestCache = {};
function readFile(filename, callback) {
  if (requestCache.hasOwnProperty(filename)) {
    console.log("Existing cache found");
    callback(null, requestCache[filename]);
    return;
  }
  console.log("Calling FS.readFile");
  FS.readFile(filename, 'utf8', function (err, contents) {
    console.log("FS.readFile finished");
    if (!err && cacheLifetime) {
      requestCache[filename] = contents;
      setTimeout(function () {
        delete requestCache[filename];
      }, cacheLifetime);
    }
    callback(err, contents);
  });
}

console.log("Calling readFile 1st time");
readFile(__filename, function (err, data) {
  console.log("1st finished");
  console.log("Calling readFile 2nd time");
  readFile(__filename, function (err, data) {
    console.log("2nd finished");
  });
});
console.log();
