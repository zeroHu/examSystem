(function($) {
    // 动态科目添加完成部分
    var objname = $('input.objname').val(),
        objstr = objname.split(','),
        objhtml = '';
    for (var i = 0; i < objstr.length; i++) {
        objhtml += '<option name="objcts" value="' + objstr[i] + '">' + objstr[i] + '</option>';
    }
    $("#object").append(objhtml);
    // get请求题库表返回数据
    var viewname = $('div.four_zsgc .viewtest');

    viewname.one('click', function() {
        testdata();
        // 翻页函数
        page();
    });
})(jQuery);
// 请求题库表
function testdata() {
    $.getJSON('/testdb', function(data) {
        var testdb = [];
        if (data.status == '200') {
            testdb = data.docs;
            var testdata = '';
            for (var i = 0; i < testdb.length; i++) {
                if (i < data.pageNum) {
                    testdata += '<tr index="' + (Math.floor(i / data.pageNum) + 1) + '"><td>' + testdb[i].object + '</td><td>' + testdb[i].type + '</td><td>' + testdb[i].title + '</td><td>' + testdb[i].answer + '</td><td>' + testdb[i].createTime + '</td><td><a href="del?id=' + testdb[i]._id + '">删除</a> | <a href="modify?id=' + testdb[i]._id + '">修改</a></td></tr>';
                } else {
                    testdata += '<tr style="display:none" index="' + (Math.floor(i / data.pageNum) + 1) + '"><td>' + testdb[i].object + '</td><td>' + testdb[i].type + '</td><td>' + testdb[i].title + '</td><td>' + testdb[i].answer + '</td><td>' + testdb[i].createTime + '</td><td><a href="del?id=' + testdb[i]._id + '">删除</a> | <a href="modify?id=' + testdb[i]._id + '">修改</a></td></tr>';
                }
            }
            $('table.testtab tbody').html('');
            $('table.testtab tbody').append(testdata);
            testdata = '';
        } else {
            document.write('请求题库失败');
        }
    });
}
// 翻页函数
function page() {
    $.getJSON('/testdb', function(data) {
        var pagenum = data.pageNum;
        var testnum = data.docs.length;
        var pn = Math.ceil(testnum / pagenum);
        var spanstr = '';
        for (var i = 0; i < pn; i++) {
            spanstr += '<span class="testspan" index="' + (i + 1) + '" value="' + (i + 1) + '">' + (i + 1) + '</span>';
        }
        $('div.pagefenye').append(spanstr);
        // 对页码首页进行隐藏部分
        $('span.testspan').each(function(i, v) {
            if (i > 2) {
                $(this).hide();
            }
        });
        $('span.testspan').on('click', function() {
            // 对页码进行梳理展示
            var indexnum = $(this).attr('index');

            if (indexnum >= 3) {
                $('span.testspan').hide();

                $("span[index=" + (indexnum - 1) + "]").show();
                $("span[index=" + indexnum + "]").show();
                $("span[index=" + (parseInt(indexnum) + 1) + "]").show();
            }
            if (indexnum == 2) {
                $("span[index=" + (indexnum - 1) + "]").show();
                $("span[index=" + (parseInt(indexnum) + 2) + "]").hide();

            }
            // 对分页内容进行分开展示
            $('tr').hide();
            $('.tsay').show();
            $("tr[index=" + $(this).html() + "]").show();
        });
    });
}