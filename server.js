var express = require('express');
var fs = require('fs');
var config = require('./config'); // 引入预设变量

var app = express();

app.get('/', function(req, res) {
    // 浏览器的参数 ==> ?a.js,b.js,c.js  (一个问号，文件名由逗号隔开)
    // 获取文件名
    var params = "";
    for (const key in req.query) {
        params += (key + req.query[key]); // 忽略了等于号
    }
    // 处理特殊符号
    params = params.replace(/[\?\=]/g, '');
    var arrFilename = params.split(',');

    // js文件的存放目录
    const libPath = config.basicFilepath;

    var arrContent = [];


    arrFilename.forEach(function (filename) {
        //忽略空文件名
        if (filename===undefined || filename==='') {return;}

        let realPath = libPath + filename; //合并成为实际的js文件路径
        // 读取js文件内容
        var fileContent = fs.readFileSync(realPath, { encoding: 'utf8' });

        // 打印出每个文件的内容
        if (process.env.NODE_ENV!=="production") {
            console.log(fileContent);
            console.log("当前是测试模式。生产模式运行 \n\t'npm run server'\n");
        }
        // 开始读取每个文件
        arrContent.push(fileContent);
    });

    // 设置返回数据的MIME类型
    if (arrFilename[0]) {
        var filename = arrFilename[0];
        var arr = filename.split('.');
        var subfix = arr[1];

        if (subfix !== undefined) {
            switch (subfix) {
                case 'css':
                    res.set('Content-Type', 'text/css');
                    break;
                case 'js':
                    res.set('Content-Type', 'text/javascript');
                    break;
                default:
                    res.set('Content-Type', 'text/plain');
            }
        }
    }

    res.send( addPreElement( arrContent.join('\n') ) );
});

app.listen(config.port);

// 模式
if (process.env.NODE_ENV==='production') {
    console.log('当前是 生产环境模式');
} else {
    console.log('当前是 测试环境模式：为方便在浏览器查看效果，已加入了<pre>标签。');
    console.log('要在脚本中使用此api，请ctrl+c关闭此进程。并重新运行 npm run server');
}
console.log("visite http://localhost:" + config.port + "?" + config.presetFilelist);

// 方便浏览器测试时查看
function addPreElement(content) {
    if (process.env.NODE_ENV === 'production') {
        // 如果是生产环境则不加 pre 标签美化浏览器查看
        return content;
    }
    return "<h1 style=\"color:red;\">当前是测试环境，加入了pre标签，方便查看文件内容。</h1><pre>" + content + "</pre>";
}
