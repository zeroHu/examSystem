(function($) {
    // 显示每道题的题号
    $('span.bihao').each(function(index, value) {
        $(this).html(index + 1 + ':');
    });
    // 对单选多选框进行显示隐藏
    $('div.shiti').each(function(i, v) {
        //  istrue 单选为0  多选为1
        var istrue = $(this).find('label').html() == '(单选)' ? true : false;
        if (istrue) {
            $(this).find('.youanswerdan').show();
            $(this).find('.youanswerduo').hide();
        } else {
            $(this).find('.youanswerdan').hide();
            $(this).find('.youanswerduo').show();
        }
    });
    // 点击提交试卷按钮
    var clickval = 0; //1 为点击提交进行验证是否有题没有做 0为自动提交不进行验证
    $('input.upshijuan').click(function() {
        // 进行验证是否确定要提交试卷
        if (window.confirm('你确定要提交试卷？')) {
            clickval = 1;
            submitshijuan(clickval);
        } else {
            return false;
        }
    });
    // 试卷进行倒计时

    timer = setInterval('CountDown()', 1000);
})(jQuery);
// 倒计时函数
function CountDown() {
    var maxtime,
        stuexamtime = $('input[name=examtime]').val();
    if (window.name == '') {
        maxtime = stuexamtime * 60;
    } else {
        maxtime = window.name;
    }
    if (maxtime >= 0) {
        minutes = Math.floor(maxtime / 60);
        seconds = Math.floor(maxtime % 60);
        msg = "距离考试结束还有" + minutes + "分" + seconds + "秒";
        document.all["timer"].innerHTML = msg;
        if (maxtime == 5 * 60) alert('注意，还有5分钟!');
        --maxtime;
        window.name = maxtime;
    } else {
        clearInterval(timer);
        submitshijuan();
        alert("考试时间到，结束!");
    }
}
// 查找 0 的函数
function find(t, v) {
    var obj = {};
    var arrslit = [];
    for (var i = 0, k; i < t.length; i++) {
        k = t.charAt(i);
        if (obj[k]) {
            obj[k].push(i);
        } else {
            obj[k] = [];
            obj[k].push(i);
        }
    }
    for (var o in obj) {
        if (o == v) {
            for (var i = 0; i < obj[o].length; i++) {
                arrslit.push(obj[o][i] - 1);
            }
        }
    }
    return arrslit;

}
// 提交试卷
function submitshijuan(clickval) {
    var studentId = $('input[name=studentId]').val(),
        stuname = $('input[name=stuname]').val(),
        examId = $('input[name=examId]').val(),
        examname = $('input[name=examname]').val();
    // 记录 所有题的_id 号的字符串
    var tistr = '';
    $('input[name=ti_id]').each(function(i, v) {
        tistr += $(this).val() + ',';
    });
    tistr = tistr.substring(0, tistr.length - 1);
    var arrti = tistr.split(',');
    // 记录所有答案的 字符串
    var tianswer = '';
    $('input[name=ti_id]').each(function(m, n) {
        if ($(this).parent().find('.youanswerdan').css('display') == 'none') {
            $(this).parent().find('input[name=answerduo' + $(this).val() + ']:checked').each(function(i, v) {
                tianswer += $(this).val() + i;
            });
        } else {
            tianswer += ',' + $(this).parent().find('input[name=answerdan' + $(this).val() + ']:checked').val() + ',';
        }
    });
    tianswer = tianswer.replace(/,/g, ' ');
    // 数组去空
    var arrtian = [];
    arrtian = tianswer.split(' ');
    for (var i = 0; i < arrtian.length; i++) {
        if (arrtian[i] == "" || typeof(arrtian[i]) == "undefined") {
            arrtian.splice(i, 1);
            i = i - 1;
        }
    }
    // 为了多选进行挑选答案
    var srtarrtian = arrtian.join(',');
    var duoanswer = find(srtarrtian, '0');
    var lastanser = ''
    for (var i = 0; i <= duoanswer.length; i++) {
        lastanser += srtarrtian.substring(duoanswer[i - 1], duoanswer[i]) + '#';
    }
    var reg = /[0-9]/g;
    lastanser = lastanser.replace(reg, "");
    lastanser = lastanser.replace(/#/g, ',');
    // 再次去空
    var tilastanser = [];
    tilastanser = lastanser.split(',');
    for (var i = 0; i < tilastanser.length; i++) {
        if (tilastanser[i] == "" || typeof(tilastanser[i]) == "undefined") {
            tilastanser.splice(i, 1);
            i = i - 1;
        }
    }
    // 最后 题目id  答案数组 前端验证哪些题没有答案的进行提示
    if (clickval == 1) {
        for (var m = 0; m < tilastanser.length; m++) {
            if (tilastanser[m] == 'undefined') {
                alert('请完成第' + (m + 1) + '题');
                return false;
            }
        }
    }

    // 提交试卷操作
    $.post('/submitexam', {
        examname: examname,
        //考生学号
        studentId: studentId,
        //考生姓名
        stuname: stuname,
        //试卷ID号
        examId: examId,
        //试题id号
        stuexamId: arrti.join(','),
        //学生成绩
        stuanser: tilastanser.join(',')
    }, function(ret) {
        if (ret.errcode == 0) {
            // 计算最后得分情况
            var istrue = ret.istrue;
            var final_score = 0;
            for (var j = 0; j < istrue.length; j++) {
                if (istrue[j] == 1) {
                    final_score += 1;
                }
            }
            final_score *= 2;
            alert('您的最终得分是：' + final_score + '分');
            open(location, '_self').close();
            // 提交试卷完成后开始计算每套题的难易程度
            $.get('/jsuandiff', function(data) {
                if (data.errcode == 0) {
                    console.log('计算难易程度失败');
                    return;
                } else {
                    console.log('计算难易程度成功');
                }
            });

        }
    });
}