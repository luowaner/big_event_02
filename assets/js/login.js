// 写了入口函数比较保险
$(function () {
    // 需求1.点击注册账号,隐藏登录区域,显示注册区域
    $('#link_reg').on('click', function () {
        $('.login-box').hide();
        $('.reg-box').show();
    });
    // 需求2.点击去登录,显示登录区域,隐藏注册区域
    $('#link_login').on('click', function () {
        $('.login-box').show();
        $('.reg-box').hide();
    });

    // 需求3.自定义验证规则
    let form = layui.form;
    // console.log(form);
    form.verify({
        pwd: [
            /^[\S]{6,12}$/
            , '密码必须6到12位，且不能出现空格'
        ],
        // 确定密码规则
        repwd: function (value) {
            let pwd = $('.reg-box input[name=password]').val();
            if (value !== pwd) {
                return '两次密码输入不一致'
            }
        }
    });

    //需求4.注册功能
    let layer = layui.layer;
    // 给form表单绑定submit事件,点击button按钮就会触发submit事件 等价于给button绑定点击事件
    $('#form_reg').on('submit', function (e) {
        e.preventDefault();
        $.ajax({
            url: '/api/reguser',
            type: 'POST',
            data: {
                username: $('.reg-box input[name=username]').val(),
                password: $('.reg-box input[name=password]').val(),
            },
            dataType: 'json',
            success: (res) => {
                console.log(res);
                if (res.status != 0) {
                    // return alert(res.message); //o=成功;1=失败
                    return layer.msg(res.message, { icon: 5 })
                }
                // 提示成功
                // alert(res.message)
                layer.msg(res.message, { icon: 6 })
                // 切换登录模块
                $('#link_login').click();
                // 表单清空
                $('#form_reg')[0].reset();
            }
        });
    });

    // 需求5.登录功能
    $('#form_login').on('submit', function (e) {
        e.preventDefault();
        $.ajax({
            url: '/api/login',
            type: 'POST',
            data: $(this).serialize(),
            dataType: 'json',
            success: (res) => {
                console.log(res);
                // console.log($(this).serialize());  返回username=luowaner7&password=123321
                // 校验返回状态
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                // 提示成功信息
                layer.msg(res.message);
                // 保存token,未来借口需要用到token
                localStorage.setItem('token', res.token);
                // 跳转
                location.href = '/index.html'
            }
        });
    });

    
})