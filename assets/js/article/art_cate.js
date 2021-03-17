$(function () {
    // 1.文章类别列表显示
    initArtCateList();
    // 封装函数:
    function initArtCateList() {
        $.ajax({
            url: '/my/article/cates',
            success: (res) => {
                // console.log(res);
                let str = template('t1', { data: res.data });
                $('tbody').html(str)
            }
        });
    };

    // 2.显示添加文章分类列表
    // 调用
    let layer = layui.layer;

    $('#btnAdd').on('click', function () {
        // 利用框架代码, 显示提示添加文章类别区域
        layer.open({
            type: 1,//type - 基本层类型:默认为0(信息框),1（页面层）
            title: '添加文章分类',
            content: $('#dialog-add').html(),//content - 内容 默认为''
            area: ['500px', '250px'] //area:宽高
        });
    });

    // 3.提交文章分类添加(事件委托) 并显示到页面
    let indexAdd = null;
    $('body').on('submit', '#form-add', function (e) {
        console.log();
        // 阻止默认提交
        e.preventDefault();
        // 给服务器发送请求
        $.ajax({
            url: '/my/article/addcates',
            type: 'POST',
            data: $(this).serialize(),
            success: (res) => {
                // console.log(res);
                if (res.status !== 0) {
                    return layui.layer.msg(res.message)
                };
                // 添加成功渲染
                initArtCateList();
                layer.msg('添加文章类别成功');
                layer.close(indexAdd)
            }
        });
    });

    // 4.修改--显示表单
    let indexEdit = null;
    let form = layui.form;
    $('tbody').on('click', '.btn-edit', function () {
        indexEdit = layer.open({
            type: 1,//type - 基本层类型:默认为0(信息框),1（页面层）
            title: '修改文章分类',
            content: $('#dialog-edit').html(),//content - 内容 默认为''
            area: ['500px', '250px'] //area:宽高
        });
        // 获取Id,给服务器发送请求,渲染到页面
        let Id = $(this).attr('data-id')
        $.ajax({
            // 路径的最后带斜杠/ 后面是字符串变量拼接`
            url: '/my/article/cates/' + Id,
            type: 'GET',
            success: (res) => {
                form.val('form-edit', res.data)
            }
        });
    });
    // 4.1修改--提交修改
    $('body').on('submit', '#form-edit', function (e) {
        e.preventDefault();
        $.ajax({
            url: '/my/article/updatecate',
            type: 'POST',
            data: $(this).serialize(),
            success: (res) => {
                // console.log(res);
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                // 修改后重新渲染到页面
                initArtCateList();
                layer.msg('文章类别更新成功')
                layer.close(indexEdit);
            }
        });

    });

    // 5.删除:事件委托
    $('tbody').on('click', '.btn-delete', function () {
        // 先获取Id
        let Id = $(this).attr('data-id');
        // 显示提示框
        layer.confirm('是否确认删除?', { icon: 3, title: '提示' }, function (index) {
            //do something
            $.ajax({
                url: '/my/article/deletecate/' + Id,
                type: 'GET',
                success: (res) => {
                    console.log(res);
                    if (res.status !== 0) {
                        // 失败
                        return layer.msg(res.message)
                    }
                    // 成功:重新渲染页面中的数据
                    initArtCateList();
                    layer.msg('文章删除成功')
                    layer.close(index);
                }
            });
        });
    })
})