$(function () {
    // 1.初始化分类
    let form = layui.form;//导入form
    let layer = layui.layer;//导入layer
    initCate();
    // 封装:
    function initCate() {
        $.ajax({
            url: '/my/article/cates',
            type: 'GET',
            success: (res) => {
                // console.log(res); 打印的数据根据属性名填到模板里
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                let htmlStr = template('tpl-cate', { data: res.data });
                // 渲染到页面
                $('[name=cate_id]').html(htmlStr);
                form.render();
            }
        });
    };

    // 2.初始化富文本编辑器
    initEditor();
    // 1. 初始化图片裁剪器
    let $image = $('#image')

    // 2. 裁剪选项
    let options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options);
    // 4.点击按钮,选择图片
    $('#btnChooseImage').on('click', function () {
        $('#coverFile').click()
    });

    // 5.设置图片
    $('coverFile').change(function (e) {
        // 拿到用户选择的文件
        var file = e.target.files[0]
        // 非空校验
        if (file == undefined) {
            return;
        }
        // 根据选择的文件，创建一个对应的 URL 地址：
        var newImgURL = URL.createObjectURL(file)
        // 先`销毁`旧的裁剪区域，再`重新设置图片路径`，之后再`创建新的裁剪区域`：
        $image
            .cropper('destroy')      // 销毁旧的裁剪区域
            .attr('src', newImgURL)  // 重新设置图片路径
            .cropper(options)        // 重新初始化裁剪区域
    });

    // 6.设置状态
    let state = '已发布';
    // $('#btnSave1').on('click', function () {
    //     state = '已发布'
    // });
    $('#btnSave2').on('click', function () {
        state = '草稿'
    });
    // 7.添加文章
    $('#form-pub').on('submit', function (e) {
        e.preventDefault();
        // 创建FormData对象,收集数据
        let fd = new FormData();
        // 放入状态
        fd.append('state', state);
        $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function (blob) {       // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                fd.append('cover_img', blob)
                // console.log(...fd);
                // 发送ajax,在toBlob里
                publishArticle(fd);
            });
        // 封装: 添加文章
        function publishArticle(fd) {
            $.ajax({
                url: '/my/article/add',
                type: 'POST',
                data: fd,
                contentType: false,
                processData: false,
                success: (res) => {
                    // console.log(res);
                    if (res.status !== 0) {
                        return layer.msg(res.message)
                    }
                    layer.msg('发布成功')
                    // location.href = '/article/art_list.html'
                    // 跳转
                    setTimeout(function () {
                        window.parent.document.getElementById('art_list').click();
                    }, 1000)

                }
            });
        }
    })
})