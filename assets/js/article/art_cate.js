// 创建入口函数
$(function () {
    var layer = layui.layer;
    var form = layui.form;
    // 获取文章分类列表
    function initArtCateList() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章分类列表失败！');
                }
                layer.msg('获取文章分类列表成功！');
                var htmlStr = template('tpl-table', res);
                $('tbody').html(htmlStr);
            }
        })
    }
    // 获取文章分类列表
    initArtCateList();
    var indexAdd = null;
    // 给添加按钮绑定点击事件
    $('#btnAddCate').on('click', function () {
        // console.log(111);
        indexAdd = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '添加文章分类',
            content: $('#dialog-add').html()
        });
    })

    // 通过事件代理的方式，给动态添加的form绑定submit事件
    $('body').on('submit', '#form-add', function (e) {
        // 阻止表单的默认跳转行为
        e.preventDefault();
        // 发起ajax请求
        $.ajax({
            method: 'POST',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('新增文章分类失败！')
                }
                initArtCateList();
                layer.msg('新增文章分类成功！');
                // 关闭弹出层
                layer.close(indexAdd);

            }
        })
    })
    var indexEdit = null;
    // 通过代理的方式给编辑的点击按钮添加点击事件
    $('tbody').on('click', '.btn-edit', function () {
        // console.log(123);
        // 弹出一个修改文章分类的层
        indexEdit = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '修改文章分类',
            content: $('#dialog-edit').html()
        });

        // 给编辑按钮添加自定义属性， 获取id值
        var id = $(this).attr('data-id');
        // 发起请求获取对应分类的数据
        $.ajax({
            method: 'GET',
            url: '/my/article/cates/' + id,
            success: function (res) {
                console.log(res);
                // if (res.status !== 0) {
                //     return layer.msg('获取文章信息失败！');
                // }
                // layer.msg('获取文章信息成功！');
                form.val('form-edit', res.data);
            }
        })
    })

    // 为修改分类的form表单 绑定submit事件 利用事件代理
    $('body').on('submit', '#form-edit', function (e) {
        // 阻止表单的默认提交行为
        e.preventDefault();
        // 发起ajax请求
        $.ajax({
            method: 'POST',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('更新文章信息失败！');
                }
                initArtCateList();
                layer.msg('更新文章信息成功！')
                // 关闭弹出层
                layer.close(indexEdit);
            }
        })
    })

    // 通过代理的方式，给删除按钮绑定点击事件
    $('tbody').on('click', '.btn-delete', function () {
        // 获取按钮对应的id
        var id = $(this).attr('data-id');
        console.log(id);
        // 创建弹出层 提示用户是否要删除
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function (index) {
            // 发起ajax请求 删除数据
            $.ajax({
                method: 'GET',
                url: '/my/article/deletecate/' + id,
                success: function (res) {
                    console.log(res);
                    if (res.status !== 0) {
                        return layer.msg('删除文章分类失败！');
                    }
                    layer.msg('删除文章分类成功！');
                    // 关闭弹出层
                    layer.close(index);
                    // 刷新文章列表内容
                    initArtCateList();
                }
            })
        });
    })
})