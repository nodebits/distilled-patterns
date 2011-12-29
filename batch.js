// With new comment
var FS = require('fs');

var requestBatch = {};
function readFile(filename, callback) {
  if (requestBatch.hasOwnProperty(filename)) {
    console.log("Existing batch found");
    requestBatch[filename].push(callback);
    return;
  }
  var batch = requestBatch[filename] = [callback];
  console.log("Calling FS.readFile");
  FS.readFile(filename, 'utf8', function (err, contents) {
    console.log("FS.readFile finished");
    delete requestBatch[filename];
    for (var i = 0, l = batch.length; i < l; i++) {
      batch[i].apply(null, arguments);
    }
  });
}

console.log("Calling readFile 1st time");
readFile(__filename, function (err, data) {
  console.log("1st finished");
});
console.log("Calling readFile 2nd time");
readFile(__filename, function (err, data) {
  console.log("2nd finished");
});
console.log();