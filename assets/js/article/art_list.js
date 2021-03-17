$(function () {
    // 为art-template定义时间过滤器
    template.defaults.imports.dateFormat = function (dtStr) {
        let dt = new Date(dtStr);

        let y = dt.getFullYear();
        let m = padZero(dt.getMonth() + 1);
        let d = padZero(dt.getDate())

        let hh = padZero(dt.getHours());
        let mm = padZero(dt.getMinutes());
        let ss = padZero(dt.getSeconds());

        return `${y}:${m}:${d} ${hh}:${mm}:${ss}`
    };
    // 个位数补零
    function padZero(n) {
        return n > 9 ? n : '0' + n;
    }
    // 1.定义提交的参数
    let q = {
        pagenum: 1,     //页码值
        pagesize: 2,    //每页显示多少条数据
        cate_id: '',	//文章分类的 Id
        state: '',      //文章的状态，可选值有：已发布、草稿
    };
    // 2.初始化文章列表
    let layer = layui.layer;
    initTable();
    // 封装:初始化文章列表数据
    function initTable() {
        // 发送ajax请求获取文章列表数据
        $.ajax({
            url: '/my/article/list',
            type: 'GET',
            data: q,
            success: (res) => {
                console.log(res);
                //获取失败
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                // 成功则不用提示,直接渲染到页面
                let htmlStr = template('tpl-table', { data: res.data });
                $('tbody').html(htmlStr);
                // 调用分页
                renderPage(res.total)
            }
        });
    };
    // 3.初始化所有分类
    let form = layui.form;//导入form
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

    // 4.筛选功能
    $('#form-search').on('submit', function (e) {
        e.preventDefault();
        // 获取
        let cate_id = $('[name=cate_id]').val();
        let state = $('[name=state]').val();
        // 赋值
        q.cate_id = cate_id;
        q.state = state;
        // 初始化文章列表
        initTable();
    });
    // 5.分页
    let laypage = layui.laypage;
    function renderPage(total) {
        // alert(total)
        laypage.render({
            elem: 'pageBox', //注意，这里的 test1 是 ID，不用加 # 号
            count: total,//数据总数，从服务端得到
            limit: q.pagesize, //每页显示的条数
            curr: q.pagenum,//起始页

            // 自定义排版
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 5, 10],
            // 触发jump:分页初始化的时候,页面改变的时候
            // 当分页被切换时触发，函数返回两个参数：obj（当前分页的所有选项值）、first（是否首次，一般用于初始加载的判断）
            jump: function (obj, first) {
                q.pagenum = obj.curr;
                q.pagesize = obj.limit;
                //首次不执行
                if (!first) {
                    //do something
                    initTable();
                }
            }
        });
    };

    // 6.删除:事件委托
    $('tbody').on('click', '.btn-delete', function () {
        // 获取Id
        let Id = $(this).attr('data-id');
        // 显示询问框
        layer.confirm('是否确认删除?', { icon: 3, title: '提示' }, function (index) {
            //do something
            // 发送ajax请求
            $.ajax({
                url: '/my/article/delete/' + Id,
                type: 'GET',
                success: (res) => {
                    // console.log(res);
                    if (res.status !== 0) {
                        return layer.msg(res.message)
                    }

                    layer.msg('文章删除成功')
                    // 页面汇总删除: 删除按钮个数等于1, 页码大于1
                    if ($('.btn-delete').length == 1 && q.pagenum > 1) {
                        q.pagenum--;
                    }
                    // 成功,重新渲染页面
                    initTable();
                }
            });
            layer.close(index);
        });
    })


})