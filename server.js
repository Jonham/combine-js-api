var express = require('express');
var fs = require('fs');

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
    const libPath = "js/";

    var arrContent = [];


    arrFilename.forEach(function (filename) {
        //忽略空文件名
        if (filename===undefined || filename==='') {return;}

        let realPath = libPath + filename;
        var fileContent = fs.readFileSync(realPath, { encoding: 'utf8' });

        console.log(fileContent);
        // 开始读取每个文件
        arrContent.push(fileContent);
    });

    res.send( addPreElement( arrContent.join('\n') ) );
});


app.listen(5000);
console.log("visited http://localhost:5000");

// 方便浏览器测试时查看
function addPreElement(content) {
    if (process.env.NODE_ENV === 'production') {
        // 如果是生产环境则不加 pre 标签美化浏览器查看
        return content;
    }
    return "<pre>" + content + "</pre>";
}