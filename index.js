/**
 * [onerror 上传插件调用]
 * @param  {[type]} errMsg       [报错信息]
 * @param  {[type]} scriptURI    [脚本连接]
 * @param  {[type]} lineNumber   [出错文件]
 * @param  {[type]} columnNumber [出错列号]
 * @param  {[type]} errorObj     [错误详情]
 * @return {[type]}              [description]
 */

///*
window.onerror = function(errMsg, scriptURI, lineNumber, columnNumber, errorObj) {
    setTimeout(function() {
        var rst = {
            "错误信息：": errMsg,
            "出错文件：": scriptURI,
            "出错行号：": lineNumber,
            "出错列号：": columnNumber,
            "错误详情：": errorObj
        };

        alert('出错了，下一步将显示错误信息');
        alert(JSON.stringify(rst, null, 10));
    });
};
// */

/**
 * [这是一个服务端显示的调用]
 * @param  {[type]} el [传入的元素]
 * @return {[type]}    [description]
 */
[].forEach.call(document.querySelectorAll('[data-src]'), function(el) {
    (function(el) {
        el.addEventListener('click', function() {
            el.src = 'img/loading.gif';

            lrz(el.dataset.src)
                .then(function(rst) {
                    el.src = rst.base64;


                    return rst;
                });
        });

        fireEvent(el, 'click');
    })(el);
});

//只选中当前元素
var uploadBox = document.querySelector("#browsefile");
//绑定事件
uploadBox.addEventListener('change', function() {
    var that = this;
    lrz(that.files[0], {
            width: 1000
        })
        .then(function(rst) {
            var img = new Image(),
                div = document.createElement('div'),
                p = document.createElement('p'),
                iconfont = document.createElement('i'),
                sourceSize = toFixed2(that.files[0].size / 1024),
                resultSize = toFixed2(rst.fileLen / 256),
                scale = parseInt(100 - (resultSize / sourceSize * 100));

            p.style.fontSize = 13 + 'px';
            p.innerHTML      = '源文件：<span class="text-danger">' +
                sourceSize + 'KB' +
                '</span> <br />' +
                '压缩后传输大小：<span class="text-success">' +
                resultSize + 'KB (省' + scale + '%)' +
                '</span> ';

            div.className = 'upload-img-box';
            iconfont.className="iconfont icon-x-copy icon-remove";

            div.appendChild(iconfont);
            div.appendChild(img);
             div.appendChild(p);
           
            img.onload = function() {
                var uploadContainer = document.querySelector('#img-content');
                uploadContainer.insertBefore(div, uploadContainer.childNodes[0]);

                // 获取元素的个数
                var tags = document.querySelectorAll('.upload-img-box');
                // console.log(tags.length);
                
                //点击当前删除按钮删除upload-img-box
               document.querySelector('.icon-remove').addEventListener('click',function(){
                    del(this);
                    function del(thisdel){
                        thisdel.parentNode.parentNode.removeChild(thisdel.parentNode);
                    }
                    //点击删除后重新获取upload-img-box
                    tags = document.querySelectorAll('.upload-img-box');
                     // console.log("当前的"+tags.length);
                     // 判断upload-img-box长度 小于4让上传按钮显示
                    if(tags.length < 4){
                        document.querySelector('#upload-container').style.display = "block";
                    };

               });
              // 判断upload-img-box长度 大于4让上传按钮隐藏
               if(tags.length >= 4){
                document.querySelector('#upload-container').style.display = "none";
               }
            };
             
            img.src = rst.base64;

            






            /* ==================================================== 
             // 原生ajax上传代码，所以看起来特别多 ╮(╯_╰)╭，但绝对能用
             // 其他框架，例如ajax处理formData略有不同，请自行google，baidu。
             var xhr = new XMLHttpRequest();
             xhr.open('POST', '/upload');

             xhr.onload = function () {
             if (xhr.status === 200) {
             // 上传成功
             } else {
             // 处理其他情况
             }
             };

             xhr.onerror = function () {
             // 处理错误
             };

             // issues #45 提到似乎有兼容性问题,关于progress
             xhr.upload.onprogress = function (e) {
             // 上传进度
             var percentComplete = ((e.loaded / e.total) || 0) * 100;
             };

             // 添加参数和触发上传
             // rst.formData.append('a', '我是参数');
             xhr.send(rst.formData);
             */
             /* ==================================================== */

            return rst;
        });
});

// document.querySelector('#version').innerHTML = lrz.version;
// document.querySelector('.UA').innerHTML      = 'UA: ' + navigator.userAgent;

function toFixed2(num) {
    return parseFloat(+num.toFixed(2));
}

/**
 * 替换字符串 !{}
 * @param obj
 * @returns {String}
 * @example
 * '我是!{str}'.render({str: '测试'});
 */
String.prototype.render = function(obj) {
    var str = this,
        reg;

    Object.keys(obj).forEach(function(v) {
        reg = new RegExp('\\!\\{' + v + '\\}', 'g');
        str = str.replace(reg, obj[v]);
    });

    return str;
};

/**
 * 触发事件 - 只是为了兼容演示demo而已
 * @param element
 * @param event
 * @returns {boolean}
 */
function fireEvent(element, event) {
    var evt;

    if (document.createEventObject) {
        // IE浏览器支持fireEvent方法
        evt = document.createEventObject();
        return element.fireEvent('on' + event, evt)
    } else {
        // 其他标准浏览器使用dispatchEvent方法
        evt = document.createEvent('HTMLEvents');
        // initEvent接受3个参数：
        // 事件类型，是否冒泡，是否阻止浏览器的默认行为
        evt.initEvent(event, true, true);
        return !element.dispatchEvent(evt);
    }
}






/**
 *
 * 　　　┏┓　　　┏┓
 * 　　┏┛┻━━━┛┻┓
 * 　　┃　　　　　　　┃
 * 　　┃　　　━　　　┃
 * 　　┃　┳┛　┗┳　┃
 * 　　┃　　　　　　　┃
 * 　　┃　　　┻　　　┃
 * 　　┃　　　　　　　┃
 * 　　┗━┓　　　┏━┛Code is far away from bug with the animal protecting
 * 　　　　┃　　　┃    神兽保佑,代码无bug
 * 　　　　┃　　　┃
 * 　　　　┃　　　┗━━━┓
 * 　　　　┃　　　　　 ┣┓
 * 　　　　┃　　　　 ┏┛
 * 　　　　┗┓┓┏━┳┓┏┛
 * 　　　　　┃┫┫　┃┫┫
 * 　　　　　┗┻┛　┗┻┛
 *
 */
 