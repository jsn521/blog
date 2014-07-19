/**
 * Created with JetBrains WebStorm.
 * User: Administrator
 * Date: 14-1-6
 * Time: 下午7:25
 * To change this template use File | Settings | File Templates.
 */
var weibo = require("weibo");
var appkey = "3486263756";
var secret = "2824b00260c474ae41d6dc78c3ac6522";
var oauth_callback_url = "http://localhost";
var Sina = {
    appkey: appkey,
    secret: secret,
    oauth_callback_url: oauth_callback_url
};
Sina.init = function (blogtype) {
    weibo.init('weibo', this.appkey, this.secret, this.oauth_callback_url);
};
Sina.public_timeline = function (user, cursor, callback) {
    weibo.public_timeline(user, cursor, function (err, statuses) {
        if (err) {
            console.error(err);
        } else {
            console.log(statuses);
        }
    });
};
exports = module.exports = Sina;
//var user = { blogtype: 'weibo' };
//var cursor = {count: 20};