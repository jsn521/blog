/**
 * Created by Administrator on 14-3-27.
 */
var http = require('http');
var fs = require('fs');
var server = http.createServer(function (req, res) {
    if (req.url == "/test") {
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.end('i am the test page');
    }
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('Hello World\n');
//    console.log(req);
//    fs.writeFile('request.txt', req.url, function () {
//        console.log('success');
//    });

});
server.listen(3000, '127.0.0.1');
//server.request('/test', function (req, res) {
//    res.writeHead(200, {'Content-Type': 'text/plain'});
//    res.end('I am in the page of test\n');
//});
console.log('the server is listen on port 3000');
