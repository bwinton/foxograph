"use strict";

exports.error = function (res, err, console) {
  if (console) {
    console.trace(err);
  }
  res.json(console ? 403 : 500, {'error': err});
};

exports.extend = function () {
  var args = Array.prototype.slice.call(arguments);
  var dest = args.shift();
  args.forEach(function (from) {
    var props = Object.getOwnPropertyNames(from);
    props.forEach(function (name) {
      dest[name] = from[name];
    });
  });
  return dest;
};