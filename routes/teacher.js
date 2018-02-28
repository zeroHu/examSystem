exports.teacher = function(req,res){
	if((!req.session.userId) || (req.session.identity != 'teacher')){
		res.redirect('/');
		return;

	// 写的固定管理员的session值 这块非常不合理，权宜之计
	}else if(req.session.userId == '56f4fe5dde9cd9e32cd8a917'){
		res.redirect('/admin');
	}

	res.render('teacher',{
		userId:req.session.userId,
		user:req.session.user
	});
}