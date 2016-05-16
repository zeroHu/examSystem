var mongoose = require('mongoose');
var model = require('./model');
var examDb = model.examDb;
var TestDb = model.TestDb;
var Score = model.Score;
var async  = require('async');
// 查看题库
exports.setexam = function(req,res){

	if(!req.session.userId){
		res.redirect('/login');
		return;
	}
	var	user = req.session.user;
	// 生成随机数的方法;
	var numOutput = new Number(Math.random() * 100).toFixed(0);
	TestDb.find(function(err,doc){
		if(err){
			console.log('获取题库失败');
			return;
		}
		// console.log("============---",doc);
		res.render('exam',{
			testdoc : doc,
			urltxt : user.objId,
			teacherId : user.ID
		});
	});
};
// 自动组卷
exports.ftestId = function(req,res){
	if(!req.session.userId){
		res.redirect('/login');
		return;
	}
	// var objId = req.objId;
	// console.log('======',req.query);
	var objId = req.body.objId,
		examname = req.body.examtitle,
		teacherId = req.body.teacherId,
		shitinum = req.body.shitinum,
		shitinanyi = req.body.shitinanyi,
		examtime = req.body.examtime;
	// { name: { $in: [ ‘jhon’, ‘eric’ ] } } 同时查询好介个
	if(shitinanyi == '混合'){
		shitinanyi = { $in:['简单','中级','稍难']}
	}
	console.log('pppp',objId,examname,teacherId,shitinum);
	TestDb.find({object:objId,difficult:shitinanyi},function(err,doc){
		var arrtest = doc;
		var arrid = [];
		// console.log("arrtest",arrtest);
		arrtest.forEach(function(name){
			// console.log("nameid",name._id);
			arrid.push(name._id);
		});
		// 随机数组
		var arrlast = getArrayItems(arrid,shitinum);
		var examdb = new examDb({
			title : examname,
			teacherId : teacherId,
			// type:{type:String},//题型
			score : arrlast.length*2,
			object : objId,//学科
			content : arrlast,
			examtime : examtime
		});
		examdb.save(function(err,doc){
			if(err){
				res.json({
					errcode:-1,
					errmsg:'自动组卷失败'
				})
				return;
			}
			res.json({
				errcode:0,
				errmsg:'自动组卷成功'
			});
		})

	});
};
// 手动组卷
exports.ftestIds = function(req,res){
	console.log('11111111111111111111111111111111111');
	if(!req.session.userId){
		res.redirect('/login');
		return;
	}
	console.log('22222222222222222222222222222222222');
	var examcontent = req.body.testarrs;
	var examshoudongarr = [];
	// var testnum = req.body.testlistnum;
	console.log('33333333333333333333333333333333333');
	examshoudongarr = examcontent.split(',');
	// console.log('4444444444444444444444444444444',testnum.length*2);
	console.log('5555555555555555555555555555555555',req.body.examname,req.body.teacherId);
	var examdb = new examDb({
		title : req.body.examname,
		teacherId : req.body.teacherId,
		// type:{type:String},//题型
		score : examshoudongarr.length*2,
		object : req.body.objtype,
		content : examshoudongarr,
		examtime :  req.body.examshoutime
	});
	examdb.save(function(err,doc){
		if(err){
			res.json({
				errcode : 0,
				errmsg : '手动组卷失败'
			})
			return;
		}
		// console.log('222222233334444',doc);
		res.json({
			errcode : 1,
			errmsg:'手动组卷成功'
		});
	});

};
// student 查看试卷
exports.stufinexams = function(req,res){
	var	gradess = req.query.grades,
		classes = req.query.classess
	// console.log('^^^^^^^^^^^^^^^^^',gradess,classes);
	if(!req.session.userId){
		res.redirect('/login');
		return;
	}
	examDb.find({grades:gradess,classes:classes},function(err,doc){
		if(err){
			// console.log('')
			res.json({
				status : 0,
			});
			return;
		}

		res.json({
			status : 200,
			examdoc : doc,
		})
	});
}
// 查看试卷
exports.finexams = function(req,res){
	if(!req.session.userId){
		res.redirect('/login');
		return;
	}
	examDb.find(function(err,doc){
		if(err){
			// console.log('')
			res.json({
				status : 0,
			});
			return;
		}

		res.json({
			status : 200,
			examdoc : doc,
		})
	});
};
// 删除试卷操作
exports.examdel = function(req,res){
	if(!req.session.userId){
		res.redirect('/login');
		return;
	}
	var examid = req.query.exam_id;
	// console.log(examid);
	if(examid && examid != ''){
		examDb.findByIdAndRemove({_id:examid},function(err,doc){
			if(err){
				res.json({
					status:502
				});
				return;
			}
			res.json({
				status:200,
				mess:'试卷删除成功'
			})
		})
	}
};
// 开始考试路由
exports.start = function(req,res){
	if(!req.session.userId){
		res.redirect('/login');
		return;
	}
	var examId = req.query.examid,
		studentId = req.query.studentId,
		stuname = req.query.stuname,
		examname = req.query.examname;
	// console.log('000999888',examId,studentId,stuname);
	examDb.find({_id:examId},function(err,doc){
		if(err){
			res.send('查询试题出错');
			return;
		}
		if(doc){
			var examcontent = doc[0].content ;
		}
		// console.log('-------',examcontent);
		var arrstuexam = [];
		/*var index = [];
		for(var i=0;i<examcontent.length;i++){
			index.push({index:i});
		};*/
		examcontent.forEach(function(name){
			// console.log('888888888888888888',name);
			TestDb.find({_id:name},function(err,docs){
				if(err){
					console.log('取试题出错',err);
					return;
				}
				arrstuexam.push(docs[0]);
			});
		});
		// console.log(studentId,examId,stuname);
		res.render('studexam',{
			examtime : doc[0].examtime,
			studentId : studentId,
			examId : examId,
			stuname : stuname,
			stuexamstr : arrstuexam,
			examname : examname
		});
		
	});
};
// 提交试卷记录学生成绩
exports.submitexam = function(req,res){
	if(!req.session.userId){
		res.redirect('/login');
		return;
	}
	/*
		exam_id : String,
		userId : String,
		final_score : String,
		mistakes : [{testdb_id:String,stu_key:String,isTrue:Boolean}],
		createTime : {type:Date,default:Date.now}
		console.log(req.body);
		{ studentId: '001',
		  stuname: '001',
		  examId: '56e4d8a9263a872e04399fb8',
		  stuexamId: '
		  56e2cdf5625f33b805507541,56e4cc5553cecbd1031952cb,
		  56e2c39cd5e4ce45056a6ecf,56e24fd5f0a629b70286e0d2,
		  56e24cf3f0a629b70286e0c7,56e2cd7d6e0598ae05c03918,
		  56e24dbdf0a629b70286e0c9,56e24eaff0a629b70286e0cd,
		  56e24f67f0a629b70286e0d0,56e2cf0e113f1ac00594f400,
		  56e25053f0a629b70286e0d3,56e2513ef0a629b70286e0d7'
		  ,
		  stuanser: 'BCD,D,BC,B,A,CD,C,D,B,ABC,C,B' 
		}
	*/
	// console.log(req.body);
	console.log('------------------------');
	// var stuexamIdarr = req.body.stuexamId.split(',');
	// var stuanswerarr = req.body.stuanser.split(',');
	// var stuexamId = [];
	// var mistakes = [];
	var stuexamId = jsontoarr(req.body.stuexamId);
	var stuanswer = jsontoarr(req.body.stuanser);
	//  stuexamId考题 唯一id  stuanswer 考题学生答案
	// console.log(stuexamId,stuanswer);
	// console.log('===================');

	var thetrueanswer = [];
	async.eachSeries(stuexamId, function(item, callback) {
		TestDb.find({_id:item},function(err,shiti){
			if(err){
				res.json({
					errcode : -1,
					errmsg : '保存分数表失败'
				});
				return;
			}
			thetrueanswer.push(shiti[0].answer);
			callback(null,thetrueanswer);
		});  
	}, function(err) {
		if(err){
			console.log('查询正确答案报错');
			return;
		}
		var istrue = [];
		console.log(thetrueanswer,stuanswer);
		for(var i=0;i<thetrueanswer.length;i++){
			if(stuanswer[i] == thetrueanswer[i]){
				istrue[i] = 1;
			}else{
				istrue[i] = 0;
			}
		};
		console.log('istrue',istrue);
		// mistakes : [{testdb_id:String,stu_key:String,isTrue:Boolean}],
		var mistakesarr = [];
		for(var n=0;n<stuexamId.length;n++){
			mistakesarr[n] = {};
		}
		// var m = {}
		for(var m=0; m<stuexamId.length; m++){
			mistakesarr[m].testdb_id = stuexamId[m];
			mistakesarr[m].stu_key = stuanswer[m];
			mistakesarr[m].isTrue = istrue[m];
		}
		console.log('mistakes',mistakesarr);
		// 计算最后得分情况
		var final_score = 0;
		for(var j=0;j<istrue.length;j++){
			console.log(istrue[j]);
			if(istrue[j] == 1){
				final_score +=1;
			}
		}
		final_score = final_score * 2;
		// console.log('final_score',final_score);
		console.log('----------------------========********');
		console.log(req.body);
		var scores = new Score({
			exam_id : req.body.examId,
			exam_name : req.body.examname,
			userId : req.session.userId,
			final_score : final_score,
			mistakes : mistakesarr
		});
		scores.save(function(err,score){
			if(err){
				res.json({
					errcode : -1,
					errmsg : '保存分数表失败'
				});
				return;
			}
			// console.log('score',score.final_score);
			res.json({
				errcode : 0,
				errmsg : '保存分数成功',
				istrue : istrue
			});
		});
	});
	    
};
// 字符串转变为数组的方法
function jsontoarr(json){
	var arr = [];
	arr = json.split(',');
	return arr; 
}
// 自动组卷取数组操作
function getArrayItems(arr, num) {
    //新建一个数组,将传入的数组复制过来,用于运算,而不要直接操作传入的数组;
    var temp_array = new Array();
    for (var index in arr) {
        temp_array.push(arr[index]);
    }
    // console.log(temp_array);
    //取出的数值项,保存在此数组
    var return_array = new Array();
    for (var i = 0; i<num; i++) {
        //判断如果数组还有可以取出的元素,以防下标越界
        if (temp_array.length>0){
            //在数组中产生一个随机索引
            var arrIndex = Math.floor(Math.random()*temp_array.length);
            // console.log("arrIndx",arrIndex);
            //将此随机索引的对应的数组元素值复制出来
            return_array[i] = temp_array[arrIndex];
            //然后删掉此索引的数组元素,这时候temp_array变为新的数组
            temp_array.splice(arrIndex, 1);
        } else {
            //数组中数据项取完后,退出循环,比如数组本来只有10项,但要求取出20项.
            break;
        }
    }
    return return_array;
};

