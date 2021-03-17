// 无论script标签放在什么位置,入口函数都写上,保证代码安全
$(function () {
    // 1.获取用户信息
    getUserInof();

    // 2.退出
    let layer = layui.layer;
    $('#btnLogout').on('click', function () {
        // 框架提供的询问框
        layer.confirm('是否确认退出?', { icon: 3, title: '提示' }, function (index) {
            //1.清空本地token
            localStorage.removeItem('token'),
                // 2.页面跳转到登录页面
                location.href = '/login.html',
                // 关闭询问框
                layer.close(index);
        });
    })
});

// 封装: 获取用户信息, 后面其他页面也要使用, 多处调用选择封装
function getUserInof() {
    // ajax获取后台数据
    $.ajax({
        url: '/my/userinfo',
        type: 'GET',
        // headers: { 属性:用户设置头像
        //     Authorization: localStorage.getItem('token') || '' //属性:用户身份认证
        // },

        success: (res) => {
            // console.log(res);
            // 判定:如果请求失败
            if (res.status !== 0) {
                return layui.layer.msg(res.message)
            }
            // 请求成功,调用函数渲染头像
            renderAvatar(res.data)
        }
    });
};

// 封装:渲染头像的函数
function renderAvatar(user) {
    // console.log(user);
    // 获取用户的用户名或者昵称
    let name = user.nickname || user.username
    $('#welcome').html("欢迎&nbsp;&nbsp;" + name);
    // 2.渲染头像
    if (user.user_pic != null) {
        // 有头像,隐藏文字头像
        $('.layui-nav-img').show().attr('src', user.user_pic);
        $('.text-avatar').hide()
    } else {
        // 没有头像,显示文字头像
        $('.layui-nav-img').hide();
        // 获取用户名的首字母,下标为零,并且转换为大写
        let text = name[0].toUpperCase();
        $('.text-avatar').show().html(text)
    }
}
