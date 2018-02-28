var hash = require('./pass').hash;
var mongoose = require('mongoose');

// var autoIncrement = require('mongoose-auto-increment');   //自增ID 模块
// autoIncrement.initialize(mongoose.connection);   //初始化

// 用户注册信息表
var UserSchema = new mongoose.Schema({
	ID:{type: String, unique: true, required: true },
	name:String,
	type:String,
	password:String,
	objId:String,
	classes:String,
	grades:String,
	createTime:{type:Date,default:Date.now}
});

// 题库表
var TestDbSchema = new mongoose.Schema({
	title:{type:String},
	type:{type:String},//题型
	score:{type:Number},
	object:{type:String},//学科
	optionsA:{type:String},
	optionsB:{type:String},
	optionsC:{type:String},
	optionsD:{type:String},
	answer:{type:String},
	difficult:{type:String},
	studiff:{type:String},
	createTime:{type:Date,default:Date.now}
});

// TestDbSchema.plugin(autoIncrement.plugin, {
//     model: 'testdbs',   //数据模块，需要跟同名 x.model("Books", BooksSchema);
//     field: 'bId',     //字段名
//     startAt: 1,    //开始位置，自定义
//     incrementBy: 1    //每次自增数量
// });

// 科目表
var ObjSchema = new mongoose.Schema({
	title:String,
	createTime:{type:Date,default:Date.now}
});

// 试卷表
var examDbSchema = new mongoose.Schema({
	title:{type:String},
	teacherId : {type:String},
	// type:{type:String},//题型
	score:{type:Number},
	object:{type:String},//学科
	content:[String],
	examtime : String,
	grades:String,
	classes:String,
	createTime:{type:Date,default:Date.now}
});

// 成绩表
var ScoreSchema = new mongoose.Schema({
	exam_name : String,
	exam_id : String,
	userId : String,
	final_score : String,
	mistakes : [{testdb_id:String,stu_key:String,isTrue:String}],
	createTime : {type:Date,default:Date.now}
})

exports.User = mongoose.model('users',UserSchema);
exports.TestDb = mongoose.model('testdbs',TestDbSchema);
exports.Obj = mongoose.model('objs',ObjSchema);
exports.examDb = mongoose.model('exams',examDbSchema);
exports.Score = mongoose.model('scores',ScoreSchema);
