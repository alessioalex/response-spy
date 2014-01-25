"use strict";

var utils = require('./utils');
var res = {};

res.setHeader = function(originalFn, context) {
  return utils.wrap(originalFn, context, function(name, value) {
    if (arguments.length > 1 && !this.headersSent) {
      // not using this._headers and this._implicitHeaders()
      // to be future proof
      this.__headers2 = this.__headers2 || {};

      this.__headers2[name.toLowerCase()] = value;
    }
  });
};

res.removeHeader = function(originalFn, context) {
  return utils.wrap(originalFn, context, function(name) {
    if (arguments.length > 0 && !this.headersSent) {
      this.__headers2 = this.__headers2 || {};

      delete this.__headers2[name.toLowerCase()];
    }
  });
};

res.writeHead = function(originalFn, context, stream) {
  return utils.wrap(originalFn, context, function(statusCode, statusMessage, headers) {
    if (typeof statusMessage !== 'string') {
      headers = statusMessage;
    }

    this.__headers2 = this.__headers2 || {};
    utils.setHeaders(this.setHeader.bind(this), headers);

    stream.emit('headers', this.__headers2, statusCode);
  });
};

res.write = function(originalFn, context, stream) {
  return utils.wrap(originalFn, context, function(data) {
    if (!this.headersSent) {
      this.writeHead(this.statusCode);
    }

    if (typeof data !== 'undefined') { stream.push(data); }
  });
};

res.end = function(originalFn, context, stream) {
  return utils.wrap(originalFn, context, function(data) {
    if (!this.headersSent) {
      this.writeHead(this.statusCode);
    }

    if (typeof data !== 'undefined') { stream.push(data); }
    stream.push(null);
  });
};

module.exports = res;
