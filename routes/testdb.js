var mongoose = require('mongoose');
var model = require('./model');
var TestDb = model.TestDb;
// 题库表进行post提交存储信息
exports.regt = function(req, res) {
    var answer = '';
    // console.log('fsddsd',req.body);
    if (req.body.tistyle == '单选') {
        answer = req.body.danxuan;
    } else if (req.body.tistyle == '多选') {
        answer = req.body.duoxuan;
    }
    var testdb = new TestDb({
        title: req.body.content,
        type: req.body.tistyle,
        score: req.body.scores,
        object: req.body.object,
        optionsA: req.body.select_a,
        optionsB: req.body.select_b,
        optionsC: req.body.select_c,
        optionsD: req.body.select_d,
        answer: answer,
        difficult: req.body.nanyi,
    });
    // .findAndModify({update:{$inc:{'id':1}}, query:{"name":"user"}, new:true});
    // { "_id" : ObjectId("4c637dbd900f00000000686c"), "name" : "user", "id" : 1 }
    testdb.save(function(err, doc) {
        // res.redirect('/');
        // console.log('-------',err);
        if (err) {
            res.json({
                errcode: -1,
                errmsg: '保存题库失败'
            })
            return;
        }
        // alert('its success');
        // res.send('<input type="button" name="button1" id="button1" value="返回" onclick="history.go(-1)">');
        // console.log('asasasasasasa',doc);
        res.json({
            errcode: 0,
            errmsg: '保存题库成功'
        })
    });
};
// 查询 题库表
exports.testdb = function(req, res) {
    /*TestDb.find(function(err,docs){
    	// res.render('index',{
    	// 	title:'cwu exam systeam',
    	// 	demo:docs
    	// });
    	res.json({
    		pageNum:5,
    		status:200,
    		docs:docs
    	})
    });*/
    TestDb.find().sort({ 'createTime': -1 }).exec(function(err, docs) {
        res.json({
            pageNum: 10, //page number
            status: 200,
            docs: docs
        });
    });
};


// 查询对应修改记录，并跳转到修改页面
exports.toModify = function(req, res) {
    var id = req.query.id;
    console.log('id = ' + id);

    if (id && '' != id) {
        // console.log('----delete id = ' + id);
        TestDb.findById(id, function(err, docs) {
            // console.log('-------findById()------' + docs);

            res.render('modify', {
                title: '修改ToDos',
                testdemo: docs
            });
        });
    };
};

exports.modify = function(req, res) {
    var answer = '';
    // console.log('===========================================---',req.body);
    if (req.body.tistyle == '单选') {
        answer = req.body.danxuan;
    } else if (req.body.tistyle == '多选') {
        answer = req.body.duoxuan;
    }
    var testdemo = {
        title: req.body.content,
        type: req.body.tistyle,
        score: req.body.scores,
        // object:req.body.object,
        optionsA: req.body.select_a,
        optionsB: req.body.select_b,
        optionsC: req.body.select_c,
        optionsD: req.body.select_d,
        answer: answer,
        difficult: req.body.nanyi,
    };
    var id = req.body.id;
    if (id && '' != id) {
        TestDb.findByIdAndUpdate(id, testdemo, function(err, docs) {
            if (err) {
                console.log('modify err');
            } else {
                res.redirect('/teacher');
            }
        });
    }
};
// 对题库的删除操作
exports.delById = function(req, res) {
    var id = req.query.id;
    console.log("id=" + id);
    if (id && '!=id') {
        TestDb.findByIdAndRemove(id, function(err, docs) {
            if (err) {
                res.send('删除失败');
                return;
            }
            res.redirect('/teacher');
        });
    }
};