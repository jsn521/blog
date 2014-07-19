/**
 * Created with JetBrains WebStorm.
 * User: Administrator
 * Date: 14-3-18
 * Time: 下午8:24
 * To change this template use File | Settings | File Templates.
 */

var qiniu = require('qiniu');
var fs = require('fs');
exports = module.exports = Qiniu;

function Qiniu(access_key, secret_key, bucketName) {
    this.access_key = access_key;
    this.secret_key = secret_key;
    this.upToken = null;
    this.extra = null;
    this.bucketName = bucketName;
    this.domain = "http://my-blog-test.qiniudn.com/";
}

Qiniu.prototype.initiallize = function () {
    qiniu.conf.ACCESS_KEY = this.access_key;
    qiniu.conf.SECRET_KEY = this.secret_key;
};

Qiniu.prototype.setUpToken = function (bucketName) {
    try {
        if (!bucketName)
            return null;
        this.upToken = new qiniu.rs.PutPolicy(bucketName).token();
        return this.upToken;
    } catch (err) {
        return null;
    }
};

Qiniu.prototype.setExtra = function () {
    this.extra = new qiniu.io.PutExtra();
};

Qiniu.prototype.PutFile = function (localfile, callback) {
    this.initiallize();
    this.setUpToken(this.bucketName);
    this.setExtra();
    var that = this;
    fs.exists(localfile, function (exist) {
        if (!exist) {
            callback([]);
        }
        else {
            try {
                qiniu.io.putFile(that.upToken, "", localfile, that.extra, function (err, ret) {
                    if (err) {
                        callback(err);
                    } else {
                        callback(null, that.domain + ret.key, that.domain + ret.hash);
                    }
                });
            } catch (err) {
                callback(err);
            }
        }
    });
};
Qiniu.prototype.GetFile = function () {

};
Qiniu.prototype.PutBinaryFile = function (body, callback) {
    this.initiallize();
    this.setUpToken(this.bucketName);
    this.setExtra();
    var that = this;
    qiniu.io.put(that.upToken, "", body, that.extra, function (err, ret) {
        if (err) {
            callback(err);
        } else {
            callback(null, that.domain + ret.key, that.domain + ret.hash);
        }
    });
};