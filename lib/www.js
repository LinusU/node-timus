
var url = require('url');
var http = require('http');

exports.request = function (options, cb) {

  var req = http.request(options);

  req.on('error', cb);
  req.on('response', function (res) {

    var chunks = [];

    res.on('error', cb);
    res.on('data', chunks.push.bind(chunks));
    res.on('end', function () {

      var data = Buffer.concat(chunks);
      var str = data.toString();

      cb(null, {
        statusCode: res.statusCode,
        headers: res.headers,
        body: str
      });
    });

  });

  return req;
};

exports.get = function (options, cb) {
  return exports.request(options, cb).end();
};

exports.post = function (options, body, cb) {

  if (typeof options === 'string') {
    options = url.parse(options);
  }

  options.method = 'POST';

  if (!options.headers) {
    options.headers = {};
  }

  options.headers['Content-Length'] = body.length;
  options.headers['Content-Type'] = 'application/x-www-form-urlencoded';

  return exports.request(options, cb).end(body);
}
