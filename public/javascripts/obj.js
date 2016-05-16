$(function(){
	var objstr = [];
	$('input').click(function(){
		objstr.push($(this).attr('title'));
	});

	// 添加科目按钮 
	$('span.obj').click(function(){
		// console.log(objstr);
		var str = objstr.join(',');
		// console.log(str);
		$.post('/addobj',{
			userId:$('.userId').html(),
			objId:str
		},function(ret){
			// console.log('***********',ret.doc);
			if(ret.status == '200'){
				window.location.href = '/teacher';
			}
		});
	});
})