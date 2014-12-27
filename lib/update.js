
var fs = require('fs');
var service = require('./service');

function update(id, dst, cb) {

  service.getProblem(id, function (err, res) {
    if (err) { return cb(err); }

    var data = JSON.stringify(res);

    fs.writeFile(dst, data, function (err) {
      if (err) { return cb(err); }

      cb(null);
    });
  });

}

module.exports = update;
