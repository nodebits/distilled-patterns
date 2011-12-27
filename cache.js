var FS = require('fs');

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
    if (!err) {
      requestCache[filename] = contents;
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
