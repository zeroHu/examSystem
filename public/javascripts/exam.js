(function($){
	
	// 添加科目表
	var objarr = $('input.objtype').val().split(',')/*.Substring(1,$('input.objtype').val().length-1)*/;
	var objhtml = '';
	for(var i=0;i<objarr.length;i++){
		objhtml += '<input type="radio" name="objId" value="'+objarr[i]+'">'+objarr[i]+'</input>';
	}
	$('div.objects').append(objhtml);
	$('div.seobjects').append(objhtml);

	// 选择科目分类显示
	var teststr = '';
	$('div.seobjects input[name=objId]').click(function(){
		$('tr').hide();
		$('tr.tsay').show();
		var strval = $(this).val();
		$('input[name=objct]').each(function(){
			// console.log("ddddd",$(this).val());
			if($(this).val() == strval){
				$(this).parents('tr').attr('index',$(this).val());
				$(this).parents('tr').show();
			}
		});
		$('.exampage').html('');
		exampage($(this).val());

	});
	// 手动提交试卷
	$('input.examsd').click(function(){
		window.location.reload();
		$('input[name=_id]:checked').each(function(){
			teststr += $(this).val()+',';
		});
		var testarr = teststr.substring(0,teststr.length-1).split(',');
		// console.log(testarr);
		var objchek = $('div.seobjects input[name=objId]:checked').val();
		// console.log("test:",objchek,teststr,$('.objtype').val(),$('input[name=teacherId]').val(),$('input[name=examtitleshou]').val());
		console.log('testarr',testarr);
		if($('input[name=examtitleshou]').val() == ''){
			alert('请输入试卷名称');
			return false;
		}
		if(objchek == undefined || objchek == ''){
			alert('请选择科目');
			return false;
		}
		if(testarr == null || testarr == '' || testarr == undefined){
			alert('请选择试题');
			return false;
		}
		if($('input[name=examshoutime]').val() == ''){
			alert('请输入考试时间');
			return false;
		}
		console.log('=======================',testarr,testarr.join(','),objchek,$('input[name=teacherId]').val(),$('input[name=examtitleshou]').val());
		$.post('/ftestIds',{
			testlistnum:testarr,
			testarrs:testarr.join(','),
			objtype:objchek,
			teacherId:$('input[name=teacherId]').val(),
			examname:$('input[name=examtitleshou]').val(),
			examshoutime : $('input[name=examshoutime]').val()
		},function(data){
			alert(data.errmsg);
		});
	});


	// 自动提交试卷
	$('input.tijuan').click(function(){
		var objs = $('div.objects input[name=objId]:checked').val(),
			examtitle = $('input[name=examtitle]').val(),
			teacherId = $('input[name=teacherId]').val(),
			shitinum = $('input[name=shitinum]').val(),
			shitinanyi = $('input[name=testnanyi]:checked').val(),
			examtime = $('input[name=examtime]').val();
		console.log('---===',objs,examtitle,teacherId,shitinanyi);
		if(examtitle == ''){
			alert('请填写试卷名字');
			return false;
		}
		if(shitinum == ''){
			alert('请填写试卷试题总数');
			return false;
		}
		if(shitinanyi == ''){
			alert('请选择难易程度');
			return false;
		}
		if(examtime == ''){
			alert('请填写考试时间');
			return false;
		}
		if(objs =='' || objs == undefined){
			alert('请选择科目');
			return false;
		}
		$.post('/ftestId',{
			objId : objs,
			examtitle : examtitle,
			teacherId : teacherId,
			shitinum : shitinum,
			shitinanyi : shitinanyi,
			examtime : examtime
		},function(ret){
			alert(ret.errmsg);
		});
	});
})(jQuery);
// exam 页面的手动题目的分页展示
function exampage(obj){
	var length = $('.testtab tr:visible').length;
	// console.log(length);
	// 一页显示多少条
	var pageone = 10;
	if(length>=3){
		var strexam = '';
		for(var i=0;i<Math.ceil((length-1)/pageone);i++){
			strexam +=  '<span class="examp" index="'+(i+1)+'">'+(i+1)+'</span>';
		}
		$('.exampage').append(strexam);
		$('span.examp').each(function(i,v){
			if(i>2){
				$(this).hide();
			}
		});
		// 对首页的超出页码的数据进行隐藏
		$('.testtab tr:visible:gt('+(pageone)+')').hide();
		$('span.examp').click(function(){
			console.log($(this).html());
			var numpage = $(this).html();

			// 对页码进行梳理展示
			var indexnum = $(this).attr('index');
			if(indexnum >=3){
				$('span.examp').hide();
				$("span[index="+(indexnum-1)+"]").show();
				$("span[index="+indexnum+"]").show();
				$("span[index="+(parseInt(indexnum)+1)+"]").show();
			}
			if(numpage == 2){
				$("span[index="+(indexnum-1)+"]").show();
				$("span[index="+(parseInt(indexnum)+2)+"]").hide();

			}

			// 对分页内容进行分开展示
			if(numpage>=2){
				var hidenumone = (numpage-1)*pageone;
				var shownum = (numpage-1)*pageone-1;
				var hidenumtwo = numpage*pageone-1;
				$('tr[index='+obj+']:lt('+hidenumone+')').hide();
				$('tr[index='+obj+']:gt('+shownum+')').show();			
				$('tr[index='+obj+']:gt('+hidenumtwo+')').hide();
			}	
			if(numpage == 1){
				// $('.testtab tr:visible:gt('+(pageone)+')').hide();
				$('tr[index='+obj+']:lt('+(pageone)+')').show();
				$('tr[index='+obj+']:gt('+(pageone-1)+')').hide();

			}	
		})
	}
}
