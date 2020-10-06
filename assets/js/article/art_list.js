// 创建入口函数
$(function () {
    var layer = layui.layer;
    var form = layui.form;
    var laypage = layui.laypage;
    // 定义一个人查询的参数对象，将来请求数据的时候
    // 需要将请求参数对象提交到服务器

    // 定义美化时间的过滤器
    template.defaults.imports.dataFormat = function (date) {
        const dt = new Date(date);

        var y = dt.getFullYear();

        var m = padZero(dt.getMonth() + 1);

        var d = padZero(dt.getDate());

        var hh = padZero(dt.getHours());

        var mm = padZero(dt.getMinutes());

        var ss = padZero(dt.getSeconds());

        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss;
    }

    // 定义一个补零的函数

    function padZero(n) {
        return n < 10 ? '0' + n : n;
    }

    var q = {
        pagenum: 1, // 页码值, 默认请求回来的是第一页的数据
        pagesize: 2, // 每页显示多少条数据
        cate_id: '', // 文章分类的 Id
        state: '' // 文章的状态，可选值有：已发布、草稿
    };
    initTable();
    initCate();
    // 获取文章列表的数据请求
    function initTable() {
        $.ajax({
            type: "GET",
            url: "/my/article/list",
            data: q,
            success: function (res) {
                if (res.status !== 0) return layer.msg('获取文章列表失败！')
                // 使用模板引擎渲染页面数据
                var htmlStr = template('tpl-table', res);
                $('tbody').html(htmlStr);
                renderPage(res.total);
            }

        });
    }

    function initCate() {
        $.ajax({
            type: "GET",
            url: "/my/article/cates",
            success: function (res) {
                if (res.status !== 0) return layer.msg('获取文章分类失败！');
                // 调用模板引擎渲染数据
                var htmlStr = template('tpl-cate', res);
                $('[name=cate_id]').html(htmlStr);

                // 通知layui 重新渲染表单结构
                form.render();
            }
        });
    }

    // 为筛选表单绑定submit事件
    $('#form-search').on('submit', function (e) {
        // 阻止表单的默认提交行为
        e.preventDefault();
        // 获取表单中选中项的值
        var cate_id = $('[name=cate_id]').val();
        var state = $('[name=state]').val();
        // 为查询对象q中的相同属性进行赋值
        q.cate_id = cate_id;
        q.state = state;
        console.log(222);
        // 根据最新的筛选数据，调用initTable()函数 重新渲染表格数据
        initTable();
    })

    // 定义渲染分页的方法
    function renderPage(total) {
        // 调用laypage下的render方法
        laypage.render({
            elem: 'pageBox', //注意，这里的pageBox是 ID，不用加 # 号
            count: total,  //数据总数，从服务端得到
            limit: q.pagesize,  // 每页显示的条数。
            curr: q.pagenum, // 设置默认被选中的分页 每页条数的选择项。
            limits: [2, 4, 6, 8, 10],
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            // 分页发生切换时，触发jump回调函数
            // 触发 jump 回调的方式有两种：
            // 1. 点击页码的时候，会触发 jump 回调
            // 2. 只要调用了 laypage.render() 方法，就会触发 jump 回调
            jump: function (obj, first) {
                // console.log(obj.curr); // 得到当前页的页码值
                // 可以通过 first 的值，来判断是通过哪种方式，触发的 jump 回调
                // 如果 first 的值为 true，证明是方式2触发的
                // 否则就是方式1触发的
                // console.log(first)
                // console.log(obj.curr)

                // 把最新的页码值，赋值给q这个查询对象中
                q.pagenum = obj.curr;

                // 把最新的条目数，赋值给q这个查询对象
                q.pagesize = obj.limit
                if (!first) {
                    initTable();
                }
            }
        });
    }
    // 截止到15页，先去搞发表文章去 搞完了我又回来了
    // 通过代理的方式，给删除按钮绑定点击事件
    $('tbody').on('click', '.btn-delete', function () {
        // 获取当前分页删除按钮的个数
        var len = $('.btn-delete').length;
        console.log(len);
        // 获取按钮对应的id
        var id = $(this).attr('data-id');
        // 创建弹出层 提示用户是否要删除
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function (index) {
            // 发起ajax请求 删除数据
            $.ajax({
                method: 'GET',
                url: '/my/article/delete/' + id,
                success: function (res) {
                    console.log(res);
                    if (res.status !== 0) {
                        return layer.msg('删除文章分类失败！');
                    }
                    layer.msg('删除文章分类成功！');
                    if (len === 1) {
                        // 如果 len 的值等于1，证明删除完毕之后，页面上就没有任何数据了
                        // 页码值最小必须是 1
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1
                    }
                    // 当数据删除完成后，需要判断当前这一页中，是否还有剩余的数据
                    // 如果没有剩余的数据了,则让页码值 -1 之后,
                    // 再重新调用 initTable 方法
                    // 关闭弹出层
                    layer.close(index);
                    // 刷新文章列表内容
                    initTable();
                }
            })
        });
    })
})