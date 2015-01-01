
var cfg = require('./cfg');
var service = require('./service');

module.exports = function login(judge, password, cb) {

  service.login(judge, password, function (err, res) {
    if (err) { return cb(err); }

    cfg.write({ auth: res }, cb);
  });

};
