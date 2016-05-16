$(function(){
	$('div.four_zsgc .viewtest').trigger('click');
	$('div.four_zsgc .addtest').click(function(){
		$("input[type=reset]").trigger("click");
		$('div.zsgc_content').show();
		$('div.csgc_content').hide();
		$('div.ssgc_content').hide();
	});
	$('div.four_zsgc .viewtest').click(function(){
		$('div.zsgc_content').hide();
		$('div.csgc_content').show();
		$('div.ssgc_content').hide();
		window.location.reload();
	});
	$('div.four_zsgc .viewexam').click(function(){
		$('div.zsgc_content').hide();
		$('div.csgc_content').hide();
		$('div.ssgc_content').show();
		gettestlist();

	});

	var ti_type = 0;
	var danxuan = $('input[name=tistyle]');
	danxuan.change(function(){
		// alert($('input[name=tistyle]:checked').val());
		if($('input[name=tistyle]:checked').val() == '单选'){
			$('div.radod').show();	
			$('div.duoselct').hide();
			// $('div.istrue').hide();
			$('span.secon').show();

		}else if($('input[name=tistyle]:checked').val() == '多选'){
			$("div.duoselct").show();
			// $('div.istrue').hide();
			$('div.radod').hide();	
			$('span.secon').show();

		}/*else{
			$('div.radod').hide();
			$('div.duoselct').hide();
			$('span.secon').hide();
			// $('div.istrue').show();
		}*/
	});
	if(ti_type == 0){
		$('div.radod').show();
		// $('div.istrue').hide();
		$('div.duoselct').hide();
		$('span.secon').show();

	}
	// ajax 提交题库
	$('input.up').click(function(){
		var duoxuan = ''
		$("input:checkbox[name='duoxuan']:checked").each(function() {
			duoxuan += $(this).val();
		});
		// duoxuan = duoxuan.substring(0,duoxuan.length-1);

		var tistyle = $('input[name=tistyle]:checked').val(),
			conent = $('textarea.cotent').val(),
			select_a = $('input[name=select_a]').val(),
			select_b = $('input[name=select_b]').val(),
			select_c = $('input[name=select_c]').val(),
			select_d = $('input[name=select_d]').val(),
			danxuan = $('input[name=danxuan]:checked').val(),
			scores = $('input[name=scores]').val(),
			nanyi = $('input[name=nanyi]:checked').val(),
			objcts = $("#object").find("option:selected").text();
		
		// 前端校验是否为空值
		if(tistyle == ''){
			alert('题型不能为空');
			return;
		}
		if(conent == ''){
			alert('题目不能为空');
			return;
		}
		if(select_a =='' || select_b == '' || select_c == '' || select_d == ''){
			alert('选项内容不能为空');
			return;
		}

		if(scores == ''){
			alert('请输入分值');
			return;
		}

		$.post('/testreg',{
			content : conent,
			tistyle : tistyle,
			scores : scores,
			object : objcts,
			select_a : select_a,
			select_b : select_b,
			select_c : select_c,
			select_d : select_d,
			danxuan : danxuan,
			duoxuan : duoxuan,
			nanyi : nanyi
		},function(data){
			alert(data.errmsg);
			if(data.errcode == 0){
				$("input[type=reset]").trigger("click");
				$('div.radod').show();
				$('div.duoselct').hide();
			}
		});	
	});
	
});
// 点击查看试题的按钮
$('.viewtest').click(function(){
	testdata();
});
// 在modify 页面点击返回教师端
$('a.returnteach').click(function(){
	testdata();
});
// 在teacher left 点击试题管理出现试题模块
$('div.exam_function .shitig').click(function(){
	$('.stuhistroy').hide();
	$('aside.right').show();
	$('aside.rightsoce').hide();
});
// 点击试卷名称查看学生具体分数
$('div.exam_function .chengjg').click(function(){
	$('div.examtitle span.exam').html('');
	var strexam = '';
	$.get('/teviewexam',function(data){
		if(data.errcode == 1){
			var examIdarr = data.examIdarr,
				examtitlearr = data.examtitlearr;
			for(var i=0;i<examIdarr.length;i++){
				strexam += '<span class="examshiti" exid="'+examIdarr[i]+'">'+examtitlearr[i]+'</span>';
			}
			$('div.examtitle span.exam').append(strexam);
			// 点击试卷名查分数
			$('.examshiti').click(function(){
				// alert(333);
				$('.stuhistroy').hide();
				var examId =  $(this).attr('exid');
				$.get('/teviewscores',{
					examId : $(this).attr('exid')
				},function(data){
					if(data.errcode == 1){
						var stuname = data.stuname,
							stucarId = data.stucarId,
							final_score = data.final_score,
							stustar = '';
						var userId = data.userId;
						for(var j=0;j<final_score.length;j++){
							stustar +='<tr><td class="stuname">'+stuname[j]+'</td><td class="stucarId">'+stucarId[j]+'</td><td>'+final_score[j]+'</td><td class="detail" index="'+j+'" userId="'+userId[j]+'">详细情况</td></tr>';
						}
						$('table.stuscoress .stuscorehead').show();
						$('table.stuscoress .stuscorebo').html('');
						$('table.stuscoress .stuscorebo').append(stustar);
						// 点击详细情况
						$('td.detail').click(function(){
							$('aside.stuhistroy').show();
							$('aside.stuhistroy thead').show();
							$('aside.stuhistroy thead tr').html('');
							$('aside.stuhistroy tbody').html('');
							$.get('/teahistroys',{
								userId : $(this).attr('userId'),
								examId : examId,
								index : $(this).attr('index')
							},function(data){
								if(data.errcode == 1){
									// console.log('1111222',data.dataarr);
									var arrhis = data.dataarr;
									var strhis = '';
									var strthead = '';
									strthead +='<th>姓名</th>'
									if(arrhis.length == 1){
										for(var n = 0;n<arrhis[0].length;n++){
											strthead += '<th>第'+(n+1)+'题</th>'
										}
									}else{
										for(var n = 0;n<arrhis[arrhis.length-1].length;n++){
											strthead += '<th>第'+(n+1)+'题</th>'
										}
									}
									for(var i=0;i<arrhis.length;i++){
										strthead +='<br></br>';
										strhis += '<tr><td>'+stuname[i]+'</td>';
										for(var j=0;j<arrhis[i].length;j++){
											// <td>'+stuname[i]+'</td>
											strhis +=' <td>'+arrhis[i][j].stu_key+','+arrhis[i][j].isTrue+'</td>;';
										}
										strhis += '</tr>';
									}
									$('aside.stuhistroy thead tr').append(strthead);
									$('aside.stuhistroy tbody.cont').append(strhis);
								}
							});
						})
					}
				});
			})
		}
	});
	$('aside.right').hide();
	$('aside.rightsoce').show();
});
// 请求试卷方法
function gettestlist(){
	$.get('/finexams',function(data){
		$('table.examview tbody').html('');
		if(data.status == '200'){
			// console.log(data.examdoc);
			var examarr = data.examdoc;
			var trstr = '';
			for(var i=0; i<examarr.length; i++){
				trstr += '<tr><td>'+examarr[i].teacherId+'</td><td>'+examarr[i].object+'</td><td>'+examarr[i].title+'</td><td>'+examarr[i].content.length+'</td><td><a href="/examdel?exam_id='+examarr[i]._id+'">删除</a></td></tr>';
				// console.log("trstr",trstr);
			}
			// console.log("ssbody",trstr);
			$('table.examview tbody').append(trstr);
		}else{
			alert('查询试卷失败');
		}
	});
}
// 请求题库数据
function testdata(){
	$.getJSON('/testdb',function(data){
		var testdb = [];
		// console.log(data);
		// console.log('data.status',data.status);
		if(data.status == '200'){
			// console.log('datadatadata',data.docs);
			testdb = data.docs;
			var testdata= '';
			// console.log("ddddddd",data);

			for(var i=0;i<testdb.length;i++){
				if(i<data.pageNum){
					testdata += '<tr index="'+(Math.floor(i/data.pageNum)+1)+'"><td>'+testdb[i].object+'</td><td>'+testdb[i].type+'</td><td>'+testdb[i].title+'</td><td>'+testdb[i].answer+'</td><td>'+testdb[i].createTime+'</td><td><a href="del?id='+testdb[i]._id+'">删除</a> | <a href="modify?id='+testdb[i]._id+'">修改</a></td></tr>'					
				}else{
					testdata += '<tr style="display:none" index="'+(Math.floor(i/data.pageNum)+1)+'"><td>'+testdb[i].object+'</td><td>'+testdb[i].type+'</td><td>'+testdb[i].title+'</td><td>'+testdb[i].answer+'</td><td>'+testdb[i].createTime+'</td><td><a href="del?id='+testdb[i]._id+'">删除</a> | <a href="modify?id='+testdb[i]._id+'">修改</a></td></tr>'											
				}
			}
			// console.log(testdata);
			$('table.testtab tbody').html('');

			$('table.testtab tbody').append(testdata);
			testdata = '';
		}else{
			document.write('请求题库失败');
		}
	});
}
