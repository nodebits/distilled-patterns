var FS = require('fs');

var requestBatch = {};
var requestCache = {};
function readFile(filename, callback) {
  if (requestCache.hasOwnProperty(filename)) {
    console.log("Existing cache found");
    callback(null, requestCache[filename]);
    return;
  }
  if (requestBatch.hasOwnProperty(filename)) {
    console.log("Existing batch found");
    requestBatch[filename].push(callback);
    return;
  }
  var batch = requestBatch[filename] = [callback];
  console.log("Calling FS.readFile");
  FS.readFile(filename, 'utf8', function (err, contents) {
    console.log("FS.readFile finished");
    if (!err) {
      requestCache[filename] = contents;
    }
    delete requestBatch[filename];
    for (var i = 0, l = batch.length; i < l; i++) {
      batch[i].apply(null, arguments);
    }
  });
}

console.log("Calling readFile 1st time");
readFile(__filename, function (err, data) {
  console.log("1st finished");
  console.log("Calling readFile 3rd time");
  readFile(__filename, function (err, data) {
    console.log("3nd finished");
  });
});
console.log("Calling readFile 2nd time");
readFile(__filename, function (err, data) {
  console.log("2nd finished");
  console.log("Calling readFile 4th time");
  readFile(__filename, function (err, data) {
    console.log("4th finished");
  });
});
console.log();
