/**
 * Created with JetBrains WebStorm.
 * User: Administrator
 * Date: 13-12-15
 * Time: 下午9:19
 * To change this template use File | Settings | File Templates.
 */
var mongodb = require('./db');
var ObjectID = require('mongodb').ObjectID;
//var string = require('string');
//var html_pe = require('html-pe');
//var parser = new html_pe.Parser();
//var Entities = require('html-entities').XmlEntities;
var ParentTag = require('./parenttag.js');

function Article(article) {
    this._id = article._id;
//    this.art_id = article.art_id;
    this.child_tag = article.info.child_tag;
    this.content = article.info.content;
    this.created_time = article.info.created_time;
    this.good = article.good;
    this.parent_tag = article.info.parent_tag;
    this.title = article.title;
//    this.user_id = article.user_id;
    this.user_name = article.info.user_name;
}

module.exports = Article;

Article.prototype.save = function save(callback) {
    var now = new Date(),
        month = now.getMonth() + 1,
        date = now.getDate(),
        hour = now.getHours(),
        minutes = now.getMinutes(),
        seconds = now.getSeconds();
    if (month < 10)
        month = "0" + month;
    if (date < 10)
        date = "0" + date;
    if (hour < 10)
        hour = "0" + hour;
    if (minutes < 10)
        minutes = "0" + minutes;
    if (seconds < 10)
        seconds = "0" + seconds;

    var article = {
        title: this.title,
        info: {
            child_tag: this.child_tag,
            parent_tag: this.parent_tag,
            content: this.content,
            good: this.good,
            user_name: 'ygh1224',
            created_time: now.getFullYear() + "-" + month
                + "-" + date + " " + hour + ":" + minutes + ":" + seconds
        },
        good: this.good
    };
    mongodb.open(function (err, db) {
        if (err) {
            mongodb.close(function () {
                return callback(err);
            });
        } else {
            db.collection('my_blog_article', function (err, collection) {
                if (err) {
                    mongodb.close(true, function () {
                        return callback(err);
                    });
                }
                else {
                    collection.find().sort({_id: -1}).toArray(function (err, articles) {
                        collection.insert(article, {safe: true}, function (err, article) {
                            mongodb.close(false, function () {
                                return callback(err, article);
                            });
                        });
                    });
                }
            });
        }
    });
};

Article.get = function get(_id, callback) {
    mongodb.open(function (err, db) {
            if (err) {
                mongodb.close(function () {
                    return callback(err);
                });
            } else {
                db.collection('my_blog_article', function (err, collection) {
                    if (err) {
                        mongodb.close(false, function () {
                            return callback(err);
                        });
                    } else {
                        //注意这里的值类型一定要是int 数据库中保存的对应字段的类型也是Int32
                        collection.findOne({_id: new ObjectID(_id)}, function (err, doc) {
                            if (err) {
                                mongodb.close(function () {
                                    return callback(err);
                                });
                            } else {
                                mongodb.close(false, function () {
                                    if (doc) {
                                        var article = new Article(doc);
                                        return callback(err, article);
                                    }
                                    else {
                                        return callback(err, null);
                                    }
                                });
                            }
                        });
                    }
                });
            }
        }
    );
};

Article.getPreTen = function (callback) {
    mongodb.open(function (err, db) {
        if (err) {
            mongodb.close(function () {
                return callback(err);
            });
        } else {
            db.collection('my_blog_article', function (err, collection) {
                if (err) {
                    mongodb.close(function () {
                        return callback(err);
                    });
                } else {
                    collection.count(function (err, count) {
                        collection.find().sort({_id: -1}).toArray(function (err, articles) {
                            mongodb.close();
                            return callback(err, articles, count);
                        });
                    });
                }
            });
        }
    });
};

Article.getByPage = function (page, callback) {
    mongodb.open(function (err, db) {
        if (err) {
            mongodb.close(function () {
                return callback(err);
            });
        }
        else {
            db.collection('my_blog_article', function (err, collection) {
                if (err) {
                    mongodb.close(function () {
                        return callback(err);
                    });
                }
                else {
                    collection.count(function (err, count) {
                        var total = count;
                        collection.find().sort({_id: -1})
                            .skip((page - 1) * 5)
                            .limit(5)
                            .toArray(function (err, articles) {
                                mongodb.close(false, function () {
                                    if (articles) {
                                        return callback(null, articles, total);
                                    } else {
                                        return callback(err, null);
                                    }
                                });
                            });
                    });
                }
            });
        }
    });
};

