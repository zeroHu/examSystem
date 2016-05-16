$(function(){
	function check(){
		var form = $('#login'),
			identity = $('input[name=identity]'),
			id = $('input[name=id]'),
			name = $('input[name=name]'),
			password = $('input[name=password]');

		if(identity == ''){
			alert('请选择身份');
			return false;
		}
		if(id == ''){
			alert('请输入ID号');
			return;
		}
		if(name == ''){
			alert('请输入姓名');
			return;
		}
		if(password == ''){
			alert('请输入密码');
			return;
		}
	}
})();