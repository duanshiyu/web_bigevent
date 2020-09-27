// 注意：每次发起$.post(),$.get(),$.ajax() 的时候
// 我们先调用 $.ajaxPrefilter()这个方法
// 这个方法会拿到我们提供给Ajax函数的配置对象
$.ajaxPrefilter(function (options) {
    // 在发起Ajax请求之前，统一拼接请求的根路径
    options.url = 'http://ajax.frontend.itheima.net' + options.url;
    console.log(options.url);
})