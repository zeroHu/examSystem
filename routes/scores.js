var mongoose = require('mongoose');
var model = require('./model');
var Score = model.Score;
var examDb = model.examDb;
var User = model.User;
var TestDb = model.TestDb;

var async = require('async');
// 学生端分数查询get
exports.viewscores = function(req, res) {
    if (!req.session.userId) {
        res.redirect('/login');
        return;
    }
    // 对学生查表的 分数 试卷名称 时间 用数组来进行存储
    var scoresarr = [];
    var final_scorearr = [];
    var examtitlearr = [];
    var time = [];
    var examId = [];
    var _id = [];
    Score.find({ userId: req.session.userId }, function(err, scores) {
        if (err) {
            console.log('viewscores报错');
            return;
        }
        async.eachSeries(scores, function(item, callback) {
            scoresarr.push(item.exam_id);
            final_scorearr.push(item.final_score);
            examId.push(item.exam_id);
            time.push(item.createTime);
            _id.push(item._id);
            examtitlearr.push(item.exam_name);
            callback(null, scoresarr);
        }, function(err) {
            if (err) {
                console.log('err', err);
                return;
            }
            var scorearr = [];
            for (var i = 0; i < final_scorearr.length; i++) {
                scorearr[i] = {};
            }
            for (var j = 0; j < final_scorearr.length; j++) {
                scorearr[j].examId = examId[j];
                scorearr[j].final = final_scorearr[j];
                scorearr[j].examtitl = examtitlearr[j];
                scorearr[j].time = time[j];
                scorearr[j]._id = _id[j];
            }

            res.render('stuscore', {
                userId: req.session.userId,
                errcode: 0,
                errmsg: '查询成绩成功',
                scorearr: scorearr
            });
        });
    });
};
// 教师端的试卷查询
exports.teviewexam = function(req, res) {
    var examIdarr = [],
        examtitlearr = [];
    examDb.find(function(err, examId) {
        if (err) {
            console.log("教师端的试卷查询报错");
            return;
        }
        async.eachSeries(examId, function(item, callback) {
            examIdarr.push(item._id);
            examtitlearr.push(item.title);
            callback(null, examtitlearr);
        }, function(err) {
            if (err) {
                res.json({
                    errcode: 0,
                    errmsg: 'failed'
                });
                return;
            }
            res.json({
                errcode: 1,
                errmsg: 'successed',
                examtitlearr: examtitlearr,
                examIdarr: examIdarr
            });
        });

    });
};
// 教师端的学生分数查询
exports.teviewscores = function(req, res) {
    Score.find({ exam_id: req.query.examId }, function(err, doc) {
        if (err) {
            console.log('查询出错');
            return;
        }
        var stuuserId = [],
            final_score = [],
            stuname = [],
            stucarId = [],
            userId = [];
        for (var i = 0; i < doc.length; i++) {
            stuuserId.push(doc[i].userId);
            final_score.push(doc[i].final_score);
            userId.push(doc[i].userId);
        }
        async.eachSeries(stuuserId, function(item, callback) {
            User.find({ _id: item }, function(err, doc) {
                if (err) {
                    console.log('查询分数报错');
                    return;
                }
                stuname.push(doc[0].name);
                stucarId.push(doc[0].ID);
                callback(null, stuname);
            });
        }, function(err) {
            if (err) {
                res.json({
                    errcode: 0,
                    errmsg: 'it is failed'
                });
            }
            res.json({
                errcode: 1,
                stuname: stuname,
                stucarId: stucarId,
                userId: userId,
                final_score: final_score,
            });
        });
    });
};
// 教师查看历史学生答题记录
exports.teahistroys = function(req, res) {
    var userId = req.query.userId,
        examId = req.query.examId,
        index = req.query.index;

    Score.find({ exam_id: examId }, function(err, mis) {
        if (err) {
            console.log('教师端查询学生分数详细情况报错');
            return;
        }
        var arrstuhistory = [];
        async.forEach(mis, function(v) {
            arrstuhistory.push(v.mistakes);
        });
        res.json({
            errcode: 1,
            errmsg: '访问学生成绩详细成功',
            dataarr: arrstuhistory
        });
    });
};
// 学生查看历史答题记录
exports.stuhistory = function(req, res) {
    var userId = req.session.userId;
    var examId = req.query.examId;
    var index = req.query.index;
    var _id = req.query._id;
    Score.find({ userId: userId, exam_id: examId, _id: _id }, function(err, mis) {
        if (err) {
            console.log('教师端查询学生分数详细情况报错');
            return;
        }
        if (mis.length > 1) {
            res.json({
                errcode: 1,
                errmsg: '查看数据成功',
                misdata: mis[index].mistakes
            });
        } else {
            res.json({
                errcode: 1,
                errmsg: '查看数据成功',
                misdata: mis[0].mistakes
            });
        }

    });
};
// 计算难易程度根据学生答题情况
exports.jsuandiff = function(req, res) {
    // 所有习题的id号
    var testid = [];
    TestDb.find(function(err, doc) {
        if (err) {
            return;
        }
        async.forEach(doc, function(v) {
            testid.push(v._id);
        });
        // 所有学生答题的详情
        var mistakesarr = [];
        Score.find(function(err, data) {
            if (err) {
                return;
            }
            async.forEach(data, function(v) {
                mistakesarr.push(v.mistakes);
            });

            var titrue = [];
            var json = [];
            for (var m = 0; m < testid.length; m++) {
                titrue[m] = {};
                titrue[m].istrue = [];
            }
            for (var m = 0; m < testid.length; m++) {
                for (var i = 0; i < mistakesarr.length; i++) {
                    for (var j = 0; j < mistakesarr[i].length; j++) {
                        if (testid[m] == mistakesarr[i][j].testdb_id) {
                            titrue[m].testid = testid[m];
                            titrue[m].istrue.push(mistakesarr[i][j].isTrue);
                        }
                    }

                }
            }
            // titrue 是记录答题情况的一个json
            /*
            [ { istrue: [ '0', '0', '0', '0', '0' ],
                testid: 56eb8f68ec782e290301ec58 },
              { istrue: [ '1', '1', '0', '0', '0' ],
                testid: 56eb8f68ec782e290301ec58 },
              { istrue: [ '1' ], testid: 56eb8e93ec782e290301ec53 },
              { istrue: [ '0', '0', '0', '0', '0' ],
                testid: 56eb8f68ec782e290301ec58 },
              { istrue: [ '0', '1', '0', '1', '0', '0', '1', '0' ],
                testid: 56ebe110eb4744d105fdbaa0 },
              { istrue: [ '0' ], testid: 56eb8e93ec782e290301ec53 },
              { istrue: [ '0' ], testid: 56eb8e93ec782e290301ec53 }
            ]
            */
            // 写入错误的个数儒json
            var index = 0;
            for (var j = 0; j < titrue.length; j++) {
                index = 0;
                if (titrue[j].istrue != '' || titrue[j].istrue != null) {
                    for (var i = 0; i < titrue[j].istrue.length; i++) {
                        if (titrue[j].istrue[i] == '0') {
                            index++;
                        }
                    }
                    titrue[j].index = index;
                }
            };
            for (var m = 0; m < titrue.length; m++) {
                var pointer = parseInt(titrue[m].index) / parseInt(titrue[m].istrue.length);
                if (pointer > 0.6) {
                    titrue[m].diff = '很难';
                } else if (pointer > 0.3) {
                    titrue[m].diff = '适中';
                } else {
                    titrue[m].diff = '容易';
                }
                // 记录新字段
                var newtest = new TestDb({
                    _id: titrue[m].testid,
                    studiff: titrue[m].diff
                });

                TestDb.findByIdAndUpdate({ _id: titrue[m].testid }, newtest, function(err, docs) {
                    if (err) {
                        console.log('更新学生自测难度失败'); //部分题目还没有测试的会提示失败，不写入字段
                        return;
                    }
                    console.log(docs);
                });
            }
        });

    });
};