/*
 * GET home page.
 */
// var mongodb = require('../models/db');
var Article = require('../models/articles');
var ParentTag = require('../models/parenttag');
var ChildTag = require('../models/childtag');
var Album = require('../models/album');
var Tag = require('../models/tag');
//var Md5 = require('crypto').createHash('md5');
var User = require('../models/user');
var Session = require('../models/sessions');
var Imgs = require('../models/imgs');
var weibo = require("weibo");
var appkey = "3486263756";
var secret = "2824b00260c474ae41d6dc78c3ac6522";
var oauth_callback_url = "http://localhost";
var path = require('path'), fs = require('fs');
var Qiniu = require('../models/qiniu');
var qiniuKey = require('../qiniuKey');
var html_entitis = require("html-entities");
//qiniu.conf.ACCESS_KEY = qiniuKey.access_key;
//qiniu.conf.SECRET_KEY = qiniuKey.secret_key;
module.exports = function (app) {
    app.get('/', function (req, res) {
        res.render('resume', {title: 'Stay hunger, stay foolish',
            active: 'home',
            username: req.session.username,
            layout: 'resume_layout'
        });
    });
    app.get('/article/category/:type', function (req, res) {
        var category = req.params.type;
        category = category.trim();
//        if (typeof category === 'undefined' || category.length == 0)
//            return res.redirect('/article');
//        else {
//
//        }
        Article.getByType(category, function (err, articles) {
            if (err) {
                articles = [];
            }
//            res.render('category/article', {
//                active: '',
//                layout: 'category/layout',
//                username: '',
//                articles: articles,
//                type: category
//            });
            res.send(articles);
        });
    });
    app.get('/article', function (req, res) {
        var page = req.param('page');
        if (typeof page == 'undefined')
            page = 1;
        page = parseInt(page);
        Article.getByPage(page, function (err, articles, total) {
            var entities = new html_entitis.AllHtmlEntities();
            if (articles) {
                var i, len = articles.length, content;
                for (i = 0; i < len; i++) {
                    content = articles[i].info.content;
                    articles[i].full = 0;
                    if (content.length > 3000) {
                        articles[i].info.content = entities.decode(content.substr(0, 3000));
                        articles[i].full = 1;
                    }
                }
                ParentTag.get(function (err, pTags) {
                    if (err || pTags == null) {
                        pTags = [];
                    }
                    res.render('article', {
                            title: 'My Articles',
                            articles: articles,
                            pTags: pTags,
                            page: page,
                            total: total,
                            active: 'article',
                            username: req.session.username
                        }
                    );
                });
            }
            else
                res.render('article', {title: 'My Articles', content: '', active: '', username: req.session.username});
        });
    });
    app.get('/article/:_id', function (req, res) {
        var _id = req.params._id;
        Article.get(_id, function (err, article) {
            if (article) {
                res.render('article_info', {title: 'Article Information',
                    article: article,
                    active: '',
                    username: req.session.username
                });
            }
            else {
                res.render('article_info', {title: 'Article Information',
                    content: '2',
                    active: '',
                    username: req.session.username,
                    article: null
                });
            }
        });
    });
    app.post('/addGood', function (req, res) {
        var _id = req.body._id, good = req.body.good;
        Article.addGood(_id, good, function (err, result) {
            if (err)
                return res.send("error");
            else {
                res.send("success");
            }
        });
    });
    app.get('/photo', function (req, res) {
        var page = req.param('page');
        if (typeof page === "undefined")
            page = 1;
        page = parseInt(page);
        var start = (page - 1) * 40;
        Imgs.getMulti(start, 40, function (err, imgs, total) {
//            res.send(imgs.length + "");
            if (err || imgs == null || typeof imgs == "undefined") {
                imgs = [];
                total = 0;
            }
            res.render('photo', {title: 'My Photos',
                active: 'photo',
                username: req.session.username,
                layout: "photo_layout",
                imgs: imgs,
                curPage: page,
                total: total
            });
        });
    });
    app.get('/admin/post_article', function (req, res) {
        if (!req.session.username) {
            res.redirect('/article');
        }
        var tag = {};
        Tag.get(function (err, tags) {
            if (err) {
                tag = {
                    parentTag: [],
                    childTag: []
                };
            } else {
                tag = tags;
            }
            //读取数据的时候出现错误
            res.render('admin/article/article',
                {
                    title: 'Article-Post-Page',
                    parentTags: tag.parentTag,
                    childTags: tag.childTag,
                    active: 'admin',
                    layout: 'admin/article/layout',
                    username: req.session.username
                });
        });
    });
    app.post('/admin/post_article', function (req, res) {
        if (!req.session.username) {
            res.redirect('/article');
        }
        var tempArticle = {
            title: req.body['title'],
            info: {
                child_tag: req.body['child_tag'],
                parent_tag: req.body['parent_tag'],
                content: req.body['content'],
                good: 0,
                user_name: ""
            },
            good: 0
        };
        var article = new Article(tempArticle);
        article.save(function (err, result) {
            if (result)
                res.redirect('/article');
            res.redirect('/admin');
        });
    });
    app.get('/admin', function (req, res) {
        if (!req.session.username) {
            res.redirect('/article');
        }
        Article.getPreTen(function (err, articles, total) {
            if (err)
                articles = [];
            ParentTag.get(function (err, parentTags) {
                if (err) {
                    parentTags = [];
                }
                ChildTag.getAll(function (err, childTags) {
                    if (err) {
                        childTags = [];
                    }
                    Album.getAll(function (err, albums) {
                        if (err) {
                            albums = [];
                        }
                        res.render('admin/index',
                            {
                                title: '后台管理首页',
                                articles: articles,
                                total: total,
                                parentTag: parentTags,
                                childTag: childTags,
                                album: albums,
                                active: 'admin',
                                layout: 'admin/layout',
                                username: req.session.username
                            });
                    });
                });
            });
        });
    });
    app.post('/admin/post_img', function (req, res) {
//        if (!req.session.username) {
//            return res.redirect('/article');
//        }
            //这里还要获取诸多参数
            var fileName = req.files.uploadimg.name,
//            fileExtname = path.extname(fileName).toLowerCase(),
                tempPath = req.files.uploadimg.path,
                targetPath = path.resolve("./public/upload/" + fileName),
                album = req.body['album'],
                title = req.body['title'],
                intro = req.body['intro'];
            //需要向数据库中写图片路径
            fs.rename(tempPath, targetPath, function (err) {
                if (err) {
                    return res.redirect("/photo");
                }
                var img = new Imgs({
                    album: album,
                    title: title,
                    intro: intro,
                    owner: req.session.username,
                    src: "/upload/" + fileName
                });
                img.save(function (err) {
                    if (err) {
                        return res.redirect("/photo");
                    } else {
                        return res.redirect("/admin");
                    }
                });
            });
        }
    )
    ;
    app.post('/admin/addPtag', function (req, res) {
        var pTag = new ParentTag({name: req.body.name});
        pTag.save(function (err, parentTag) {
            if (parentTag) {
                return res.send("success");
            }
            else {
                return res.send("error");
            }
        });
    });
    app.post('/admin/addCtag', function (req, res) {
        var cTag = new ChildTag({name: req.body.name});
        cTag.save(function (err, childTag) {
            if (childTag) {
                return res.send("success");
            }
            return res.send("error");
        });
    });
    app.post('/article/delete/:_id', function (req, res) {
        if (!req.session.username)
            return res.send('error');
        var _id = req.params._id;
        Article.remove(_id, function (err, document) {
            if (err)
                return res.send("error");
            res.send("success");
        })
    });
    app.get('/article/edit/:_id', function (req, res) {
        if (!req.session.username) {
            res.redirect('/article');
        }
        var _id = req.params._id.trim();
        Article.get(_id, function (err, document) {
            if (err) {
                document = new Article({});
            }
            ParentTag.get(function (err, parentTags) {
                if (err) {
                    parentTags = [];
                }
                ChildTag.getAll(function (err, childTags) {
                    if (err) {
                        childTags = [];
                    }
                    res.render('admin/article/edit', {
                        title: 'Edit-Article',
                        article: document,
                        parentTag: parentTags,
                        childTag: childTags,
                        layout: 'admin/article/layout',
                        username: req.session.username
                    });
                });
            });
        })
    });
    app.post('/article/edit/:_id', function (req, res) {
        var _id = req.body['_id'], content = req.body['content'];
        Article.update(_id, content, function (err, modifiedDoc) {
            var successOrnot = false;
            if (modifiedDoc > 0)
                successOrnot = true;
            if (!successOrnot)
                res.redirect('/article');
            res.redirect('/article/' + _id);
        });
    });
    app.get('/test', function (req, res) {
        var upLoad = new Qiniu(qiniuKey.access_key, qiniuKey.secret_key, 'my-blog-test');
        var localFile = "./public/images/0.jpg";
        upLoad.PutFile(localFile, function (err, key, hash) {
            if (err) {
                console.log(err);
                return res.render('test', {layout: 'test_layout'});
            } else {
                console.log(key, hash);
                return res.render('test', {layout: 'test_layout'});
            }
        });
    });
    app.post('/login', function (req, res) {
        var username = req.body['username'], password = req.body['password'];
        if (username == null || password == null || typeof username == 'undefined' || typeof password == 'undefined') {
            return res.redirect('/');
        }
        User.authenticate(username, password, function (err, username) {
            if (err) {
                return res.redirect('/');
            }
            req.session.username = username;
            res.redirect('/article');
        })
    });
    app.get('/logout', function (req, res) {
        req.session.username = "";
        res.redirect('/article');
    });
}
;

function ygh_get_login_user(req) {
    if (req.session.username)
        return req.session.username;
    else
        return "";
}