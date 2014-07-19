var mongodb = require('./db');
var Sessions = require('./sessions');
var crypto = require('crypto');
function User(user) {
    this.name = user.name;
    this.password = user.password;
}
module.exports = User;
User.prototype.save = function (callback) {
    var user = {
        name: this.name,
        password: this.password
    };
    mongodb.open(function (err, db) {
        if (err) {
            mongodb.close(function () {
                return callback(err);
            });
        } else {
            // 讀取 users 集合
            db.collection('my_blog_users', function (err, collection) {
                if (err) {
                    mongodb.close(function () {
                        return callback(err);
                    });
                } else {
                    // 爲 name 屬性添加索引
                    collection.ensureIndex('name', {unique: true});
                    // 寫入 user 文檔
                    collection.insert(user, {safe: true}, function (err, user) {
                        mongodb.close(function () {
                            return callback(err, user);
                        });
                    });
                }
            });
        }
    });
};
//注意这里不能添加到原型中 因为这样就不能引用其方法了
//添加到原型中的方法只能被对象调用
User.get = function get(username, callback) {
    mongodb.open(function (err, db) {
        if (err) {
            return callback(err);
        }
        // 讀取 users 集合
        db.collection('my_blog_users', function (err, collection) {
            if (err) {
                mongodb.close();
                return callback(err);
            }
            // 查找 name 屬性爲 username 的文檔
            collection.findOne({name: username}, function (err, doc) {
                mongodb.close();
                if (doc) {
                    // 封裝文檔爲 User 對象
                    var user = new User(doc);
                    callback(err, user);
                } else {
                    callback(err, null);
                }
            });
        });
    });
};

User.remove = function (username, callback) {
    mongodb.open(function (err, db) {
    });
}

User.resetPassword = function (username, oldPwd, newPwd, callback) {
    mongodb.open(function (err, db) {
        if (err) {
            mongodb.close();
            callback(err);
        }
        db.collection('my_blog_users', function (err, collection) {
            if (err) {
                mongodb.close();
                callback(err);
            }
            collection.findOne({name: username}, function (err, user) {
//                mongodb.close();
//                var curPwd = Md5.update(newPwd + 'jsn521').digest('hex');
//                return callback(null, curPwd + 'dsaf');
                if (err) {
                    mongodb.close();
                    callback(err);
                }
                var dbOldPwd = user.password;
                //这里之所以使用两个对象是因为对象使用一次之后 就不能再使用了
                var md5_1 = crypto.createHash('md5'), md5_2 = crypto.createHash('md5');
                if (dbOldPwd !== md5_1.update(oldPwd + user.salt).digest('hex')) {
                    mongodb.close();
                    return callback({msg: '原密码不正确'});
                }
                var curPwd = md5_2.update(newPwd + user.salt).digest('hex');
//                return callback(null, curPwd);
                if (dbOldPwd === curPwd) {
                    mongodb.close();
                    return callback({msg: '新密码与原密码相同'});
                }
                collection.update({name: username}, {$set: {password: curPwd}}, function (err, modifedNumber) {
                    if (err) {
                        mongodb.close();
                        return callback({msg: '密码更新错误'});
                    }
                    mongodb.close();
                    callback(null, modifedNumber);
                });
            });
        });
    });
};

User.authenticate = function (username, password, callback) {
    if (username.length == 0 || password.length == 0)
        callback({});
    mongodb.open(function (err, db) {
        if (err) {
            mongodb.close(function () {
                return callback(err);
            });
        }
        else {
            db.collection('my_blog_users', function (err, collection) {
                    if (err) {
                        mongodb.close(function () {
                            callback(err);
                        });
                    } else {
                        collection.findOne({name: username}, function (err, user) {
                            if (err) {
                                mongodb.close(function () {
                                    callback(err);
                                });
                            }
                            else {
                                if (user.password !== crypto.createHash('md5').update(password + user.salt).digest('hex')) {
                                    mongodb.close(function () {
                                        callback({});
                                    });
                                } else {
                                    mongodb.close(function () {
                                        var session = new Sessions({key: username, value: user.password});
                                        session.save(function () {
                                            return callback(null, user.name);
                                        });
                                    });
                                }
                            }
                        });
                    }
                }
            );
        }
    });
};