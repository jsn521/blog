/**
 * Created with JetBrains WebStorm.
 * User: Administrator
 * Date: 13-12-19
 * Time: 下午7:15
 * To change this template use File | Settings | File Templates.
 */
var mongodb = require('./db');
var Tag = function (tags) {
    this.parentTag = tags.parentTag;
    this.childTag = tags.childTag;
};
module.exports = Tag;
Tag.get = function (callback) {
    mongodb.open(function (err, db) {
        var tag = {parentTag: [1, 2, 3], childTag: []};
        if (err) {
            mongodb.close(function () {
                return callback(err);
            });
        } else {
            db.collection('my_blog_parenttag', function (err, collection) {
                if (err) {
                    mongodb.close(function () {
                        return callback(err);
                    });
                } else {
                    collection.find().toArray(function (err, parentTags) {
                        if (err) {
                            mongodb.close(function () {
                                return callback(err);
                            });
                        } else {
                            tag.parentTag = parentTags;
                            db.collection('my_blog_childtag', function (err, collection) {
                                if (err) {
                                    mongodb.close(function () {
                                        return callback(err);
                                    });
                                }
                                //这里可以选择过滤 即只返回一列数据
                                else {
                                    collection.find().toArray(function (err, childTags) {
                                        mongodb.close(function () {
                                            if (err) {
                                                return callback(err);
                                            }
                                            tag.childTag = childTags;
                                            return callback(err, tag);
                                        });
                                    });
                                }
                            });
                        }
                    });
                }
            });
        }
    });
};