Article.getByType = function (type, callback) {
    mongodb.open(function (err, db) {
        if (err) {
            mongodb.close(function () {
                return callback(err);
            });
        } else {
            if (type !== 'all') {
                db.collection('my_blog_article', function (err, collection) {
                    if (err) {
                        mongodb.close(function () {
                            return callback(err);
                        });
                    } else {
                        collection.find({"info.parent_tag": type}, {fields: {_id: 1, title: 1}}).toArray(function (err, articles) {
                            if (err) {
                                mongodb.close(function () {
                                    return callback(err);
                                });
                            } else {
                                mongodb.close(function () {
                                    return callback(null, articles);
                                });
                            }
                        });
                    }
                });
            }
            else {
                mongodb.close(function () {
                    ParentTag.get(function (err, parentTags) {
                        if (err) {
                            mongodb.close(function () {
                                return callback([]);
                            });
                        } else {
                            mongodb.close(function () {
                                var details = {};
                                var articles = null;
                                Article.getAll(function (err, artic) {
                                    if (err) {
                                        artic = [];
                                    } else {
                                        parentTags.forEach(function (element, index) {
                                            details[element.name] = artic.filter(function (ele) {
                                                if (ele.info.parent_tag === element.name)
                                                    return ele;
                                            });
                                        });
                                        callback(null, details);
                                    }
                                });
                            });
                        }
                    });
                });
            }
        }
    });
};

Article.remove = function (_id, callback) {
    mongodb.open(function (err, db) {
        if (err) {
            mongodb.close();
            return callback(err);
        } else {
            db.collection('my_blog_article', function (err, collection) {
                if (err) {
                    mongodb.close();
                    return callback(err);
                }
                collection.remove({_id: new ObjectID(_id)}, {w: 1}, function (err, numberOfRemovedDocs) {
                    mongodb.close(false, function () {
                        if (err) {
                            return callback(err);
                        }
                        return callback(err, numberOfRemovedDocs);
                    });
                })
            });
        }
    });
};

Article.update = function (_id, content, callback) {
    mongodb.open(function (err, db) {
        if (err) {
            mongodb.close();
            return callback(err);
        } else {
            db.collection('my_blog_article', function (err, collection) {
                if (err) {
                    mongodb.close();
                    return callback(err);
                } else {
                    collection.update({_id: new ObjectID(_id)}, {$set: {"info.content": content}}, {upsert: true, w: 1}, function (err, modifiedDoc) {
                        mongodb.close(false, function () {
                            if (err || modifiedDoc === 0) {
                                return callback(err);
                            }
                            callback(err, modifiedDoc);
                        });
                    })
                }
            });
        }
    });
};

Article.addGood = function (_id, good, callback) {
    good = parseInt(good);
    mongodb.open(function (err, db) {
        if (err) {
            mongodb.close(function () {
                return callback(err);
            });
        } else {
            db.collection('my_blog_article', function (err, collection) {
                if (err) {
                    mongodb.close(function () {
                        return callback(err);
                    });
                } else {
                    collection.update({_id: new ObjectID(_id)}, {$set: {good: good}}, function (err, result) {
                        mongodb.close(false, function () {
                            if (err) {
                                return callback(err);
                            }
                            return callback(null, result);
                        });
                    });
                }
            });
        }
    });
};

Article.getAll = function (callback) {
    mongodb.open(function (err, db) {
        if (err) {
            mongodb.close(function () {
                callback([]);
            });
        }
        else {
            db.collection('my_blog_article', function (err, collection) {
                if (err) {
                    mongodb.close(function () {
                        callback([]);
                    });
                }
                else {
                    collection.find({}, {fields: {title: 1, _id: 1, 'info.parent_tag': 1}}).toArray(function (err, articles) {
                        if (err) {
                            mongodb.close(function () {
                                callback([]);
                            });
                        } else {
                            mongodb.close(function () {
                                callback(null, articles);
                            });
                        }
                    });
                }
            });
        }
    });
};