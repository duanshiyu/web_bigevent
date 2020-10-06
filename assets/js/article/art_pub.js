// 创建入口函数
$(function () {
    var layer = layui.layer;
    var form = layui.form;
    initCate();
    // 初始化富文本编辑器
    initEditor();
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
    // 1. 初始化图片裁剪器
    var $image = $('#image')

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options)


    // 给选择封面按钮绑定点击事件
    $('#btnChooseImage').on('click', function () {
        $('#coverFile').click();
    })

    // 监听coverFile的change事件，获取用户选择的文件列表
    $('#coverFile').on('change', function (e) {
        // 获取到文件的列表数组
        var files = e.target.files;
        // 判断用户是否选择了文件
        if (files.length === 0) {
            return
        }
        // 根据文件，创建对应的 URL 地址
        var newImgURL = URL.createObjectURL(files[0])
        // 为裁剪区域重新设置图片
        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', newImgURL) // 重新设置图片路径
            .cropper(options) // 重新初始化裁剪区域
    })

    // 定义文章的发布状态
    var art_state = '已发布';


    // 给存为草稿按钮绑定点击事件
    $('#btnSave2').on('click', function () {
        art_state = '草稿';
    })

    // 给表单绑定submit事件
    $('#form-pub').on('submit', function (e) {
        // 阻止表单的默认提交行为
        e.preventDefault();
        // 基于form表单 快速创建一个FormData对象
        var fd = new FormData($(this)[0]);
        // 将文章的发布状态存到fd中
        fd.append('state', art_state);

        // // 遍历对象
        // fd.forEach(function (v,k) {
        //     console.log(k, v);
        // })
        // 4. 将封面裁剪过后的图片，输出为一个文件对象
        $image
            .cropper('getCroppedCanvas', {
                // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function (blob) {
                // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                // 5. 将文件对象，存储到 fd 中
                fd.append('cover_img', blob)
                // 6. 发起 ajax 数据请求
                publishArticle(fd);
            })
    })
    function publishArticle(fd) {
        $.ajax({
            type: "POST",
            url: "/my/article/add",
            data: fd,
            // 注意 如果向服务器提交的是formdata创建的实例
            // 那么必须添加以下两项配置项
            contentType: false,
            processData: false,
            success: function (res) {
                if (res.status !== 0) return layer.msg('发表文章失败！');
                layer.msg('发表文章成功！')
                // 发表成功后跳转到文章列表页面
                location.href = '../article/art_list.html';
            }
        });
    }
})