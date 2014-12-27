
var child_process = require('child_process');

function once(fn) {
  var called = 0;
  return function () {
    (called++ === 0) && fn.apply(this, arguments);
  }
}

function build(src, dst, cb) {

  var args = [
    '-Wall',
    '-o', dst,
    src
  ];

  var done = once(cb);
  var gcc = child_process.spawn('gcc', args, { stdio: 'inherit' });

  gcc.on('error', done);
  gcc.on('close', function (code) {
    if (code !== 0) {
      cb(new Error('Build failed'));
    } else {
      cb(null);
    }
  });

}

module.exports = build;
