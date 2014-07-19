/**
 * Created by Administrator on 14-4-16.
 */
var http = require("http");
var options = {
    host: "www.google.com",
    port: "80",
    path: "/upload",
    method: "post"
};
var req = http.request(options, function (res) {
    console.log('STATUS: ' + res.statusCode);
    console.log("HEADERS: " + JSON.stringify(res.headers));
    res.setEncoding('utf-8');
    res.on('data', function (chunk) {
        console.log('BODY: ' + chunk);
    });
    res.on('end', function (e) {
        console.log('this is end event');
    });
});
req.on('error', function (e) {
    console.log('problem with request: ' + e.message);
});
req.write('data\n');
req.write('data\n');
req.end();