// 注意：每次发起$.post(),$.get(),$.ajax() 的时候
// 我们先调用 $.ajaxPrefilter()这个方法
// 这个方法会拿到我们提供给Ajax函数的配置对象
$.ajaxPrefilter(function (options) {
    // 在发起Ajax请求之前，统一拼接请求的根路径
    options.url = 'http://ajax.frontend.itheima.net' + options.url;
    // console.log(options.url);

    // 统一为有权限的接口，设置headers请求头
    if (options.url.indexOf('/my/') !== -1) {
        options.headers = {
            Authorization: localStorage.getItem('token') || ''
        }
    }
    // 不论成功或者失败都会调用的函数
    // 全局统一挂载complete 回调函数
    // 在complete回调函数中，可以通过responseJSON拿到服务器响应回来的数据
    options.complete = function (res) {
        if (res.responseJSON.status === 1 && res.responseJSON.message === "身份认证失败！") {
            // 1. 强制清除本地储存中的token
            localStorage.removeItem('token');
            // 2. 强制跳转到login.html
            location.href = 'login.html';
        }
    }
})