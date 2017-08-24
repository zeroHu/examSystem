var mongoose = require('mongoose');
var model = require('./model');
var Obj = model.Obj;
var User = model.User;
var async = require('async');
// 连接出错提示
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
exports.insertobj = function(req, res) {
    Obj.find(function(err, objs) {
        if (err) {
            res.send('<script>alert("it is failed")</script>')
            return;
        }
        console.log('qqqqqqqqq', objs);
        res.render('insert', {
            objs: objs
        });
    });
};
exports.saveobj = function(req, res) {
    var oobj = req.body.objcets;
    var objarr = oobj.split(',');
    async.forEach(objarr, function(item) {
        var objs = new Obj({
            title: item
        });
        objs.save(function(err, objs) {
            if (err) {
                res.send('add objs failed');
                return;
            }
            // res.send('<script>alert("objs is success")</script>')
        });
    });
    res.send('objs successed');
    /*var objs = new Obj({
    	title:oobj
    });*/
    /*objs.save(function(err,objs){
    	if(err){
    		res.send('add objs failed');
    		return;
    	}
    	res.send('<script>alert("objs is success")</script>')
    })*/
}
exports.getobj = function(req, res) {
    if ((!req.session.userId) || (req.session.identity != 'teacher')) {
        res.redirect('/login');
        return;
    }
    var userId = req.session.userId;
    var objId = req.session.user.objId;
    console.log(req.session);
    Obj.find(function(err, docs) {
        res.render('obj', {
            'doc': docs,
            'userId': userId,
        });
    });
};
exports.chooseojb = function(req, res) {
    var objctId = req.body.objId;
    usersId = req.body.userId;
    // var uId = usersId.substring(usersId.indexOf('='),end);
    // var a = usersId.replace(/[^0-9]/ig,""); 
    User.update({ _id: usersId }, { $set: { objId: objctId } }, function(err, doc) {
        if (err) {
            console.log('老师选择科目报错');
            return;
        }
        res.json({
            status: 200,
            doc: doc
        });
        // res.redirect('/');
        //res.render('teacher',{"doc":doc});
    });
};