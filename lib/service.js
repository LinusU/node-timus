
var fetch = require('./fetch');
var cheerio = require('cheerio');

var BASE = 'http://acm.timus.ru/';

function getProblem(id, cb) {

  var url = BASE + 'problem.aspx?space=1&num=' + id;

  fetch(url, function (err, html) {
    if (err) { return cb(err); }

    var $ = cheerio.load(html);

    if ($('div.problem_content').length === 0) {
      return cb(new Error('Problem not found'));
    }

    var samples = [];

    $('table.sample').find('tr').slice(1).each(function () {
      samples.push({
        input: $(this).find('pre').eq(0).text().replace(/\r\n/g, '\n'),
        output: $(this).find('pre').eq(1).text().replace(/\r\n/g, '\n')
      });
    });

    cb(null, {
      id: id,
      samples: samples
    });
  });

}

exports.getProblem = getProblem;
