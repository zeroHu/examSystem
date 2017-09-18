$(function() {
    var objstr = [];
    $('input').click(function() {
        objstr.push($(this).attr('title'));
    });

    // 添加科目按钮
    $('span.obj').click(function() {
        var str = objstr.join(',');
        $.post('/addobj', {
            userId: $('.userId').html(),
            objId: str
        }, function(ret) {
            if (ret.status == '200') {
                window.location.href = '/teacher';
            }
        });
    });
});