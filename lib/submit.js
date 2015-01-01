
var cfg = require('./cfg');
var service = require('./service');

var LANGUAGE = '25'; // GCC 4.9

function getResult(id, auth, cb) {

  function refresh() {
    service.checkStatus(id, auth.coder, function (err, status) {
      if (err) { return cb(err); }

      if (status.verdict === 'Compiling' || status.verdict === 'Running') {
        return setTimeout(refresh, 1500);
      }

      cb(null, status);
    });
  }

  refresh();
}

function submit(id, source, cb) {

  cfg.read(function (err, data) {
    if (err) { return cb(err); }

    if (!data.auth || !data.auth.coder || !data.auth.judge) {
      return cb(new Error('Not logged in'));
    }

    service.submitSolution({
      problem: id,
      judge: data.auth.judge,
      language: LANGUAGE,
      source: source.toString()
    }, function (err) {
      if (err) { return cb(err); }

      getResult(id, data.auth, cb);
    });

  });

}

module.exports = submit;
