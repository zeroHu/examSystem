var mongoose = require('mongoose');
var model = require('./model');
var User = model.User;
var Obj = model.Obj;

mongoose.connect('mongodb://localhost/cwuexam', { useMongoClient: true });

// 连接出错提示
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

exports.index = function(req, res) {
    if (req.session && !req.session.userId) {
        res.redirect('/login');
        return;
    }
    var identity = req.session.identity;

    if (identity == 'teacher') {
        res.redirect('/teacher');
    } else {
        res.redirect('/student');
    }
};