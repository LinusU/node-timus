
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
      return cb(new Error('Test failed: wrong output'));
    }

    cb(null);
  });

}

exports.runSample = runSample;
