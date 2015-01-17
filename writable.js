'use strict';

var util = require('util');
var Writable = require('stream').Writable;
var Client = require('elasticsearch').Client;

module.exports = ESWritable;
util.inherits(ESWritable, Writable);

var proto = ESWritable.prototype;

function ESWritable(options) {
  if (!(this instanceof ESWritable)) {
    return new ESWritable(options);
  }
  options || (options = {});
  options.objectMode = true;
  Writable.call(this, options);
  this._client = new Client(options);
  this._type = options.type || 'log';
  this._getIndex = createIndexNameGetter(options.index);
}

proto._write = function (chunk, enc, cb) {
  var options = {
    index: this._getIndex(chunk),
    type: this._type,
    body: chunk
  };

  this._client.create(options);
  cb();
};

function createIndexNameGetter(fn) {
  return staticIndexNameGetter(fn)
    || customIndexNameGetter(fn)
    || defaultIndexNameGetter;
}

function staticIndexNameGetter(index) {
  if (index === 'string') {
    return function () {
      return index;
    };
  }
}

function customIndexNameGetter(fn) {
  if (isNormalFunction(fn)) {
    return fn;
  }
}

function defaultIndexNameGetter(data) {
  var date = new Date();
  return '[es-writable]'
    + date.getUTCFullYear() + '-'
    + pad(date.getUTCMonth() + 1, 2) + '-'
    + pad(date.getUTCDate(), 2);
}

function isNormalFunction(fn) {
  return util.isFunction(fn)
    && !isGeneratorFunction(fn);
}

function isGeneratorFunction(fn) {
  return fn.constructor.name === 'GeneratorFunction';
}

function pad(str, len) {
  str = String(str);
  var n = len - str.length;
  return n > 0
    ? repeat('0', n) + str
    : str;
}

function repeat(str, times) {
  if (str.repeat) {
    return str.repeat(times);
  }

  var out = '';

  while (times--) {
    out += str;
  }

  return out;
}
