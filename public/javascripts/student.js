(function($) {
    var classess = $('input[name=classess]').val(),
        grades = $('input[name=gradess]').val();
    $.get('/stufinexams', {
        classess: classess,
        grades: grades
    }, function(data) {
        if (data.status == '200') {
            var examdocarr = data.examdoc;
            var trstr = '';
            var studentname = $('span.studentname').html();
            var studentId = $('span.studentId').html();
            $.each(examdocarr, function(index, value) {
                trstr += '<tr style="display:none" norb="' + value.object + '"><td>' + value.teacherId + '</td><td>' + value.title + '</td><td>' + value.score + '</td><td><a href="/start?examid=' + value._id + '&studentId=' + studentId + '&examname=' + value.title + '&stuname=' + studentname + '" target="_blank">开始考试</a></td></tr>';
            });
            $('table.stuexam tbody.stubody').append(trstr);
            $('table > thead,table > thead > tr').show();
            $('tbody.stubody tr').show();
        } else {
            alert('获取试题库失败');
        }
    });
    $('input:radio').click(function() {
        $('tr').hide();
        $('table > thead,table > thead > tr').show();
        var thisval = $('input:radio:checked').val();
        $('tr').each(function() {
            if ($(this).attr('norb') == thisval) {
                $('tr[norb=' + thisval + ']').show();
            }
        });
    });
})(jQuery);