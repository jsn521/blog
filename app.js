/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');
var partials = require('express-partials');
var app = express();
var store = new express.session.MemoryStore;
var settings = require('./settings');

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(partials());
app.use(express.favicon());
app.use(express.bodyParser({uploadDir: "./public/upload/"}));
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
//app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.cookieParser('123465789abcdefg'));
//app.use(express.session({
//        key: 'sessionKey',
//        secret: '1234567890QWERTY',
//        store: store,
//        cookie: {
//            path: '/',
//            domain: 'localhost',
//            httpOnly: true,
//            maxAge: 1000 * 60 * 60 * 24 * 30
//        }
//    }
//));
app.use(express.session());//一定要将app.use(router);放在最后 不然的话 session以及cookie就不能用了
app.use(app.router);
// development only
if ('development' == app.get('env')) {
    app.use(express.errorHandler());
}

//app.get('/', routes.index);
//app.get('/users', user.list);

http.createServer(app).listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});
routes(app);