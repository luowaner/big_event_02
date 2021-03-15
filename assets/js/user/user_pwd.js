$(function () {
    // 1.定义校验规则
    let form = layui.form;
    form.verify({
        // 1.1密码
        pwd: [
            /^[\S]{6,12}$/,
            '密码必须6到12位，且不能出现空格'
        ],
        // 1.2新旧密码不能重复
        samePwd: function (value) {
            // value是新密码
            if (value == $('[name=oldPwd]').val()) {
                return "新旧密码不可相同"
            }

        },
        // 新密码和确认密码不能相同
        rePwd: function (value) {
            // value是确认密码的值
            if (value !== $('[name=newPwd]').val()) {
                return '两次输入密码不一致'
            }
        },
    });

    // 2.表单提交
    $('.layui-form').on('submit', function (e) {
        e.preventDefault();
        $.ajax({
            url: '/my/updatepwd',
            type: 'POST',
            data: $(this).serialize(),
            success: (res) => {
                // console.log(res);
                if (res.status !== 0) {
                    return layui.layer.msg(res.message);
                }
                layui.layer.msg('修改密码成功');
                // 表单重置
                $('.layui-form')[0].reset();
            }
        });
    })

})