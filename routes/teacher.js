exports.teacher = function(req,res){
	console.log("teacher session",req.session);
	if((!req.session.userId) || (req.session.identity != 'teacher')){
		res.redirect('/');
		return;
	}else if(req.session.userId == '56f4fe5dde9cd9e32cd8a917'){
		res.redirect('/admin');
	}
	res.render('teacher',{
		userId:req.session.userId,
		user:req.session.user
	});
}