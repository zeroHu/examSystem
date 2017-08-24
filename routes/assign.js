var mongoose = require('mongoose');
var model = require('./model');
var TestDb = model.TestDb;
var examDb = model.examDb;

exports.assigned = function(req, res) {
    var grades = req.query.grades,
        classes = req.query.classess,
        examId = req.query.exam_id;
    var newsexam = {
        grades: grades,
        classes: classes
    };
    examDb.findByIdAndUpdate(examId, newsexam, function(err, exams) {
        if (err) {
            res.json({
                errcode: -1,
                errmsg: '分配班级失败'
            });
            return;
        }
        res.json({
            errcode: 0,
            errmsg: '分配班级成功'
        })
    });
}