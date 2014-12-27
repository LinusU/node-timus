
var fs = require('fs');
var path = require('path');
var update = require('./update');

function once(fn) {
  var called = 0;
  return function () {
    (called++ === 0) && fn.apply(this, arguments);
  }
}

function copyAsset(asset, target, cb) {
  var src = path.join(__dirname, '..', 'assets', asset);

  var i = fs.createReadStream(src);
  var o = fs.createWriteStream(target);
  var done = once(cb);

  i.on('error', done);
  o.on('error', done);
  o.on('finish', function () { done(null); });

  i.pipe(o);
}

function checkout(id, dir, cb) {

  fs.mkdir(dir, function (err) {
    if (err) { return cb(err); }

    copyAsset('main.c', path.join(dir, 'main.c'), function (err) {
      if (err) { return cb(err); }

      update(id, path.join(dir, '.timus'), function (err) {
        if (err) { return cb(err); }

        console.log('done');
      });

    });

  });

}

module.exports = checkout;
