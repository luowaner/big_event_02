$(function () {
    // 1.自定义验证规则
    let form = layui.form;
    form.verify({
        nickname: function (value) {
            if (value.length > 6) {
                return '昵称长度为1-6之间'
            }
        }
    });

    // 2.用户渲染
    initUserInfo();
    let layer = layui.layer;
    // 封装函数
    function initUserInfo() {
        $.ajax({
            url: '/my/userinfo',
            type: 'GET',
            success: (res) => {
                // console.log(res);
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                form.val('formUserInfo', res.data)
            }
        });

    }

    // 3.表单重置
    $('#btnReset').on('click', function (e) {
        // 阻止重置
        e.preventDefault();
        // 重新用户渲染
        initUserInfo()
    });

    // 4.修改用户信息
    $('.layui-form').on('submit', function (e) {
        e.preventDefault();
        $.ajax({
            url: '/my/userinfo',
            type: 'POST',
            data: $(this).serialize(),
            dataType: 'json',
            success: (res) => {
                // console.log(res);
                if (res.status !== 0) {
                    return layer.msg('用户信息修改失败!')
                }
                // 成功
                layer.msg('用户信息修改成功!')
                // 调用父页面中的更新用户信息和头像方法
                window.parent.getUserInof();
            }
        });
    });

    
})