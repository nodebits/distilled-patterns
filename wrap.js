// A General wrapper with cache and batch and timeouts
module.exports = function Wrap(fn) {
  var requestBatches = {};
  var requestCache = {};
  wrapped.cacheLifetime = 1000;
  function wrapped(key, callback) {
    if (requestCache.hasOwnProperty(key)) {
      var value = requestCache[key];
      process.nextTick(function () {
        callback(null, value);
      });
      return;
    }
    if (requestBatches.hasOwnProperty(key)) {
      requestBatches[key].push(callback);
      return;
    }
    var batch = requestBatches[key] = [callback];
    fn(key, onDone);
    function onDone(err, result) {
      if (!err && wrapped.cacheLifetime) {
        requestCache[key] = result;
        setTimeout(function () {
          delete requestCache[key];
        }, wrapped.cacheLifetime);
      }
      delete requestBatches[key];
      for (var i = 0, l = batch.length; i < l; i++) {
        batch[i].apply(null, arguments);
      }
    }
  }
  return wrapped;
};
