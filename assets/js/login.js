// 创建入口函数
$(function () {
    // 这是"去注册账号"的链接
    $('#link_reg').on('click', function () {
        // 不要搞串了，整的麻烦了
        $('.login-box').hide();
        $('.reg-box').show();
    });
    // 这是"去登录"的链接
    $('#link_login').on('click', function () {
        $('.login-box').show();
        $('.reg-box').hide();
    })
    // 从layui中获取form对象
    var form = layui.form;
    //  // 从layui中获取layer对象
    var layer = layui.layer;
    // 通过form.verify()函数 自定义校验规则
    form.verify({
        pwd: [
            /^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'
        ],
        // 校验两次密码是否一致的规则
        repwd: function (value) {
            // 通过形参拿到的是确认密码框中的内容
            // 还需要拿到密码框中的内容
            // 两者进行比较 
            // 如果判断失败，return一个失败的信息即可
            var pwd = $('.reg-box [name=password]').val();
            if (pwd !== value) {
                return '两次输入的密码不一致！';
            }

        }
    })
    // 监听注册表单事件
    $('#form_reg').on('submit', function (e) {
        e.preventDefault();
        // 发起post请求
        $.ajax({
            method: 'POST',
            url: '/api/reguser',
            data: {
                // 找半天 还好
                username: $('#form_reg [name=username]').val(),
                password: $('#form_reg [name=password]').val(),
            },
            success: function (res) {
                // console.log($('#form_reg [name=userbame]').val());
                // console.log($('#form_reg [name=password]').val());
                // console.log(res);
                if (res.status !== 0) return layer.msg((res.message));
                layer.msg('注册成功,请登录');
                $('#link_login').click();
            }
        })
    })


    // 监听登录表单的提交事件
    // aaaaaaaa12 1111111
    $('#form_login').on('submit', function (e) {
        e.preventDefault();
        // 发起post请求
        $.ajax({
            method: 'POST',
            url: '/api/login',
            // 快速获取表单数据
            data:
                $(this).serialize()
            // username: $('#form_login [name=username]').val(),
            // password: $('#form_login [name=password]').val(),
            ,
            success: function (res) {
                if (res.status !== 0) return layer.msg((res.message));
                layer.msg('登录成功！');
                // 将登录成功后得到的token中的字符串，保存到
                // localStorage
                localStorage.setItem('token', res.token)
                // 跳转到后台主页
                location.href = 'index.html';
            }
        })
    })

})