
var events = require('events');
var child_process = require('child_process');

function runSample(bin, sample, cb) {

  var chunks = [];
  var prog = child_process.spawn(bin);

  prog.stdout.on('data', chunks.push.bind(chunks));
  prog.stdin.end(sample.input.trim());

  prog.on('close', function (code) {

    if (code !== 0) {
      return cb(new Error('Test failed: non-zero exit code'));
    }

    var out = Buffer.concat(chunks).toString();

    if (out.trim() !== sample.output.trim()) {
      var err = new Error('Test failed: wrong output');
      err.actual = out.trim();
      err.expected = sample.output.trim();
      return cb(err);
    }

    cb(null);
  });

}

function runArray(bin, samples) {

  var i = 0;
  var ee = new events.EventEmitter();
  var next = function () {

    if (i === samples.length) {
      ee.emit('finish');
      return ;
    }

    runSample(bin, samples[i], function (err) {
      if (err) {
        ee.emit('error', err);
      } else {
        ee.emit('ok', i);
        i += 1;
        next();
      }
    });

  };

  next();

  return ee;
}

exports.runSample = runSample;
exports.runArray = runArray;
