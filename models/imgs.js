/**
 * Created with JetBrains WebStorm.
 * User: Administrator
 * Date: 13-12-26
 * Time: 下午9:52
 * To change this template use File | Settings | File Templates.
 */
var mongodb = require('./db');
var ObjectID = require('mongodb').ObjectID;
function MyImage(img) {
    this.album = img.album;
    this.title = img.title;
    this.intro = img.intro;
    this.owner = img.owner;
    this.src = img.src;
}
exports = module.exports = MyImage;

MyImage.prototype.save = function (callback) {
    var tempImg = {
        album: this.album,
        title: this.title,
        intro: this.intro,
        owner: this.owner,
        src: this.src
    };
    mongodb.open(function (err, db) {
        if (err) {
            mongodb.close(false, function () {
                return callback(err);
            });

        } else {
            db.collection('my_blog_imgs', function (err, collection) {
                if (err) {
                    mongodb.close(false, function () {
                        return callback(err);
                    });
                } else {
                    collection.insert(tempImg, {safe: true}, function (err, img) {
                        if (err) {
                            mongodb.close(false, function () {
                                return callback(err);
                            });
                        } else {
                            mongodb.close(function () {
                                return callback(null, img);
                            });
                        }
                    });
                }
            });
        }
    });
};

MyImage.get = function (_id, callback) {

};

MyImage.getMulti = function (start, limit, callback) {
    mongodb.open(function (err, db) {
        if (err) {
            mongodb.close();
            return callback(err);
        } else {
            db.collection('my_blog_imgs', function (err, collection) {
                if (err) {
                    mongodb.close();
                    return callback(err);
                } else {
                    collection.count(function (err, count) {
                        if (err) {
                            mongodb.close();
                            callback(err);
                        } else {
                            collection.find().sort({_id: -1})
                                .skip(start).limit(limit).toArray(function (err, imgs) {
                                    mongodb.close(false, function () {
                                        if (err) {
                                            return callback(err);
                                        }
                                        callback(null, imgs, count);
                                    });
                                });
                        }
                    });
                }
            });
        }
    });
};