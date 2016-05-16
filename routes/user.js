var mongoose = require('mongoose');
var model = require('./model');
var User = model.User;
var Obj = model.Obj;

// admin user index
exports.admin = function(req,res){
	if(req.session.userId !='56f4fe5dde9cd9e32cd8a917' ){
		res.redirect('/');
		return;
	}
	res.render('admin');
};
// other user index
exports.login = function(req,res){
	// console.log(req.session);
	res.render('login',{'title':'登录界面'});
};

/*exports.user = function(req,res){
	// console.log(req.session);
	// res.render('login',{'title':'登录界面'});
	var userId = req.session.userId;

	console.log(userId);
	res.json({
		'aaa' : 'assdsds',
		'userID' : userId
	});
};*/
exports.dologin = function(req,res){
	var ID = req.body.id;
		identity = req.body.identity;
		name = req.body.name;
		password = req.body.password;
	// console.log("-----------",identity);
	User.find({ID:ID},function(err,doc){
		if(err){
			res.send({'id':'您输入的信息有误'});
		}else{
			if(name == '' ||  doc == '' || doc[0].name != name){
				res.send({'name':'您输入的信息有误'});
				return;
			}
			if(name == doc[0].name){
				if(password == '' || password != doc[0].password){
					res.send({'password':'您输入的信息有误'});
					return;
				}
				if(password == doc[0].password){
					console.log('identity=====',identity,doc[0].type);
					if(identity == 0 && identity == doc[0].type){
						console.log("this is a big bug");
						// 学生保存session状态
						req.session.regenerate(function(){
					            req.user = doc[0];
					            req.session.userId = doc[0]._id;
					            req.session.user = doc[0];
   					            req.session.identity = 'student';
					            req.session.save();  //保存一下修改后的Session					        	
					    });
						// 学生状态  identity == doc[0].type 是判断是否是学生状态
						// console.log("====================",doc);
						Obj.find(function(err,docs){
							res.redirect('/student');	
						});
						// res.redirect('/student');
					}else if(identity == 1 && identity == doc[0].type){
						// res.redirect('/obj');
						// 教师保存session 状态
						req.session.regenerate(function(){
					            		 req.user = doc[0];
					           		 req.session.userId = doc[0]._id;
					           		 req.session.user = doc[0];
							 req.session.identity = 'teacher';
					          		 req.session.save();  //保存一下修改后的Session
					   	 });
						Obj.find(function(err,docs){
							if(doc[0].objId == ''){
								console.log('0000111122222');
								res.redirect('/obj');
							}else{
								res.redirect('/teacher');
							}
						});
					}else{
						res.send({'identity':'您输入的信息有误'});
					}
				}else{
					res.send({'password':'您输入的密码有误'})
				}
			}
		}
	})
};
//注册动作
exports.register = function(req,res){
	res.render('register');
};
exports.post_register = function(req,res){
	// console.log("######");
	console.log(req.body);
	var user = new User({
		ID:req.body.id,
	   	name:req.body.name,
	    	type:req.body.identity,
	    	objId:'',
	    	classes:req.body.classes,
	    	grades:req.body.grades,
  	 	password:req.body.password
	});
	user.save(function(err,docs){
		console.log("======="+docs);
		if(docs == undefined){
			res.send('<script>alert("此ID已有人注册")</script>');
			return;
		}
		res.redirect('/register');
	});
};

// 修改密码操作
exports.uppassword = function(req,res){
	res.render('uppassword');
};
exports.dapassword = function(req,res){
	var ID=req.body.id;
	console.log("22222222222",req.body.id,req.body.password);
	var user = {
		ID:req.body.id,
		password:req.body.password
	};
	User.findOne({ID:ID},'some select',function(err,docs){
		if(err){
			res.send('查询报错');
			return;
		}
		console.log('999999999999',docs);
		if(docs == '' || docs == null){
			res.send('您输入的ID号有误，请重新输入');
			res.redirect('/register');
		}
		if(docs._id && '' != docs._id){
		// console.log('----update id = ' + id + "," + user);
		User.findByIdAndUpdate(docs._id,user,function(err,doc){
			// console.log('000000000000000000',err);
			// console.log('-----------------',doc);
			if(err){
				res.send("you id is wrong");
			}else{
				res.redirect('/');				
			}
		})
	}
	});
	
};
