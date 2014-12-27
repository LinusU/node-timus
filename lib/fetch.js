
var http = require('http');

module.exports = function (options, cb) {

  var req = http.request(options);

  req.on('error', cb);
  req.on('response', function (res) {

    var chunks = [];

    res.on('error', cb);
    res.on('data', chunks.push.bind(chunks));
    res.on('end', function () {

      var data = Buffer.concat(chunks);
      var str = data.toString();

      cb(null, str);
    });

  });

  req.end();

};
