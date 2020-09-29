// 创建入口函数
$(function () {
    // 获取用户基本信息
    getUserInfo();
    // 获取layer实例对象
    var layer = layui.layer;
    // 给退出按钮绑定点击事件
    $('#btnlogout').on('click', function () {
        // console.log('ce');
        layer.confirm('确认退出登录?', { icon: 3, title: '提示' }, function (index) {
            // 点击确认退出后，进行回调
            // 1. 清空本地存储中的token
            localStorage.removeItem('token');
            // 2. 跳转到登录界面
            location.href = 'login.html';
            // 3. 关闭询问框
            layer.close(index);
        });
    })
})

// 获取用户的基本信息
function getUserInfo() {
    $.ajax({
        method: 'GET',
        url: '/my/userinfo',
        // headers 是请求头 就是配置对象
        headers: {
            Authorization: localStorage.getItem('token') || ''
        },
        success: function (res) {
            // 判断数据是否获取成功
            if (res.status !== 0) {
                return layui.layer.msg('获取用户信息失败');
            }
            // 调用渲染用户头像的函数
            renderAvatar(res.data);
        }
    })
}

// 封装渲染头像的函数
function renderAvatar(user) {
    // 1. 获取用户名称
    var name = user.nickname || user.username;
    // 2. 设置欢迎文本
    $('#welcome').html('欢迎&nbsp;&nbsp;' + name);
    // 3. 按需渲染用户头像
    if (user.user_pic !== null) {
        // 3.1 渲染图片头像
        // 图片头像显示
        $('.layui-nav-img').attr('src', user.user_pic).show();
        // 文本头像隐藏
        $('.text-avatar').hide();
    } else {
        // 3.2 渲染文本头像
        // 图片头像隐藏
        $('.layui-nav-img').hide();
        var first = name[0].toUpperCase();
        // 文本头像显示
        $('.text-avatar').html(first).show();
    }
}
