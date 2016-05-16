var mongoose = require('mongoose');
var model = require('./model');
var User = model.User;
var Obj = model.Obj;
exports.student = function(req,res){
	console.log(req.session);
	if((!req.session.userId) || (req.session.identity != 'student')){
		res.redirect('/');
		return;
	}
	Obj.find(function(err,obj){
		res.render('student',{
			objdoc : obj,
			username : req.session.user.name,
			userId : req.session.user.ID,
			user_id : req.session.userId,
			classess : req.session.user.classes,
			gradess : req.session.user.grades
		});
	});
};