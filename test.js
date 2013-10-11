var http = require('http');
var express = require('express'), 
app = express();

/*var sleep = function(t) {
    var initial = new Date();
    while(new Date() - initial < t) {

    }
};
app.get("/:a", function(req, res) {
    console.log("Request received!");
    http.get("http://google.com", function (err, data) {
	res.write(err.toString('utf-8'));
    });
});

app.listen(8080); */

var options = {
  hostname: 'www.google.com',
  port: 80,
  path: '/upload',
  method: 'POST'
};

var req = http.request(options, function(res) {
  console.log('STATUS: ' + res.statusCode);
  console.log('HEADERS: ' + JSON.stringify(res.headers));
  res.setEncoding('utf8');
  res.on('data', function (chunk) {
    console.log('BODY: ' + chunk);
  });
});

req.on('error', function(e) {
  console.log('problem with request: ' + e.message);
});

req.end();
