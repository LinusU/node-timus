
var url = require('url');
var querystring = require('querystring');

var www = require('./www');
var cheerio = require('cheerio');

var BASE = 'http://acm.timus.ru/';

function extractParam(str, key) {
  return querystring.parse(url.parse(str).query)[key];
}

function checkStatus(problem, coder, cb) {

  var uri = BASE + '/status.aspx?space=1&count=100';

  www.get(uri, function (err, res) {
    if (err) { return cb(err); }

    var $ = cheerio.load(res.body);
    var result;

    $('table.status').find('tr').slice(1, -2).each(function () {

      var lCoder = extractParam($(this).find('.coder a').attr('href'), 'id');
      var lProblem = extractParam($(this).find('.problem a').attr('href'), 'num');

      if (parseInt(lCoder, 10) !== coder) { return ; }
      if (parseInt(lProblem, 10) !== problem) { return ; }

      result = {
        verdict: $(this).find('.verdict_wt, .verdict_ac, .verdict_rj').text()
      };

      return false;
    });

    if (result === undefined) {
      return cb(new Error('Status not found'));
    }

    cb(null, result);
  });

}

function login(judge, password, cb) {

  var uri = BASE + 'authedit.aspx';
  var body = new Buffer(querystring.stringify({
    'Action': 'edit',
    'JudgeID': judge,
    'Password': password
  }));

  www.post(uri, body, function (err, res) {
    if (err) { return cb(err); }

    if (res.statusCode !== 302) {
      return cb(new Error('Login failed'));
    }

    if (/Wrong verification code entered/.exec(res.body)) {
      return cb(new Error('Captcha required'));
    }

    var coder = extractParam(res.headers['location'], 'id');

    cb(null, {
      coder: Number(coder),
      judge: judge
    });
  });

}

function submitSolution(data, cb) {

  var uri = BASE + 'submit.aspx?space=1';
  var body = new Buffer(querystring.stringify({
    'Action': 'submit',
    'SpaceID': '1',
    'Language': data.language,
    'JudgeID': data.judge,
    'ProblemNum': data.problem,
    'Source': data.source
  }));

  www.post(uri, body, function (err, res) {
    if (err) { return cb(err); }

    if (res.statusCode !== 303) {
      return cb(new Error('Server did not accept solution'));
    }

    cb(null);
  });

}

function getProblem(id, cb) {

  var uri = BASE + 'problem.aspx?space=1&num=' + id;

  www.get(uri, function (err, res) {
    if (err) { return cb(err); }

    var $ = cheerio.load(res.body);

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

exports.login = login;
exports.getProblem = getProblem;
exports.checkStatus = checkStatus;
exports.submitSolution = submitSolution;
