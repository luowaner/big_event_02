// 开发环境服务器地址
let baseURL = 'http://api-breakingnews-web.itheima.net'
// 测试环境服务器地址
// 生产环境服务器地址

// $.ajaxPrefilter 可以在调用$.get(); $.post(); $.ajax()方法之后会立即触发此方法,接收到ajax响应之后,还会触发此方法
$.ajaxPrefilter(function (options) {
    options.url = baseURL + options.url;

    // 身份认证
    if (options.url.indexOf('/my/') !== -1) {
        options.headers = {
            Authorization: localStorage.getItem('token') || '',
        }
    }

    // 登录拦截:判断身份认证信息
    options.complete = function (res) {
        // console.log(res.responseJSON);
        if (res.responseJSON.status == 1 && res.responseJSON.message == '身份认证失败！') {
            // 1.清空本地token
            localStorage.removeItem('token');
            // 2.页面跳转到登录页面
            location.href = '/login.html'
        }

    }
})