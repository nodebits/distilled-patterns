var FS = require('fs');
var Wrap = require('./wrap');

// Create a wrapped version of FS.readFile
var readFile = Wrap(FS.readFile);

// Request the same resource 10,000 times using 100 parallel chains
var left = 10000;
for (var i = 0; i < 100; i++) {
  (function next() {
    if (left-- <= 0) return;
    readFile(__filename, next);
  }());
}
