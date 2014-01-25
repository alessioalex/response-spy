"use strict";

var slice = Array.prototype.slice;
var utils = {};

utils.setHeaders = function(setHeader, obj) {
  if (!obj) { return; }

  var keys = Object.keys(obj);

  for (var i = 0; i < keys.length; i++) {
    var k = keys[i];
    if (k) { setHeader(k, obj[k]); }
  }
};

utils.wrap = function(originalFn, context, fn) {
  return function() {
    var args = slice.call(arguments);
    fn.apply(context, args);
    return originalFn.apply(context, args);
  };
};

module.exports = utils;
