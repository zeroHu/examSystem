var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var index = require('./routes/index');
var testDb = require('./routes/testdb');
var obj = require('./routes/obj');
var user = require('./routes/user');
var exams = require('./routes/examsdb');
var student = require('./routes/student');
var teacher = require('./routes/teacher');
var scores = require('./routes/scores');
var assign = require('./routes/assign');
var app = express();

// Session
var express = require('express');
var session = require('express-session');
var RedisStore = require('connect-redis')(session);

// Redis 配置
var options = {
    "host": "127.0.0.1",
    "port": "6379",
    "ttl": 60 * 60 * 24 * 30, //Session的有效期为30天
};

// 经过中间件处理后，可以通过req.session访问session object。比如如果你在session中保存了session.userId就可以根据userId查找用户的信息了。
// 此时req对象还没有session这个属性
app.use(session({
    store: new RedisStore(options),
    secret: 'express is powerful'
}));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// uncomment after placing your favicon in /public
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// admin
app.get('/admin', user.admin);
// all user
app.get('/', index.index);
// 登录页面路由
app.get('/login', user.login);
app.post('/login', user.dologin);

// 注册路由
app.get('/register', user.register);
app.post('/register', user.post_register);

// 修改信息路由
app.get('/uppassword', user.uppassword);
app.post('/uppassword', user.dapassword);
// 教师模块
app.get('/teacher', teacher.teacher);
// 学生模块
app.get('/student', student.student);

// 退出模块
app.get('/logout', function(req, res) {
    res.clearCookie('connect.sid');
    req.user = null;
    req.session.regenerate(function() {
        //重新生成session之后后续的处理
        res.redirect('/');
    });
});
// 题库注册
app.get('/testdb', testDb.testdb);
app.post('/testreg', testDb.regt);

// 教师选择科目
app.all('/insertobj', obj.insertobj);
app.post('/saveobj', obj.saveobj);
app.get('/obj', obj.getobj);
app.post('/addobj', obj.chooseojb);

// 对题库的 删除模块
app.get('/del', testDb.delById);

// 对题库的 修改模块
app.get('/modify', testDb.toModify);
app.post('/modify', testDb.modify);

// 组卷操作
app.get('/exam', exams.setexam);
app.post('/ftestId', exams.ftestId);
app.post('/ftestIds', exams.ftestIds);

//student  查看试卷
app.get('/stufinexams', exams.stufinexams);
// 查看试卷
app.get('/finexams', exams.finexams);
// 删除试卷
app.get('/examdel', exams.examdel);
// 开始考试
app.get('/start', exams.start);
// 提交试卷
app.post('/submitexam', exams.submitexam);
//成绩查看 学生端
app.get('/viewscores', scores.viewscores);
// 成绩查看 老师端
app.get('/teviewscores', scores.teviewscores);
app.get('/teviewexam', scores.teviewexam);
// 分数查询详细情况 教师端
app.get('/teahistroys', scores.teahistroys);
// 分数详情学生查询
app.get('/stuhistory', scores.stuhistory);
// 计算难易程度
app.get('/jsuandiff', scores.jsuandiff);
// 分配班级
app.get('/assigned', assign.assigned);
// 提交分配班级
// app.post('doassigned',assign.doassigned);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// development error handler
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}
// 处理报错页面
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

module.exports = app;